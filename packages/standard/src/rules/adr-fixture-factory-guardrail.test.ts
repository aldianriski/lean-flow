// Guardrail proof (SPRINT-092 T1, EPIC-014 H14): "factory creates state, factory does not decide
// expected verdict" -- enforced structurally by `test/fixtures/adr-family-factory.ts` and
// `test/fixtures/git-repo-factory.ts` (see their own headers for the two mechanisms: a return type
// with no data property to smuggle a verdict onto, and an excess-property check on the state literal
// every call site passes in). This file is the MUST-FAIL half of that proof (CLAUDE.md Tier G bar): a
// factory call site that tries to smuggle assertion vocabulary into its STATE must not compile, and a
// sibling call site that stays legitimately state-only must keep passing -- L-142's "reddens while a
// sibling control stays green," applied to a compile-time guard rather than a runtime one.
//
// "Rejected" here means COMPILE-TIME rejection, not a runtime throw: each `// @ts-expect-error` line
// below asserts "the next statement must fail to type-check." If TypeScript's excess-property check
// on the object literal did NOT fire (i.e. the extra field silently compiled), the `@ts-expect-error`
// directive itself becomes an error ("Unused '@ts-expect-error' directive") -- so `bunx tsc --noEmit`
// staying at zero errors IS the ongoing, permanent proof this guard fires on every run, not merely the
// one time it was seeded and reverted during this task's own build. That is the strongest of the
// three options T1's brief names (compile rejection > runtime throw > lint rule): a verdict-deciding
// call site cannot exist in the committed tree at all, rather than being caught by a linter someone
// can silence or a runtime path a test might never execute.

import { describe, expect, test } from "bun:test";
import { adrFamilyPort, adrHistoryPort } from "../../../../test/fixtures/adr-family-factory.ts";
import { gitRepoFromFixture } from "../../../../test/fixtures/git-repo-factory.ts";

describe("factory guardrail (H14) -- a verdict-deciding call site does not compile", () => {
  test("MUST-FAIL: adrFamilyPort rejects an `expectedVerdict` field on its state literal", () => {
    // @ts-expect-error -- `expectedVerdict` is assertion vocabulary, not STATE. TypeScript's
    // excess-property check on this object literal must flag it; if it did not, the line below would
    // report "Unused '@ts-expect-error' directive" and `bunx tsc --noEmit` would redden.
    adrFamilyPort({ adrDirFiles: {}, expectedVerdict: "fail" });
  });

  test("MUST-FAIL: adrHistoryPort rejects a `shouldPass` field on its state literal", () => {
    // @ts-expect-error -- same mechanism, applied to the OTHER §4 in-memory port (S4.APPEND's
    // history half).
    adrHistoryPort({ isRepo: true, shouldPass: false });
  });

  // gitRepoFromFixture has REAL side effects (mkdtemp + git init/commit on disk), so its own
  // must-FAIL proof is a function TypeScript checks but this file deliberately never CALLS -- the
  // compiler still type-checks a function body whether or not anything invokes it, so the proof holds
  // without paying for a throwaway git repo on every test run.
  function typeOnlyGitRepoOptionsRejectVerdict(): void {
    // @ts-expect-error -- `expectedFinding` is assertion vocabulary; `GitRepoFromFixtureOptions` is
    // sealed the same way `AdrFamilyState` is. If this stopped erroring, the directive above would
    // itself error and `bunx tsc --noEmit` would redden.
    gitRepoFromFixture({ fixtureName: "clean", tmpPrefix: "guardrail-unused-", expectedFinding: "adr-edited-after-decision" });
  }
  test("MUST-FAIL: gitRepoFromFixture rejects an `expectedFinding` field on its options literal (type-checked, never invoked)", () => {
    expect(typeof typeOnlyGitRepoOptionsRejectVerdict).toBe("function");
  });

  // SIBLING CONTROLS (L-142): a LEGITIMATE state-only call to the SAME functions, right beside the
  // must-FAIL cases above -- proves the guard discriminates on the ONE extra field, not on "any call
  // to this factory." A guard that rejected every call would pass the must-FAIL tests too, vacuously.
  test("CONTROL: a legitimate state-only adrFamilyPort call compiles and builds a working port", () => {
    const port = adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": "" } });
    expect(port.hasAdrDir()).toBe(true);
    expect(port.listAdrDirMdFiles()).toEqual(["ADR-001-a-real-decision.md"]);
  });

  test("CONTROL: a legitimate state-only adrHistoryPort call compiles and builds a working port", () => {
    const port = adrHistoryPort({ isRepo: false });
    expect(port.isGitRepo()).toBe(false);
  });
});
