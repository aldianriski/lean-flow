// evals/layers-completeness.test.ts -- SPRINT-103: the always-on TS-evaluator suite for
// scripts/lib/check-layers-completeness.ts, run via `bun test` by evals/run-layers-completeness-
// fixtures.sh. Mirrors run-s4-ts-evaluators.sh's role for §4 and evals/dod-delta.test.ts's role for
// check-dod-delta.ts: the shell oracle (scripts/lib/check-layers-completeness.sh) stays authoritative
// and is checked against separately by evals/layers-completeness-differential.ts (opt-in, not run on
// every gate); THIS file is what runs on every default gate, fork-free, calling the TS port in-process.
//
// Every must-FAIL fixture, sibling control, and population-selection case from the harness this file
// replaces is retained (TD-012: don't delete fixtures with the prototype that built them) -- see each
// describe block's own comment for the finding it is named after.
//
// FIX FOLDED IN (independent analysis, same file): the shell harness this replaces invoked its own
// checker 16 times for only 10 distinct argument sets -- dir-token-prefix.md 2x, the substring fixture
// 4x, the archive-selection pair 3x. Every describe block below calls runLayersCompleteness() ONCE per
// distinct argument set (in a `beforeAll`) and every `test()` asserts against that ONE captured
// {exitCode, output} -- never a second invocation of the same input.
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { posix } from "node:path";
import { runLayersCompleteness } from "../scripts/lib/check-layers-completeness.ts";
import {
  buildArchiveSelectionPair,
  buildCaseVariantFixture,
  buildSubstringFixture,
} from "./fixtures/layers-completeness/synthetic.ts";

const FIXTURES = posix.join(import.meta.dir, "fixtures/layers-completeness");

interface Captured {
  exitCode: number;
  output: string;
}

function capture(args: readonly string[]): Captured {
  const result = runLayersCompleteness(args);
  return { exitCode: result.fail ? 1 : 0, output: result.lines.join("\n") };
}

// --- case 0: bare invocation -- must-note, exit 0 (TD-056, SPRINT-069 T4) -----------------------
describe("bare invocation", () => {
  let r: Captured;
  beforeAll(() => {
    r = capture([]);
  });
  test("exits 0 and notes nothing was verified", () => {
    expect(r.exitCode).toBe(0);
    expect(r.output).toContain("layers completeness: no sprint files given -- nothing verified");
  });
});

// --- case 1: SPRINT-041 reconstructed -- TD marked resolved implies TECH-DEBT.md, undeclared -----
describe("sprint-041-reconstructed (retained must-FAIL fixture)", () => {
  let r: Captured;
  beforeAll(() => {
    r = capture([posix.join(FIXTURES, "sprint-041-reconstructed.md")]);
  });
  test("FAILs naming TECH-DEBT.md as implied-but-undeclared", () => {
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain(
      "Layers completeness: DoD/Acceptance implies TECH-DEBT.md(TD-marked-resolved), absent from Layers: -- if the prose only cites it rather than touching it, declare it on a Cites: line",
    );
  });
});

// --- case 2: Depends-on omission (constructed) ----------------------------------------------------
describe("depends-on-omitted (retained must-FAIL fixture)", () => {
  let r: Captured;
  beforeAll(() => {
    r = capture([posix.join(FIXTURES, "depends-on-omitted.md")]);
  });
  test("FAILs naming T1 as prose-referenced but absent from Depends-on:", () => {
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain(
      "Depends-on completeness: DoD/Acceptance references T1, absent from Depends-on: -- if the prose only cites that task rather than depending on it, declare it on a Cites: line",
    );
  });
});

// --- cases 3-5: the Cites: escape and the wrapped-declaration rule (SPRINT-049 T3) ----------------
describe("sprint-048-citations (must-PASS -- the escape's own regression guard)", () => {
  let r: Captured;
  beforeAll(() => {
    r = capture([posix.join(FIXTURES, "sprint-048-citations.md")]);
  });
  test("stays a clean PASS -- real SPRINT-048 false positives, now escaped via Cites:", () => {
    expect(r.exitCode).toBe(0);
    expect(r.output).toContain("Layers completeness (DoD-implied files all declared)");
  });
});

describe("cites-contradiction (retained must-FAIL fixture)", () => {
  let r: Captured;
  beforeAll(() => {
    r = capture([posix.join(FIXTURES, "cites-contradiction.md")]);
  });
  test("FAILs on a token both declared as touched and escaped as cited", () => {
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain(
      "Cites/Layers contradiction: docs/QA.md declared as touched AND escaped as merely cited",
    );
  });
});

