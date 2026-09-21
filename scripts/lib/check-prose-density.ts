// scripts/lib/check-prose-density.ts -- EPIC-017 TASK-364, first slice. Run by Bun.
//
// WHY THIS EXISTS. `check-doc-caps` counts NEWLINES. A markdown file satisfies a newline cap by
// writing longer lines, and that is measurably what happened: `.claude/CLAUDE.md` held 63 lines
// (cap 80) while its content grew 2.62x after the cap was first reached, and its longest single
// line reached 6,681 characters. STANDARD 157 already forbids this -- "cap-hit -> split, never
// squeeze ... never compress signal away" -- but nothing checked it, and an enforced counter
// beside an unenforced principle wins every time.
//
// WHY A RATCHET AND NOT A THRESHOLD. TD-174 records the failure mode of the obvious design: three
// `OVER-CAP (soft)` rows print on every run, one 23x its cap, and nothing acts on them. So this
// reuses the pattern `doc-caps-grandfathered.txt` already documents -- record the count at
// adoption, FAIL when it GROWS -- which cannot be satisfied by ignoring it. A file reaching 0 is
// told to delete its own row, so the baseline is a file whose purpose is to reach empty.
//
// THE POPULATION IS DERIVED, NOT HAND-LISTED -- and it was hand-listed once, which was the defect.
// The first version examined 3 hardcoded paths plus `skills/*/SKILL.md`: 16 files against the 78
// that `check-doc-caps` enforces a cap on. An outside review found 62 capped files unexamined, 10
// of them already dense, including `TODO.md` (684 lines against a 320 soft cap, carrying a 679-char
// line) -- the file where the squeeze incentive is highest. It also found the inverted tell that
// proves the set was inherited rather than derived: `spec/STANDARD.md`, the ONE examined file with
// no numeric cap at all, was in; 62 that can be squeezed were out. The squeeze incentive exists
// exactly where a newline cap is enforced, so the population is now taken from the same source
// `check-doc-caps` uses -- `deriveRows()` over STANDARD 2, plus the ADR-006 `SKILL.md` allowlist.
// (STANDARD.md is re-added by ALWAYS_EXAMINED below, on the SECOND rationale -- see there.)
// This is L-186: detection logic can be perfect over the wrong member set, and the member set is
// the one property no fixture written against the detector will ever question.
//
// DELIBERATELY OUT: `skills/*/references/*.md`. ADR-006 makes `references/` the sanctioned overflow
// when a SKILL.md hits its cap, and it is uncapped ON PURPOSE. No cap means no squeeze incentive,
// which is this leg's whole subject. Stated here as a ruling so its absence is never read as the
// same oversight that produced the hand-list.
//
// WHY 400 CHARACTERS. Derived. Across the capped prose corpus the distribution was median 74,
// p90 130, p95 254, p99 664, max 6,681. This repo hand-wraps at ~100. 400 sits near p97 --
// comfortably above any ordinary long sentence, so what it catches is a paragraph that refused
// to wrap, not a style preference.
//
// TABLE ROWS ARE MEASURED BY CELL, NOT BY LINE. A real table row is legitimately long because it
// encodes columns. Skipping the whole row, however, let `| ` prefixed onto any prose hide it
// completely -- and that bypass was already live: `spec/STANDARD.md` carried a 1,108-char prose
// cell and this leg reported it clean, while `skills/lean-doc-generator/SKILL.md:107` held a
// 2,111-char paragraph in a table cell. Measuring the longest CELL keeps real tables quiet and
// closes the hole.
//
// Usage: bun scripts/lib/check-prose-density.ts <repo-root>
// Prints one PASS/FAIL/INFO/SKIP line per finding; exits 1 if any FAIL line was printed.

import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { deriveRows, shGlobExpand } from "./check-doc-caps.ts";

export const DENSE_LINE_CHARS = 400;
export const ALWAYS_LOADED = [".claude/CLAUDE.md", ".claude/CONTEXT.md"];

