// scripts/lib/check-layers-completeness.ts -- SPRINT-103: a faithful, fork-free TypeScript port of
// scripts/lib/check-layers-completeness.sh, run by Bun.
//
// WHY THIS EXISTS, AND WHAT IT IS NOT. The shell checker is correct; its cost is Windows fork()
// emulation -- ~40 subprocess spawns (grep/sort/tr/sed/awk) per task block, which is what makes
// evals/run-layers-completeness-fixtures.sh expensive for what it covers (measured ~55-70s for
// only 10 distinct argument sets).
// CORRECTED SPRINT-104 T3: this line read "the slowest harness in the gate", which Round 16
// (2026-09-20) refutes -- that profile is the first over a completed run and puts
// run-sprint-family-fixtures.sh first at 305 s, while layers-completeness does not appear in the
// top TWENTY. Round 16 names this exact mistake as its own costliest finding: TASK-355's targets
// were chosen from TD-090's harness timings, which nominated layers-completeness, and the real top
// three were sprint-family, layers-observed and the conformance sweep -- none of them on that list.
// The ~55-70s cost is real and still justifies this port; the RANK was never measured. This file is a PORT, not a rewrite: every branch, every regex,
// every message string is copied from the shell oracle's actual behaviour (not its header comment,
// which is stale in one place -- see "the status: red herring" note below), because this is a Tier G
// guard and a "cleaner" reimplementation is exactly how a false negative gets introduced silently.
//
// scripts/lib/check-layers-completeness.sh REMAINS THE ORACLE (owner ruling, mirroring EPIC-014 D2's
// "Shell retains §4 authority"). This file is the migrated implementation being checked AGAINST it,
// never the other way around -- see evals/layers-completeness-differential.ts for the row-by-row
// proof this port agrees with the oracle over every retained fixture and every real sprint Plan in
// this repository (including docs/sprint/archive/).
//
// THE STATUS: RED HERRING. check-layers-completeness.sh's own header comment (its lines 58-61) says
// "Only files whose frontmatter status: is active are checked" -- but the CODE never reads
// frontmatter at all (fmv() is defined and never called; SPRINT-056 T4's own inline comment at the
// main loop says the check is "Scoped by LOCATION, not by status:"). The comment is stale; the code
// is the oracle. This port follows the CODE: every file argument that exists and is not under an
// archive/ path (by content OR filesystem identity, see isArchivedPath below) is fully evaluated,
// regardless of its `status:` field.
//
// LOCALE-SENSITIVE SORT (the one place this port could NOT stay locale-independent and still match
// byte-for-byte). The oracle's `sort -u` calls are unpinned -- no `LC_ALL=C` (unlike three other
// checkers in this repo that explicitly pin it: conformance-engine.sh, run-foreign-repo-fixtures.sh).
// On a host whose LANG/LC_COLLATE is a UTF-8 locale (this host: en_US.UTF-8), `sort -u` does NOT
// produce plain ASCII/codepoint order -- e.g. `A.txt` sorts before `T1` before `a.txt` before
// `bar-baz.md`, which diverges from a naive `.sort()` in JavaScript. A message naming two or more
// tokens (miss_f, miss_d, layers_bare) would then differ in TOKEN ORDER ONLY between this port and
// the oracle -- not in verdict, but the brief's bar is byte-identical stdout, so token order counts.
// Reimplementing glibc's/ICU's full Unicode collation by hand is exactly the kind of "improve on the
// shell behaviour" this porting task forbids, and would drift from whatever the CI host's locale
// actually is besides. So sorting is delegated to the SAME `sort` binary the oracle uses, spawned via
// child_process -- but only ONCE per checker invocation (not once per list, not once per block): every
// group needing sort+dedup across every file and every block is batched into a single stdin payload
// with a `<n>\t` group-index prefix, sorted once, then demultiplexed. One subprocess for an entire
// multi-file, multi-block run is the "ONE Bun process" the sprint goal asks for in spirit -- the
// prohibition is the N-invocations-of-a-whole-interpreter-plus-~40-forks-per-block shape, not literally
// zero forks ever. If `sort` is unavailable, this throws rather than silently falling back to a
// different (and therefore possibly divergent) order.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";

