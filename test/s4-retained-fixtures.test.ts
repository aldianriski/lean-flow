// §4 evaluated against the NINE RETAINED fixture directories, TS-only (SPRINT-092 T2).
//
// WHY THIS EXISTS, and why it is not a copy of `adr-family-fixtures.test.ts`. The two files read the
// same real directories and answer DIFFERENT questions:
//
//   * that file asks "do TS and the live Shell oracle AGREE, row by row" -- a differential, which
//     costs a real `sh conformance-engine.sh` spawn per row and moves to the OPT-IN profile (T3).
//   * this file asks "do the TS evaluators produce the right verdict on a REAL directory tree" --
//     no oracle, no subprocess, so it stays ALWAYS-ON.
//
// The distinction is the whole of T2's owner ruling. Before this file, §4's only always-on coverage
// was `evals/run-adr-family-fixtures.sh`, which spawns the Shell engine 12 times and costs 23.4-28.2 s.
// Dropping that harness without this one would not have RELOCATED §4 coverage -- it would have
// deleted it from every default gate run, because `scripts/qa-check.sh` reduces its own spec to
// S9+S13 on a bare run (0 of §4's 7 rows survive) and never invokes `bun test`. Measured, not
// assumed: see the sprint log's T2 scope-change entry.
//
// The fixtures are RETAINED, read and never modified (TD-012). Rows are matched on the NAMED finding,
// never a bare verdict -- a rule that reddens for the wrong reason is a rule that is not working.

import { describe, expect, test } from "bun:test";
import type { RuleEvaluation } from "../packages/standard/src/result.ts";
import type { AdrFamilyPort } from "../packages/standard/src/rules/adr-family-port.ts";
import { RULE_ID as ONEFILE_ID, evaluate as evaluateOnefile } from "../packages/standard/src/rules/s4-onefile.ts";
import { RULE_ID as INDEX_ID, evaluate as evaluateIndex } from "../packages/standard/src/rules/s4-index.ts";
import { RULE_ID as SECTIONS_ID, evaluate as evaluateSections } from "../packages/standard/src/rules/s4-sections.ts";
import { RULE_ID as NEGATIVE_ID, evaluate as evaluateNegative } from "../packages/standard/src/rules/s4-negative.ts";
import { loadAdrFamilyFixture } from "./fixtures/adr-family-factory.ts";

interface Row {
  readonly fixture: string;
  readonly ruleId: string;
  readonly evaluate: (port: AdrFamilyPort) => RuleEvaluation;
  /** The offence the finding's own detail must name. `null` marks a PASS control. */
  readonly mustContain: string | null;
}

// Deliberately the same seven must-FAIL rows plus four PASS controls the Shell harness asserts --
// `test/adr-family-harness-parity.test.ts` diffs the two case lists mechanically, so this set cannot
// drift away from the harness it replaces without a FAIL naming the difference.
const ROWS: readonly Row[] = [
  { fixture: "path-noncanonical", ruleId: "S4.ONEFILE", evaluate: evaluateOnefile, mustContain: "docs/adr/adr-1-loose-name.md" },
  { fixture: "duplicate-number", ruleId: "S4.ONEFILE", evaluate: evaluateOnefile, mustContain: "ADR-001-the-same-number-again.md" },
  { fixture: "adr-outside-dir", ruleId: "S4.ONEFILE", evaluate: evaluateOnefile, mustContain: "docs/ADR-002-in-the-wrong-place.md" },
  { fixture: "index-absent", ruleId: "S4.INDEX", evaluate: evaluateIndex, mustContain: "no decision index found" },
  { fixture: "index-missing-row", ruleId: "S4.INDEX", evaluate: evaluateIndex, mustContain: "ADR-001-a-real-decision.md" },
  { fixture: "sections-missing", ruleId: "S4.SECTIONS", evaluate: evaluateSections, mustContain: "Alternatives" },
  { fixture: "no-negative", ruleId: "S4.NEGATIVE", evaluate: evaluateNegative, mustContain: "ADR-001-a-real-decision.md" },
  { fixture: "clean", ruleId: "S4.ONEFILE", evaluate: evaluateOnefile, mustContain: null },
  { fixture: "clean", ruleId: "S4.INDEX", evaluate: evaluateIndex, mustContain: null },
  { fixture: "clean", ruleId: "S4.SECTIONS", evaluate: evaluateSections, mustContain: null },
  { fixture: "clean", ruleId: "S4.NEGATIVE", evaluate: evaluateNegative, mustContain: null },
];

