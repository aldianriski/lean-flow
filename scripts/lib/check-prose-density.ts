// scripts/lib/check-prose-density.ts -- EPIC-017 TASK-364, first slice. Run by Bun.
//
// WHY THIS EXISTS. `check-doc-caps` counts NEWLINES. A markdown file satisfies a newline cap by
// writing longer lines, and that is measurably what happened: `.claude/CLAUDE.md` held 63 lines
// (cap 80) while its content grew 2.62x after the cap was first reached, and its longest single
// line is now 6,681 characters. STANDARD 157 already forbids this -- "cap-hit -> split, never
// squeeze ... never compress signal away" -- but nothing checks it, and an enforced counter beside
// an unenforced principle wins every time. This file is the missing check.
//
// WHY A RATCHET AND NOT A THRESHOLD. TD-174 records the failure mode of the obvious design: the
// three `OVER-CAP (soft)` rows print on every run and nothing acts on them, one of them 23x its
// cap. A guard that only reports is a log line. So this reuses the pattern
// `doc-caps-grandfathered.txt` already documents -- record the count at adoption, FAIL when it
// GROWS -- which cannot be satisfied by ignoring it and cannot flood day one with 64 findings.
// A file that reaches 0 is told to delete its own row, so the baseline is a file whose purpose is
// to reach empty.
//
// WHY 400 CHARACTERS. Derived, not chosen. Across the capped prose corpus (CLAUDE.md, CONTEXT.md,
// every SKILL.md, STANDARD.md; n=2,246 non-table lines) the distribution is median 74, p90 130,
// p95 254, p99 664, max 6,681. This repo hand-wraps at ~100. 400 sits near p97 -- comfortably above
// any ordinary long sentence, so what it catches is a paragraph that refused to wrap, which is the
// density-gaming signal and not a style preference.
//
// WHAT IT DELIBERATELY DOES NOT DO. It does not judge content, and it does not replace the line
// cap -- line counts remain the primary size signal and this is the second one, answering the
// question a newline count cannot: *is the file meeting its cap honestly?*
//
// Usage: bun scripts/lib/check-prose-density.ts <repo-root>
// Prints one PASS/FAIL/INFO line per finding; exits 1 if any FAIL line was printed, 0 otherwise.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** A prose line longer than this is a paragraph that refused to wrap. See header for derivation. */
export const DENSE_LINE_CHARS = 400;

/** Relative to the repo root. Read on EVERY session, so their density is paid every time. */
export const ALWAYS_LOADED = [".claude/CLAUDE.md", ".claude/CONTEXT.md"];

export const BASELINE_FILE = "scripts/lib/prose-density-baseline.txt";

/**
 * Lines that are not prose and must not be measured as prose.
 *
 * A markdown TABLE row is legitimately long -- it encodes columns, and wrapping it would break the
 * table. A FENCED CODE block is verbatim content whose line length is not the author's to choose.
 * Counting either would make the check fire on files that are not gaming anything, and a guard that
 * cries wolf on correct input gets ignored, which is the failure this whole task is about.
 *
 * NOTE the fence toggle is deliberately dumb (any line whose trimmed form starts with ```): nested
 * or malformed fences would mis-toggle, but markdown that malformed has a bigger problem than this
 * check, and a cleverer parser is a second thing to get wrong.
 */
export function denseLines(content: string, threshold = DENSE_LINE_CHARS): number[] {
  const out: number[] = [];
  let inFence = false;
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const trimmed = line.trimStart();
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (trimmed.startsWith("|")) continue; // table row
    if (line.length > threshold) out.push(i + 1);
  }
  return out;
}

/** `<path> <count-at-adoption>` per line; `#` comments and blanks ignored. */
export function parseBaseline(content: string): Map<string, number> {
  const map = new Map<string, number>();
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;
    const n = Number.parseInt(parts[1]!, 10);
    if (!Number.isNaN(n)) map.set(parts[0]!, n);
  }
  return map;
}

/** Every SKILL.md plus the always-loaded set and the spec -- the capped prose corpus. */
export function proseFiles(root: string): string[] {
  const files = [...ALWAYS_LOADED, "spec/STANDARD.md"];
  const skillsDir = join(root, "skills");
  if (existsSync(skillsDir)) {
    for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const rel = `skills/${entry.name}/SKILL.md`;
      if (existsSync(join(root, rel))) files.push(rel);
    }
  }
  return files.filter((f) => existsSync(join(root, f)));
}

export interface Finding {
  readonly level: "PASS" | "FAIL" | "INFO";
  readonly text: string;
}

export function run(root: string): Finding[] {
  const findings: Finding[] = [];
  const baselinePath = join(root, BASELINE_FILE);
  const baseline = existsSync(baselinePath)
    ? parseBaseline(readFileSync(baselinePath, "utf8"))
    : new Map<string, number>();

  // The number nobody had: what every session pays before any work begins.
  let alwaysLoadedBytes = 0;
  for (const rel of ALWAYS_LOADED) {
    const p = join(root, rel);
    if (existsSync(p)) alwaysLoadedBytes += readFileSync(p).byteLength;
  }
  findings.push({
    level: "INFO",
    // Bytes, not tokens, and said so on purpose. This repo declares ZERO dependencies, so there is
    // no tokenizer here and inventing a number from one would be an unstated method (L-169). Bytes
    // are exact and reproducible anywhere; the ~4 bytes/token ratio is the documented conversion.
    text: `prose-density: always-loaded read set = ${alwaysLoadedBytes} bytes (~${Math.round(alwaysLoadedBytes / 4)} tokens at 4 bytes/token, a stated approximation -- no tokenizer, zero-dep policy)`,
  });

  for (const rel of proseFiles(root)) {
    const lines = denseLines(readFileSync(join(root, rel), "utf8"));
    const actual = lines.length;
    const recorded = baseline.get(rel);

    if (actual === 0) {
      if (recorded !== undefined) {
        findings.push({
          level: "PASS",
          text: `prose-density: ${rel} (0 lines > ${DENSE_LINE_CHARS} chars) -- baseline row is spent, delete it`,
        });
      }
      continue;
    }

    if (recorded === undefined) {
      // A file that has dense lines and NO baseline row is new drift, not adopted drift. This is
      // the arm that makes the ratchet a ratchet: you cannot add a dense file and stay green.
      findings.push({
        level: "FAIL",
        text: `prose-density: ${rel} has ${actual} line(s) over ${DENSE_LINE_CHARS} chars and no baseline row [STANDARD 157: split, never squeeze] -- lines ${lines.slice(0, 5).join(", ")}${lines.length > 5 ? ", ..." : ""}`,
      });
    } else if (actual > recorded) {
      findings.push({
        level: "FAIL",
        text: `prose-density: ${rel} grew to ${actual} dense lines, baseline ${recorded} [STANDARD 157: split, never squeeze] -- it got denser under the clause; lines ${lines.slice(0, 5).join(", ")}${lines.length > 5 ? ", ..." : ""}`,
      });
    } else {
      findings.push({
        level: "PASS",
        text: `prose-density: ${rel} (${actual} <= ${recorded} dense lines) -- adopted drift, shrink it at the next promote review`,
      });
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
  const fails = findings.filter((f) => f.level === "FAIL").length;
  console.log(`prose-density: ${findings.length - fails} pass, ${fails} fail`);
  process.exit(fails > 0 ? 1 : 0);
}
