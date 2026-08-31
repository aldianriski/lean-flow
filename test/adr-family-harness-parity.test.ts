// CASE-FOR-CASE equivalence between the Shell ADR-family harness and its TS replacements
// (SPRINT-092 T2, DoD 1). D2 forbids "most": the two case lists are diffed AS LISTS, in BOTH
// directions, and any difference is a FAIL naming the case.
//
// WHY a guard and not a one-time audit. T2 removes `evals/run-adr-family-fixtures.sh` from the
// always-on eval leg on the strength of "every case it asserted has a TS equivalent." That sentence
// is true the day it is written and silently false the first time someone adds a 13th case to the
// harness, or renames a TS test out from under it. A harness removed from the gate is a guard that
// stopped running; the claim that replaced it has to keep being checked, not merely have been
// checked once.
//
// HOW the shell side is read: case names are parsed from the harness's own `run_case_anywhere`
// call sites, ANCHORED to the start of a line (L-108 -- this repo's corpus is self-describing, and
// an unanchored match eventually reads prose ABOUT a case as a case; the harness's own
// `FAIL fixture(...)` fallback string names a case and must not be counted twice).
//
// HOW the TS side is read: each mapping names a FILE and an ANCHOR -- a literal fragment of that
// file's real source. A mapping pointing at a test that was renamed or deleted therefore FAILs here,
// rather than standing as a claim about a test that no longer exists. That is the difference between
// a coverage map and a coverage assertion.

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoFile = (rel: string): string => fileURLToPath(new URL(`../${rel}`, import.meta.url));

const HARNESS = "evals/run-adr-family-fixtures.sh";

interface Coverage {
  /** Repo-relative TS file asserting this case's behaviour. */
  readonly file: string;
  /** Verbatim source fragment that must exist in `file` -- proves the counterpart is really there. */
  readonly anchor: string;
  /** Does the covering test run on a BARE gate run, or only under the opt-in profile? */
  readonly alwaysOn: boolean;
}

// One entry per Shell case. Cases 1-8 read the tree; their always-on counterpart is the oracle-free
// retained-fixture suite T2 added. Cases 9-12 build real git repositories, and their counterpart
// spawns the oracle, so they sit in the opt-in differential -- recorded here explicitly rather than
// blurred, because DoD 4 turns on exactly which coverage stayed always-on.
const COVERAGE: Readonly<Record<string, Coverage>> = {
  "path-noncanonical-fires": { file: "test/s4-retained-fixtures.test.ts", anchor: 'fixture: "path-noncanonical", ruleId: "S4.ONEFILE"', alwaysOn: true },
  "index-missing-adr-fires": { file: "test/s4-retained-fixtures.test.ts", anchor: 'fixture: "index-missing-row", ruleId: "S4.INDEX"', alwaysOn: true },
  "required-section-missing-fires": { file: "test/s4-retained-fixtures.test.ts", anchor: 'fixture: "sections-missing", ruleId: "S4.SECTIONS"', alwaysOn: true },
  "no-negative-consequence-fires": { file: "test/s4-retained-fixtures.test.ts", anchor: 'fixture: "no-negative", ruleId: "S4.NEGATIVE"', alwaysOn: true },
  "duplicate-number-fires": { file: "test/s4-retained-fixtures.test.ts", anchor: 'fixture: "duplicate-number", ruleId: "S4.ONEFILE"', alwaysOn: true },
  "adr-outside-dir-fires": { file: "test/s4-retained-fixtures.test.ts", anchor: 'fixture: "adr-outside-dir", ruleId: "S4.ONEFILE"', alwaysOn: true },
  "index-absent-fires": { file: "test/s4-retained-fixtures.test.ts", anchor: 'fixture: "index-absent", ruleId: "S4.INDEX"', alwaysOn: true },
  "clean-repo-passes": { file: "test/s4-retained-fixtures.test.ts", anchor: 'fixture: "clean", ruleId: "S4.ONEFILE"', alwaysOn: true },
  "edited-after-decision-fires": { file: "packages/standard/src/rules/s4-append-oracle.test.ts", anchor: "rewritten after the deciding commit", alwaysOn: false },
  "post-decision-marker-passes": { file: "packages/standard/src/rules/s4-append-oracle.test.ts", anchor: "PASS control: a post-decision MARKER", alwaysOn: false },
  "no-git-history-is-reported-not-guessed": { file: "packages/standard/src/rules/s4-append-oracle.test.ts", anchor: "NOTE: no git history at all", alwaysOn: false },
  "shallow-clone-is-reported-not-guessed": { file: "packages/standard/src/rules/s4-append-oracle.test.ts", anchor: "NOTE: a SHALLOW clone", alwaysOn: false },
};

