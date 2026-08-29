import { describe, expect, test } from "bun:test";
import { makeRuleId } from "../model.ts";
import { combineAdrAppendPort } from "./adr-append-port.ts";
// SPRINT-092 T1 (gap closed on coordinator review): this file asserts a `.verdict` outcome through
// S4.APPEND's own registry, which makes it a §4 case by DoD 1's own reading -- fixtures build through
// the shared factory, same as every other §4 test file. See s4-onefile.test.ts's own comment and
// `test/fixtures/adr-family-factory.ts`'s header for why the factory cannot decide a verdict
// (EPIC-014 H14).
import { adrFamilyPort, adrHistoryPort } from "../../../../test/fixtures/adr-family-factory.ts";
import { createS4AppendRegistry } from "./s4-append-registry.ts";

describe("createS4AppendRegistry -- S4.APPEND resolves out of the box", () => {
  test("S4.APPEND dispatches to its own evaluator", () => {
    const registry = createS4AppendRegistry();
    const port = combineAdrAppendPort(
      adrFamilyPort({ adrDirFiles: {} }),
      adrHistoryPort({}),
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
