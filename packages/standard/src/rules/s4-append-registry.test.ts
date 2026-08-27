import { describe, expect, test } from "bun:test";
import { makeRuleId } from "../model.ts";
import { combineAdrAppendPort } from "./adr-append-port.ts";
import { InMemoryAdrFamilyPort } from "./adr-family-port.fake.ts";
import { InMemoryAdrHistoryPort } from "./adr-history-port.fake.ts";
import { createS4AppendRegistry } from "./s4-append-registry.ts";

describe("createS4AppendRegistry -- S4.APPEND resolves out of the box", () => {
  test("S4.APPEND dispatches to its own evaluator", () => {
    const registry = createS4AppendRegistry();
    const port = combineAdrAppendPort(
      new InMemoryAdrFamilyPort({ adrDirFiles: {} }),
      new InMemoryAdrHistoryPort({}),
    );
    expect(registry.dispatch(makeRuleId("S4.APPEND"), port)?.verdict).toBe("note");
  });

  test("a rule outside this family (S4.ONEFILE, T6's own) resolves to undefined, not a thrown error", () => {
    const registry = createS4AppendRegistry();
    expect(registry.resolve(makeRuleId("S4.ONEFILE"))).toBeUndefined();
  });

  test("a rule outside §4 entirely (S12.SECRETS) resolves to undefined, not a thrown error", () => {
    const registry = createS4AppendRegistry();
    expect(registry.resolve(makeRuleId("S12.SECRETS"))).toBeUndefined();
  });
});
