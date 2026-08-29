import { describe, expect, test } from "bun:test";
// SPRINT-092 T1: fixtures build through the shared factory -- see s4-onefile.test.ts's own comment
// and `test/fixtures/adr-family-factory.ts`'s header for why the factory cannot decide a verdict.
import { adrFamilyPort } from "../../../../test/fixtures/adr-family-factory.ts";
import { ADR_REQUIRED_SECTION_MISSING, evaluate } from "./s4-sections.ts";

const COMPLETE_ADR = [
  "- **Status:** accepted (2026-08-20)",
  "- **Deciders:** Maintainer",
  "",
  "## Context",
  "",
  "text",
  "",
  "## Decision",
  "",
  "text",
  "",
  "## Consequences",
  "",
  "**Positive:** it works.",
  "**Negative:** it costs something.",
  "",
  "## Alternatives considered",
  "",
  "| a | b |",
].join("\n");

describe("S4.SECTIONS -- evaluate, against the in-memory fake", () => {
  test("no canonical ADR files: note, not a finding", () => {
    const r = evaluate(adrFamilyPort({ adrDirFiles: {} }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("all six sections present: pass", () => {
    const r = evaluate(adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": COMPLETE_ADR } }));
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("Alternatives missing (the retained fixture's own shape): fail, ONE finding naming ONLY it", () => {
    const withoutAlternatives = COMPLETE_ADR.replace(/\n\n## Alternatives considered[\s\S]*$/, "\n");
    const r = evaluate(adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": withoutAlternatives } }));
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(ADR_REQUIRED_SECTION_MISSING);
    expect(r.findings[0]?.detail).toContain("-- Alternatives.");
  });

  test("a Status BULLET is accepted; a Status HEADING is accepted too", () => {
    const withHeading = COMPLETE_ADR.replace("- **Status:** accepted (2026-08-20)", "## Status");
    const r = evaluate(adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": withHeading } }));
    expect(r.verdict).toBe("pass");
  });

  test("Status AND Deciders both missing: the finding names both, in order", () => {
    const withoutBullets = COMPLETE_ADR.replace("- **Status:** accepted (2026-08-20)\n- **Deciders:** Maintainer\n", "");
    const r = evaluate(adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": withoutBullets } }));
    expect(r.verdict).toBe("fail");
    expect(r.findings[0]?.detail).toContain("-- Status, Deciders.");
  });
});
