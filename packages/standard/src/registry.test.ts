import { describe, expect, test } from "bun:test";
import { makeRuleId } from "./model.ts";
import { createRegistry } from "./registry.ts";
import type { RuleEvaluation } from "./result.ts";

type FakePort = { readonly label: string };

function passing(label: string): RuleEvaluation {
  return { ruleId: makeRuleId("S9.LOGDIR"), verdict: "pass", finding: null, detail: label };
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