/** Case names as the harness itself declares them, anchored to a call site at line start. */
function shellCaseNames(): string[] {
  const path = repoFile(HARNESS);
  if (!existsSync(path)) {
    throw new Error(
      `${HARNESS} not found -- this guard compares against it, and a missing harness must FAIL loudly rather than vacuously pass with an empty list`,
    );
  }
  const text = readFileSync(path, "utf8");
  const names: string[] = [];
  for (const m of text.matchAll(/^[ \t]*run_case_anywhere[ \t]+"([^"]+)"/gm)) {
    if (m[1] !== undefined) names.push(m[1]);
  }
  return names;
}

describe("Shell ADR-family harness and its TS replacements, diffed as lists (DoD 1)", () => {
  test("the harness still declares cases at all -- an empty list would make every diff below vacuous", () => {
    // L-136: a comparison whose inputs are empty passes while examining nothing. The count is
    // asserted as a floor before any set arithmetic runs on it.
    expect(shellCaseNames().length).toBeGreaterThanOrEqual(12);
  });

  test("no duplicate case names on the Shell side -- a duplicate would let a set comparison hide a gap", () => {
    const names = shellCaseNames();
    expect(new Set(names).size).toBe(names.length);
  });

  test("case-name lists are IDENTICAL in both directions -- 'most' is a FAIL", () => {
    const shell = shellCaseNames().slice().sort();
    const covered = Object.keys(COVERAGE).slice().sort();

    // Reported as sorted LISTS, so a failure prints exactly which case is on which side rather than
    // a bare count mismatch the reader then has to reconstruct.
    expect(covered).toEqual(shell);

    const uncovered = shell.filter((c) => !(c in COVERAGE));
    const orphaned = covered.filter((c) => !shell.includes(c));
    expect({ uncovered, orphaned }).toEqual({ uncovered: [], orphaned: [] });
  });

  test("every mapped counterpart actually exists in the file it names", () => {
    const missing: string[] = [];
    for (const [caseName, cov] of Object.entries(COVERAGE)) {
      const path = repoFile(cov.file);
      if (!existsSync(path)) {
        missing.push(`${caseName}: file ${cov.file} does not exist`);
        continue;
      }
      if (!readFileSync(path, "utf8").includes(cov.anchor)) {
        missing.push(`${caseName}: ${cov.file} no longer contains its anchor ${JSON.stringify(cov.anchor)}`);
      }
    }
    expect(missing).toEqual([]);
  });

  // DoD 4's record, made mechanical. The sprint's § Decisions states which coverage stayed
  // always-on; this pins that statement to the artifact so the two cannot drift apart silently.
  test("the always-on subset is exactly the eight tree-reading cases -- the four git cases are opt-in, by record", () => {
    const alwaysOn = Object.entries(COVERAGE)
      .filter(([, c]) => c.alwaysOn)
      .map(([n]) => n)
      .sort();
    expect(alwaysOn).toEqual([
      "adr-outside-dir-fires",
      "clean-repo-passes",
      "duplicate-number-fires",
      "index-absent-fires",
      "index-missing-adr-fires",
      "no-negative-consequence-fires",
      "path-noncanonical-fires",
      "required-section-missing-fires",
    ]);
  });
});
