import { describe, expect, test } from "bun:test";
import { makeRuleId, type RuleMark, type StandardRule } from "./model.ts";
import { createRegistry } from "./registry.ts";
import { classifySection } from "./section.ts";

type FakePort = { readonly calls: string[] };

function ruleOf(id: string, mark: RuleMark, section: number): StandardRule {
  return {
    id: makeRuleId(id),
    section,
    mark,
    level: mark === "mechanical" || mark === "split" ? "Structural" : null,
    source: { file: "f.md", line: 1 },
  };
}

describe("classifySection — dispatches every rule handed to it, in order (DoD 1's foundation)", () => {
  test("a mix of mechanical/judgment-only/implementation-directed classifies each to its own outcome", () => {
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S9.A"), () => ({
      ruleId: makeRuleId("S9.A"),
      verdict: "pass",
      findings: [],
      detail: "ok",
    }));
    const port: FakePort = { calls: [] };

    const rules = [
      ruleOf("S9.A", "mechanical", 9), // registered -> evaluated/pass
      ruleOf("S9.B", "mechanical", 9), // unregistered -> evaluated/gap
      ruleOf("S9.C", "judgment-only", 9), // excluded
    ];

    const report = classifySection(9, rules, registry, port);
    expect(report.section).toBe(9);
    expect(report.outcomes).toHaveLength(3);
    expect(report.outcomes[0]).toEqual({
      kind: "evaluated",
      evaluation: { ruleId: makeRuleId("S9.A"), verdict: "pass", findings: [], detail: "ok" },
    });
    expect(report.outcomes[1].kind === "evaluated" && report.outcomes[1].evaluation.verdict).toBe("gap");
    expect(report.outcomes[2].kind).toBe("excluded");
  });

  test("classifies in the exact order given -- never re-sorted or re-derived from the registry", () => {
    const registry = createRegistry<FakePort>();
    const port: FakePort = { calls: [] };
    const rules = [ruleOf("S9.Z", "judgment-only", 9), ruleOf("S9.A", "judgment-only", 9)];

    const report = classifySection(9, rules, registry, port);
    expect(report.outcomes.map((o) => (o.kind === "excluded" ? o.ruleId : "?"))).toEqual(["S9.Z", "S9.A"]);
  });

  test("an empty rule list classifies to an empty report -- not an error", () => {
    const registry = createRegistry<FakePort>();
    const report = classifySection(8, [], registry, { calls: [] });
    expect(report).toEqual({ section: 8, outcomes: [] });
  });
});

// --- DoD 2: the absence of a global level is a property of the RESULT, checked with "key" in obj,
// never a truthiness check (a falsy-but-present key is still the false assurance this exists to
// refuse) -------------------------------------------------------------------------------------------
describe("classifySection's result — DoD 2: no global conformance level, ever", () => {
  test("the report carries NO globalLevel key at all -- absent, not undefined", () => {
    const registry = createRegistry<FakePort>();
    const report = classifySection(9, [ruleOf("S9.A", "mechanical", 9)], registry, { calls: [] });
    expect("globalLevel" in report).toBe(false);
    // Belt-and-braces (spec-reader.ts's own convention): the exact key set, so a field added under
    // ANY other name still shows up here rather than passing because this test only checked one name.
    expect(Object.keys(report).sort()).toEqual(["outcomes", "section"]);
  });

  test("still no globalLevel key on an all-excluded report (no rule ever reached the registry)", () => {
    const registry = createRegistry<FakePort>();
    const report = classifySection(12, [ruleOf("S12.X", "judgment-only", 12)], registry, { calls: [] });
    expect("globalLevel" in report).toBe(false);
  });
});

// --- Tier G evidence (SPRINT-087 T4; ADR-029 -- classifySection is part of a Tier G engine) --------
//
// Every hash below is `git show <ref>:<path> | sha256sum` -- the SHA-256 of the LF blob git itself
// stores, normalization-independent regardless of local `core.autocrlf` (L-169: two earlier T-tasks
// this sprint recorded hashes under mixed LF/CRLF conventions and cost their reviewers real time).
// `<ref>` here is `:packages/standard/src/section.ts` (the git INDEX at the time this file was
// staged, before the commit this task produces existed) -- identical to `HEAD:...` once committed,
// since nothing changed in this file after staging.
//
// Seed (DoD 2, the load-bearing one -- "make the partial run emit a global level anyway"):
//   `classifySection`'s return literal changed from
//     `{ section, outcomes: rules.map(...) }`
//   to
//     `{ section, outcomes: rules.map(...), globalLevel: "Attested" }`.
//   Landed: confirmed via `cmp` against a pristine copy saved before editing (differed at byte 2970,
//   line 48 -- the exact edited line).
//   File still parses: `bun test packages/standard/src/section.test.ts` ran to completion (30 pass
//   + 3 fail across both files in that run, never an error-out-of-file, which is what a demolition
//   -- not a discrimination -- would have produced).
//   Targeted: exactly 1 line changed (the return statement), 49 -> 49 lines.
//   Reddened EXACTLY 3 of 6 tests in this file: "the report carries NO globalLevel key at all",
//   "still no globalLevel key on an all-excluded report" (both DoD 2 assertions, as expected), AND
//   "an empty rule list classifies to an empty report -- not an error" (an extra, CORRECT catch --
//   that test's `toEqual({ section, outcomes: [] })` is exact-shape, so it also detects an added key;
//   not a false attribution, since the added field really is present in every `classifySection` call
//   after the seed, including the empty-rules one).
//   Stayed GREEN (named sibling controls): the two `describe("classifySection — dispatches...")`
//   tests that DO inspect shape but not `globalLevel` specifically ("a mix of ... classifies...",
//   "classifies in the exact order given") -- confirming the seed adds a field rather than breaking
//   dispatch itself. In `apps/cli/src/main.test.ts`, run in the SAME pass: all 28 tests stayed green,
//   INCLUDING the two DoD 2 "never contains a 'level:' line" printer-only checks -- this is the
//   proof the task brief asked for: a renderer-only guard does NOT catch this seed; only the
//   structural `"globalLevel" in report` check does.
//   Restored: `git checkout -- packages/standard/src/section.ts`, then
//   `git show :packages/standard/src/section.ts | sha256sum` compared byte-identical to the
//   pre-seed capture below, and `cmp` against the pristine copy agreed too.
//   Pristine hash: git show :packages/standard/src/section.ts | sha256sum
//     -> 973d70a13dd3bea070c5537996fecb0fb1bd71cb77f4547f104eb1f9ce44c2ce (49 lines)
