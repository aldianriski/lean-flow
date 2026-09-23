// evals/run-typecheck-population-fixtures.ts -- gates evals/typecheck-population.test.ts (SPRINT-104
// T1, TD-169). Run by Bun: `bun evals/run-typecheck-population-fixtures.ts`
//
// WHY THIS WRAPPER EXISTS AT ALL. `scripts/qa-check.sh` never invokes a bare `bun test` -- it reaches
// a *.test.ts only through a harness registered in eval_harnesses_always, which is why nine such thin
// wrappers already exist (see evals/run-authority-fixtures.sh's header for the original statement of
// this). The registration guard at qa-check.sh:1333 globs `evals/run-*.sh|ts` and `selftest-*.sh`
// only, so a bare `*.test.ts` is neither required to register nor reported when it does not -- it is
// simply never run by the gate. That is how test/gate-discovery/discovery-order.test.ts came to sit
// RED since SPRINT-097 T4 without any sprint noticing.
//
// The fixture file it gates was added in this same task and had exactly that gap: retained, green
// under `bun test`, and unreachable from the gate that promote and close actually run. A retained
// guard nothing runs is L-105's absent guard wearing the shape of a present one.
//
// THIN BY DESIGN: it spawns the test file rather than restating its assertions, so the .test.ts stays
// the single source of truth and the two cannot drift apart.
//
// A test-COUNT FLOOR, not just an exit code. `bun test` exits 0 on a file with zero live tests, so an
// exit-code-only wrapper would report PASS over a file whose cases had all been deleted or renamed
// out of existence -- a false PASS indistinguishable from a real one (L-058, and the same reasoning
// evals/run-authority-fixtures.sh records for its own floor).
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TEST_FILE = "evals/typecheck-population.test.ts";

// The file carries 4 LIVE-config cases + 3 must-FAIL (pre-fix config) cases. The floor is the number
// that must still be there; adding cases is fine, losing them is not.
const MIN_CASES = 7;

const r = spawnSync("bun", ["test", TEST_FILE], { cwd: ROOT, encoding: "utf8" });
const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;

let pass = 0;
let fail = 0;

// Findings are emitted at the TWO-space column every other checker uses. A one-space `FAIL ` line is
// invisible to a column-keyed selector and has already left sweep_gate returning rc=0 on a crashed
// engine once (TD-157, this sprint's T2).
const bad = (msg: string) => {
  console.log(`FAIL  ${msg}`);
  fail++;
};
const ok = (msg: string) => {
  console.log(`PASS  ${msg}`);
  pass++;
};

if (r.error !== undefined) {
  bad(`typecheck-population: could not spawn bun -- ${r.error.message}. NOT a verdict on the fixtures`);
} else {
  const m = /(\d+)\s+pass/.exec(out);
  const ran = m?.[1] !== undefined ? Number(m[1]) : 0;

  if (r.status !== 0) {
    bad(
      `typecheck-population: the population fixture suite is red (bun test exit ${r.status}) -- ` +
        `the gate's typecheck program no longer holds both scripts/ and evals/, or the must-FAIL ` +
        `control stopped discriminating. Output: ${out.replace(/\s+/g, " ").slice(0, 400)}`,
    );
  } else if (ran < MIN_CASES) {
    bad(
      `typecheck-population: only ${ran} case(s) ran, floor is ${MIN_CASES} -- bun test exits 0 on a ` +
        `file with zero live tests, so this is a vanished suite reporting success, not a pass`,
    );
  } else {
    ok(`typecheck-population: ${ran} case(s) green (>= ${MIN_CASES} floor), both program arms asserted`);
  }
}

console.log(`typecheck-population-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
