import { describe, expect, test } from "bun:test";
import { makeRuleId, type RuleMark, type StandardRule } from "./model.ts";
import { bindRegistry, createRegistry, type BoundDispatcher } from "./registry.ts";
import { classifyAll, composeFamilies } from "./traverse.ts";

function ruleOf(id: string, mark: RuleMark, section: number): StandardRule {
  return {
    id: makeRuleId(id),
    section,
    mark,
    level: mark === "mechanical" || mark === "split" ? "Structural" : null,
    source: { file: "f.md", line: 1 },
  };
}

type PortA = { readonly a: string };
type PortB = { readonly b: string };

describe("composeFamilies — a plain list, no switch on rule id or mark (DoD 3)", () => {
  test("dispatches to the ONE family that has() the id", () => {
    const registryA = createRegistry<PortA>();
    registryA.register(makeRuleId("S9.LOGDIR"), (port) => ({ ruleId: makeRuleId("S9.LOGDIR"), verdict: "pass", findings: [], detail: `a:${port.a}` }));
    const dispatch = composeFamilies([bindRegistry(registryA, { a: "x" })]);

    expect(dispatch(makeRuleId("S9.LOGDIR"))?.detail).toBe("a:x");
  });

  test("two DIFFERENT-port families compose into one dispatch function -- the central design proof", () => {
    const registryA = createRegistry<PortA>();
    registryA.register(makeRuleId("S9.LOGDIR"), (port) => ({ ruleId: makeRuleId("S9.LOGDIR"), verdict: "pass", findings: [], detail: `a:${port.a}` }));
    const registryB = createRegistry<PortB>();
    registryB.register(makeRuleId("S12.SECRETS"), (port) => ({ ruleId: makeRuleId("S12.SECRETS"), verdict: "fail", findings: [], detail: `b:${port.b}` }));

    const dispatch = composeFamilies([bindRegistry(registryA, { a: "x" }), bindRegistry(registryB, { b: "y" })]);

    expect(dispatch(makeRuleId("S9.LOGDIR"))?.detail).toBe("a:x");
    expect(dispatch(makeRuleId("S12.SECRETS"))?.detail).toBe("b:y");
  });

  test("an id NO family owns dispatches to undefined -- never a thrown error, never a guess", () => {
    const dispatch = composeFamilies([bindRegistry(createRegistry<PortA>(), { a: "x" })]);
    expect(dispatch(makeRuleId("S1.NOWHERE"))).toBeUndefined();
  });

  // DoD 3's own verify clause: adding a THIRD family is appending one more entry to the LIST, with
  // ZERO edits to composeFamilies/classifyAll -- no case, no `if (id.startsWith(...))` this test had
  // to add anywhere in traverse.ts to make room for it.
  test("a THIRD family, appended with zero code changes here, dispatches independently -- proves OCP", () => {
    type PortC = { readonly c: string };
    const registryA = createRegistry<PortA>();
    registryA.register(makeRuleId("S9.LOGDIR"), () => ({ ruleId: makeRuleId("S9.LOGDIR"), verdict: "pass", findings: [], detail: "a" }));
    const registryB = createRegistry<PortB>();
    registryB.register(makeRuleId("S12.SECRETS"), () => ({ ruleId: makeRuleId("S12.SECRETS"), verdict: "pass", findings: [], detail: "b" }));
    const registryC = createRegistry<PortC>();
    registryC.register(makeRuleId("S5.THIRD"), (port) => ({ ruleId: makeRuleId("S5.THIRD"), verdict: "fail", findings: [], detail: `c:${port.c}` }));

    const dispatch = composeFamilies([
      bindRegistry(registryA, { a: "x" }),
      bindRegistry(registryB, { b: "y" }),
      bindRegistry(registryC, { c: "z" }),
    ]);

    expect(dispatch(makeRuleId("S9.LOGDIR"))?.detail).toBe("a");
    expect(dispatch(makeRuleId("S12.SECRETS"))?.detail).toBe("b");
    expect(dispatch(makeRuleId("S5.THIRD"))?.detail).toBe("c:z");
  });

  test("no families at all still returns a valid (always-undefined) dispatch function -- not a crash", () => {
    const dispatch = composeFamilies([]);
    expect(dispatch(makeRuleId("S9.LOGDIR"))).toBeUndefined();
  });

  // Reviewer finding 2 (T3 retry): first-wins-with-no-detection was the one place in this seam that
  // broke the codebase's own universal rule that an ambiguity fails LOUD (`gap()` names itself,
  // `BoundDispatcher.dispatch` throws for an id it doesn't own). Two families claiming the SAME id is
  // never silently resolved to "whichever was listed first" -- it throws, naming the id and BOTH
  // families' positions, so a duplicate registration surfaces the moment a real traversal reaches it
  // rather than becoming permanently dead code discoverable only by reading every registry by eye.
  test("TWO families claiming the SAME id throws, naming the id -- never a silent first-wins", () => {
    const registryA = createRegistry<PortA>();
    registryA.register(makeRuleId("S9.LOGDIR"), () => ({ ruleId: makeRuleId("S9.LOGDIR"), verdict: "pass", findings: [], detail: "first" }));
    const registryB = createRegistry<PortB>();
    registryB.register(makeRuleId("S9.LOGDIR"), () => ({ ruleId: makeRuleId("S9.LOGDIR"), verdict: "fail", findings: [], detail: "second" }));

    const dispatch = composeFamilies([bindRegistry(registryA, { a: "x" }), bindRegistry(registryB, { b: "y" })]);
    expect(() => dispatch(makeRuleId("S9.LOGDIR"))).toThrow(/S9\.LOGDIR.*MORE THAN ONE family/);
  });

  // Sibling control: a DIFFERENT id, claimed by only ONE of the same two families, still dispatches
  // normally -- the duplicate-detection above must not turn every lookup into a throw, only a
  // genuinely ambiguous one.
  test("CONTROL: a different id, claimed by only one of the same two families, still dispatches normally", () => {
    const registryA = createRegistry<PortA>();
    registryA.register(makeRuleId("S9.LOGDIR"), () => ({ ruleId: makeRuleId("S9.LOGDIR"), verdict: "pass", findings: [], detail: "a-only" }));
    const registryB = createRegistry<PortB>();
    registryB.register(makeRuleId("S12.SECRETS"), () => ({ ruleId: makeRuleId("S12.SECRETS"), verdict: "pass", findings: [], detail: "b-only" }));

    const dispatch = composeFamilies([bindRegistry(registryA, { a: "x" }), bindRegistry(registryB, { b: "y" })]);
    expect(dispatch(makeRuleId("S9.LOGDIR"))?.detail).toBe("a-only");
    expect(dispatch(makeRuleId("S12.SECRETS"))?.detail).toBe("b-only");
  });

  // THREE families, only two of which collide on one id -- proves the check names the RIGHT pair
  // (positions 0 and 2), not merely "a collision exists somewhere", and that the third, uninvolved
  // family's own id is unaffected.
  test("a collision between families at positions 0 and 2 (not adjacent) is still caught and named correctly", () => {
    type PortC = { readonly c: string };
    const registryA = createRegistry<PortA>();
    registryA.register(makeRuleId("S9.LOGDIR"), () => ({ ruleId: makeRuleId("S9.LOGDIR"), verdict: "pass", findings: [], detail: "a" }));
    const registryB = createRegistry<PortB>();
    registryB.register(makeRuleId("S12.SECRETS"), () => ({ ruleId: makeRuleId("S12.SECRETS"), verdict: "pass", findings: [], detail: "b" }));
    const registryC = createRegistry<PortC>();
    registryC.register(makeRuleId("S9.LOGDIR"), () => ({ ruleId: makeRuleId("S9.LOGDIR"), verdict: "fail", findings: [], detail: "c" }));

    const dispatch = composeFamilies([
      bindRegistry(registryA, { a: "x" }),
      bindRegistry(registryB, { b: "y" }),
      bindRegistry(registryC, { c: "z" }),
    ]);
    expect(() => dispatch(makeRuleId("S9.LOGDIR"))).toThrow(/S9\.LOGDIR.*positions 0 and 2 of 3/);
    // The uninvolved family's own id is untouched by the check.
    expect(dispatch(makeRuleId("S12.SECRETS"))?.detail).toBe("b");
  });
});

