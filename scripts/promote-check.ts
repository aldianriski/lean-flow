// scripts/promote-check.ts -- TASK-368 (SPRINT-115 T5). Run by Bun. Tier X: run plumbing, not a guard.
//
// WHY. A finding in a Plan is cheapest at the moment the Plan is written. The two per-file checks
// below take well under a second on ONE sprint file, but their only runner was the full gate, which
// is the slowest thing in this repo (SPRINT-104 shipped a Plan that failed layers-completeness from
// plan_commit to close, six findings, because nothing ran it earlier). This is lean-flow's own
// promote step: run it on the NEW sprint file BEFORE committing `plan locked`.
//
// It calls the existing checkers -- it owns no check logic:
//   1. layers-completeness   (scripts/lib/check-layers-completeness.ts, runLayersCompleteness)
//   2. prose-density, 400-char dense-line rule (scripts/lib/check-prose-density.ts, runSingleFile --
//      a new file has no baseline row, so any line over DENSE_LINE_CHARS is a FAIL)
// Every finding is printed, never the first only. Not shipped to adopters: this path must not
// appear in skills/ or templates/ (L-015).
//
// Usage: bun scripts/promote-check.ts <sprint-file>
// Exit 0 + a PASS verdict line when clean; exit 1 with every FAIL named otherwise.

import { existsSync, statSync } from "node:fs";
import { runLayersCompleteness } from "./lib/check-layers-completeness.ts";
import { runSingleFile } from "./lib/check-prose-density.ts";

export interface PromoteResult {
  readonly lines: string[];
  readonly fails: number;
}

export function promoteCheck(file: string): PromoteResult {
  if (!existsSync(file) || !statSync(file).isFile()) {
    return { lines: [`FAIL  promote-check: ${file} is not a file -- nothing verified, which is NOT a pass`], fails: 1 };
  }
  const lines: string[] = [];
  const layers = runLayersCompleteness([file]);
  lines.push(...layers.lines);
  for (const f of runSingleFile(file)) lines.push(`${f.level.padEnd(5)} ${f.text}`);
  const fails = lines.filter((l) => l.startsWith("FAIL")).length;
  return { lines, fails };
}

if (import.meta.main) {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: promote-check.ts <sprint-file>");
    process.exit(1);
  }
  const r = promoteCheck(file);
  for (const l of r.lines) console.log(l);
  const passes = r.lines.filter((l) => l.startsWith("PASS")).length;
  console.log(
    r.fails > 0
      ? `promote-check: FAIL -- ${r.fails} finding(s), ${passes} pass -- fix before committing \`plan locked\``
      : `promote-check: PASS -- ${passes} pass, 0 fail`,
  );
  process.exit(r.fails > 0 ? 1 : 0);
}
