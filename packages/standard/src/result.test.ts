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

  // SPRINT-091 T4: `hold` joins the Verdict union (level.ts's full-run arithmetic). Mirrors `hold()`
  // in scripts/lib/conformance-engine.sh, which does NOT set `fail=1` either -- a hold is a level
  // honestly reached and not exceeded (§14, §13c), never a defect, so it must never move the exit
  // code -- the DoD 2 distinction ("hold is distinguished from fail, never collapsed") proven at the
  // exit-code layer, alongside level.test.ts's proof at the level-arithmetic layer.
  test("a hold verdict never fails the run on its own -- distinguished from fail (DoD 2)", () => {
    const result: ConformanceResult = {
      evaluations: [{ ruleId: RID, verdict: "hold", findings: [], detail: "attestation-absent" }],
    };
    expect(exitCodeFor(result)).toBe(0);
  });

  test("a hold alongside passes still exits zero -- only `fail` moves the exit code", () => {
    const result: ConformanceResult = {
      evaluations: [
        { ruleId: RID, verdict: "pass", findings: [], detail: "ok" },
        { ruleId: RID, verdict: "hold", findings: [], detail: "attestation-absent" },
      ],
    };
    expect(exitCodeFor(result)).toBe(0);
  });

  test("a hold does not mask a real fail elsewhere in the same run -- and a fail does not read back as a hold", () => {
    const result: ConformanceResult = {
      evaluations: [
        { ruleId: RID, verdict: "hold", findings: [], detail: "attestation-absent" },
        { ruleId: RID, verdict: "fail", findings: [{ name: "x", detail: "d" }], detail: "d" },
      ],
    };
    expect(exitCodeFor(result)).toBe(1);
  });
});
