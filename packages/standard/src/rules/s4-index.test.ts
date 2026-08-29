import { describe, expect, test } from "bun:test";
// SPRINT-092 T1: fixtures build through the shared factory -- see s4-onefile.test.ts's own comment
// and `test/fixtures/adr-family-factory.ts`'s header for why the factory cannot decide a verdict.
import { adrFamilyPort } from "../../../../test/fixtures/adr-family-factory.ts";
import { DECISIONS_INDEX_MISSING_ADR, evaluate } from "./s4-index.ts";

describe("S4.INDEX -- evaluate, against the in-memory fake", () => {
  test("no canonical ADR files: note, not a finding", () => {
    const r = evaluate(adrFamilyPort({ adrDirFiles: {} }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("an ADR carries a row in docs/DECISIONS.md: pass", () => {
    const r = evaluate(
      adrFamilyPort({
        adrDirFiles: { "ADR-001-a-real-decision.md": "" },
        indexFile: { path: "docs/DECISIONS.md", text: "| [ADR-001](adr/ADR-001-a-real-decision.md) | ... |\n" },
      }),
    );
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("docs/DECISIONS.md");
  });

  test("no index file at all: fail, ONE finding naming BOTH candidate paths", () => {
    const r = evaluate(adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": "" } }));
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(DECISIONS_INDEX_MISSING_ADR);
    expect(r.findings[0]?.detail).toContain("no decision index found");
  });

  test("an index exists but carries no row for the ADR: fail, naming the ADR and the index file", () => {
    const r = evaluate(
      adrFamilyPort({
        adrDirFiles: { "ADR-001-a-real-decision.md": "" },
        indexFile: { path: "docs/DECISIONS.md", text: "| ADR | Title | Status | Date |\n|---|---|---|---|\n" },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.detail).toContain("docs/adr/ADR-001-a-real-decision.md");
    expect(r.findings[0]?.detail).toContain("docs/DECISIONS.md carries no row");
  });

  // The duplicate-number cross-check (adr-family.ts's own header claim): BOTH files sharing a number
  // are independently checked against the index, so an unindexed duplicate is ITS OWN S4.INDEX
  // finding -- not absorbed into S4.ONEFILE's.
  test("two files sharing a number, only one indexed: fail, naming the UNINDEXED one only", () => {
    const r = evaluate(
      adrFamilyPort({
        adrDirFiles: {
          "ADR-001-a-real-decision.md": "",
          "ADR-001-the-same-number-again.md": "",
        },
        indexFile: { path: "docs/DECISIONS.md", text: "ADR-001-a-real-decision.md\n" },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.detail).toContain("docs/adr/ADR-001-the-same-number-again.md");
  });

  test("root-level DECISIONS.md is accepted too, and named in the pass detail", () => {
    const r = evaluate(
      adrFamilyPort({
        adrDirFiles: { "ADR-001-a-real-decision.md": "" },
        indexFile: { path: "DECISIONS.md", text: "ADR-001-a-real-decision.md\n" },
      }),
    );
    expect(r.verdict).toBe("pass");
    expect(r.detail).toContain("DECISIONS.md");
  });
});