/**
 * Examined REGARDLESS of whether §2 gives them a numeric cap.
 *
 * There are two reasons a file belongs in this population, not one. The first is the **squeeze
 * incentive**: wherever a newline cap is enforced, density is the way to satisfy it, and that is
 * what `deriveRows()` covers. The second is **reading cost**: core prose that is read constantly
 * is expensive when dense whether or not anyone capped it.
 *
 * Deriving from caps alone got this wrong in both directions on the same file. The first version
 * hand-listed `spec/STANDARD.md` and an outside review flagged it as the tell that the set was
 * inherited rather than derived -- it is the one file §2 explicitly rules "no numeric cap". The
 * fix then dropped it, and it turns out to carry **6 dense lines including a 1,047-char table
 * cell**: the document that says "split, never squeeze" would have gone unmeasured by the check
 * that enforces it. Neither rationale alone covers the population; both are stated here.
 */
export const ALWAYS_EXAMINED = ["spec/STANDARD.md"];
export const BASELINE_FILE = "scripts/lib/prose-density-baseline.txt";

/**
 * The measured width of a line.
 *
 * For a table row this is the longest CELL, not the row: a 5-column row of short cells is fine,
 * and a "row" that is one paragraph behind a `| ` is not. For anything else it is the line.
 */
export function measuredWidth(line: string): number {
  const t = line.trimStart();
  if (!t.startsWith("|")) return line.length;
  let widest = 0;
  for (const cell of t.split("|")) {
    const w = cell.trim().length;
    if (w > widest) widest = w;
  }
  return widest;
}

export interface DenseResult {
  readonly lines: number[];
  /** An ODD number of fence markers means everything after the last one was skipped silently. */
  readonly unbalancedFence: boolean;
}

export function denseLines(content: string, threshold = DENSE_LINE_CHARS): DenseResult {
  const out: number[] = [];
  let inFence = false;
  let fenceMarkers = 0;
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const t = line.trimStart();
    if (t.startsWith("```") || t.startsWith("~~~")) {
      fenceMarkers++;
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (measuredWidth(line) > threshold) out.push(i + 1);
  }
  return { lines: out, unbalancedFence: fenceMarkers % 2 !== 0 };
}

export interface BaselineParse {
  readonly counts: Map<string, number>;
  readonly duplicates: string[];
  readonly malformed: string[];
}

/** `<path> <count-at-adoption>`; `#` comments and blanks ignored. Duplicates are a finding, not a merge. */
export function parseBaseline(content: string): BaselineParse {
  const counts = new Map<string, number>();
  const duplicates: string[] = [];
  const malformed: string[] = [];
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2 || !/^\d+$/.test(parts[1]!)) {
      malformed.push(line);
      continue;
    }
    const p = parts[0]!;
    if (counts.has(p)) duplicates.push(p);
    counts.set(p, Number.parseInt(parts[1]!, 10));
  }
  return { counts, duplicates, malformed };
}

/**
 * Every file that `check-doc-caps` enforces a numeric cap on, hard or soft -- derived from
 * STANDARD 2 exactly as that checker derives it -- plus the ADR-006 SKILL.md allowlist and the
 * always-loaded pair. Deduped, sorted, existing only.
 */
export function proseFiles(root: string): string[] {
  const set = new Set<string>();
  const guide = join(root, "spec", "STANDARD.md");
  if (existsSync(guide)) {
    for (const row of deriveRows(readFileSync(guide, "utf8"))) {
      if (row.path === "") continue;
      const glob = (row.pfx + row.path).replace(/NNN/g, "*").replace(/<[^>]*>/g, "*");
      for (const c of shGlobExpand(root, glob)) if (c.endsWith(".md")) set.add(c);
    }
  }
  for (const s of shGlobExpand(root, "skills/*/SKILL.md")) set.add(s);
  for (const a of ALWAYS_LOADED) set.add(a);
  for (const a of ALWAYS_EXAMINED) set.add(a);

  return [...set]
    .filter((f) => {
      const p = join(root, f);
      if (!existsSync(p)) return false;
      try {
        return statSync(p).isFile();
      } catch {
        return false;
      }
    })
    .sort();
}

export interface Finding {
  readonly level: "PASS" | "FAIL" | "INFO" | "SKIP";
  readonly text: string;
}

