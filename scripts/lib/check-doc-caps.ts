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

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
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

// --- glob expansion (ONE real `ls -d` subprocess per glob, never reimplemented) -----------------

// Round 2 (outside review, TASK-355 revise): a hand-rolled collation comparator was tried and
// REJECTED after an outside reviewer found 12+/33 real divergences against `ls` on a case-sensitive
// NTFS dir -- glibc's en_US.UTF-8 collation is ISO 14651, and inferring it from a handful of
// examples (even a 44-file census) keeps producing new defects (lowercase-first case tie-breaking;
// `_`/`.` are ALSO primary-ignorable, not just `-`; a from-scratch regex-based glob had no dotglob
// emulation and could MATCH a file the real shell would never return -- a file-SET divergence, not
// only an ordering one). The fix is not a better formula: it is to stop reimplementing the shell's
// own glob+sort and ask the shell for it directly. `cd "$root" && ls -d $glob 2>/dev/null` is
// exactly the shape check-doc-caps.sh's own for-loop uses, run through the SAME `sh` binary this
// repo already treats as the oracle -- so ordering and dotfile semantics are correct BY
// CONSTRUCTION, not by inference. One spawn per glob (~38 on a full-repo run) measured at a few
// hundred ms total -- see the differential-parity report for the actual number on this host; that
// is the cost accepted to close a defect class a formula cannot close for good (ISO 14651 keeps
// moving; `sh` never has to).
/**
 * Single-quotes `s` for embedding literally in a POSIX shell command line (closes the quote,
 * appends an escaped literal quote, reopens it, for every embedded `'`).
 */
function shSingleQuote(s: string): string {
  return "'" + s.replace(/'/g, `'\\''`) + "'";
}

export function shGlobExpand(root: string, pattern: string): string[] {
  // `root` and `pattern` are embedded directly into ONE `-c` script string, never passed as
  // separate argv entries. Reason (found live, not theorised): MSYS's `sh.exe` on Windows performs
  // its own CRT-level wildcard expansion of an UNQUOTED argv token containing `*`/`?` at process
  // startup -- a legacy MS-DOS-compatibility behaviour, independent of and prior to the shell's own
  // "-c" script interpretation. Passing the glob as its own argv element (`["-c", script, "sh",
  // root, pattern]`) let that startup-time expansion silently pre-expand `pattern` against the
  // spawning process's OWN cwd before the inner script ever ran `ls`, corrupting the result (e.g.
  // 1 of 44 matches survived on a real run). Folding everything into a single, already-quoted `-c`
  // string sidesteps it: that whole argument is one Windows-quoted token, so no bare `*` sits at an
  // argv-token boundary for the CRT to expand.
  const script = `cd ${shSingleQuote(root)} 2>/dev/null && ls -d ${pattern} 2>/dev/null`;
  let stdout = "";
  try {
    stdout = execFileSync("sh", ["-c", script], { encoding: "utf8" });
  } catch (e: any) {
    // `ls` exits non-zero when the glob matched nothing (bash leaves it unexpanded and `ls` can't
    // find a file literally named e.g. `docs/research/*.md`) -- same "no match" the oracle's own
    // `2>/dev/null` swallows. Whatever landed on stdout before the non-zero exit is still used.
    stdout = e.stdout ?? "";
  }
  // `for f in $(...)` word-splits the command substitution on IFS whitespace (space/tab/newline) --
  // ported as-is, including its bug: a real filename containing a space would be split into
  // multiple bogus tokens by the ORACLE too, and this must reproduce that, not fix it.
  return stdout.split(/\s+/).filter((s) => s.length > 0);
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
    const candidates = shGlobExpand(root, glob);
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
  const skillDirs = shGlobExpand(root, "skills/*/SKILL.md");
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

export interface ResolvedArgs {
  readonly guide: string;
  readonly root: string;
  readonly gfFile: string;
}

/**
 * `${1:-default}` / `${2:-default}` / `${3:-default}` -- the shell substitutes the default when a
 * positional parameter is UNSET *or* NULL (empty string). `||` mirrors that; `??` only catches
 * null/undefined and would pass an empty string straight through, diverging from the oracle on
 * `sh check-doc-caps.sh "" . gf.txt` (repro: the oracle resolves the default guide path; a `??`-based
 * port prints an empty path instead).
 */
export function resolveArgs(argv: readonly (string | undefined)[], here: string): ResolvedArgs {
  const [guideArg, rootArg, gfArg] = argv;
  return {
    guide: guideArg || join(here, "..", "..", "spec", "STANDARD.md"),
    root: rootArg || join(here, "..", ".."),
    gfFile: gfArg || join(here, "doc-caps-grandfathered.txt"),
  };
}

if (import.meta.main) {
  const { guide, root, gfFile } = resolveArgs(process.argv.slice(2), import.meta.dir);
  const result = runCheckDocCaps(guide, root, gfFile);
  for (const l of result.lines) console.log(l);
  process.exit(result.exitCode);
}
