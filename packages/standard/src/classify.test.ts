import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { RULE_MARKS, makeRuleId, type RuleMark, type StandardRule } from "./model.ts";
import { createRegistry } from "./registry.ts";
import { marksInStandard, sectionsOf } from "./spec-reader.ts";
import { tokenize } from "./tokenizer.ts";
import { classifyRule, outcomeName, type RuleOutcome } from "./classify.ts";

// `readFileSync` stays in this `*.test.ts` file only, matching spec-reader.test.ts's own pattern --
// classify.ts itself never touches the filesystem (domain layer, V3 §2.1).
const SPEC_PATH = fileURLToPath(new URL("../../../spec/STANDARD.md", import.meta.url));

type FakePort = { readonly calls: string[] };

function ruleOf(mark: RuleMark, id = "S1.X"): StandardRule {
  return { id: makeRuleId(id), section: 1, mark, level: mark === "mechanical" || mark === "split" ? "Structural" : null, source: { file: "f.md", line: 1 } };
}

describe("classifyRule — mechanical/split dispatch through the registry (DoD 1)", () => {
  test("a mechanical rule WITH a registered evaluator dispatches to it -- not GAP", () => {
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S1.X"), (port) => {
      port.calls.push("S1.X");
      return { ruleId: makeRuleId("S1.X"), verdict: "pass", findings: [], detail: "ok" };
    });
    const port: FakePort = { calls: [] };

    const outcome = classifyRule(ruleOf("mechanical"), registry, port);
    expect(outcome.kind).toBe("evaluated");
    expect(outcome.kind === "evaluated" && outcome.evaluation.verdict).toBe("pass");
    expect(port.calls).toEqual(["S1.X"]);
  });

  // The load-bearing case (CLAUDE.md / the task brief): a rule id absent from the registry must
  // report GAP, never `undefined` read back as an empty (and therefore clean-looking) pass.
  test("an UNKNOWN mechanical rule id (absent from the registry) reports GAP, not an empty pass", () => {
    const registry = createRegistry<FakePort>();
    const port: FakePort = { calls: [] };

    const outcome = classifyRule(ruleOf("mechanical"), registry, port);
    expect(outcome.kind).toBe("evaluated");
    expect(outcome.kind === "evaluated" && outcome.evaluation.verdict).toBe("gap");
    expect(outcome.kind === "evaluated" && outcome.evaluation.findings).toEqual([]);
    expect(outcome.kind === "evaluated" && outcome.evaluation.detail).toContain("rule-unimplemented");
    expect(port.calls).toEqual([]); // never touched the port -- nothing was registered to call
  });

  test("an UNKNOWN split rule id also reports GAP -- split's mechanical half is still checkable", () => {
    const registry = createRegistry<FakePort>();
    const outcome = classifyRule(ruleOf("split"), registry, { calls: [] });
    expect(outcome.kind === "evaluated" && outcome.evaluation.verdict).toBe("gap");
  });
});

describe("classifyRule — the four excluded marks, each its own named outcome (DoD 2)", () => {
  test("judgment-only -> excluded/judgment-required, not debt, never dispatched", () => {
    const registry = createRegistry<FakePort>();
    const outcome = classifyRule(ruleOf("judgment-only"), registry, { calls: [] });
    expect(outcome.kind).toBe("excluded");
    expect(outcome.kind === "excluded" && outcome.reason).toBe("judgment-only");
    expect(outcomeName(outcome)).toBe("excluded/judgment-required");
  });

  test("implementation-directed -> excluded, never dispatched", () => {
    const registry = createRegistry<FakePort>();
    const outcome = classifyRule(ruleOf("implementation-directed"), registry, { calls: [] });
    expect(outcome.kind).toBe("excluded");
    expect(outcome.kind === "excluded" && outcome.reason).toBe("implementation-directed");
    expect(outcomeName(outcome)).toBe("excluded");
  });

  test("restated -> excluded, never dispatched", () => {
    const registry = createRegistry<FakePort>();
    const outcome = classifyRule(ruleOf("restated"), registry, { calls: [] });
    expect(outcome.kind).toBe("excluded");
    expect(outcome.kind === "excluded" && outcome.reason).toBe("restated");
    expect(outcomeName(outcome)).toBe("excluded");
  });

  test("standard-directed -> excluded, never dispatched", () => {
    const registry = createRegistry<FakePort>();
    const outcome = classifyRule(ruleOf("standard-directed"), registry, { calls: [] });
    expect(outcome.kind).toBe("excluded");
    expect(outcome.kind === "excluded" && outcome.reason).toBe("standard-directed");
    expect(outcomeName(outcome)).toBe("excluded");
  });

  // §14: "never evaluate it against an adopter" -- even if a checker happens to be registered under
  // an excluded mark's own id (a mistake somewhere upstream), classification must still win: the four
  // excluded marks never reach `registry.dispatch` or `port` at all.
  test("an evaluator mistakenly registered under an implementation-directed id is never called", () => {
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S1.X"), (port) => {
      port.calls.push("should-never-run");
      return { ruleId: makeRuleId("S1.X"), verdict: "pass", findings: [], detail: "ok" };
    });
    const port: FakePort = { calls: [] };

    const outcome = classifyRule(ruleOf("implementation-directed"), registry, port);
    expect(outcome.kind).toBe("excluded");
    expect(port.calls).toEqual([]);
  });
});

