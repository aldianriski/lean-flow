import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tokenize } from "./tokenizer.ts";
import { allRules, formatRuleRow, rulesInSection, sectionsOf, toStandardRule } from "./spec-reader.ts";

const SPEC_PATH = fileURLToPath(new URL("../../../spec/STANDARD.md", import.meta.url));
const SHELL_READER_PATH = fileURLToPath(new URL("../../../scripts/lib/read-spec-rules.sh", import.meta.url));

// A helper, not a describe-level `const` -- computing this outside a `test()` callback runs it at
// collection time. A throw there surfaces as bun's own "Unhandled error between tests" / "N error"
// line, not a named `(fail)`, and silently drops every test in the block from the count instead of
// reddening one. Calling it fresh inside each test keeps a real defect attributable (found live: an
// S4 seeded break here printed "0 fail" and only revealed itself via the separate error count).
function loadS13Rows() {
  const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
  return rulesInSection(doc, 13);
}

describe("rulesInSection — §13 against the real Standard, structurally", () => {
  test("emits exactly §13's 7 rows, identical to `read-spec-rules.sh --section 13`", () => {
    // Independent source of truth: `sh scripts/lib/read-spec-rules.sh spec/STANDARD.md --section 13`,
    // run and hand-verified against §13's own printed table (not recomputed by this code).
    expect(loadS13Rows().map(formatRuleRow)).toEqual([
      "S13.TRAILERS Attested mechanical",
      "S13.OWNCOMMIT Attested mechanical",
      "S13.EVIDENCESHA Attested mechanical",
      "S13.AGREE Attested mechanical",
      "S13.UNSIGNEDCLAIM Attested mechanical",
      "S13.NOINFER — implementation-directed", // "—", the literal em-dash cell value
      "S13.NOTAUTHOR — implementation-directed",
    ]);
  });

  test("every row carries a source location inside §13's table", () => {
    const rows = loadS13Rows();
    for (const row of rows) {
      expect(row.loc.file).toBe(SPEC_PATH);
      expect(row.loc.line).toBeGreaterThan(0);
    }
    // Rows are in document order, so their line numbers strictly increase.
    for (let i = 1; i < rows.length; i++) expect(rows[i].loc.line).toBeGreaterThan(rows[i - 1].loc.line);
  });
});

describe("rulesInSection — the window is structural (which table sits inside which heading)", () => {
  test("a table before §13's heading is not attributed to §13, even when one of its rows is id'd S13.*", () => {
    // The decoy row is labelled S13.ROGUE and sits in §12's window. A substring reader (grep for
    // "S13.") would ingest it into §13's rows; a window-based reader must not -- it never even looks
    // at §12's table when asked for §13. The row also does not leak into §12's rows: the id's own
    // section (13) disagrees with the window it physically sits in (12), so it belongs to neither --
    // the same guard `read-spec-rules.sh` applies by embedding the window's section number into the
    // id pattern it matches against, rather than accepting any id shape.
    const src = [
      "## §12 — Earlier section",
      "",
      "| Rule | Level | Mark |",
      "|---|---|---|",
      "| `S12.REAL` | Structural | mechanical |",
      "| `S13.ROGUE` | Structural | mechanical |",
      "",
      "## §13 — Later section",
      "",
      "| Rule | Level | Mark |",
      "|---|---|---|",
      "| `S13.TRAILERS` | Attested | mechanical |",
    ].join("\n");
    const doc = tokenize(src, "f.md");

    const s13 = rulesInSection(doc, 13).map((r) => r.id);
    const s12 = rulesInSection(doc, 12).map((r) => r.id);

    expect(s13).toEqual(["S13.TRAILERS"]); // never sees §12's table at all
    expect(s12).toEqual(["S12.REAL"]); // S13.ROGUE is orphaned, not reassigned to §12 either
  });

  test("querying a section number with no heading at all returns no rows, not an error", () => {
    const doc = tokenize("## §1 — Only section\n\n| Rule |\n|---|\n| `S1.X` |", "f.md");
    expect(rulesInSection(doc, 99)).toEqual([]);
  });

  test("a table before ANY numbered heading belongs to no section", () => {
    const src = ["| Rule |", "|---|", "| `S1.PREAMBLE` |", "", "## §1 — Title", "", "| Rule |", "|---|", "| `S1.REAL` |"].join(
      "\n",
    );
    const doc = tokenize(src, "f.md");
    expect(rulesInSection(doc, 1).map((r) => r.id)).toEqual(["S1.REAL"]);
  });
});