describe("§4 on the retained fixture trees — TS evaluators only, no oracle spawn (always-on)", () => {
  for (const row of ROWS) {
    const label = row.mustContain === null
      ? `${row.fixture}/${row.ruleId}: PASS, and stays silent`
      : `${row.fixture}/${row.ruleId}: FAIL, naming the offence`;
    test(label, () => {
      const ts = row.evaluate(loadAdrFamilyFixture(row.fixture));
      if (row.mustContain === null) {
        expect(ts.verdict).toBe("pass");
        expect(ts.findings).toEqual([]);
      } else {
        expect(ts.verdict).toBe("fail");
        expect(ts.findings.length).toBeGreaterThan(0);
        // One rule speaks with ONE finding name; a row that reddens under a second name is a
        // different defect wearing this row's label.
        expect(new Set(ts.findings.map((f) => f.name)).size).toBe(1);
        expect(JSON.stringify(ts.findings)).toContain(row.mustContain);
      }
    });
  }

  // L-142, at fixture level: each must-FAIL tree breaks exactly ONE rule, and its siblings on the
  // SAME tree stay green. A guard that reddened everything would satisfy every row above vacuously.
  test("sibling control: index-missing-row breaks ONLY S4.INDEX", () => {
    const port = loadAdrFamilyFixture("index-missing-row");
    expect(evaluateIndex(port).verdict).toBe("fail");
    expect(evaluateOnefile(port).verdict).toBe("pass");
    expect(evaluateSections(port).verdict).toBe("pass");
    expect(evaluateNegative(port).verdict).toBe("pass");
  });

  test("sibling control: sections-missing breaks ONLY S4.SECTIONS", () => {
    const port = loadAdrFamilyFixture("sections-missing");
    expect(evaluateSections(port).verdict).toBe("fail");
    expect(evaluateOnefile(port).verdict).toBe("pass");
    expect(evaluateIndex(port).verdict).toBe("pass");
    expect(evaluateNegative(port).verdict).toBe("pass");
  });

  test("sibling control: no-negative breaks ONLY S4.NEGATIVE", () => {
    const port = loadAdrFamilyFixture("no-negative");
    expect(evaluateNegative(port).verdict).toBe("fail");
    expect(evaluateOnefile(port).verdict).toBe("pass");
    expect(evaluateIndex(port).verdict).toBe("pass");
    expect(evaluateSections(port).verdict).toBe("pass");
  });

  // The ninth retained fixture. TS's side of the owner-ruled TS/Shell divergence -- asserted here as
  // TS's OWN behaviour, never as agreement, because the two deliberately disagree. The Shell half
  // stays in the opt-in differential where the oracle lives.
  test("empty-slug: S4.ONEFILE=fail; INDEX/SECTIONS/NEGATIVE=note, never re-admitting the rejected file", () => {
    const port = loadAdrFamilyFixture("empty-slug");
    const onefile = evaluateOnefile(port);
    expect(onefile.verdict).toBe("fail");
    expect(onefile.findings[0]?.detail).toContain("docs/adr/ADR-001-.md");
    expect(evaluateIndex(port).verdict).toBe("note");
    expect(evaluateSections(port).verdict).toBe("note");
    expect(evaluateNegative(port).verdict).toBe("note");
  });

  // `ruleId` was DECORATIVE until SPRINT-092's independent review: it fed the test label and nothing
  // else, so swapping a row's `evaluate` to a different rule left the label lying and every guard
  // green (proven — `evaluate: evaluateNegative` → `evaluateOnefile` gave 20 pass, 0 fail, with
  // S4.NEGATIVE's PASS control silently gone). Worse, `adr-family-harness-parity.test.ts` anchors on
  // that exact label text, so it was certifying a STRING, not that the named rule is exercised.
  // Binding the label to the evaluator's own exported RULE_ID is what makes the anchor mean something.
  test("every row's ruleId is the rule its evaluate() actually belongs to -- labels cannot drift", () => {
    const idOf = new Map<Row["evaluate"], string>([
      [evaluateOnefile, String(ONEFILE_ID)],
      [evaluateIndex, String(INDEX_ID)],
      [evaluateSections, String(SECTIONS_ID)],
      [evaluateNegative, String(NEGATIVE_ID)],
    ]);
    const mismatched = ROWS.filter((r) => idOf.get(r.evaluate) !== r.ruleId).map(
      (r) => `${r.fixture}/${r.ruleId} is wired to ${idOf.get(r.evaluate) ?? "an unregistered evaluator"}`,
    );
    expect(mismatched).toEqual([]);

    // Every §4 rule this suite claims to cover must appear on at least one row -- otherwise a rule
    // could be dropped from ROWS entirely and the mismatch check above would still pass vacuously.
    const covered = new Set(ROWS.map((r) => r.ruleId));
    expect([...covered].sort()).toEqual(
      [String(ONEFILE_ID), String(INDEX_ID), String(SECTIONS_ID), String(NEGATIVE_ID)].sort(),
    );
  });
});
