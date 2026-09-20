// scripts/lib/check-doc-caps.ts -- TypeScript port of check-doc-caps.sh (TASK-355), run by Bun.
//
// WHY: the shell version launches ~16 subprocesses (wc/sed/awk/grep/case) per invocation, each
// costing ~2.75s under Windows fork() emulation. This port moves the same logic in-process. It is a
// SPEED change only -- every assertion the shell checker makes, this file makes identically, bug for
// bug. scripts/lib/check-doc-caps.sh is UNCHANGED and remains the live oracle; this file is checked
// against it by a differential-parity harness, never trusted on its own say-so.
//
// Ported faithfully, including the shell version's own quirks:
//   - the grandfather-candidate gate (`case "$GF" in *"$f "*)`) is a raw substring test over the
//     WHOLE grandfather-file blob, not a per-line anchored match -- kept exactly as-is rather than
//     "fixed", because bug-for-bug compatibility is the requirement, not an improvement.
//   - `cap_file()` in the shell version is defined but never called (dead code) -- not ported, since
//     it produces no observable output.
//
// Cap NUMBERS are still DERIVED from spec/STANDARD.md §2 at run time (never hardcoded here) -- same
// source the shell version reads, so the two cannot drift into two sources of truth for a cap figure.
//
// Usage: bun scripts/lib/check-doc-caps.ts [<docs-guide.md> [<root-dir> [<grandfather-list>]]]
// Prints one PASS/FAIL/note line per cap; exits 1 if any FAIL line was printed, 0 otherwise.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// --- §2 row derivation (pure) ----------------------------------------------------------------------

export interface DerivedRow {
  readonly pfx: string;
  readonly path: string;
  readonly capn: number;
  readonly soft: boolean;
}

/**
 * Ports the awk state machine at the top of check-doc-caps.sh: walk §2's three tables, tracking
 * which prefix marker was last seen, and emit one row per table line that states a numeric cap.
 * A row whose Cap cell has an integer but whose File cell yields no path is retained with path=""
 * (a named FAIL downstream), never silently dropped -- the whole point of deriving rather than
 * hand-listing (L-058).
 */