describe("rulesInSection — row shape mirrors the shell reader's two defaulting rules", () => {
  test("a qualifier after the mark ('mechanical *on the fact*') does not become a distinct value", () => {
    const src = [
      "## §1 — T",
      "",
      "| Rule | Level | Mark |",
      "|---|---|---|",
      "| `S1.X` | Attested | mechanical *on the fact* |",
    ].join("\n");
    const doc = tokenize(src, "f.md");
    expect(rulesInSection(doc, 1).map(formatRuleRow)).toEqual(["S1.X Attested mechanical"]);
  });

  test("a cell with no token at all falls back to the shell's defaults ('--' / '?')", () => {
    const src = ["## §1 — T", "", "| Rule | Level | Mark |", "|---|---|---|", "| `S1.X` |  |  |"].join("\n");
    const doc = tokenize(src, "f.md");
    expect(rulesInSection(doc, 1).map(formatRuleRow)).toEqual(["S1.X -- ?"]);
  });

  test("an id cell that is not EXACTLY a backticked id is not a rule row (prose mention, not a row)", () => {
    const src = [
      "## §1 — T",
      "",
      "| Rule | Level | Mark |",
      "|---|---|---|",
      "| see `S1.X` above | Attested | mechanical |",
    ].join("\n");
    const doc = tokenize(src, "f.md");
    expect(rulesInSection(doc, 1)).toEqual([]);
  });
});

describe("sectionsOf — section numbering", () => {
  test("strips the non-digit prefix ('§') before reading the number", () => {
    const doc = tokenize("## §7 — Anti-patterns", "f.md");
    expect(sectionsOf(doc).map((s) => s.number)).toEqual([7]);
  });

  test("a '## ' heading with no digits numbers as 0, ending any prior window", () => {
    const doc = tokenize(["## §1 — T", "", "## Not Numbered", "", "| Rule |", "|---|", "| `S1.LATE` |"].join("\n"), "f.md");
    // The unnumbered heading resets the window, so §1's table (none here) would not reach past it --
    // demonstrated by the row landing in the unnumbered section (number 0), not §1.
    expect(rulesInSection(doc, 1)).toEqual([]);
    expect(sectionsOf(doc).map((s) => s.number)).toEqual([1, 0]);
  });
});

describe("toStandardRule — lifts a raw row into the H04 domain model", () => {
  test("a recognised level and mark round-trip", () => {
    const row = { id: "S13.TRAILERS", level: "Attested", mark: "mechanical", loc: { file: "f.md", line: 5 } };
    expect(toStandardRule(row, 13, "f.md")).toEqual({
      id: "S13.TRAILERS",
      section: 13,
      mark: "mechanical",
      level: "Attested",
      source: { file: "f.md", line: 5 },
    });
  });

  test("a level the Standard's vocabulary does not define ('--') becomes null, not a thrown error", () => {
    const row = { id: "S13.NOINFER", level: "—", mark: "implementation-directed", loc: { file: "f.md", line: 9 } };
    expect(toStandardRule(row, 13, "f.md").level).toBeNull();
  });

  test("a mark the Standard does not define throws -- that is a parse defect, not a value to paper over", () => {
    const row = { id: "S1.X", level: "Attested", mark: "automatic", loc: { file: "f.md", line: 1 } };
    expect(() => toStandardRule(row, 1, "f.md")).toThrow();
  });
});

