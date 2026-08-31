// CASE-FOR-CASE equivalence between the Shell ADR-family harness and its TS replacements
// (SPRINT-092 T2, DoD 1). D2 forbids "most": the two case lists are diffed AS LISTS, in BOTH
// directions, and any difference is a FAIL naming the case.
//
// WHY a guard and not a one-time audit. T2 removed `evals/run-adr-family-fixtures.sh` from the
// always-on eval leg on the strength of "every case it asserted has a TS equivalent." That sentence
// is true the day it is written and silently false the first time someone adds a case to the harness,
// or renames a TS test out from under it. A harness removed from the gate is a guard that stopped
// running; the claim that replaced it has to keep being checked, not merely have been checked once.
//
// HOW the shell side is read -- REWRITTEN after SPRINT-092's independent review found the first
// version broken. It anchored the match to the start of a line (`/^[ \t]*run_case_anywhere/`), which
// is invisible to any prefixed invocation -- and the `cmd && cmd` idiom is already used in this very
// harness. A real 13th case guarded by `[ -d "$fx/empty-slug" ] && run_case_anywhere "..."` executed
// on every run while this file certified case-for-case equivalence: exactly the silent false negative
// the guard exists to prevent, committed by the guard itself. Now:
//   * comment lines are dropped first (the harness's own header discusses `run_case_anywhere`, and a
//     corpus that documents its own format will otherwise be read as content -- L-108);
//   * the call is matched ANYWHERE on a surviving line, in either quote style;
//   * and any non-comment line that mentions the function but yields NO literal name is a FAIL, not a
//     skip. A `for`-loop or variable dispatch is not something this parser may quietly ignore: an
//     invocation form it cannot read is an unknown number of cases, which is the same as an unguarded
//     one. Loud beats clever.

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoFile = (rel: string): string => fileURLToPath(new URL(`../${rel}`, import.meta.url));

const HARNESS = "evals/run-adr-family-fixtures.sh";
const ALWAYS_ON_HARNESS = "evals/run-s4-ts-evaluators.sh";
const GATE = "scripts/qa-check.sh";

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

interface ShellCases {
  readonly names: readonly string[];
  /** Non-comment lines that invoke the function but expose no literal name -- never silently skipped. */
  readonly unreadable: readonly string[];
}

function shellCases(): ShellCases {
  const path = repoFile(HARNESS);
  if (!existsSync(path)) {
    throw new Error(
      `${HARNESS} not found -- this guard compares against it, and a missing harness must FAIL loudly rather than vacuously pass with an empty list`,
    );
  }
  const names: string[] = [];
  const unreadable: string[] = [];
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    if (/^[ \t]*#/.test(raw)) continue; // the harness documents its own format; prose is not a case
    if (!raw.includes("run_case_anywhere")) continue;
    const m = raw.match(/run_case_anywhere[ \t]+(?:"([^"]+)"|'([^']+)')/);
    const name = m?.[1] ?? m?.[2];
    if (name === undefined) unreadable.push(raw.trim());
    else names.push(name);
  }
  return { names, unreadable };
}

/** The `files="..."` block of the always-on §4 harness, as it really is on disk. */
function alwaysOnHarnessFiles(): string[] {
  const text = readFileSync(repoFile(ALWAYS_ON_HARNESS), "utf8");
  const block = text.match(/files="\n([\s\S]*?)\n"/);
  if (block?.[1] === undefined) {
    throw new Error(`${ALWAYS_ON_HARNESS}: could not locate its files=" ... " block -- the shape this guard reads has changed`);
  }
  return block[1].split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
}

function gateBucket(name: "eval_harnesses_always" | "eval_harnesses_optin"): string[] {
  const text = readFileSync(repoFile(GATE), "utf8");
  const m = text.match(new RegExp(`^${name}="([^"]*)"`, "m"));
  if (m?.[1] === undefined) throw new Error(`${GATE}: ${name} not found`);
  return m[1].split(/\s+/).filter((s) => s.length > 0);
}

describe("Shell ADR-family harness and its TS replacements, diffed as lists (DoD 1)", () => {
  test("the harness still declares cases at all -- an empty list would make every diff below vacuous", () => {
    // L-136: a comparison whose inputs are empty passes while examining nothing. The count is
    // asserted as a floor before any set arithmetic runs on it.
    expect(shellCases().names.length).toBeGreaterThanOrEqual(12);
  });

  test("every run_case_anywhere invocation is READABLE -- an unparseable form is a FAIL, never a skip", () => {
    // The hole the first version of this file had: a case the parser cannot see is a case with no
    // counterpart, reported as equivalence. Anything this parser cannot read must stop the gate.
    expect(shellCases().unreadable).toEqual([]);
  });

  test("no duplicate case names on the Shell side -- a duplicate would let a set comparison hide a gap", () => {
    const { names } = shellCases();
    expect(new Set(names).size).toBe(names.length);
  });

  test("case-name lists are IDENTICAL in both directions -- 'most' is a FAIL", () => {
    const shell = shellCases().names.slice().sort();
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

  // --- `alwaysOn` is a CLAIM ABOUT THE GATE, so it is checked against the gate ---------------------
  //
  // The first version compared `alwaysOn: true` only against a hardcoded list in this same file --
  // two copies of one assertion, agreeing by construction. SPRINT-092's review proved it: deleting
  // `test/s4-retained-fixtures.test.ts` from the always-on harness's own file list left BOTH guards
  // green while §4's fixture coverage had left the default profile, which is the exact property T2
  // re-ruled DoD 4 over. The claim now reads the two artifacts that decide it.

  test("every alwaysOn counterpart is really in the always-on harness's file list", () => {
    const declared = alwaysOnHarnessFiles();
    const orphans = Object.entries(COVERAGE)
      .filter(([, c]) => c.alwaysOn)
      .map(([n, c]) => ({ n, file: c.file }))
      .filter(({ file }) => !declared.includes(file))
      .map(({ n, file }) => `${n}: ${file} is marked alwaysOn but ${ALWAYS_ON_HARNESS} does not run it`);
    expect(orphans).toEqual([]);
  });

  test("the always-on harness is in eval_harnesses_always, and the oracle-spawning ones are not", () => {
    const always = gateBucket("eval_harnesses_always");
    const optin = gateBucket("eval_harnesses_optin");
    expect(always).toContain("run-s4-ts-evaluators.sh");
    expect(always).not.toContain("run-adr-family-fixtures.sh");
    expect(always).not.toContain("run-s4-differential-parity.sh");
    expect(optin).toContain("run-adr-family-fixtures.sh");
    expect(optin).toContain("run-s4-differential-parity.sh");
  });

  test("every non-alwaysOn counterpart is carried by the OPT-IN differential, not stranded", () => {
    const optinFiles = readFileSync(repoFile("evals/run-s4-differential-parity.sh"), "utf8");
    const stranded = Object.entries(COVERAGE)
      .filter(([, c]) => !c.alwaysOn)
      .filter(([, c]) => !optinFiles.includes(c.file))
      .map(([n, c]) => `${n}: ${c.file} is opt-in but no opt-in harness runs it`);
    expect(stranded).toEqual([]);
  });
});
