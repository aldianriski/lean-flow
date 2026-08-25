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

  // SPRINT-087 T2: `gap` joins the Verdict union (classify.ts's unregistered mechanical/split case).
  // Mirrors `gap()` in scripts/lib/conformance-engine.sh, which does NOT set `fail=1` -- a gap is a
  // statement about this engine's own coverage, never a finding about the repository, so it must
  // never move the exit code either alone or alongside real passes.
  test("a gap verdict never fails the run on its own", () => {
    const result: ConformanceResult = {
      evaluations: [{ ruleId: RID, verdict: "gap", findings: [], detail: "rule-unimplemented" }],
    };
    expect(exitCodeFor(result)).toBe(0);
  });

  test("a gap alongside passes still exits zero -- only `fail` moves the exit code", () => {
    const result: ConformanceResult = {
      evaluations: [
        { ruleId: RID, verdict: "pass", findings: [], detail: "ok" },
        { ruleId: RID, verdict: "gap", findings: [], detail: "rule-unimplemented" },
      ],
    };
    expect(exitCodeFor(result)).toBe(0);
  });

  test("a gap does not mask a real fail elsewhere in the same run", () => {
    const result: ConformanceResult = {
      evaluations: [
        { ruleId: RID, verdict: "gap", findings: [], detail: "rule-unimplemented" },
        { ruleId: RID, verdict: "fail", findings: [{ name: "x", detail: "d" }], detail: "d" },
      ],
    };
    expect(exitCodeFor(result)).toBe(1);
  });
});