// SPRINT-085 T2 -- full-document parity. `loadAllRows`/`loadShellRows` are helpers, not describe-level
// `const`s, for the same reason `loadS13Rows` above is one: a throw at collection time drops the whole
// block silently instead of reddening one test.
function loadAllRows() {
  const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
  return allRules(doc);
}

/** The independent oracle: `read-spec-rules.sh`, run fresh, never a copied-in literal. */
function loadShellRows(): string[] {
  const out = execFileSync("sh", [SHELL_READER_PATH, SPEC_PATH], { encoding: "utf8" });
  return out.split("\n").filter((l) => l !== "");
}

describe("allRules -- full-document parity against read-spec-rules.sh (SPRINT-085 T2)", () => {
  test("emits exactly 100 rows -- §14's own published total (ADR-034's frozen denominator)", () => {
    // Independent source of truth: the literal from ADR-034 / §14's `classified` row, not
    // recomputed the way the code counts (tdd anti-tautology rule).
    expect(loadAllRows().length).toBe(100);
  });

  test("rows are in strict document order across section boundaries, not just within one section", () => {
    const rows = loadAllRows();
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].loc.line).toBeGreaterThan(rows[i - 1].loc.line);
    }
  });

  test("agrees with the shell reader ROW BY ROW -- a mismatch names its row (EPIC-014 Closed-when: never in aggregate)", () => {
    const actual = loadAllRows().map(formatRuleRow);
    const expected = loadShellRows();

    // The aggregate check first, but it alone would satisfy neither this test's name nor the DoD --
    // two readers can agree on a total while disagreeing on every row's content or order.
    expect(actual.length).toBe(expected.length);

    // Row-by-row: the loop's own thrown message names the 0-indexed row and both sides' text, so the
    // failure is attributable from the message alone, with no need to re-run anything to find it.
    for (let i = 0; i < expected.length; i++) {
      if (actual[i] !== expected[i]) {
        throw new Error(
          `row ${i} differs (0-indexed, document order) -- TS: ${JSON.stringify(actual[i])} ` +
            `shell: ${JSON.stringify(expected[i])}`,
        );
      }
    }
  });

  test("S13.NOINFER: 2 prose+row mentions in the document, admitted exactly once as a rule " +
    "(reproduces position-anchored-not-substring)", () => {
    const raw = readFileSync(SPEC_PATH, "utf8");
    const nMentions = (raw.match(/S13\.NOINFER/g) ?? []).length;
    const admitted = loadAllRows().filter((r) => r.id === "S13.NOINFER");

    expect(nMentions).toBe(2); // §13's own table row + §14's prose explaining implementation-directed
    expect(admitted.length).toBe(1);
    expect(formatRuleRow(admitted[0])).toBe("S13.NOINFER — implementation-directed");
  });

  test("a positive witness for 'no prose mention was ingested' (L-156): report the denominator, " +
    "not just the zero", () => {
    // The candidate population this check actually examined: every backtick-quoted, rule-id-shaped
    // token anywhere in the raw document -- inside real table id cells AND inside prose. A check that
    // asserts "none leaked" without this number could be vacuously passing over an empty search.
    const raw = readFileSync(SPEC_PATH, "utf8");
    const candidates = raw.match(/`S\d+\.[A-Z][A-Z0-9-]*`/g) ?? [];
    const admittedCount = loadAllRows().length;

    // The denominator is the witness: candidates examined must be a real, non-trivial population...
    expect(candidates.length).toBeGreaterThan(0);
    // ...and strictly more than what was admitted, which is the proof the discriminator filtered
    // something real rather than every candidate happening to already be a legitimate row.
    expect(candidates.length).toBeGreaterThan(admittedCount);
    expect(admittedCount).toBe(100);
  });
});
