import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { RULE_MARKS, makeRuleId, type RuleMark, type StandardRule } from "./model.ts";
import { createRegistry } from "./registry.ts";
import { marksInStandard, sectionsOf } from "./spec-reader.ts";
import { tokenize } from "./tokenizer.ts";
import { classifyRule, classifyRuleVia, outcomeName, type RuleOutcome } from "./classify.ts";

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

// --- SPRINT-091 T3: classifyRuleVia -- the dispatch-agnostic core a whole-spec traversal drives ------
describe("classifyRuleVia — identical mark logic, driven by a PLAIN dispatch function (no Registry/port)", () => {
  test("dispatches through the given function for mechanical/split, exactly like classifyRule", () => {
    const calls: string[] = [];
    const outcome = classifyRuleVia(ruleOf("mechanical"), (id) => {
      calls.push(id);
      return { ruleId: id, verdict: "pass", findings: [], detail: "ok" };
    });
    expect(outcome).toEqual({
      kind: "evaluated",
      evaluation: { ruleId: makeRuleId("S1.X"), verdict: "pass", findings: [], detail: "ok" },
    });
    expect(calls).toEqual([makeRuleId("S1.X")]);
  });

  test("a dispatch function returning undefined still reports GAP, never a silent pass", () => {
    const outcome = classifyRuleVia(ruleOf("mechanical"), () => undefined);
    expect(outcome.kind === "evaluated" && outcome.evaluation.verdict).toBe("gap");
  });

  test("the four excluded marks never call dispatch at all -- same refusal as classifyRule", () => {
    let called = false;
    for (const mark of ["judgment-only", "implementation-directed", "restated", "standard-directed"] as const) {
      const outcome = classifyRuleVia(ruleOf(mark), () => {
        called = true;
        return undefined;
      });
      expect(outcome.kind).toBe("excluded");
    }
    expect(called).toBe(false);
  });

  // classifyRule is now a thin wrapper: `registry.dispatch(id, port)` closed over ONE port is the
  // single-family instance of the exact seam `registry.ts`'s `bindRegistry` uses for MANY families.
  // This proves the wrapping introduced no behavioural drift between the two entry points.
  test("classifyRule(rule, registry, port) agrees with classifyRuleVia(rule, id => registry.dispatch(id, port)) on every mark", () => {
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S1.X"), () => ({ ruleId: makeRuleId("S1.X"), verdict: "fail", findings: [], detail: "d" }));
    const port: FakePort = { calls: [] };

    for (const mark of RULE_MARKS) {
      const rule = ruleOf(mark);
      const viaRegistry = classifyRule(rule, registry, port);
      const viaPlainDispatch = classifyRuleVia(rule, (id) => registry.dispatch(id, port));
      expect(viaRegistry).toEqual(viaPlainDispatch);
    }
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
    const result = marksInStandard(doc, SPEC_PATH);
    if (!result.ok) throw new Error(`expected success, got finding ${result.finding}: ${result.message}`);
    const fromStandard = result.marks;

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
    const result = marksInStandard(doc, SPEC_PATH);
    if (!result.ok) throw new Error(`expected success, got finding ${result.finding}: ${result.message}`);
    expect(result.marks).not.toContain("Level"); // the Levels table's header cell, not a mark
  });

  // SPRINT-087 T2 revise (reviewer finding 1): the real Standard's §14 Marks table stripped entirely
  // must be the SAME named `marks-table-unreadable` finding as the synthetic fixtures in
  // spec-reader.test.ts prove -- exercised here against the REAL document, not a hand-built one, so
  // this is the "real artifact" half of the guard (CLAUDE.md's guard-motivating-case bar).
  test("the real Standard with its §14 Marks table stripped: named finding, not a silent []", () => {
    // Drops the header row AND the delimiter row directly below it -- the tokenizer (tokenizer.ts)
    // only recognises a table when a header-shaped line is immediately followed by a delimiter row
    // (`isDelimiterRow`), so removing both leaves the table's former BODY rows with no header above
    // them; they fall through to `paragraph` blocks instead, which `marksInStandard` never inspects.
    const realSpec = readFileSync(SPEC_PATH, "utf8");
    const lines = realSpec.split(/\r\n|\r|\n/);
    const headerIdx = lines.findIndex((l) => l.trim() === "| Mark | Meaning | Is it work? |");
    expect(headerIdx).toBeGreaterThan(-1); // the strip target actually exists in the real document
    const stripped = [...lines.slice(0, headerIdx), ...lines.slice(headerIdx + 2)];
    const strippedText = stripped.join("\n");
    // Harness guard: the strip must actually remove the Marks table header, or this case is not
    // testing what it claims.
    expect(strippedText).not.toContain("| Mark | Meaning | Is it work? |");

    const doc = tokenize(strippedText, "spec-no-marks.md");
    const result = marksInStandard(doc, "spec-no-marks.md");
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("marks-table-unreadable");
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
// byte-identical this session.
//
// SPRINT-087 T2 revise (reviewer finding 2): the FIRST cut of this block recorded two hashes taken
// under two DIFFERENT normalizations without saying so -- classify.ts's via `sha256sum` on the
// (already-LF) working-tree file, model.ts's via `sha256sum` on the CRLF working tree (this checkout
// has `core.autocrlf=true`) -- so the pair looked checkable but did not reproduce on a stock Windows
// clone. Fixed convention, stated once: every hash below is `git show <ref>:<path> | sha256sum`, i.e.
// the SHA-256 of the LF blob git itself stores -- normalization-independent, reproducible on ANY
// checkout regardless of local `core.autocrlf`, and requiring no local file at all:
//   classify.ts: git show 18e326a:packages/standard/src/classify.ts | sha256sum
//     -> 382bcfb56cf545049d6d8f0228ab677a486a2cbbdd9786cc5761d5a8926157bd (141 lines)
//   model.ts:    git show 18e326a:packages/standard/src/model.ts    | sha256sum
//     -> 08228ebc84d8a21e776ed1a8eb448f68215b92888593deebeece4f36dd6e775a (95 lines)
// (18e326a is the commit both files were last written in; neither changed in this revise, so the same
// two commands against HEAD reproduce the same two hashes.)
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
