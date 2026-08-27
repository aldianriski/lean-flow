import { describe, expect, test } from "bun:test";
import { InMemoryAdrFamilyPort } from "./adr-family-port.fake.ts";
import { ADR_NO_NEGATIVE_CONSEQUENCE, evaluate } from "./s4-negative.ts";

function adrWithConsequences(consequences: string): string {
  return ["- **Status:** accepted", "- **Deciders:** M", "", "## Context", "x", "", "## Decision", "x", "", "## Consequences", "", consequences].join("\n");
}

describe("S4.NEGATIVE -- evaluate, against the in-memory fake", () => {
  test("no canonical ADR files: note, not a finding", () => {
    const r = evaluate(new InMemoryAdrFamilyPort({ adrDirFiles: {} }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("a Negative is named: pass", () => {
    const text = adrWithConsequences("**Positive:** it works.\n**Negative:** it costs something.");
    const r = evaluate(new InMemoryAdrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": text } }));
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("no Negative in an existing Consequences section: fail, ONE finding named adr-no-negative-consequence", () => {
    const text = adrWithConsequences("**Positive:** it works.");
    const r = evaluate(new InMemoryAdrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": text } }));
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(ADR_NO_NEGATIVE_CONSEQUENCE);
    expect(r.findings[0]?.detail).toContain("docs/adr/ADR-001-a-real-decision.md");
  });

  // Left to S4.SECTIONS -- billing one defect to two rules would inflate the report. Not this rule's
  // finding, and NOT counted as a Negative-carrying pass either.
  test("NO Consequences section at all: note, not this rule's finding (left to S4.SECTIONS)", () => {
    const text = "- **Status:** accepted\n- **Deciders:** M\n\n## Context\nx\n";
    const r = evaluate(new InMemoryAdrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": text } }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("S4.SECTIONS");
  });

  test("case-insensitive: 'NEGATIVE' in caps still counts", () => {
    const text = adrWithConsequences("NEGATIVE (trade-offs): it costs something.");
    const r = evaluate(new InMemoryAdrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": text } }));
    expect(r.verdict).toBe("pass");
  });
});