describe("classifyAll — every rule handed in, classified in order, across composed families (DoD 1)", () => {
  test("a mix of mechanical (dispatched)/mechanical (gap)/judgment-only classifies each to its own outcome", () => {
    const registryA = createRegistry<PortA>();
    registryA.register(makeRuleId("S9.A"), () => ({ ruleId: makeRuleId("S9.A"), verdict: "pass", findings: [], detail: "ok" }));
    const dispatch = composeFamilies([bindRegistry(registryA, { a: "x" })]);

    const rules = [
      ruleOf("S9.A", "mechanical", 9), // registered -> evaluated/pass
      ruleOf("S12.B", "mechanical", 12), // no family owns it -> evaluated/gap
      ruleOf("S9.C", "judgment-only", 9), // excluded
    ];

    const report = classifyAll(rules, dispatch);
    expect(report.outcomes).toHaveLength(3);
    const [first, second, third] = report.outcomes;
    if (first?.kind !== "evaluated") throw new Error("expected outcome 0 to be evaluated");
    expect(first.evaluation.verdict).toBe("pass");
    if (second?.kind !== "evaluated") throw new Error("expected outcome 1 to be evaluated");
    expect(second.evaluation.verdict).toBe("gap");
    expect(second.evaluation.detail).toContain("rule-unimplemented");
    expect(third?.kind).toBe("excluded");
  });

  test("classifies in the exact order given -- never re-sorted, never re-derived from the dispatchers", () => {
    const dispatch = composeFamilies([]);
    const rules = [ruleOf("S9.Z", "judgment-only", 9), ruleOf("S1.A", "judgment-only", 1)];
    const report = classifyAll(rules, dispatch);
    expect(report.outcomes.map((o) => (o.kind === "excluded" ? o.ruleId : "?"))).toEqual([makeRuleId("S9.Z"), makeRuleId("S1.A")]);
  });

  test("an empty rule list classifies to an empty report -- not an error", () => {
    const report = classifyAll([], composeFamilies([]));
    expect(report).toEqual({ outcomes: [] });
  });

  test("spans MULTIPLE families in one pass -- one rule per family, both real (non-gap) dispatches", () => {
    const registryA = createRegistry<PortA>();
    registryA.register(makeRuleId("S9.A"), () => ({ ruleId: makeRuleId("S9.A"), verdict: "pass", findings: [], detail: "a" }));
    const registryB = createRegistry<PortB>();
    registryB.register(makeRuleId("S12.B"), () => ({ ruleId: makeRuleId("S12.B"), verdict: "fail", findings: [], detail: "b" }));
    const dispatch = composeFamilies([bindRegistry(registryA, { a: "x" }), bindRegistry(registryB, { b: "y" })]);

    const report = classifyAll([ruleOf("S9.A", "mechanical", 9), ruleOf("S12.B", "mechanical", 12)], dispatch);
    const verdicts = report.outcomes.map((o) => (o.kind === "evaluated" ? o.evaluation.verdict : "excluded"));
    expect(verdicts).toEqual(["pass", "fail"]);
  });
});

