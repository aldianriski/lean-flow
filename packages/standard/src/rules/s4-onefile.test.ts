import { describe, expect, test } from "bun:test";
import { InMemoryAdrFamilyPort } from "./adr-family-port.fake.ts";
import { ADR_PATH_NONCANONICAL, evaluate } from "./s4-onefile.ts";

describe("S4.ONEFILE -- evaluate, against the in-memory fake", () => {
  test("no docs/adr/ directory: note, not a finding", () => {
    const r = evaluate(new InMemoryAdrFamilyPort({ hasAdrDir: false }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("docs/adr/ exists but holds no ADR file: note, not a finding", () => {
    const r = evaluate(new InMemoryAdrFamilyPort({ adrDirFiles: {} }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("a single canonical ADR: pass", () => {
    const r = evaluate(new InMemoryAdrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": "" } }));
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("all 1 ADR(s)");
  });

  test("a noncanonical name inside docs/adr/: fail, ONE finding named adr-path-noncanonical", () => {
    const r = evaluate(new InMemoryAdrFamilyPort({ adrDirFiles: { "adr-1-loose-name.md": "" } }));
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(ADR_PATH_NONCANONICAL);
    expect(r.findings[0]?.detail).toContain("docs/adr/adr-1-loose-name.md");
  });

  test("two files sharing a number: fail, ONE finding naming which one it lost to", () => {
    const r = evaluate(
      new InMemoryAdrFamilyPort({
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
      new InMemoryAdrFamilyPort({
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
      new InMemoryAdrFamilyPort({
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
      new InMemoryAdrFamilyPort({
        adrDirFiles: { "adr-1-loose-name.md": "" },
        strayDocsFiles: { "docs/ADR-002-in-the-wrong-place.md": "" },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(2);
    expect(r.findings.every((f) => f.name === ADR_PATH_NONCANONICAL)).toBe(true);
  });
});
