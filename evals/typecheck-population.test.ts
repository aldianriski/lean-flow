// evals/typecheck-population.test.ts -- retained fixtures for the gate's typecheck POPULATION
// (SPRINT-104 T1, TD-169). Runs in the `bun test` phase, deliberately NOT in qa-check.sh's leg 12:
// the gate measured 547s against a 520s budget on the maintainer host at the time this landed, and
// an always-on harness that shells out to tsc twice would spend that margin. Placement is a cost
// ruling, not an accident -- if leg 12's budget is ever re-derived (TASK-357), revisit it.
//
// WHAT THIS GUARDS, AND WHY IT IS NOT THE SAME AS THE TYPECHECK LEG. scripts/qa-check.sh's
// typecheck leg already asserts that `tsc --noEmit` reports no errors, and it was hardened twice
// (ADR-037/TD-101) so that a MISSING checker could not read as a pass. It was still blind, because
// both of those are properties of the VERDICT and neither is a property of the SET the verdict ranges
// over: the root tsconfig's include was apps/packages/test only, so all 26 .ts files under scripts/
// and evals/ sat outside the program while the leg printed `clean (0 errors)`. Three `tsc clean`
// claims in SPRINT-103 were statements about a program that never held the file in question.
//
// This is L-186's axis: fixtures discriminate a guard's BRANCHES, nothing above discriminates the
// SET of artifacts those branches run over. So these cases vary the SELECTION RULE (the tsconfig
// handed to tsc), never the verdict.
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TSC = "node_modules/typescript/lib/tsc.js";

// The pre-SPRINT-104 root config, retained verbatim as a fixture (TD-012: retained, not deleted with
// the prototype). This is the artifact TD-169 was actually filed against -- L-166's bar: a fixture
// proves a branch works, only the real motivating artifact proves the branch is REACHABLE.
const NARROW = "evals/fixtures/typecheck-population/tsconfig.narrow.json";

// --listFilesOnly, not --listFiles: it enumerates the program WITHOUT typechecking it (~1s against
// ~6s). The distinction also matters for correctness -- --listFiles interleaves diagnostics on
// stdout, and a path-shaped grep over that output counts error lines as files. That is exactly how
// this file's own population figure was first mis-derived as 28 against a true 26 (L-108).
function programFiles(configPath: string): readonly string[] {
  const out = execFileSync(process.execPath, [TSC, "-p", configPath, "--listFilesOnly"], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return out
    .split(/\r?\n/)
    .map((l) => l.trim().split(String.fromCharCode(92)).join("/"))
    .filter((l) => l.endsWith(".ts"));
}

const inTree = (files: readonly string[], tree: string) =>
  files.filter((f) => f.includes(`/${tree}/`) && !f.includes("/node_modules/")).length;

describe("gate typecheck population -- the LIVE root tsconfig", () => {
  const files = programFiles("tsconfig.json");

  // Named files, not just counts. A count can be satisfied by the wrong tree; a named member cannot.
  test("contains a named scripts/lib checker", () => {
    expect(files.some((f) => f.endsWith("/scripts/lib/check-layers-observed.ts"))).toBe(true);
  });

  test("contains a named evals harness", () => {
    expect(files.some((f) => f.endsWith("/evals/authority.test.ts"))).toBe(true);
  });

  // Both ARMS of the population, asserted separately. T1's DoD names one file per tree precisely
  // because a single arm passing says nothing about the other -- the two trees enter the program
  // through two different include globs, and either can be dropped on its own.
  test("both trees are represented, not merely one", () => {
    expect(inTree(files, "scripts")).toBeGreaterThan(0);
    expect(inTree(files, "evals")).toBeGreaterThan(0);
  });

  // The sibling control: the trees that were ALWAYS in the program must still be there. A "fix" that
  // swapped one population for another would pass every assertion above and be a regression.
  test("the original three trees are still present (control)", () => {
    const original = files.filter((f) => /\/(apps|packages|test)\//.test(f)).length;
    expect(original).toBeGreaterThan(0);
  });
});

describe("gate typecheck population -- MUST FAIL against the pre-fix config", () => {
  const files = programFiles(NARROW);

  // THE DISCRIMINATION PROOF. A suite that goes green on its first run has not been shown to
  // discriminate: the fixtures and the config were written in one session and agree by construction.
  // These three cases re-run the SAME assertions against the config as it stood before the fix, and
  // require them to come out the other way. If the include is ever narrowed back, the block above
  // goes red -- and this block is what proves the block above is capable of going red at all (L-142).
  test("the pre-fix config holds NO scripts/ file", () => {
    expect(inTree(files, "scripts")).toBe(0);
  });

  test("the pre-fix config holds NO evals/ file", () => {
    expect(inTree(files, "evals")).toBe(0);
  });

  // The whole point of TD-169, stated as an assertion: the pre-fix program was not empty and not
  // broken -- it was POPULATED WITH THE WRONG SET, which is why `clean (0 errors)` was true and
  // useless at the same time. A guard that only checked "did tsc succeed" could never see this.
  test("...yet is a perfectly healthy program -- which is why the blindness was silent", () => {
    expect(files.filter((f) => /\/(apps|packages|test)\//.test(f)).length).toBeGreaterThan(0);
  });
});