describe("unindented-continuation (retained must-FAIL fixture)", () => {
  let r: Captured;
  beforeAll(() => {
    r = capture([posix.join(FIXTURES, "unindented-continuation.md")]);
  });
  test("FAILs on a wrapped declaration line left at column 0", () => {
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain(
      "declaration continuation: a wrapped Layers line must be indented",
    );
  });
});

// --- case 6: directory tokens are a PREFIX, not a wildcard (SPRINT-055 T1) -----------------------
// ONE capture, TWO assertions -- this file is exercised 2x by the harness it replaces; captured once.
describe("dir-token-prefix (T1 covered-by-directory PASS + T2 outside-directory FAIL, one capture)", () => {
  let r: Captured;
  beforeAll(() => {
    r = capture([posix.join(FIXTURES, "dir-token-prefix.md")]);
  });
  test("T1's implied paths sit under the declared directory tree -- PASS", () => {
    expect(r.output).toContain("### T1 Layers completeness (DoD-implied files all declared)");
  });
  test("T2's implied path sits OUTSIDE the declared tree -- FAIL, named", () => {
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain(
      "### T2 Layers completeness: DoD/Acceptance implies scripts/lib/check-count-claims.sh, absent from Layers:",
    );
  });
});

// --- cases 7-9: SPRINT-097 T3 (TD-142) -- the substring-vs-backtick-delimited fix ------------------
// ONE capture, FOUR assertions -- this fixture is exercised 4x by the harness it replaces (three
// run_case_anywhere calls plus a separate sibling-control capture); captured exactly once here.
describe("substring-declaration-not-declared (TD-142 silent-direction fix + sibling control, one capture)", () => {
  let r: Captured;
  let workDir: string;
  beforeAll(() => {
    workDir = mkdtempSync(posix.join(tmpdir(), "lc-test-"));
    const fx = buildSubstringFixture(workDir);
    r = capture([fx]);
  });
  afterAll(() => rmSync(workDir, { recursive: true, force: true }));
  test("T1: a token inside a longer declared path still FAILs (no substring match)", () => {
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain("### T1 Layers completeness: DoD/Acceptance implies config.sh, absent from Layers:");
  });
  test("T2: a token inside a trailing unbackticked comment still FAILs", () => {
    expect(r.output).toContain("### T2 Layers completeness: DoD/Acceptance implies config.sh, absent from Layers:");
  });
  test("T2: the unbackticked comment ALSO gets its own named layers-unbackticked-token finding", () => {
    expect(r.output).toContain(
      "### T2 layers-unbackticked-token: declares a path-shaped token outside backticks (config.sh)",
    );
  });
  test("T3 sibling control: an ordinary, correct declaration stays a clean PASS, never named in a FAIL line", () => {
    const failLines = r.output.split("\n").filter((l) => l.startsWith("FAIL"));
    expect(failLines.some((l) => l.includes("### T3"))).toBe(false);
    expect(r.output).toContain("### T3 Layers completeness (DoD-implied files all declared)");
  });
});

// --- case 9: SELECTION, not verdict (L-186) -- archive/ path segment exclusion -------------------
// ONE capture, TWO assertions -- this pair is exercised 3x by the harness it replaces (run_case_
// anywhere plus two separate re-captures of the identical args); captured exactly once here.
describe("archive-path-excluded pair (L-186 selection fixture + live sibling control, one capture)", () => {
  let r: Captured;
  let workDir: string;
  beforeAll(() => {
    workDir = mkdtempSync(posix.join(tmpdir(), "lc-test-"));
    const { archived, live } = buildArchiveSelectionPair(workDir);
    r = capture([archived, live]);
  });
  afterAll(() => rmSync(workDir, { recursive: true, force: true }));
  test("the live sibling FAILs by name in the same run", () => {
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain("Layers completeness: DoD/Acceptance implies bar.txt, absent from Layers:");
  });
  test("the archived Plan (real violation, direct path argument) is never evaluated at all", () => {
    expect(r.output).not.toContain("SPRINT-999");
    expect(r.output).not.toContain("archived-should-be-skipped");
  });
});

