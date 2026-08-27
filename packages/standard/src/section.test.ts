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
    const [first, second, third] = report.outcomes;
    expect(first).toEqual({
      kind: "evaluated",
      evaluation: { ruleId: makeRuleId("S9.A"), verdict: "pass", findings: [], detail: "ok" },
    });
    // Narrow to the variant before reading its own field, rather than indexing twice and asserting.
    if (second?.kind !== "evaluated") throw new Error("expected outcome 1 to be evaluated");
    expect(second.evaluation.verdict).toBe("gap");
    expect(third?.kind).toBe("excluded");
  });

  test("classifies in the exact order given -- never re-sorted or re-derived from the registry", () => {
    const registry = createRegistry<FakePort>();
    const port: FakePort = { calls: [] };
    const rules = [ruleOf("S9.Z", "judgment-only", 9), ruleOf("S9.A", "judgment-only", 9)];

    const report = classifySection(9, rules, registry, port);
    // The expectation is built with makeRuleId so it carries the SAME branded type the report
    // does -- widening the assertion instead would test less than the code promises.
    expect(report.outcomes.map((o) => (o.kind === "excluded" ? o.ruleId : "?"))).toEqual([
      makeRuleId("S9.Z"),
      makeRuleId("S9.A"),
    ]);
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

  // Reviewer finding 1 (SPRINT-087 T4 revise): "no field COULD occupy globalLevel" was overclaimed --
  // the object is a plain, extensible, non-frozen literal until this test's own subject exists.
  // TD-101 (no `tsc`) means the interface is documentation, not enforcement, so `classifySection`
  // freezes its return value -- this asserts that enforcement directly, not just its typed shape.
  test("the report is FROZEN -- attaching a globalLevel at runtime throws, never silently succeeds", () => {
    const registry = createRegistry<FakePort>();
    const report = classifySection(9, [ruleOf("S9.A", "mechanical", 9)], registry, { calls: [] });

    expect(Object.isFrozen(report)).toBe(true);
    expect(() => {
      (report as unknown as { globalLevel: string }).globalLevel = "Attested";
    }).toThrow(TypeError);
    // The throw must actually have prevented the write -- belt-and-braces against a mock/proxy that
    // throws but still mutates (not the case here, but the assertion should not just trust the throw).
    expect("globalLevel" in report).toBe(false);
  });
});

// --- Tier G evidence (SPRINT-087 T4; ADR-029 -- classifySection is part of a Tier G engine) --------
//
// This file has SIX tests (confirmed by `bun test packages/standard/src/section.test.ts` -> "Ran 6
// tests" pre-seed) -- stated explicitly because an earlier revision of this block miscounted its own
// denominator as "6" when the file then held 5 (reviewer finding 2, SPRINT-087 T4 revise). The seed
// below was RE-RUN after the freeze fix (reviewer finding 1) added the 6th test, so every count here
// is fresh against the CURRENT file, not carried over from before that test existed.
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
//     `Object.freeze({ section, outcomes: rules.map(...) })`
//   to
//     `Object.freeze({ section, outcomes: rules.map(...), globalLevel: "Attested" })`.
//   Landed: confirmed via `git diff -- packages/standard/src/section.ts`, which showed EXACTLY one
//   changed line (the return statement) and nothing else -- a cleaner landedness check than a raw
//   `cmp` here, since this repo's `core.autocrlf=true` makes a byte-offset `cmp` against a plain `cp`
//   copy unreliable across a checkout/edit cycle (the same class of trap L-169 names; `git diff`
//   normalizes line endings the same way on both sides, so it does not inherit that trap).
//   File still parses: `bun test packages/standard/src/section.test.ts` ran to completion (2 pass +
//   4 fail, never an error-out-of-file, which is what a demolition -- not a discrimination -- would
//   have produced).
//   Targeted: exactly 1 line changed (the return statement).
//   Reddened EXACTLY 4 of 6 tests in this file: "the report carries NO globalLevel key at all",
//   "still no globalLevel key on an all-excluded report" (both DoD 2 assertions, as expected);
//   "an empty rule list classifies to an empty report -- not an error" (an extra, CORRECT catch --
//   that test's `toEqual({ section, outcomes: [] })` is exact-shape, so it also detects an added key;
//   not a false attribution, since the added field really is present in every `classifySection` call
//   after the seed, including the empty-rules one); AND "the report is FROZEN -- attaching a
//   globalLevel at runtime throws..." -- its OWN `toThrow(TypeError)` assertion still passed (writing
//   to an existing property of a frozen object still throws, seed or no seed), but its final
//   `"globalLevel" in report` check correctly caught the seed's pre-existing key -- a genuine catch,
//   not a false attribution: the seed really does put `globalLevel` on the object before freezing it.
//   Stayed GREEN (named sibling controls): the two `describe("classifySection — dispatches...")`
//   tests that inspect dispatch/ordering but never the exact key set or `globalLevel` ("a mix of ...
//   classifies...", "classifies in the exact order given") -- confirming the seed adds a field rather
//   than breaking dispatch itself. In `apps/cli/src/main.test.ts`, run in the SAME pass: all 28 tests
//   stayed green, INCLUDING the two DoD 2 "never contains a 'level:' line" printer-only checks -- this
//   is the proof the task brief asked for: a renderer-only guard does NOT catch this seed; only the
//   structural `"globalLevel" in report` check does.
//   Restored: `git checkout -- packages/standard/src/section.ts`, then `git diff -- ...` reported
//   nothing, and `git show :packages/standard/src/section.ts | sha256sum` reproduced the pre-seed
//   hash below exactly.
//   Pristine hash: git show :packages/standard/src/section.ts | sha256sum
//     -> d8a6279002486b6fd84e968a98e304fe10534997fc230ad24f1ede7acc516cfe (66 lines)
