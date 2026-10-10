// evals/run-learnings-metadata-fixtures.ts -- retained proof for the body-metadata leg of
// scripts/qa-check.sh § 4a (SPRINT-121 T4, TASK-419). Run by Bun: `bun evals/run-learnings-metadata-fixtures.ts`
//
// THE GUARD: every `[status: active]` ## L-NNN entry must carry a body `- count:` AND `- promoted:` line.
// The gate checked only the heading's [tags][status]; L-209/L-210/L-211 shipped with no body metadata.
//
// This harness extracts the REAL awk program from qa-check.sh (between the `>>> learnings-body-meta`
// and `<<< learnings-body-meta` markers) and runs it, so the fixtures exercise the shipped code, not a copy.
//
//   missing-count / missing-promoted  must FAIL, naming the entry and the absent field
//   complete-control                  must PASS (sibling: discriminates rather than just fires)
//   promoted-pointer-exempt           must PASS -- SELECTION arm (L-186): a collapsed promoted pointer
//                                     legitimately has no body metadata; only active entries are the population
//   boundary-leak                     must FAIL for L-906 only -- the previous entry's lines must not satisfy it

import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const lines = readFileSync("scripts/qa-check.sh", "utf8").split(/\r?\n/);
const a = lines.findIndex((l) => l.includes(">>> learnings-body-meta"));
const b = lines.findIndex((l) => l.includes("<<< learnings-body-meta"));
if (a < 0 || b < 0 || b <= a + 2) {
  console.log("FAIL  learnings-metadata-fixture: markers not found in scripts/qa-check.sh");
  process.exit(1);
}
// lines a+1 is `lm_awk='`, line b-1 is the closing `'`
const prog = lines.slice(a + 2, b - 1).join("\n");
const progFile = join(mkdtempSync(join(tmpdir(), "lm-awk-")), "prog.awk");
writeFileSync(progFile, prog);

function check(file: string): string {
  const r = spawnSync("awk", ["-f", progFile, file], { encoding: "utf8" });
  return (r.stdout ?? "").trim();
}

// `--ledger`: run the extracted program on the REAL docs/LEARNINGS.md (the motivating artifact) and report.
if (process.argv.includes("--ledger")) {
  const out = check("docs/LEARNINGS.md");
  console.log(out ? `FAIL  real ledger:${out}` : "PASS  real ledger: every active entry has count + promoted");
  process.exit(out ? 1 : 0);
}

interface Case { dir: string; expect: "FAIL" | "PASS"; finding?: string; absent?: string; why: string }
const CASES: Case[] = [
  { dir: "missing-count", expect: "FAIL", finding: "L-901(count)", why: "count arm" },
  { dir: "missing-promoted", expect: "FAIL", finding: "L-902(promoted)", why: "promoted arm" },
  { dir: "complete-control", expect: "PASS", why: "must-NOT-catch sibling control" },
  { dir: "promoted-pointer-exempt", expect: "PASS", why: "SELECTION arm (L-186): promoted pointers are out of the population" },
  { dir: "boundary-leak", expect: "FAIL", finding: "L-906(count)", absent: "L-905", why: "entry boundary: L-905's lines must not satisfy L-906" },
];

let pass = 0, fail = 0;
for (const c of CASES) {
  const out = check(`evals/fixtures/learnings-metadata/${c.dir}/LEARNINGS.md`);
  const got = out ? "FAIL" : "PASS";
  const named = c.finding ? out.includes(c.finding) : true;
  const clean = c.absent ? !out.includes(c.absent) : true;
  if (got === c.expect && named && clean) {
    console.log(`PASS  learnings-metadata-fixture: ${c.dir} -> ${got}${out ? ` [${out}]` : ""} (${c.why})`);
    pass++;
  } else {
    console.log(`FAIL  learnings-metadata-fixture: ${c.dir} -> expected ${c.expect}${c.finding ? ` naming ${c.finding}` : ""}, got ${got} [${out}] (${c.why})`);
    fail++;
  }
}
console.log(`learnings-metadata-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