export function deriveRows(guideContent: string): DerivedRow[] {
  const lines = guideContent.split(/\r?\n/);
  let in2 = false;
  let pfx = "";
  const rows: DerivedRow[] = [];

  for (const line of lines) {
    if (/^## §2/.test(line)) {
      in2 = true;
      continue;
    }
    if (/^## §/.test(line)) {
      in2 = false;
    }
    if (!in2) continue;

    if (/^\*\*Root files/.test(line)) {
      pfx = "";
      continue;
    }
    if (/^\*\*AI context/.test(line)) {
      pfx = ".claude/";
      continue;
    }
    if (/^\*\*`docs\/` tree\*\*/.test(line)) {
      pfx = "docs/";
      continue;
    }

    if (/^\|/.test(line)) {
      if (/^\|[ ]*File[ ]*\|/.test(line)) continue; // header row
      if (/^\|[-| ]*\|$/.test(line)) continue; // separator row
      const parts = line.split("|");
      if (parts.length < 4) continue;
      const file = parts[1] ?? "";
      // Cap column is the 4th cell (parts[3]) for root/.claude tables, 5th (parts[4]) for the docs
      // tree table (it carries an extra Tier column) -- same offsets check-doc-caps.sh's awk uses.
      const cap = pfx === "docs/" ? (parts[4] ?? "") : (parts[3] ?? "");
      const capMatch = cap.match(/[0-9]+/);
      if (!capMatch) continue; // no integer in the Cap cell -- states no numeric cap
      const capn = parseInt(capMatch[0], 10);
      const soft = cap.includes("~") || cap.includes("soft");
      const pathMatch = file.match(/`[^`]+`/);
      const path = pathMatch ? pathMatch[0].slice(1, -1) : "";
      rows.push({ pfx, path, capn, soft });
    }
  }
  return rows;
}

// --- grandfather list (pure) ------------------------------------------------------------------------

/** `$GF`: grandfather file content with comment (`^#`) and blank lines stripped, "" if absent. */
export function loadGrandfatherRaw(gfFilePath: string): string {
  if (!existsSync(gfFilePath)) return "";
  let content: string;
  try {
    content = readFileSync(gfFilePath, "utf8");
  } catch {
    return "";
  }
  const lines = content.split(/\r?\n/);
  const kept = lines.filter((l) => !/^#/.test(l) && !/^[ \t]*$/.test(l));
  return kept.join("\n");
}

/**
 * `case "$GF" in *"$f "*)` -- a raw substring test over the WHOLE blob (not per-line, not anchored).
 * Ported as-is: bug-for-bug compatibility is the requirement, not an improvement on it.
 */
export function gfHasCandidate(gfRaw: string, f: string): boolean {
  return gfRaw.includes(`${f} `);
}

function gfField(gfRaw: string, f: string, fieldIndex: number): string | null {
  const lines = gfRaw.split(/\r?\n/);
  for (const line of lines) {
    const fields = line.trim().split(/\s+/).filter((x) => x.length > 0);
    if (fields.length >= 1 && fields[0] === f) {
      return fields[fieldIndex] ?? "";
    }
  }
  return null;
}

/** `gf_recorded()`: first line whose field 1 equals `f`, field 2. */
export function gfRecorded(gfRaw: string, f: string): string | null {
  return gfField(gfRaw, f, 1);
}

/** `gf_reason()`: first line whose field 1 equals `f`, field 3. */
export function gfReason(gfRaw: string, f: string): string | null {
  return gfField(gfRaw, f, 2);
}

// --- frontmatter status (pure) -----------------------------------------------------------------

/**
 * `fm_status()`: first `status:<space>...` line inside the first 20 lines, position-anchored
 * (L-108) -- a substring search would match prose about supersession further down in this
 * self-describing corpus.
 */
export function fmStatus(content: string): string {
  const lines = content.split(/\r?\n/).slice(0, 20);
  for (const line of lines) {
    if (/^status:[ \t]/.test(line)) {
      return line.replace(/^status:[ \t]*/, "").replace(/[ \t]*$/, "");
    }
  }
  return "";
}

// --- glob expansion (fs, no subprocess) ---------------------------------------------------------

/**
 * Replicates GNU `ls`'s en_US.UTF-8 collation for filenames (bash's glob expansion is then
 * re-sorted by `ls -d` again, so `ls`'s own comparator is the one that must match, not bash's).
 * Derived empirically against this host's real `ls -d` output (glibc's ISO-14651-based en_US
 * collation is not the same table as ICU/`Intl.Collator`, so that was tried and rejected first):
 * primary key folds case and drops hyphens entirely (hyphen is primary-ignorable); ties break on
 * the case-folded string WITH hyphens restored; remaining ties break on the raw byte string.
 * Verified byte-for-byte against this repo's own 44-file `docs/research/` directory before relying
 * on it for the differential-parity claim (a formula is itself a query result, cross-checked here
 * against a census rather than trusted from a handful of hand-picked examples).
 */
function lsCompare(a: string, b: string): number {
  const pa = a.toLowerCase().replace(/-/g, "");
  const pb = b.toLowerCase().replace(/-/g, "");
  if (pa !== pb) return pa < pb ? -1 : 1;
  const sa = a.toLowerCase();
  const sb = b.toLowerCase();
  if (sa !== sb) return sa < sb ? -1 : 1;
  if (a !== b) return a < b ? -1 : 1;
  return 0;
}

/** `cd "$root" && ls -d $glob 2>/dev/null` -- a per-segment glob (`*` never crosses `/`), sorted. */
export function expandGlob(root: string, pattern: string): string[] {
  const segments = pattern.split("/");
  let dirs = [""]; // relative paths accumulated so far
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    const isLast = i === segments.length - 1;
    const regex = new RegExp(
      "^" + seg.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$",
    );
    const next: string[] = [];
    for (const rel of dirs) {
      const absDir = join(root, rel);
      let entries: string[];
      try {
        entries = readdirSync(absDir);
      } catch {
        continue;
      }
      entries.sort(lsCompare);
      for (const e of entries) {
        if (!regex.test(e)) continue;
        const relChild = rel === "" ? e : `${rel}/${e}`;
        if (isLast) {
          next.push(relChild);
        } else {
          try {
            if (statSync(join(root, relChild)).isDirectory()) next.push(relChild);
          } catch {
            /* ignore */
          }
        }
      }
    }
    dirs = next;
  }
  return dirs;
}

function countLines(content: string): number {
  // `wc -l` counts newline characters, not `split("\n").length` (which over-counts a file with no
  // trailing newline by one).
  const m = content.match(/\n/g);
  return m ? m.length : 0;
}

// --- per-row evaluation ---------------------------------------------------------------------------

export interface DocCapsRunOptions {
  readonly root: string;
  readonly gfRaw: string;
}

/**
 * Evaluates every derived row against the real filesystem, producing the exact PASS/FAIL/note lines
 * check-doc-caps.sh's main loop prints (in the same order: row order, then glob-match order within
 * a row), plus whether any FAIL line was emitted.
 */
export function evaluateRows(rows: readonly DerivedRow[], opts: DocCapsRunOptions): { lines: string[]; anyFail: boolean } {
  const { root, gfRaw } = opts;
  const out: string[] = [];
  let anyFail = false;

  for (const row of rows) {
    const { pfx, path, capn } = row;
    if (path === "") {
      out.push(`FAIL  doc-caps: §2 row states cap ${capn} but no path could be derived from its File cell`);
      anyFail = true;
      continue;
    }
    const glob = (pfx + path).replace(/NNN/g, "*").replace(/<[^>]*>/g, "*");
    const candidates = expandGlob(root, glob);
    let matched = false;

    for (const f of candidates) {
      const abs = join(root, f);
      let stat;
      try {
        stat = statSync(abs);
      } catch {
        continue;
      }
      if (!stat.isFile()) continue;
      matched = true;

      let content: string;
      try {
        content = readFileSync(abs, "utf8");
      } catch {
        continue;
      }
      const n = countLines(content);

      let rec: string | null = null;
      if (gfHasCandidate(gfRaw, f)) rec = gfRecorded(gfRaw, f);

      if (rec !== null && row.soft) {
        out.push(
          `FAIL  doc-caps: ${f} has a SOFT cap (${capn}) and must not be in the grandfather list [ADR-015 rule 2] -- a soft cap already reports every run and routes to the promote review; delete the row`,
        );
        anyFail = true;
        rec = null;
      }

      if (n <= capn) {
        if (rec !== null) {
          out.push(`PASS  cap ${f} (${n} <= ${capn}) [§2] -- back under cap: DELETE its grandfather row`);
        } else {
          out.push(`PASS  cap ${f} (${n} <= ${capn}) [§2]`);
        }
      } else if (fmStatus(content) === "superseded") {
        out.push(
          `      FROZEN (superseded): ${f} (${n} lines, cap ${capn}) [§2 · ADR-020] -- uncapped while spent; exits via §11 archive once nothing live cites it, never via a diet`,
        );
      } else if (rec !== null && n <= parseInt(rec, 10)) {
        out.push(`      OVER-CAP (grandfathered): ${f} (${n} > ${capn}, recorded ${rec}) -- ${gfReason(gfRaw, f) ?? ""}`);
      } else if (rec !== null) {
        out.push(`FAIL  cap ${f} (${n} > ${capn}) [§2] -- grandfathered at ${rec} and it GREW; a grandfather clause is not a licence to drift`);
        anyFail = true;
      } else if (row.soft) {
        out.push(`      OVER-CAP (soft): ${f} (${n} > ${capn}) [§2 soft] -- prune at the next promote governance review (§11)`);
      } else {
        out.push(`FAIL  cap ${f} (${n} > ${capn}) [§2]`);
        anyFail = true;
      }
    }

    if (!matched) {
      out.push(`      skip (absent): ${glob} [§2 cap ${capn}]`);
    }
  }

  return { lines: out, anyFail };
}

/** The `skills/<name>/SKILL.md` allowlist (ADR-006, not §2) -- appended after the §2 rows loop. */
export function evaluateSkillCaps(root: string): { lines: string[]; anyFail: boolean } {
  const out: string[] = [];
  let anyFail = false;
  const skillDirs = expandGlob(root, "skills/*/SKILL.md");
  for (const s of skillDirs) {
    const abs = join(root, s);
    let stat;
    try {
      stat = statSync(abs);
    } catch {
      continue;
    }
    if (!stat.isFile()) continue;
    let content: string;
    try {
      content = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    const n = countLines(content);
    if (n <= 140) {
      out.push(`PASS  cap ${s} (${n} <= 140) [ADR-006, not §2]`);
    } else {
      out.push(`FAIL  cap ${s} (${n} > 140) [ADR-006, not §2]`);
      anyFail = true;
    }
  }
  return { lines: out, anyFail };
}

// --- CLI -------------------------------------------------------------------------------------------

export interface DocCapsResult {
  readonly lines: string[];
  readonly exitCode: 0 | 1;
}

/** The full checker, pure w.r.t. its three string/paths inputs plus the filesystem under `root`. */
export function runCheckDocCaps(guidePath: string, root: string, gfFilePath: string): DocCapsResult {
  const lines: string[] = [];

  if (!existsSync(guidePath) || !statSync(guidePath).isFile()) {
    return { lines: [`FAIL  doc-caps: standard not readable: ${guidePath}`], exitCode: 1 };
  }
  let guideContent: string;
  try {
    guideContent = readFileSync(guidePath, "utf8");
  } catch {
    return { lines: [`FAIL  doc-caps: standard not readable: ${guidePath}`], exitCode: 1 };
  }

  const rows = deriveRows(guideContent);
  if (rows.length === 0) {
    return {
      lines: [`FAIL  doc-caps: derived 0 rows from §2 -- the table shape changed and this parser did not`],
      exitCode: 1,
    };
  }

  const gfRaw = loadGrandfatherRaw(gfFilePath);
  const rowResult = evaluateRows(rows, { root, gfRaw });
  lines.push(...rowResult.lines);

  const skillResult = evaluateSkillCaps(root);
  lines.push(...skillResult.lines);

  const anyFail = rowResult.anyFail || skillResult.anyFail;
  return { lines, exitCode: anyFail ? 1 : 0 };
}

if (import.meta.main) {
  const here = import.meta.dir;
  const [guideArg, rootArg, gfArg] = process.argv.slice(2);
  const guide = guideArg ?? join(here, "..", "..", "spec", "STANDARD.md");
  const root = rootArg ?? join(here, "..", "..");
  const gfFile = gfArg ?? join(here, "doc-caps-grandfathered.txt");

  const result = runCheckDocCaps(guide, root, gfFile);
  for (const l of result.lines) console.log(l);
  process.exit(result.exitCode);
}