describe("classifyRule — a seventh mark cannot appear silently (DoD 3)", () => {
  test("a mark outside the six throws loud, rather than falling through to 'not evaluated'", () => {
    const registry = createRegistry<FakePort>();
    // Fabricated: `RuleMark` is a closed 6-value union and `toStandardRule` already refuses to build
    // one with an unrecognized mark, but TD-101 (no tsc) means that guarantee is documentation only --
    // a runtime value can still arrive here shaped wrong, so classifyRule's own guard is what's on test.
    const bogus = { ...ruleOf("mechanical"), mark: "automatic" as unknown as RuleMark };
    expect(() => classifyRule(bogus, registry, { calls: [] })).toThrow(/unrecognized mark/);
  });

  test("the mark set classifyRule switches on is IDENTICAL to §14's own Marks table, both directions", () => {
    // Independent source of truth: the REAL spec/STANDARD.md's §14 table, parsed fresh -- never a
    // copied-in literal (tdd anti-tautology rule). If §14 ever grows a 7th mark, this reddens before
    // classifyRule's silent fallthrough would.
    const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
    const fromStandard = marksInStandard(doc);

    expect(fromStandard.length).toBeGreaterThan(0); // denominator -- a vacuous [] must not pass silently
    expect(new Set(fromStandard)).toEqual(new Set(RULE_MARKS));
    expect(fromStandard.length).toBe(RULE_MARKS.length); // catches a duplicate row hiding behind a Set
  });

  // Positive witness (L-156): §14 has other tables (Levels, Counts) this query must NOT match.
  test("marksInStandard does not pick up an unrelated table in the same section", () => {
    const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
    const s14 = sectionsOf(doc).find((s) => s.number === 14);
    const tableCount = (s14?.blocks ?? []).filter((b) => b.type === "table").length;
    expect(tableCount).toBeGreaterThan(1); // §14 really does have more than one table
    expect(marksInStandard(doc)).not.toContain("Level"); // the Levels table's header cell, not a mark
  });
});

// --- Tier G evidence (SPRINT-087 T2; CLAUDE.md ADR-029 -- classifyRule is a guard: a false negative
// here is silent by construction, same reasoning as sprint-log-outside-logs-dir.ts's own block) -------
// 8 branches enumerated from the FINISHED code (classify.ts's 6 mark cases + its GAP path + its
// default guard, plus model.ts's RULE_MARKS closure), one targeted one-line seed per branch, each
// confirmed LANDED (`cmp` against a pristine copy saved BEFORE seeding), confirmed the file still
// parses (bun's own transpiler accepted it -- `bun test` ran) and stays line-count-STABLE (classify.ts:
// 141/141 every seed but #7, which swaps one statement for another of equal line count, also 141/141;
// model.ts's #8 is 95 -> 96, a targeted addition, not a demolition), confirmed reddening ONLY its named
// case(s) while every sibling test in the SAME run stayed green, then RESTORED and confirmed
// byte-identical via `sha256sum` this session:
//   classify.ts pristine: 382bcfb56cf545049d6d8f0228ab677a486a2cbbdd9786cc5761d5a8926157bd (141 lines)
//   model.ts    pristine: fed514245b277de345f6a5ed74621cf64a8d8cc1a8689b9560c7ca8f561342a6 (95 lines)
//
//   1. judgment-only branch's reason flipped ("judgment-only" -> "implementation-directed")
//      -- reddened EXACTLY "judgment-only -> excluded/judgment-required..." / 10 other tests green
//   2. implementation-directed branch's reason flipped ("implementation-directed" -> "restated")
//      -- reddened EXACTLY "implementation-directed -> excluded..." / 10 green
//   3. restated branch's reason flipped ("restated" -> "standard-directed")
//      -- reddened EXACTLY "restated -> excluded..." / 10 green
//   4. standard-directed branch's reason flipped ("standard-directed" -> "judgment-only")
//      -- reddened EXACTLY "standard-directed -> excluded..." / 10 green
//   5. GAP branch's verdict flipped ("gap" -> "pass", inside the shared `gap()` helper) -- the DoD 1
//      load-bearing case -- reddened EXACTLY the two tests that dispatch an unregistered id (mechanical
//      AND split, which share this helper) / 15 green across classify.test.ts + result.test.ts
//      (result.test.ts's own gap tests build `RuleEvaluation` literals directly, so they never call
//      this code and stayed green, confirming they are NOT hidden siblings of this branch)
//   6. dispatch branch short-circuited to `evaluation ? gap(rule) : gap(rule)`, discarding a real
//      registration -- reddened EXACTLY "a mechanical rule WITH a registered evaluator..." / 10 green
//   7. the default/unrecognized-mark throw removed (falls through to an implicit `undefined` instead
//      of throwing) -- reddened EXACTLY "a mark outside the six throws loud..." / 10 green, including
//      the mark-set-closure test, which is a DIFFERENT guard (#8) and correctly did not fire here
//   8. model.ts's `RULE_MARKS` widened with a fabricated 7th entry ("seeded-seventh-mark") -- reddened
//      EXACTLY 2 tests package-wide: this file's "the mark set classifyRule switches on is IDENTICAL to
//      §14's own Marks table" AND model.test.ts's pre-existing "admits the six marks §14 defines, not
//      V3 §9's four" -- 94 other tests across all 10 files in packages/standard/src stayed green. This
//      is the proof DoD 3's own guard fires: a 7th mark cannot enter RULE_MARKS without reddening a
//      case that names it.
// No seed left either file in a state `cmp` disagreed with the pristine copy on restore.
