import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { makeRuleId } from "./model.ts";
import { tokenize } from "./tokenizer.ts";
import {
  allRules,
  formatRuleRow,
  formatSectionCount,
  marksInStandard,
  readAll,
  readSection,
  reconcile,
  rulesInSection,
  sectionNumberOfRuleId,
  sectionsOf,
  specNotFound,
  toStandardRule,
  type SpecReadResult,
} from "./spec-reader.ts";

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
    for (let i = 1; i < rows.length; i++) {
      const cur = rows[i];
      const prev = rows[i - 1];
      if (cur === undefined || prev === undefined) throw new Error(`missing row at ${i}`);
      expect(cur.loc.line).toBeGreaterThan(prev.loc.line);
    }
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

describe("marksInStandard — §14's own Marks legend table (SPRINT-087 T2)", () => {
  test("a synthetic §14 with the Marks table returns exactly its backticked mark names, in order", () => {
    const src = [
      "## §14 — Conformance model",
      "",
      "| Mark | Meaning | Is it work? |",
      "|---|---|---|",
      "| `mechanical` | a tool can decide it | a check either exists or is a gap |",
      "| `judgment-only` | not checkable | no |",
    ].join("\n");
    const doc = tokenize(src, "f.md");
    const result = marksInStandard(doc, "f.md");
    if (!result.ok) throw new Error(`expected success, got finding ${result.finding}: ${result.message}`);
    expect(result.marks).toEqual(["mechanical", "judgment-only"]);
  });

  // SPRINT-087 T2 revise (reviewer finding 1): an unrelated table, a table-less §14, and a §14 whose
  // Marks table itself has no valid rows must ALL be the SAME named `marks-table-unreadable` finding
  // -- never a silently returned `[]` a caller could read as "the Standard defines zero marks" instead
  // of "this reader found nothing". Mirrors `readSection`/`readAll`'s own refusal, immediately below.
  test("an unrelated table in §14 (e.g. the Levels table) is not mistaken for the Marks table -- named finding, not []", () => {
    const src = [
      "## §14 — Conformance model",
      "",
      "| Level | Evidence | Reads |",
      "|---|---|---|",
      "| **Structural** | the file tree | paths |",
    ].join("\n");
    const doc = tokenize(src, "f.md");
    const result = marksInStandard(doc, "f.md");
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("marks-table-unreadable");
    expect("marks" in result).toBe(false); // absence, not an empty list -- same D7 shape as SpecReadFail
  });

  test("no §14 at all -- named finding, not [] and not a thrown error", () => {
    const doc = tokenize("## §1 — Not §14\n\n| Rule |\n|---|\n| `S1.X` |", "f.md");
    const result = marksInStandard(doc, "f.md");
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("marks-table-unreadable");
  });

  test("§14 HAS the Marks table but every row is malformed (no backticked mark) -- still the named finding", () => {
    const src = [
      "## §14 — Conformance model",
      "",
      "| Mark | Meaning | Is it work? |",
      "|---|---|---|",
      "| mechanical (no backticks) | a tool can decide it | yes |",
    ].join("\n");
    const doc = tokenize(src, "f.md");
    const result = marksInStandard(doc, "f.md");
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("marks-table-unreadable");
  });

  // Against the REAL spec/STANDARD.md: an independent literal, hand-verified against §14's own
  // printed table (not recomputed the way `RULE_MARKS` in model.ts lists them -- tdd anti-tautology).
  test("the real Standard's §14 table names exactly these 6 marks, in this order", () => {
    const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
    const result = marksInStandard(doc, SPEC_PATH);
    if (!result.ok) throw new Error(`expected success, got finding ${result.finding}: ${result.message}`);
    expect(result.marks).toEqual([
      "mechanical",
      "judgment-only",
      "split",
      "implementation-directed",
      "restated",
      "standard-directed",
    ]);
  });
});

