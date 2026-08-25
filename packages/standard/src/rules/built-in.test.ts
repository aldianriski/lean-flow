import { describe, expect, test } from "bun:test";
import { makeRuleId } from "../model.ts";
import { InMemorySprintDirPort } from "./sprint-log-outside-logs-dir.fake.ts";
import { createBuiltInRegistry } from "./built-in.ts";

describe("createBuiltInRegistry", () => {
  test("resolves S9.LOGDIR out of the box", () => {
    const registry = createBuiltInRegistry();
    const result = registry.dispatch(makeRuleId("S9.LOGDIR"), new InMemorySprintDirPort(["a.md"]));
    expect(result?.verdict).toBe("pass");
  });

  test("an id nothing registers resolves to undefined, not a thrown error", () => {
    const registry = createBuiltInRegistry();
    expect(registry.resolve(makeRuleId("S1.LAW2"))).toBeUndefined();
  });
});