// --- T3's DoD (leaves T4's level arithmetic explicitly unfilled) -- TraversalReport carries no field
// a level could occupy, same enforcement as section.ts's SectionReport (TD-101's runtime belt).
describe("classifyAll's result — carries NO global level, matching section.ts's own frozen convention", () => {
  test("the report has NO globalLevel/level key at all -- absent, not undefined", () => {
    const report = classifyAll([ruleOf("S9.A", "mechanical", 9)], composeFamilies([]));
    expect("globalLevel" in report).toBe(false);
    expect(Object.keys(report).sort()).toEqual(["outcomes"]);
  });

  test("the report is FROZEN -- attaching a globalLevel at runtime throws, never silently succeeds", () => {
    const report = classifyAll([ruleOf("S9.A", "mechanical", 9)], composeFamilies([]));
    expect(Object.isFrozen(report)).toBe(true);
    expect(() => {
      (report as unknown as { globalLevel: string }).globalLevel = "Attested";
    }).toThrow(TypeError);
    expect("globalLevel" in report).toBe(false);
  });
});

// Type-level sanity: a `BoundDispatcher` produced by `bindRegistry` is what `composeFamilies` accepts
// -- imported here so a future signature drift between registry.ts and traverse.ts fails to compile
// (once T8's tsc leg is in the gate, which it already is) rather than only at a call site nobody tests.
const _typeCheck: (d: readonly BoundDispatcher[]) => unknown = composeFamilies;
void _typeCheck;
