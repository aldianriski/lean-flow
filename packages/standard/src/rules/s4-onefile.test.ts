import { describe, expect, test } from "bun:test";
// SPRINT-092 T1: fixtures now build through the shared factory (`adrFamilyPort`) instead of
// `new InMemoryAdrFamilyPort({...})` inline per test -- see `test/fixtures/adr-family-factory.ts`'s
// own header for why the factory cannot decide a verdict (EPIC-014 H14).
import { adrFamilyPort } from "../../../../test/fixtures/adr-family-factory.ts";
import { ADR_PATH_NONCANONICAL, evaluate } from "./s4-onefile.ts";

describe("S4.ONEFILE -- evaluate, against the in-memory fake", () => {
  test("no docs/adr/ directory: note, not a finding", () => {
    const r = evaluate(adrFamilyPort({ hasAdrDir: false }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("docs/adr/ exists but holds no ADR file: note, not a finding", () => {
    const r = evaluate(adrFamilyPort({ adrDirFiles: {} }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("a single canonical ADR: pass", () => {
    const r = evaluate(adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": "" } }));
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("all 1 ADR(s)");
  });

  test("a noncanonical name inside docs/adr/: fail, ONE finding named adr-path-noncanonical", () => {
    const r = evaluate(adrFamilyPort({ adrDirFiles: { "adr-1-loose-name.md": "" } }));
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(ADR_PATH_NONCANONICAL);
    expect(r.findings[0]?.detail).toContain("docs/adr/adr-1-loose-name.md");
  });

  test("two files sharing a number: fail, ONE finding naming which one it lost to", () => {
    const r = evaluate(
      adrFamilyPort({
        adrDirFiles: {
          "ADR-001-a-real-decision.md": "",
          "ADR-001-the-same-number-again.md": "",
        },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(ADR_PATH_NONCANONICAL);
    expect(r.findings[0]?.detail).toContain("docs/adr/ADR-001-the-same-number-again.md");
    expect(r.findings[0]?.detail).toContain("already claimed by docs/adr/ADR-001-a-real-decision.md");
  });

  test("a canonically-named stray under docs/ (outside docs/adr/): fail, naming the stray path", () => {
    const r = evaluate(
      adrFamilyPort({
        adrDirFiles: { "ADR-001-a-real-decision.md": "" },
        strayDocsFiles: { "docs/ADR-002-in-the-wrong-place.md": "" },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(ADR_PATH_NONCANONICAL);
    expect(r.findings[0]?.detail).toContain("docs/ADR-002-in-the-wrong-place.md");
  });

  test("a canonically-named stray at the repo root: fail, naming the bare basename", () => {
    const r = evaluate(
      adrFamilyPort({
        adrDirFiles: { "ADR-001-a-real-decision.md": "" },
        strayRootFiles: { "ADR-002-in-the-wrong-place.md": "" },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.detail).toContain("ADR-002-in-the-wrong-place.md");
  });

  // Cardinality (EPIC-014 D2): TWO independent offences (a noncanonical name AND a stray) must read
  // back as TWO findings, never one comma-joined finding.
  test("a noncanonical name AND a stray together: fail, TWO findings", () => {
    const r = evaluate(
      adrFamilyPort({
        adrDirFiles: { "adr-1-loose-name.md": "" },
        strayDocsFiles: { "docs/ADR-002-in-the-wrong-place.md": "" },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(2);
    expect(r.findings.every((f) => f.name === ADR_PATH_NONCANONICAL)).toBe(true);
  });
});