describe("toStandardRule — lifts a raw row into the H04 domain model", () => {
  test("a recognised level and mark round-trip", () => {
    const row = { id: "S13.TRAILERS", level: "Attested", mark: "mechanical", loc: { file: "f.md", line: 5 } };
    expect(toStandardRule(row, 13, "f.md")).toEqual({
      id: makeRuleId("S13.TRAILERS"),
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

// --- SPRINT-091 T3: sectionNumberOfRuleId -- recovers a whole-document row's section from its OWN id
describe("sectionNumberOfRuleId — the section digits embedded in a rule id's own text", () => {
  test("a plain single-digit section id", () => {
    expect(sectionNumberOfRuleId("S9.LOGDIR")).toBe(9);
  });

  test("a two-digit section id", () => {
    expect(sectionNumberOfRuleId("S12.SECRETS")).toBe(12);
  });

  test("a hyphenated id (21 of the 100 rules carry one) still resolves from the leading digits only", () => {
    expect(sectionNumberOfRuleId("S2.F-ARCHIVE")).toBe(2);
  });

  test("agrees with allRules()'s OWN section assignment for every one of the real spec's 100 rows", () => {
    // Cross-check (CLAUDE.md's "a query whose result you act on gets a second query that must
    // agree"): rederiving each row's section from its id text must match sectionsOf()'s own window
    // assignment for every real row, not just the three hand-picked cases above.
    const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
    let checked = 0;
    for (const section of sectionsOf(doc)) {
      if (section.number <= 0) continue;
      for (const row of rulesInSection(doc, section.number)) {
        expect(sectionNumberOfRuleId(row.id)).toBe(section.number);
        checked++;
      }
    }
    expect(checked).toBe(100); // the same published denominator allRules() itself is checked against
  });

  test("a non-rule-id string throws rather than silently returning NaN or 0", () => {
    expect(() => sectionNumberOfRuleId("not-a-rule-id")).toThrow();
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
      const cur = rows[i];
      const prev = rows[i - 1];
      if (cur === undefined || prev === undefined) throw new Error(`missing row at ${i}`);
      expect(cur.loc.line).toBeGreaterThan(prev.loc.line);
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
    const onlyAdmitted = admitted[0];
    if (onlyAdmitted === undefined) throw new Error("expected exactly one admitted row");
    expect(formatRuleRow(onlyAdmitted)).toBe("S13.NOINFER — implementation-directed");
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

// SPRINT-085 T3 -- error semantics parity. Rows were the easy half: `read-spec-rules.sh`'s own header
// names the failure this reader refuses to have -- returning nothing and exiting clean (L-058). For
// each of the four retained malformed cases, TS must agree with Shell on the NAMED FINDING and the
// EXIT MEANING, not merely on rows.
//
// Every fixture's input is built the SAME WAY `evals/run-spec-reader-fixtures.sh` builds its own --
// read from there, never re-typed from memory -- and the shell reader is run FRESH via
// `execFileSync` as an independent oracle (same pattern as `loadShellRows` above), so the comparison
// is real rather than approximate. `readFileSync`/`writeFileSync`/`execFileSync` stay in this
// `*.test.ts` file only, matching T2's pattern -- the architecture test exempts colocated test files
// but not `spec-reader.ts` itself (domain, no filesystem).

/** Runs the real `read-spec-rules.sh`, fresh, and reports its exit code + stderr -- never a literal. */
function runShellReader(args: readonly string[]): { readonly code: number; readonly stdout: string; readonly stderr: string } {
  try {
    const stdout = execFileSync("sh", [SHELL_READER_PATH, ...args], { encoding: "utf8" });
    return { code: 0, stdout, stderr: "" };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" };
  }
}

/** A fresh temp dir per call -- fixtures never share a file, so one test's write can't leak into another's read. */
function freshTmpFile(name: string): string {
  return join(mkdtempSync(join(tmpdir(), "sr3-")), name);
}

/**
 * Mirrors `evals/run-spec-reader-fixtures.sh` case 5's `awk` transform exactly: strip every §13 table
 * row (`| \`S13.*\` | ...`) from inside §13's own window, leaving §14's published count (7) untouched
 * -- so the emitted rows and the expected count disagree, which is the case this fixture exists to
 * produce.
 */
function stripSection13Rows(specText: string): string {
  const lines = specText.split(/\r\n|\r|\n/);
  let inS13 = false;
  const out: string[] = [];
  for (const line of lines) {
    if (/^## §13 /.test(line)) inS13 = true;
    if (/^## §14 /.test(line)) inS13 = false;
    if (inS13 && /^\| *`S13\./.test(line)) continue;
    out.push(line);
  }
  return out.join("\n");
}

/**
 * A thin stand-in for the adapter Sprint C's H07 will ship: attempts the read, and on failure maps it
 * to the domain's OWN `spec-not-found` constructor rather than inventing a second finding shape here.
 * `spec-reader.ts` itself never calls `readFileSync` -- only this test file does (T2's pattern).
 * Callers of this helper always pass a path known not to exist -- it is not a general-purpose loader.
 */
function attemptReadMissingSpec(path: string): SpecReadResult {
  try {
    readFileSync(path, "utf8");
  } catch {
    return specNotFound(path);
  }
  throw new Error(`test setup error: ${path} unexpectedly exists`);
}

describe("readAll / readSection -- error semantics parity with read-spec-rules.sh (SPRINT-085 T3)", () => {
  test("spec-table-unreadable-whole: no Conformance tables anywhere -- named finding, non-zero exit, both sides", () => {
    // Built exactly as case 4's `printf '# not a standard\n\nNo conformance tables here.\n'`.
    const content = "# not a standard\n\nNo conformance tables here.\n";

    const doc = tokenize(content, "empty-spec.md");
    const tsResult = readAll(doc, "empty-spec.md");
    if (tsResult.ok) throw new Error("expected a failure result");
    expect(tsResult.finding).toBe("spec-table-unreadable");

    const path = freshTmpFile("empty-spec.md");
    writeFileSync(path, content);
    const shell = runShellReader([path]);
    expect(shell.code).not.toBe(0);
    expect(shell.stderr).toContain("spec-table-unreadable");
  });

  test("spec-table-unreadable-section: §13's rows stripped from the real spec, §14 still says 7 -- named finding, non-zero exit, both sides", () => {
    const realSpec = readFileSync(SPEC_PATH, "utf8");
    const stripped = stripSection13Rows(realSpec);
    // Harness guard mirroring case 5's own: the strip must actually remove §13's rows, or this case
    // is not testing what it claims.
    const nLeft = (stripped.match(/^\| *`S13\./gm) ?? []).length;
    expect(nLeft).toBe(0);

    const doc = tokenize(stripped, "spec-no-s13.md");
    const tsResult = readSection(doc, 13, "spec-no-s13.md");
    if (tsResult.ok) throw new Error("expected a failure result");
    expect(tsResult.finding).toBe("spec-table-unreadable");

    const path = freshTmpFile("spec-no-s13.md");
    writeFileSync(path, stripped);
    const shell = runShellReader([path, "--section", "13"]);
    expect(shell.code).not.toBe(0);
    expect(shell.stderr).toContain("spec-table-unreadable");
  });

  test("spec-not-found: a path that does not exist -- named finding, non-zero exit, NOT an empty rule set, both sides", () => {
    const missing = freshTmpFile("no-such-spec.md"); // directory created, file never written

    const tsResult = attemptReadMissingSpec(missing);
    if (tsResult.ok) throw new Error("expected a failure result");
    expect(tsResult.finding).toBe("spec-not-found");
    // Absence is not emptiness: the failure variant carries no `rows` field to mistake for `[]` --
    // asserted at the type level too (`SpecReadFail` in spec-reader.ts has no `rows` member).
    expect("rows" in tsResult).toBe(false);

    const shell = runShellReader([missing]);
    expect(shell.code).not.toBe(0);
    expect(shell.stderr).toContain("spec-not-found");
  });

  test("zero-rule-section-is-not-a-finding: §8 exits 0 silently -- §14 publishes 0 for it, both sides", () => {
    const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
    const tsResult = readSection(doc, 8, SPEC_PATH);
    if (!tsResult.ok) throw new Error(`expected success, got finding ${tsResult.finding}: ${tsResult.message}`);
    expect(tsResult.rows).toEqual([]); // legitimately empty, not absent -- no finding, no throw

    const shell = runShellReader([SPEC_PATH, "--section", "8"]);
    expect(shell.code).toBe(0);
    expect(shell.stdout).toBe("");
    expect(shell.stderr).toBe("");
  });
});

// SPRINT-085 T4 -- `--reconcile` mode parity. Migrating a MODE the shell reader already owns, not
// adding a capability: TS must reproduce the per-section count table AND the mismatch FAIL, agreeing
// with Shell on all three retained reconcile fixtures (`evals/run-spec-reader-fixtures.sh` cases 1, 6,
// 7). The shell reader is spawned FRESH via `execFileSync` as an independent oracle in every case
// below -- never a copied-in expected literal (hard constraint 3) -- and every fixture's input is
// built the SAME transform `evals/run-spec-reader-fixtures.sh` uses (hard constraint: hard-coded
// literals are a T3-style anti-pattern this file already avoids).

/** Parses a `PASS  §N  M rules` line from `--reconcile`'s own stdout -- the independent oracle's shape. */
function parseShellReconcileTable(stdout: string): ReadonlyMap<number, number> {
  const counts = new Map<number, number>();
  for (const line of stdout.split("\n")) {
    const m = /^PASS\s+§(\d+)\s+(\d+) rules$/.exec(line.trim());
    if (m) counts.set(Number(m[1]), Number(m[2]));
  }
  return counts;
}

/**
 * Mirrors `evals/run-spec-reader-fixtures.sh` case 6's `awk` transform exactly: drops the FIRST row
 * whose id cell matches `idLiteral` (e.g. `` `S2.F-CAP` ``), leaving §14's published count untouched --
 * so the emitted rows and the expected count disagree for that section.
 */
function stripFirstRow(specText: string, idLiteral: string): string {
  const anchor = new RegExp(`^\\| *\`${idLiteral}\` *\\|`);
  const lines = specText.split(/\r\n|\r|\n/);
  let dropped = false;
  const out: string[] = [];
  for (const line of lines) {
    if (!dropped && anchor.test(line)) {
      dropped = true;
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

/** Mirrors case 7's `awk '!/^[|] *classified *[|]/'` -- drops §14's own `classified` counts row. */
function stripClassifiedRow(specText: string): string {
  return specText
    .split(/\r\n|\r|\n/)
    .filter((line) => !/^\| *classified *\|/.test(line))
    .join("\n");
}

describe("reconcile -- `--reconcile` mode parity with read-spec-rules.sh (SPRINT-085 T4)", () => {
  test("reconciles-with-section-14: the real Standard's per-section table matches Shell's, both ok, both §1..§13", () => {
    const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
    const tsResult = reconcile(doc, SPEC_PATH);
    if (!tsResult.ok) throw new Error(`expected success, got finding ${tsResult.finding}: ${tsResult.message}`);
    expect(tsResult.sections).toBeDefined();

    const shell = runShellReader([SPEC_PATH, "--reconcile"]);
    expect(shell.code).toBe(0);
    expect(shell.stdout).toContain("reconciled");

    const shellTable = parseShellReconcileTable(shell.stdout);
    expect(shellTable.size).toBe(13); // the oracle actually printed a per-section table, not an empty one

    for (const row of tsResult.sections!) {
      // A missing key is a real failure of this comparison, not something to paper over with a
      // default -- so it throws by name rather than silently comparing against undefined.
      const shellCount = shellTable.get(row.section);
      if (shellCount === undefined) throw new Error(`shell table has no §${row.section}`);
      expect(row.got).toBe(shellCount);
      expect(formatSectionCount(row)).toBe(`§${row.section} ${shellCount} rules`);
    }

    // The total, read two independent ways: TS's own row count, and the sum of TS's per-section table.
    expect(tsResult.rows.length).toBe(100);
    expect(tsResult.sections!.reduce((sum, r) => sum + r.got, 0)).toBe(100);
  });

  test("section-rows-mismatch: §2 short one row of its published count -- named finding, non-ok, both sides", () => {
    const realSpec = readFileSync(SPEC_PATH, "utf8");
    const short = stripFirstRow(realSpec, "S2\\.F-CAP");
    // Harness guard: the strip must actually remove the ROW (id as its own table cell), by the SAME
    // anchored pattern the reader itself matches against -- not a bare substring, which would also
    // match §7's `S7.MEGA` row and §2's own prose, both of which legitimately still mention the id.
    expect(/^\| *`S2\.F-CAP` *\|/m.test(short)).toBe(false);

    const doc = tokenize(short, "spec-short-s2.md");
    const tsResult = reconcile(doc, "spec-short-s2.md");
    if (tsResult.ok) throw new Error("expected a failure result");
    expect(tsResult.finding).toBe("section-rows-mismatch");
    expect("rows" in tsResult).toBe(false); // absence, not an empty/short table -- same D7 line as T3

    const path = freshTmpFile("spec-short-s2.md");
    writeFileSync(path, short);
    const shell = runShellReader([path, "--reconcile"]);
    expect(shell.code).not.toBe(0);
    expect(shell.stderr + shell.stdout).toContain("section-rows-mismatch");
  });

  test("two mismatching sections are BOTH surfaced, not just the lowest-numbered one (SPRINT-087 T7)", () => {
    // A single stripped row proves nothing here -- the pre-T7 shape (one `SpecReadFail` with no
    // `mismatches` field) also reports `finding: "section-rows-mismatch"` for exactly one bad section,
    // so it would pass a one-mismatch fixture by construction. This fixture strips a row out of TWO
    // different sections (§1 and §2) so only a widened, multi-finding shape can report both.
    const realSpec = readFileSync(SPEC_PATH, "utf8");
    const short = stripFirstRow(stripFirstRow(realSpec, "S2\\.F-CAP"), "S1\\.LAW1");
    expect(/^\| *`S2\.F-CAP` *\|/m.test(short)).toBe(false);
    expect(/^\| *`S1\.LAW1` *\|/m.test(short)).toBe(false);

    const doc = tokenize(short, "spec-short-s1-s2.md");
    const tsResult = reconcile(doc, "spec-short-s1-s2.md");
    if (tsResult.ok) throw new Error("expected a failure result");
    // ADR-034 D3: the Finding ID and verdict surface is frozen -- widening HOW MANY mismatches are
    // carried must not change WHAT the single finding is called, or that this run is non-ok.
    expect(tsResult.finding).toBe("section-rows-mismatch");

    expect(tsResult.mismatches).toBeDefined();
    const bySection = new Map(tsResult.mismatches!.map((m) => [m.section, m]));
    // Count AND membership, not merely "some finding exists" -- both sections, not only §1 (the
    // lowest-numbered, which is all the pre-T7 shape could ever report).
    expect([...bySection.keys()].sort((a, b) => a - b)).toEqual([1, 2]);
    expect(bySection.get(1)).toEqual({ section: 1, got: bySection.get(1)!.expected - 1, expected: bySection.get(1)!.expected });
    expect(bySection.get(2)).toEqual({ section: 2, got: bySection.get(2)!.expected - 1, expected: bySection.get(2)!.expected });

    // Independent oracle, spawned fresh, never a copied literal: Shell prints one `FAIL §N
    // section-rows-mismatch` line PER disagreeing section (line-oriented report) -- both must appear,
    // matching the TS `mismatches` set's membership exactly.
    const path = freshTmpFile("spec-short-s1-s2.md");
    writeFileSync(path, short);
    const shell = runShellReader([path, "--reconcile"]);
    expect(shell.code).not.toBe(0);
    const shellOut = shell.stderr + shell.stdout;
    expect(shellOut).toMatch(/FAIL\s+§1\s+section-rows-mismatch/);
    expect(shellOut).toMatch(/FAIL\s+§2\s+section-rows-mismatch/);
  });

  test("spec-counts-unreadable: §14's `classified` row is gone -- named finding, non-ok, both sides", () => {
    const realSpec = readFileSync(SPEC_PATH, "utf8");
    const noCounts = stripClassifiedRow(realSpec);
    expect(noCounts).not.toContain("| classified |");

    const doc = tokenize(noCounts, "spec-no-counts.md");
    const tsResult = reconcile(doc, "spec-no-counts.md");
    if (tsResult.ok) throw new Error("expected a failure result");
    expect(tsResult.finding).toBe("spec-counts-unreadable");

    const path = freshTmpFile("spec-no-counts.md");
    writeFileSync(path, noCounts);
    const shell = runShellReader([path, "--reconcile"]);
    expect(shell.code).not.toBe(0);
    expect(shell.stderr).toContain("spec-counts-unreadable");
  });

  test("a section legitimately at 0 (§8) reconciles as a PASS row, not a mismatch", () => {
    const doc = tokenize(readFileSync(SPEC_PATH, "utf8"), SPEC_PATH);
    const tsResult = reconcile(doc, SPEC_PATH);
    if (!tsResult.ok) throw new Error(`expected success, got finding ${tsResult.finding}`);
    const s8 = tsResult.sections!.find((r) => r.section === 8);
    expect(s8).toEqual({ section: 8, got: 0, expected: 0 });
  });
});

// --- SPRINT-087 T7 Tier G seed evidence -------------------------------------------------------------
//
// Base commit efe5147. Pristine `spec-reader.ts` (T7's starting point, HEAD):
//   sha256 202d1ec6f41ce648a304319f164b08905957a3de65dd0d8aff3b03c5d8fa2cec
//   (git show efe5147:packages/standard/src/spec-reader.ts | sha256sum)
// Fixed `spec-reader.ts` (this task's change, widened `reconcile`/`SpecReadFail.mismatches`):
//   sha256 fb89f70f8fea0519b466a55752d8b3d60874bf98dc728de94ebe6ad070eca497
//
// Seed: reverted `reconcile`'s body to the pre-T7 single-finding shape (SPRINT-085 T4's original --
// capture the FIRST mismatching section only, drop the `mismatches` field from the returned
// `SpecReadFail` entirely). 437 -> 434 lines (within the L-142 one-line band; not a demolition).
// `cmp` confirmed the seed landed and differed from the fixed file at byte 18307 / line 392.
//
// Result: `bun test packages/standard/src/spec-reader.test.ts` --
//   31 pass / 1 fail (208 expect() calls). The ONE case that reddened was this file's new
//   "two mismatching sections are BOTH surfaced, not just the lowest-numbered one (SPRINT-087 T7)"
//   test, failing exactly where expected -- `expect(tsResult.mismatches).toBeDefined()` received
//   `undefined` -- because the seeded revert never sets that field. Every sibling reconcile test
//   stayed green, in particular the named control "section-rows-mismatch: §2 short one row of its
//   published count -- named finding, non-ok, both sides" (SPRINT-085 T4's original one-mismatch
//   fixture), which the pre-T7 shape already satisfied and continues to satisfy unchanged.
//
// Restored the fixed file from a backup copy taken before seeding; `sha256sum` on the restored file
// matched the fixed hash above exactly (fb89f70f...), confirming the seed did not leak. Re-ran
// `bun test packages/standard` after restoring: 99 pass / 0 fail (one earlier run of the full 10-file
// suite timed out this new test at the 5s default under concurrent subprocess load spawning
// `sh read-spec-rules.sh`; a second immediate re-run, and every isolated run of this file alone,
// passed clean -- read as environment contention across parallel test files, not a defect in the
// widened `reconcile`, since the isolated file consistently completes in ~7-11s).