export function run(root: string): Finding[] {
  const findings: Finding[] = [];
  const baselinePath = join(root, BASELINE_FILE);
  const parsed = existsSync(baselinePath)
    ? parseBaseline(readFileSync(baselinePath, "utf8"))
    : { counts: new Map<string, number>(), duplicates: [], malformed: [] };

  let alwaysLoadedBytes = 0;
  for (const rel of ALWAYS_LOADED) {
    const p = join(root, rel);
    if (existsSync(p)) alwaysLoadedBytes += readFileSync(p).byteLength;
  }
  findings.push({
    level: "INFO",
    // Bytes, not tokens, and said so. This repo declares ZERO dependencies, so there is no
    // tokenizer here and inventing a number from one would be an unstated method (L-169).
    text: `prose-density: always-loaded read set = ${alwaysLoadedBytes} bytes (~${Math.round(alwaysLoadedBytes / 4)} tokens at 4 bytes/token, a stated approximation -- no tokenizer, zero-dep policy)`,
  });

  for (const d of parsed.duplicates) {
    findings.push({ level: "FAIL", text: `prose-density: baseline has a DUPLICATE row for ${d} -- the later row silently wins, which is a quieter diff than editing the first` });
  }
  for (const m of parsed.malformed) {
    findings.push({ level: "FAIL", text: `prose-density: baseline row is malformed and was ignored: "${m}"` });
  }

  const files = proseFiles(root);
  if (files.length === 0) {
    // A skip is indistinguishable from a pass unless it is printed (L-058, and the rule
    // check-doc-caps already follows by naming every absent path).
    findings.push({ level: "SKIP", text: `prose-density: no capped prose files found under ${root} -- nothing examined, which is NOT a pass` });
  }

  const examined = new Set(files);
  for (const rel of parsed.counts.keys()) {
    if (!examined.has(rel)) {
      findings.push({ level: "FAIL", text: `prose-density: baseline names ${rel}, which is not in the examined population -- a stale row rots invisibly and takes its dense lines with it` });
    }
  }

  for (const rel of files) {
    const res = denseLines(readFileSync(join(root, rel), "utf8"));
    if (res.unbalancedFence) {
      findings.push({ level: "FAIL", text: `prose-density: ${rel} has an ODD number of fence markers -- everything after the last one is skipped silently, so this file's count cannot be trusted` });
    }
    const actual = res.lines.length;
    const recorded = parsed.counts.get(rel);

    if (actual === 0) {
      if (recorded !== undefined) {
        findings.push({ level: "PASS", text: `prose-density: ${rel} (0 lines > ${DENSE_LINE_CHARS} chars) -- baseline row is spent, delete it` });
      }
      continue;
    }
    const where = `lines ${res.lines.slice(0, 5).join(", ")}${res.lines.length > 5 ? ", ..." : ""}`;
    if (recorded === undefined) {
      findings.push({ level: "FAIL", text: `prose-density: ${rel} has ${actual} line(s) over ${DENSE_LINE_CHARS} chars and no baseline row [STANDARD 157: split, never squeeze] -- ${where}` });
    } else if (actual > recorded) {
      findings.push({ level: "FAIL", text: `prose-density: ${rel} grew to ${actual} dense lines, baseline ${recorded} [STANDARD 157: split, never squeeze] -- it got denser under the clause; ${where}` });
    } else {
      findings.push({ level: "PASS", text: `prose-density: ${rel} (${actual} <= ${recorded} dense lines) -- adopted drift, shrink it at the next promote review` });
    }
  }
  return findings;
}

if (import.meta.main) {
  const root = process.argv[2];
  if (!root) {
    console.error("usage: check-prose-density.ts <repo-root>");
    process.exit(1);
  }
  const findings = run(root);
  for (const f of findings) console.log(`${f.level.padEnd(5)} ${f.text}`);
  // Count the levels actually emitted. The first version printed `findings.length - fails`, which
  // counted its own INFO line as a pass -- so the number it PRINTED (15) disagreed with the rows it
  // emitted (14) and with what qa-check.sh adds to the gate total. L-120, in the guard built to
  // enforce rule-following.
  const passes = findings.filter((f) => f.level === "PASS").length;
  const fails = findings.filter((f) => f.level === "FAIL").length;
  console.log(`prose-density: ${passes} pass, ${fails} fail`);
  process.exit(fails > 0 ? 1 : 0);
}
