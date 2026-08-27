import { describe, expect, test } from "bun:test";
import { makeRuleId } from "./model.ts";
import { bindRegistry, createRegistry } from "./registry.ts";
import type { RuleEvaluation } from "./result.ts";

type FakePort = { readonly label: string };

function passing(label: string): RuleEvaluation {
  return { ruleId: makeRuleId("S9.LOGDIR"), verdict: "pass", findings: [], detail: label };
}

describe("createRegistry — dispatch through a map, never a switch", () => {
  test("resolves an unregistered id to undefined, not a thrown error or a default rule body", () => {
    const registry = createRegistry<FakePort>();
    expect(registry.resolve(makeRuleId("S9.LOGDIR"))).toBeUndefined();
    expect(registry.dispatch(makeRuleId("S9.LOGDIR"), { label: "x" })).toBeUndefined();
  });

  test("registers and dispatches one evaluator by id", () => {
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S9.LOGDIR"), (port) => passing(port.label));
    expect(registry.dispatch(makeRuleId("S9.LOGDIR"), { label: "hi" })?.detail).toBe("hi");
  });

  // DoD 2's own verify clause: adding a SECOND evaluator is a `register` call at ITS OWN site, with
  // ZERO edits to `createRegistry`/`resolve`/`dispatch` above — no `case`, no `if (id === ...)` this
  // test had to add to `registry.ts` to make room for it.
  test("a second evaluator, registered for a DIFFERENT rule id, dispatches independently — proves no procedural switch", () => {
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S9.LOGDIR"), (port) => passing(`first:${port.label}`));
    registry.register(makeRuleId("S1.LAW2"), (port) => passing(`second:${port.label}`));

    expect(registry.dispatch(makeRuleId("S9.LOGDIR"), { label: "a" })?.detail).toBe("first:a");
    expect(registry.dispatch(makeRuleId("S1.LAW2"), { label: "b" })?.detail).toBe("second:b");
    // Each id resolves to ITS OWN evaluator, not the other's or a merge of both.
    expect(registry.resolve(makeRuleId("S9.LOGDIR"))).not.toBe(registry.resolve(makeRuleId("S1.LAW2")));
  });

  test("registering twice for the same id REPLACES the evaluator, rather than silently keeping the first", () => {
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S9.LOGDIR"), () => passing("v1"));
    registry.register(makeRuleId("S9.LOGDIR"), () => passing("v2"));
    expect(registry.dispatch(makeRuleId("S9.LOGDIR"), { label: "x" })?.detail).toBe("v2");
  });
});

// --- SPRINT-091 T3: bindRegistry -- the type-erasure seam a whole-spec traversal composes over ------
type OtherPort = { readonly tag: string };

describe("bindRegistry — erases TPort so registries with DIFFERENT port shapes can be composed", () => {
  test("has() reports true for a registered id WITHOUT touching the port", () => {
    let touched = false;
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S9.LOGDIR"), () => {
      touched = true;
      return passing("x");
    });
    const bound = bindRegistry(registry, { label: "never touched" });

    expect(bound.has(makeRuleId("S9.LOGDIR"))).toBe(true);
    expect(touched).toBe(false); // membership alone must never invoke the evaluator
  });

  test("has() reports false for an id nothing registers", () => {
    const bound = bindRegistry(createRegistry<FakePort>(), { label: "x" });
    expect(bound.has(makeRuleId("S9.LOGDIR"))).toBe(false);
  });

  test("dispatch() calls the bound evaluator against the bound port, with no port argument at the call site", () => {
    const registry = createRegistry<FakePort>();
    registry.register(makeRuleId("S9.LOGDIR"), (port) => passing(`bound:${port.label}`));
    const bound = bindRegistry(registry, { label: "hi" });

    expect(bound.dispatch(makeRuleId("S9.LOGDIR")).detail).toBe("bound:hi");
  });

  test("dispatch() on an id nothing registers throws loudly rather than returning undefined silently", () => {
    const bound = bindRegistry(createRegistry<FakePort>(), { label: "x" });
    expect(() => bound.dispatch(makeRuleId("S9.LOGDIR"))).toThrow(/has no registered evaluator/);
  });

  // The load-bearing proof for T3's central design problem: TWO registries with COMPLETELY DIFFERENT
  // port shapes (FakePort vs OtherPort) each bind to their OWN `BoundDispatcher`, indistinguishable
  // from the composing caller's point of view -- neither carries any residual type information a
  // caller could branch on, which is exactly what lets `traverse.ts` hold a plain
  // `readonly BoundDispatcher[]` of them.
  test("two registries with UNRELATED port shapes both erase to the identical BoundDispatcher interface", () => {
    const a = createRegistry<FakePort>();
    a.register(makeRuleId("S9.LOGDIR"), (port) => passing(`a:${port.label}`));
    const b = createRegistry<OtherPort>();
    b.register(makeRuleId("S1.LAW2"), (port) => ({ ruleId: makeRuleId("S1.LAW2"), verdict: "fail", findings: [], detail: `b:${port.tag}` }));

    const dispatchers = [bindRegistry(a, { label: "L" }), bindRegistry(b, { tag: "T" })];

    expect(dispatchers[0]?.has(makeRuleId("S9.LOGDIR"))).toBe(true);
    expect(dispatchers[0]?.has(makeRuleId("S1.LAW2"))).toBe(false);
    expect(dispatchers[1]?.has(makeRuleId("S1.LAW2"))).toBe(true);
    expect(dispatchers[1]?.dispatch(makeRuleId("S1.LAW2")).detail).toBe("b:T");
  });
});
