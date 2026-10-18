// evals/run-layers-observed-test-fixtures.ts -- gates evals/layers-observed.test.ts (SPRINT-128 T4,
// TASK-446). Run by Bun: `bun evals/run-layers-observed-test-fixtures.ts`
//
// WHY THIS WRAPPER EXISTS. The shell checker check-layers-observed.sh and its runner
// (run-layers-observed-fixtures.sh) were retired at SPRINT-128, because the gate runs only the TS
// checker. That runner was also the ONLY thing that ran evals/layers-observed.test.ts (the TS port's
// member-aware must-FAIL fixtures, SPRINT-110 T2 / TASK-391); deleting it unwired that test, and a
// bare *.test.ts is never reached by qa-check.sh (see run-typecheck-population-fixtures.ts). This thin
// wrapper keeps it gated, opt-in (the fixtures build real git histories, slow on Windows).
//
// A test-COUNT FLOOR, not just an exit code: `bun test` exits 0 on a file with zero live tests.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TEST_FILE = "evals/layers-observed.test.ts";

// RAISE with the file: adding cases is fine, losing them is not.
const MIN_CASES = 42;

const r = spawnSync("bun", ["test", TEST_FILE], { cwd: ROOT, encoding: "utf8" });
const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;

let pass = 0;
let fail = 0;

// Two-space column, as every other checker emits (TD-157).
const bad = (msg: string) => {
  console.log(`FAIL  ${msg}`);
  fail++;
};
const ok = (msg: string) => {
  console.log(`PASS  ${msg}`);
  pass++;
};

if (r.error !== undefined) {
  bad(`layers-observed: could not spawn bun -- ${r.error.message}. NOT a verdict on the fixtures`);
} else {
  const m = /(\d+)\s+pass/.exec(out);
  const ran = m?.[1] !== undefined ? Number(m[1]) : 0;

  if (r.status !== 0) {
    bad(`layers-observed: the member-aware suite is red (bun test exit ${r.status}). Output: ${out.replace(/\s+/g, " ").slice(0, 400)}`);
  } else if (ran < MIN_CASES) {
    bad(`layers-observed: only ${ran} case(s) ran, floor is ${MIN_CASES} -- a vanished suite reporting success, not a pass`);
  } else {
    ok(`layers-observed: ${ran} case(s) green (>= ${MIN_CASES} floor)`);
  }
}

console.log(`layers-observed-test-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