// --- archive-path.sh port (SPRINT-099 T3, TD-145 * TD-151) ---------------------------------------
// Ported from scripts/lib/archive-path.sh's lf_is_archived_path(). Two tests, in the SAME order:
// (a) the literal substring "/archive/" anywhere in the path (cheap, works for paths that don't
//     exist on disk -- most fixture input); (b) filesystem IDENTITY -- walk each ancestor directory
//     and ask whether it IS (same device+inode, the `test -ef` semantic) its own parent's literal
//     "archive" subdirectory. This is what makes `docs/sprint/Archive/...` and `docs/sprint/archive/
//     ...` the SAME directory on a case-insensitive filesystem (every Windows checkout) without
//     hardcoding a case-insensitive string compare, which would be WRONG on Linux.
function sameDirIdentity(a: string, b: string): boolean {
  try {
    const sa = statSync(a);
    const sb = statSync(b);
    return sa.dev === sb.dev && sa.ino === sb.ino;
  } catch {
    return false;
  }
}

function isDir(p: string): boolean {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

export function isArchivedPath(p: string): boolean {
  if (!p) return false;
  // (a) literal spelling -- a "/" on both sides of "archive".
  if (/\/archive\//.test(p)) return true;

  // (b) filesystem identity walk, ancestor by ancestor, mirroring the shell's `${d%/*}` loop exactly
  // (splits on "/" only, never backslash -- this repo's paths are always forward-slash, and the
  // oracle would not recognise a backslash-separated path as archived either).
  let d = p;
  for (;;) {
    const idx = d.lastIndexOf("/");
    if (idx === -1) break;
    const parent = d.slice(0, idx);
    if (!parent) break;
    if (isDir(d) && isDir(parent + "/archive") && sameDirIdentity(d, parent + "/archive")) {
      return true;
    }
    d = parent;
  }
  return false;
}

// --- text extraction, ported from check-layers-completeness.sh + the layers_tokens() it shares
// with check-layers-observed.sh (TD-142) ----------------------------------------------------------

/** `awk '/^## Plan/{f=1;next} /^## /{f=0} f'` -- the "## Plan" section's body, header lines excluded. */
export function extractPlanLines(content: string): string[] {
  // \r is stripped here to match this repo's toolchain empirically: on this host, awk/grep/sed all
  // silently drop \r from CRLF input (verified directly -- every sprint file in this repo is CRLF,
  // core.autocrlf=true, and the oracle's own output carries zero 0x0D bytes). Normalizing at the one
  // read site means every downstream regex below can assume LF-only text, exactly like the oracle's.
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let f = false;
  const out: string[] = [];
  for (const line of lines) {
    if (/^## Plan/.test(line)) {
      f = true;
      continue;
    }
    if (/^## /.test(line)) {
      f = false;
      continue;
    }
    if (f) out.push(line);
  }
  return out;
}

export interface RawBlock {
  /** e.g. "### T1" -- the FULL matched prefix, never just "T1" (ported verbatim: the oracle's own
   *  `grep -oE '^### T[0-9]+'` captures the heading marker too, and every message prints this whole
   *  string). A heading with a letter suffix (`### T2a`) yields "### T2" -- the digits-only class is
   *  the oracle's own regex, not a simplification made here. */
  tidFull: string;
  text: string;
}

/** Splits "## Plan" body lines into per-`### `-heading blocks, mirroring the oracle's read loop.
 *  A `### ` heading that is not `### T<digits>...` yields tidFull="" and its whole block (including
 *  any task-shaped content it contains) is silently dropped -- never merged into a neighbour, never
 *  checked itself. Ported, not "fixed": this is the oracle's own behaviour for e.g. "### Retro". */
export function extractBlocks(planLines: readonly string[]): RawBlock[] {
  const blocks: RawBlock[] = [];
  let tid = "";
  let blk: string[] = [];
  for (const line of planLines) {
    if (line.startsWith("### ")) {
      if (tid !== "") blocks.push({ tidFull: tid, text: blk.join("\n") });
      const m = /^### T[0-9]+/.exec(line);
      tid = m ? m[0] : "";
      blk = [line];
    } else {
      blk.push(line);
    }
  }
  if (tid !== "") blocks.push({ tidFull: tid, text: blk.join("\n") });
  return blocks;
}

interface ClassifiedLine {
  tag: string; // "Layers" | "Depends-on" | "Cites" | "STRAY" | "P"
  text: string;
}

const DECL_KEY_RE = /^(Layers|Depends-on|Cites):[ \t]*/;

/** Ports classify()'s awk script line-for-line, same rule order (each line matches exactly one
 *  branch, mirroring awk's `next`-terminated pattern-action list). */
export function classify(blockText: string): ClassifiedLine[] {
  const lines = blockText.split("\n");
  const out: ClassifiedLine[] = [];
  let cur = "";
  for (const raw of lines) {
    if (/^### /.test(raw)) {
      cur = "";
      continue;
    }
    const declMatch = DECL_KEY_RE.exec(raw);
    if (declMatch) {
      cur = declMatch[1]!;
      out.push({ tag: cur, text: raw.slice(declMatch[0].length) });
      continue;
    }
    if (cur !== "" && /^[ \t]+[^ \t]/.test(raw)) {
      out.push({ tag: cur, text: raw.replace(/^[ \t]+/, "") });
      continue;
    }
    if (cur !== "" && raw.startsWith("`")) {
      out.push({ tag: "STRAY", text: cur });
      cur = "";
      out.push({ tag: "P", text: raw });
      continue;
    }
    cur = "";
    out.push({ tag: "P", text: raw });
  }
  return out;
}

/** declval(): joined value text for one declaration key, trailing space included when non-empty --
 *  ported verbatim from `sed -n "s/^$2|//p" | tr '\n' ' '`, whose trailing newline (re-added by the
 *  `printf '%s\n'` ahead of it) becomes a trailing space nothing downstream ever strips. */
function declval(cls: readonly ClassifiedLine[], key: string): string {
  const vals = cls.filter((c) => c.tag === key).map((c) => c.text);
  return vals.length > 0 ? vals.join(" ") + " " : "";
}

function proseOf(cls: readonly ClassifiedLine[]): string {
  return cls
    .filter((c) => c.tag === "P")
    .map((c) => c.text)
    .join("\n");
}

function straysRaw(cls: readonly ClassifiedLine[]): string[] {
  return cls.filter((c) => c.tag === "STRAY").map((c) => c.text);
}

/** layers_tokens(): every backtick-delimited span in `text`, backticks stripped, IN ORDER (dedup is
 *  the caller's job, exactly as in the shell -- callers pipe this through `sort -u`). */
export function layersTokens(text: string): string[] {
  const matches = text.match(/`[^`]+`/g) ?? [];
  return matches.map((m) => m.slice(1, -1));
}

// --- the one batched subprocess: sort+dedup every group across the whole run in a single call ----

/** One `<n>\t<value>` line per raw item; sorted with the host's OWN collation (see file header), then
 *  split back into per-group deduped, sorted arrays. Never called per-block or per-list -- called
 *  exactly once for an entire multi-file run, which is what keeps this ONE-Bun-process fast despite
 *  needing the real `sort` binary for locale fidelity. */
function batchSortDedup(groups: readonly (readonly string[])[]): string[][] {
  const nonEmptyIdx: number[] = [];
  const payloadLines: string[] = [];
  groups.forEach((items, i) => {
    if (items.length === 0) return;
    nonEmptyIdx.push(i);
    for (const item of items) payloadLines.push(`${i}\t${item}`);
  });
  const result: string[][] = groups.map(() => []);
  if (payloadLines.length === 0) return result;

  const payload = payloadLines.join("\n") + "\n";
  const sorted = execFileSync("sort", ["-u"], { input: payload, encoding: "utf8" });
  for (const line of sorted.split("\n")) {
    if (line === "") continue;
    const tab = line.indexOf("\t");
    const idx = Number(line.slice(0, tab));
    result[idx]!.push(line.slice(tab + 1));
  }
  return result;
}

// --- check_block(), ported verbatim including every message string -------------------------------

interface BlockCheckInputs {
  sp: string;
  tidFull: string;
  tshort: string;
  layersLine: string;
  depsLine: string;
  citesLine: string;
  prose: string;
  strays: string[]; // sorted, deduped
  citesToks: string[]; // sorted, deduped
  citesTids: string[]; // sorted, deduped
  layersToks: string[]; // sorted, deduped
  toks: string[]; // sorted, deduped -- prose-implied file tokens
  layersBare: string[]; // sorted, deduped
  oids: string[]; // sorted, deduped
}

function runCheckBlock(inp: BlockCheckInputs): { lines: string[]; anyFail: boolean } {
  const lines: string[] = [];
  let anyFail = false;
  const ok = (msg: string) => lines.push(`PASS  ${msg}`);
  const bad = (msg: string) => {
    anyFail = true;
    lines.push(`FAIL  ${msg}`);
  };

  const { sp, tidFull, tshort, depsLine, prose, layersLine } = inp;

  // -- unindented continuation ----------------------------------------------------------------
  const straysJoined = inp.strays.length > 0 ? inp.strays.join(" ") + " " : "";
  if (straysJoined.trim() !== "") {
    bad(
      `${sp} ${tidFull} declaration continuation: a wrapped ${straysJoined}line must be indented to continue; at column 0 it reads as prose`,
    );
  }

  const layersSet = new Set(inp.layersToks);
  const citesSet = new Set(inp.citesToks);
  const citesTidSet = new Set(inp.citesTids);

  // -- Cites:/Layers: contradiction ------------------------------------------------------------
  let contra = "";
  for (const c of inp.citesToks) {
    if (layersSet.has(c)) contra += " " + c;
  }
  if (contra !== "") {
    bad(`${sp} ${tidFull} Cites/Layers contradiction:${contra} declared as touched AND escaped as merely cited`);
  }

  // -- (a)+(b): file-shaped tokens named in prose, absent from Layers: ------------------------
  const layersDirs = inp.layersToks.filter((t) => t.endsWith("/"));
  const coveredByDir = (path: string) => layersDirs.some((d) => path.startsWith(d));

  let missF = "";
  for (const t of inp.toks) {
    if (layersSet.has(t)) continue;
    if (coveredByDir(t)) continue;
    if (citesSet.has(t)) continue;
    missF += " " + t;
  }
  if (/TD-[0-9]+/.test(prose) && /resolved/i.test(prose)) {
    if (!layersSet.has("TECH-DEBT.md") && !citesSet.has("TECH-DEBT.md")) {
      missF += " TECH-DEBT.md(TD-marked-resolved)";
    }
  }
  if (missF !== "") {
    bad(
      `${sp} ${tidFull} Layers completeness: DoD/Acceptance implies${missF}, absent from Layers: -- if the prose only cites it rather than touching it, declare it on a Cites: line`,
    );
  } else {
    ok(`${sp} ${tidFull} Layers completeness (DoD-implied files all declared)`);
  }

  // -- (d): a file-shaped token written in Layers: OUTSIDE backticks --------------------------
  // NB the oracle's own message uses `printf '%s' "$layers_bare" | tr '\n' ' '` here -- NO trailing
  // \n before the tr, unlike declval()/strays() a few lines above which both use `printf '%s\n'`.
  // That means NO trailing space before the closing paren, regardless of item count (verified
  // against the live oracle: "(config.sh)", never "(config.sh )") -- a real divergence this port
  // shipped with once and the differential caught (evals/layers-completeness-differential.ts).
  if (inp.layersBare.length > 0) {
    bad(
      `${sp} ${tidFull} layers-unbackticked-token: declares a path-shaped token outside backticks (${inp.layersBare.join(" ")}); a declaration is backtick-delimited, so this reads as prose to both checkers and as a declaration to the dispatch preflight`,
    );
  }

  // -- (c): other task ids named in prose, absent from Depends-on: ----------------------------
  let missD = "";
  for (const o of inp.oids) {
    if (o === tshort) continue;
    if (new RegExp(`\\b${o}\\b`).test(depsLine)) continue;
    if (citesTidSet.has(o)) continue;
    missD += " " + o;
  }
  if (missD !== "") {
    bad(
      `${sp} ${tidFull} Depends-on completeness: DoD/Acceptance references${missD}, absent from Depends-on: -- if the prose only cites that task rather than depending on it, declare it on a Cites: line`,
    );
  } else {
    ok(`${sp} ${tidFull} Depends-on completeness (prose-referenced tasks all declared)`);
  }

  // layersLine is read by the caller's dead-code equivalent (fmv()) in the oracle -- unused here
  // too, kept as a named field on BlockCheckInputs only so callers don't have to special-case it.
  void layersLine;

  return { lines, anyFail };
}

// --- top-level run, batching the sort exactly once across every file and block -------------------

export interface RunResult {
  lines: string[];
  fail: boolean;
}

const FILE_TOKEN_RE = /`[A-Za-z0-9_./-]+\.[A-Za-z]+`/g;
const BARE_TOKEN_RE = /[A-Za-z0-9_./-]+\.[A-Za-z]+/g;
const TID_RE = /\bT[0-9]+\b/g;

export function runLayersCompleteness(args: readonly string[]): RunResult {
  if (args.length === 0) {
    return { lines: ["      layers completeness: no sprint files given -- nothing verified"], fail: false };
  }

  // emit[] holds the FINAL output in original order: either a fixed string (file-not-found) or a
  // pending block whose lines are filled in after the one batched sort call.
  type Emit = { kind: "line"; text: string } | { kind: "block"; index: number };
  const emit: Emit[] = [];
  const pending: {
    sp: string;
    tidFull: string;
    tshort: string;
    layersLine: string;
    depsLine: string;
    citesLine: string;
    prose: string;
    strayItems: string[];
    citesTokItems: string[];
    citesTidItems: string[];
    layersTokItems: string[];
    tokItems: string[];
    layersBareItems: string[];
    oidItems: string[];
  }[] = [];

  for (const sp of args) {
    let isFile = false;
    try {
      isFile = existsSync(sp) && statSync(sp).isFile();
    } catch {
      isFile = false;
    }
    if (!isFile) {
      emit.push({ kind: "line", text: `FAIL  layers-completeness: file not found: ${sp}` });
      continue;
    }
    if (isArchivedPath(sp)) continue;

    const content = readFileSync(sp, "utf8");
    const planLines = extractPlanLines(content);
    const blocks = extractBlocks(planLines);

    for (const block of blocks) {
      const tshortMatch = /T[0-9]+/.exec(block.tidFull);
      const tshort = tshortMatch ? tshortMatch[0] : "";
      const cls = classify(block.text);

      const layersLine = declval(cls, "Layers");
      const depsLine = declval(cls, "Depends-on");
      const citesLine = declval(cls, "Cites");
      const prose = proseOf(cls);

      const citesTokItems = layersTokens(citesLine);
      const citesTidItems = citesLine.match(TID_RE) ?? [];
      const layersTokItems = layersTokens(layersLine);
      const tokItems = (prose.match(FILE_TOKEN_RE) ?? []).map((m) => m.slice(1, -1));
      const strippedLayersLine = layersLine.replace(/`[^`]*`/g, "");
      const layersBareItems = strippedLayersLine.match(BARE_TOKEN_RE) ?? [];
      const oidItems = prose.match(TID_RE) ?? [];
      const strayItems = straysRaw(cls);

      const index = pending.length;
      pending.push({
        sp,
        tidFull: block.tidFull,
        tshort,
        layersLine,
        depsLine,
        citesLine,
        prose,
        strayItems,
        citesTokItems,
        citesTidItems,
        layersTokItems,
        tokItems,
        layersBareItems,
        oidItems,
      });
      emit.push({ kind: "block", index });
    }
  }

  // One sort call for the ENTIRE run: 7 groups per block, in a fixed order so the demux below can
  // read them back by position.
  const groups: string[][] = [];
  const groupIdx: Record<
    "strays" | "citesToks" | "citesTids" | "layersToks" | "toks" | "layersBare" | "oids",
    number[]
  > = { strays: [], citesToks: [], citesTids: [], layersToks: [], toks: [], layersBare: [], oids: [] };
  for (const p of pending) {
    groupIdx.strays.push(groups.push(p.strayItems) - 1);
    groupIdx.citesToks.push(groups.push(p.citesTokItems) - 1);
    groupIdx.citesTids.push(groups.push(p.citesTidItems) - 1);
    groupIdx.layersToks.push(groups.push(p.layersTokItems) - 1);
    groupIdx.toks.push(groups.push(p.tokItems) - 1);
    groupIdx.layersBare.push(groups.push(p.layersBareItems) - 1);
    groupIdx.oids.push(groups.push(p.oidItems) - 1);
  }
  const sorted = batchSortDedup(groups);

  const finalLines: string[] = [];
  let fail = false;
  for (const e of emit) {
    if (e.kind === "line") {
      finalLines.push(e.text);
      fail = true;
      continue;
    }
    const i = e.index;
    const p = pending[i]!;
    const { lines, anyFail } = runCheckBlock({
      sp: p.sp,
      tidFull: p.tidFull,
      tshort: p.tshort,
      layersLine: p.layersLine,
      depsLine: p.depsLine,
      citesLine: p.citesLine,
      prose: p.prose,
      strays: sorted[groupIdx.strays[i]!]!,
      citesToks: sorted[groupIdx.citesToks[i]!]!,
      citesTids: sorted[groupIdx.citesTids[i]!]!,
      layersToks: sorted[groupIdx.layersToks[i]!]!,
      toks: sorted[groupIdx.toks[i]!]!,
      layersBare: sorted[groupIdx.layersBare[i]!]!,
      oids: sorted[groupIdx.oids[i]!]!,
    });
    finalLines.push(...lines);
    if (anyFail) fail = true;
  }

  return { lines: finalLines, fail };
}

if (import.meta.main) {
  const result = runLayersCompleteness(process.argv.slice(2));
  for (const line of result.lines) console.log(line);
  process.exit(result.fail ? 1 : 0);
}
