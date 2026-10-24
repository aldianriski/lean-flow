// evals/run-workflow-command-fixtures.ts -- gates the workflow-command test files (SPRINT-138 T1,
// TASK-482). Run by Bun: `bun evals/run-workflow-command-fixtures.ts`
//
// Same shape and reasoning as evals/run-typecheck-population-fixtures.ts: qa-check.sh reaches a
// *.test.ts only through a harness registered in eval_harnesses_always, so a bare test file is a guard
// nothing runs. THIN BY DESIGN: it spawns each test file and never restates an assertion.
//
// A test-COUNT FLOOR per file, not just an exit code: `bun test` exits 0 on a file with zero live
// tests, which would report PASS over a vanished suite (L-058).
//
// Adding a file is one line in FILES.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

// [test file, minimum live cases]. Losing cases is not fine; adding them is.
const FILES: ReadonlyArray<readonly [string, number]> = [
  ["evals/gate-remote.test.ts", 36],
];

let pass = 0;
let fail = 0;
const bad = (msg: string) => {
  console.log(`FAIL  ${msg}`);
  fail++;
};
const ok = (msg: string) => {
  console.log(`PASS  ${msg}`);
  pass++;
};

for (const [file, floor] of FILES) {
  const r = spawnSync("bun", ["test", file], { cwd: ROOT, encoding: "utf8" });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  if (r.error !== undefined) {
    bad(`${file}: could not spawn bun -- ${r.error.message}. NOT a verdict on the fixtures`);
    continue;
  }
  const m = /(\d+)\s+pass/.exec(out);
  const ran = m?.[1] !== undefined ? Number(m[1]) : 0;
  if (r.status !== 0) {
    bad(`${file}: suite is red (bun test exit ${r.status}). Output: ${out.replace(/\s+/g, " ").slice(0, 400)}`);
  } else if (ran < floor) {
    bad(`${file}: only ${ran} case(s) ran, floor is ${floor} -- bun test exits 0 on zero live tests, so this is a vanished suite, not a pass`);
  } else {
    ok(`${file}: ${ran} case(s) green (>= ${floor} floor)`);
  }
}

console.log(`workflow-command-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
