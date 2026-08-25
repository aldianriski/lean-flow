import { describe, expect, test } from "bun:test";
import { makeRuleId } from "./model.ts";
import { exitCodeFor, type ConformanceResult } from "./result.ts";

const RID = makeRuleId("S9.LOGDIR");

describe("exitCodeFor — mirrors the Shell oracle's `exit $fail`", () => {
  test("any fail verdict makes the run exit non-zero, even alongside passes", () => {
    const result: ConformanceResult = {
      evaluations: [
        { ruleId: RID, verdict: "pass", findings: [], detail: "ok" },
        { ruleId: RID, verdict: "fail", findings: [{ name: "x", detail: "d" }], detail: "d" },
      ],
    };
    expect(exitCodeFor(result)).toBe(1);
  });

  test("all pass/note exits zero", () => {
    const result: ConformanceResult = {
      evaluations: [
        { ruleId: RID, verdict: "pass", findings: [], detail: "ok" },
        { ruleId: RID, verdict: "note", findings: [], detail: "n/a" },
      ],
    };
    expect(exitCodeFor(result)).toBe(0);
  });

  test("an empty run — nothing evaluated — exits zero, not a phantom failure", () => {
    expect(exitCodeFor({ evaluations: [] })).toBe(0);
  });
});