// --- case 10: SELECTION varied along the CASING axis (SPRINT-099 T3, TD-145 * L-186) --------------
describe("archive-case-variant (filesystem-identity selection, platform-aware)", () => {
  let r: Captured;
  let workDir: string;
  let sameDirOnThisHost: boolean;
  beforeAll(() => {
    workDir = mkdtempSync(posix.join(tmpdir(), "lc-test-"));
    const fx = buildCaseVariantFixture(workDir);
    r = capture([fx]);
    // Ask the SAME question the predicate itself asks (filesystem identity), not a hardcoded
    // assumption -- this fixture must stay correct on a case-sensitive host too (Linux), where
    // Archive/ is genuinely a different directory and must NOT be skipped.
    try {
      const a = statSync(posix.join(workDir, "Archive"));
      const b = statSync(posix.join(workDir, "archive"));
      sameDirOnThisHost = a.dev === b.dev && a.ino === b.ino;
    } catch {
      sameDirOnThisHost = false;
    }
  });
  afterAll(() => rmSync(workDir, { recursive: true, force: true }));
  test("Archive/ is treated identically to archive/ wherever the filesystem says they are the same directory", () => {
    if (sameDirOnThisHost) {
      expect(r.output.split("\n").filter((l) => l.startsWith("FAIL")).length).toBe(0);
    } else {
      expect(r.output.split("\n").some((l) => l.startsWith("FAIL"))).toBe(true);
    }
  });
});

// --- file-not-found: a non-checker-specific but load-bearing shape (main loop's own FAIL) --------
describe("file not found", () => {
  test("FAILs by name rather than silently skipping", () => {
    const r = capture(["/nonexistent/path/for-sure/SPRINT-000-nope.md"]);
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain("layers-completeness: file not found: /nonexistent/path/for-sure/SPRINT-000-nope.md");
  });
});

// --- space-containing tokens: the retained guard on the ORACLE's IFS fix (TASK-355) ---------------
// `layers_tokens()` extracts backtick spans with no character-class restriction, so a token may
// legitimately contain a space. The shell oracle iterated `for c in $cites_toks` and
// `for _d in $layers_dirs` UNQUOTED, word-splitting such a token so that no fragment matched the
// intact value -- two SILENT FALSE NEGATIVES. The TS port never had the bug (array iteration does
// not word-split), which is how it was found: an outside review caught the port DIVERGING from the
// oracle, and the owner ruled the oracle should be fixed rather than the port made bug-compatible.
//
// WHAT THIS BLOCK DOES AND DOES NOT GUARD -- stated precisely, because the distinction is easy to
// get wrong and an earlier draft of this comment did. `capture()` runs the TypeScript PORT, so these
// assertions guard the PORT's behaviour on space-containing tokens. They do NOT guard the oracle's
// IFS fix: re-breaking `scripts/lib/check-layers-completeness.sh` leaves this suite 19/19 green
// (verified by seeding exactly that break). The guard on the ORACLE is the DIFFERENTIAL
// (`evals/layers-completeness-differential.ts`), where the same seed makes shell and port diverge on
// the T1 contradiction line -- also verified. Both instruments are needed and they cover different
// halves; this fixture is the shared input that makes the oracle's half reachable at all.
//
// Against the PRE-FIX oracle, both findings below were absent: the T1 contradiction was omitted
// entirely and T2 printed "PASS ... Layers completeness (DoD-implied files all declared)" -- a false
// green. Deleting this fixture makes that regression invisible again (TD-012's shape).
describe("space-token-wordsplit (retained must-FAIL fixture -- the oracle's IFS fix)", () => {
  let r: Captured;
  beforeAll(() => {
    r = capture([posix.join(FIXTURES, "space-token-wordsplit.md")]);
  });
  test("T1: a space-containing token in BOTH Cites: and Layers: is reported as contradictory", () => {
    expect(r.exitCode).toBe(1);
    expect(r.output).toContain(
      "T1 Cites/Layers contradiction: my file.md declared as touched AND escaped as merely cited",
    );
  });
  test("T2: a space-containing directory token does not falsely cover an unrelated prefix", () => {
    // `zz dir/` word-split to `zz`, which prefix-matched `zzsomething.md` and wrongly covered it.
    expect(r.output).toContain(
      "T2 Layers completeness: DoD/Acceptance implies zzsomething.md, absent from Layers:",
    );
  });
  test("sibling control: T2's Depends-on leg is unaffected and still passes in the same run", () => {
    expect(r.output).toContain("T2 Depends-on completeness (prose-referenced tasks all declared)");
  });
});
