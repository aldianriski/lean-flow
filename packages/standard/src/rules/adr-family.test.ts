import { describe, expect, test } from "bun:test";
import { InMemoryAdrFamilyPort } from "./adr-family-port.fake.ts";
import {
  canonicalAdrs,
  hasBulletOrHeadingSection,
  hasHeadingSection,
  isCanonicalAdrName,
  sectionBody,
} from "./adr-family.ts";

describe("isCanonicalAdrName -- SHAPE only", () => {
  test("three digits, a hyphen, a slug, .md is canonical", () => {
    expect(isCanonicalAdrName("ADR-001-a-real-decision.md")).toBe(true);
    expect(isCanonicalAdrName("ADR-999-z.md")).toBe(true);
  });
  test("a loose lower-case name is not canonical", () => {
    expect(isCanonicalAdrName("adr-1-loose-name.md")).toBe(false);
  });
  test("two digits or four digits is not canonical", () => {
    expect(isCanonicalAdrName("ADR-01-x.md")).toBe(false);
    expect(isCanonicalAdrName("ADR-0001-x.md")).toBe(false);
  });
  test("no slug at all is not canonical", () => {
    expect(isCanonicalAdrName("ADR-001-.md")).toBe(false);
    expect(isCanonicalAdrName("ADR-001.md")).toBe(false);
  });
});

describe("canonicalAdrs -- docs/adr/'s own listing, sorted, dup numbers both included", () => {
  test("no docs/adr/ directory: empty", () => {
    expect(canonicalAdrs(new InMemoryAdrFamilyPort({ hasAdrDir: false }))).toEqual([]);
  });
  test("docs/adr/ present but empty: empty", () => {
    expect(canonicalAdrs(new InMemoryAdrFamilyPort({ adrDirFiles: {} }))).toEqual([]);
  });
  test("a noncanonical name is excluded", () => {
    const port = new InMemoryAdrFamilyPort({ adrDirFiles: { "adr-1-loose-name.md": "" } });
    expect(canonicalAdrs(port)).toEqual([]);
  });
  test("sorted ascending, and BOTH files sharing a number are included once each", () => {
    const port = new InMemoryAdrFamilyPort({
      adrDirFiles: {
        "ADR-001-the-same-number-again.md": "",
        "ADR-001-a-real-decision.md": "",
      },
    });
    expect(canonicalAdrs(port)).toEqual(["docs/adr/ADR-001-a-real-decision.md", "docs/adr/ADR-001-the-same-number-again.md"]);
  });
});

describe("hasBulletOrHeadingSection -- Status/Deciders' own dual rendering", () => {
  test("a header bullet counts", () => {
    expect(hasBulletOrHeadingSection("- **Status:** accepted (2026-08-20)", "Status")).toBe(true);
    expect(hasBulletOrHeadingSection("- **Status** accepted", "Status")).toBe(true);
  });
  test("a heading counts too", () => {
    expect(hasBulletOrHeadingSection("## Status", "Status")).toBe(true);
  });
  test("neither present: false", () => {
    expect(hasBulletOrHeadingSection("Status: accepted", "Status")).toBe(false);
  });
});

describe("hasHeadingSection / sectionBody -- prefix match, mirrors the Shell awk", () => {
  const adr = ["## Consequences", "", "**Positive:** it works.", "**Negative:** it costs something.", "", "## Alternatives considered", "", "| a | b |"].join("\n");

  test("a longer heading text still matches its prefix", () => {
    expect(hasHeadingSection(adr, "Alternatives")).toBe(true);
  });
  test("a heading absent from the text is false", () => {
    expect(hasHeadingSection(adr, "Context")).toBe(false);
  });
  test("sectionBody stops at the NEXT ## heading", () => {
    expect(sectionBody(adr, "Consequences")).toContain("Negative");
    expect(sectionBody(adr, "Consequences")).not.toContain("Alternatives considered");
  });
  test("sectionBody for the LAST section runs to the end of the text", () => {
    expect(sectionBody(adr, "Alternatives")).toContain("| a | b |");
  });
});
