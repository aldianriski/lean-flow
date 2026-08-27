import { describe, expect, test } from "bun:test";
import {
  CONFORMANCE_LEVELS,
  RULE_MARKS,
  isCheckable,
  isConformanceLevel,
  isRuleMark,
  makeRuleId,
  type StandardRule,
} from "./model.ts";

describe("RuleMark — the vocabulary the Standard actually defines", () => {
  test("admits the six marks §14 defines, not V3 §9's four", () => {
    // `restated` and `standard-directed` were added by ADR-028 because a `mechanical` mark had been
    // reporting eleven rules as "unchecked gaps someone can close", which they are not.
    expect([...RULE_MARKS].sort()).toEqual([
      "implementation-directed", "judgment-only", "mechanical", "restated", "split", "standard-directed",
    ]);
  });

  test("rejects a mark the Standard does not define", () => {
    expect(isRuleMark("mechanical")).toBe(true);
    expect(isRuleMark("restated")).toBe(true);
    expect(isRuleMark("automatic")).toBe(false);
    expect(isRuleMark("")).toBe(false);
  });
});

describe("ConformanceLevel", () => {
  test("admits exactly the three levels, spelled as the Standard spells them", () => {
    expect([...CONFORMANCE_LEVELS]).toEqual(["Structural", "Gated", "Attested"]);
  });

  test("rejects a level the Standard does not define", () => {
    expect(isConformanceLevel("Gated")).toBe(true);
    expect(isConformanceLevel("gated")).toBe(false);
    expect(isConformanceLevel("Certified")).toBe(false);
  });
});

describe("StandardRule", () => {
  test("represents a rule that carries NO level — six real rules do", () => {
    // `implementation-directed` rules constrain a tool, not a repository, so they sit at no level.
    // A model that forced one would put them somewhere the Standard deliberately does not.
    const r: StandardRule = {
      id: makeRuleId("S13.NOINFER"),
      section: 13,
      mark: "implementation-directed",
      level: null,
      source: { file: "spec/STANDARD.md", line: 1 },
    };
    expect(r.level).toBeNull();
  });

  test("does not admit a rule with no section — a rule always belongs to one", () => {
    const r: StandardRule = {
      id: makeRuleId("S1.LAW1"),
      section: 1,
      mark: "judgment-only",
      level: "Structural",
      source: { file: "spec/STANDARD.md", line: 34 },
    };
    expect(r.section).toBe(1);
  });
});

describe("makeRuleId — a rule id is validated, not merely a string", () => {
  test("accepts the shapes the Standard actually uses, including hyphenated §2 ids", () => {
    // The hyphenated ids are exactly the 21 that a naive S[0-9]+\.[A-Z][A-Z0-9]+ grep missed,
    // producing the phantom "79 rules" this sprint disproved (ADR-034).
    // `String(...)` widens the brand for comparison without an assertion; the point of these
    // three is that a valid id round-trips to its own text, which is exactly what is asserted.
    expect(String(makeRuleId("S1.LAW1"))).toBe("S1.LAW1");
    expect(String(makeRuleId("S2.F-ARCHIVE"))).toBe("S2.F-ARCHIVE");
    expect(String(makeRuleId("S11.TDDELETE"))).toBe("S11.TDDELETE");
  });

  test("rejects a malformed id rather than passing it through as a string", () => {
    expect(() => makeRuleId("LAW1")).toThrow();
    expect(() => makeRuleId("s1.law1")).toThrow();
    expect(() => makeRuleId("")).toThrow();
  });
});

describe("isCheckable — the 51/49 split ADR-034 froze", () => {
  test("mechanical and split are checkable; the other four are explicitly not", () => {
    expect(isCheckable("mechanical")).toBe(true);
    expect(isCheckable("split")).toBe(true);
    expect(isCheckable("judgment-only")).toBe(false);
    expect(isCheckable("restated")).toBe(false);
    expect(isCheckable("implementation-directed")).toBe(false);
    expect(isCheckable("standard-directed")).toBe(false);
  });
});
