import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { FsSprintDirPort } from "../adapters/fs-sprint-dir.ts";
import { InMemorySprintDirPort } from "./sprint-log-outside-logs-dir.fake.ts";
import { SPRINT_LOG_OUTSIDE_LOGS_DIR, evaluate, isMisplacedLogName } from "./sprint-log-outside-logs-dir.ts";

// `readFileSync`/`writeFileSync`/`execFileSync`/`mkdtempSync` stay in this `*.test.ts` file only,
// matching spec-reader.test.ts's own pattern (test layer is exempted from the domain-infrastructure
// rule; sprint-log-outside-logs-dir.ts itself stays free of all of it).

describe("isMisplacedLogName — matched by SHAPE, not a bare substring (L-108)", () => {
  test("a Plan itself is never misread as a log", () => {
    expect(isMisplacedLogName("SPRINT-001-x.md")).toBe(false);
  });

  test("a doc merely CONTAINING 'log' is not a match — backlog.md names a Plan artifact, not a log", () => {
    expect(isMisplacedLogName("backlog.md")).toBe(false);
  });

  test("*-log.md is a match", () => {
    expect(isMisplacedLogName("SPRINT-001-x-log.md")).toBe(true);
  });

  test("*Execution-Log*.md is a match", () => {
    expect(isMisplacedLogName("SPRINT-Execution-Log-002.md")).toBe(true);
  });

  test("Execution-Log without the .md extension is not a match — a directory or a different filetype", () => {
    expect(isMisplacedLogName("SPRINT-Execution-Log-002")).toBe(false);
  });
});

describe("evaluate — the three verdicts, against the in-memory fake", () => {
  test("no docs/sprint/ at all: note, not a finding — a repo between sprints has not violated anything", () => {
    const r = evaluate(new InMemorySprintDirPort(null));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("docs/sprint/ exists, nothing misplaced: pass", () => {
    const r = evaluate(new InMemorySprintDirPort(["SPRINT-001-x.md"]));
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("a misplaced log: fail, ONE finding, named sprint-log-outside-logs-dir, naming the offending file", () => {
    const r = evaluate(new InMemorySprintDirPort(["SPRINT-001-x.md", "SPRINT-001-x-log.md"]));
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(SPRINT_LOG_OUTSIDE_LOGS_DIR);
    expect(r.findings[0]?.detail).toContain("SPRINT-001-x-log.md");
  });

  // Finding 1 (SPRINT-087 T1 revise): the Shell oracle's `assert_S9_LOGDIR` calls `bad()` once PER
  // glob match, so TWO misplaced files must read back as TWO findings — never one finding naming
  // both, which is exactly what the first cut of this evaluator did (comma-joining), silently
  // absorbing a cardinality difference EPIC-014 D2 requires to be ruled, not hidden in a string.
  test("TWO misplaced logs: fail, TWO findings — cardinality, not just names, must match", () => {
    const r = evaluate(
      new InMemorySprintDirPort(["SPRINT-001-x.md", "SPRINT-001-x-log.md", "SPRINT-Execution-Log-002.md"]),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(2);
    expect(r.findings.every((f) => f.name === SPRINT_LOG_OUTSIDE_LOGS_DIR)).toBe(true);
    expect(r.findings.map((f) => f.detail).join("\n")).toContain("SPRINT-001-x-log.md");
    expect(r.findings.map((f) => f.detail).join("\n")).toContain("SPRINT-Execution-Log-002.md");
  });
});

// --- DoD 3: the port is a SEAM, not a wrapper -----------------------------------------------------
// The SAME evaluator, run unmodified against BOTH implementations over an EQUIVALENT scenario, must
// agree. If it didn't, the port would be describing two different contracts rather than one.

function buildRealFailingRepo(): string {
  const repo = mkdtempSync(join(tmpdir(), "s9-logdir-seam-"));
  mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
  writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");
  writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), "log");
  return repo;
}

describe("evaluate — the SAME evaluator against both port implementations (DoD 3)", () => {
  test("fake and real Bun adapter agree on the misplaced-log scenario", () => {
    const fake = new InMemorySprintDirPort(["SPRINT-001-x.md", "SPRINT-001-x-log.md"]);
    const real = new FsSprintDirPort(buildRealFailingRepo());

    const fromFake = evaluate(fake);
    const fromReal = evaluate(real);

    expect(fromReal.verdict).toBe(fromFake.verdict);
    expect(fromReal.findings.map((f) => f.name)).toEqual(fromFake.findings.map((f) => f.name));
  });

  test("fake and real Bun adapter agree on the clean scenario", () => {
    const repo = mkdtempSync(join(tmpdir(), "s9-logdir-seam-clean-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");

    const fromFake = evaluate(new InMemorySprintDirPort(["SPRINT-001-x.md"]));
    const fromReal = evaluate(new FsSprintDirPort(repo));

    expect(fromReal.verdict).toBe(fromFake.verdict);
    expect(fromReal.verdict).toBe("pass");
  });

  // Finding 2 (reviewer): the two tests above use plain FILES on both sides, so nothing proves the
  // fake and the real adapter would ever DIVERGE — a wrapper that always agrees is not a proven seam.
  // The differentiating case: a DIRECTORY literally named like a misplaced log
  // (`docs/sprint/SPRINT-001-x-log.md/`, a directory, not a file). `FsSprintDirPort.isFile()` must
  // exclude it -- and Shell's own `[ -f ]` guard in `assert_S9_LOGDIR` agrees (verified below, DoD 4).
  // The in-memory fake has no notion of "this entry is a directory" at all — it has no filesystem to
  // consult, so every name it is given is implicitly a file. That asymmetry IS the seam: the two
  // implementations only ever have to agree on inputs that represent the SAME real-world state, and
  // this test proves the real adapter's is-a-file guard is actually load-bearing, not vestigial.
  test("a DIRECTORY named like a misplaced log is excluded by the real adapter — the differentiating case", () => {
    const repo = mkdtempSync(join(tmpdir(), "s9-logdir-seam-dirname-"));
    mkdirSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), { recursive: true }); // a DIRECTORY
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-a.md"), "# plan");

    const real = new FsSprintDirPort(repo);
    expect(real.listSprintDirEntries()).not.toContain("SPRINT-001-x-log.md");

    const fromReal = evaluate(real);
    expect(fromReal.verdict).toBe("pass");
    expect(fromReal.findings).toEqual([]);
  });
});

// --- DoD 4: TS agrees with the SHELL ORACLE, spawned live, on the named finding and exit meaning ---
// Never a copied-in literal (parity would then rot silently the next time the Shell assertion's
// wording changes) — the same pattern spec-reader.test.ts's `runShellReader` uses for
// read-spec-rules.sh.

const ENGINE_PATH = fileURLToPath(new URL("../../../../scripts/lib/conformance-engine.sh", import.meta.url));

/** Runs the real Shell oracle, fresh, and returns its exit code + full stdout — never a literal. */
function runShellEngine(repoDir: string): { readonly code: number; readonly stdout: string } {
  try {
    const stdout = execFileSync("sh", [ENGINE_PATH, repoDir], { encoding: "utf8", timeout: 15_000 });
    return { code: 0, stdout };
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "" };
  }
}

/** Just the S9.LOGDIR line(s) out of the whole-engine report — everything else on this fixture is
 *  noise from OTHER rules (a bare repo owes a README, a CONTEXT.md, ...) that this rule does not own. */
function logdirLines(stdout: string): string[] {
  return stdout.split("\n").filter((l) => l.includes("LOGDIR") || l.includes(SPRINT_LOG_OUTSIDE_LOGS_DIR));
}

// The whole-engine driver scans all 100 rules over the repo's own 3000+-line assertion set
// (~8s measured on this host: `time sh scripts/lib/conformance-engine.sh <dir>`) -- far past bun:test's
// 5000ms default per-test timeout, which is what a first run of these four surfaced. Not a defect in
// the rule under test: the oracle IS the whole engine, and this file only greps the S9.LOGDIR lines
// back out of its full report.
const ORACLE_TIMEOUT_MS = 20_000;

describe("TS agrees with the live Shell oracle on S9.LOGDIR (DoD 4)", () => {
  test("FAIL: same named finding, same exit meaning (a FAIL line, not a PASS/note)", () => {
    const repo = buildRealFailingRepo();

    const shell = runShellEngine(repo);
    const shellLines = logdirLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(true);
    expect(shellLines.join("\n")).toContain(SPRINT_LOG_OUTSIDE_LOGS_DIR);

    const ts = evaluate(new FsSprintDirPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.findings[0]?.name).toBe(SPRINT_LOG_OUTSIDE_LOGS_DIR);
  }, ORACLE_TIMEOUT_MS);

  test("PASS: same exit meaning (a PASS line, no finding)", () => {
    const repo = mkdtempSync(join(tmpdir(), "s9-logdir-oracle-pass-"));
    mkdirSync(join(repo, "docs", "sprint", "logs"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");
    writeFileSync(join(repo, "docs", "sprint", "logs", "SPRINT-001-x-log.md"), "log");

    const shell = runShellEngine(repo);
    const shellLines = logdirLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("PASS"))).toBe(true);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);

    const ts = evaluate(new FsSprintDirPort(repo));
    expect(ts.verdict).toBe("pass");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);

  test("NOTE: no docs/sprint/ at all — neither side reports a finding", () => {
    const repo = mkdtempSync(join(tmpdir(), "s9-logdir-oracle-note-"));

    const shell = runShellEngine(repo);
    const shellLines = logdirLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.some((l) => l.startsWith("PASS"))).toBe(false);
    expect(shellLines.join("\n")).toContain("no docs/sprint/");

    const ts = evaluate(new FsSprintDirPort(repo));
    expect(ts.verdict).toBe("note");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);

  test("the *Execution-Log* glob shape agrees too, not just *-log.md", () => {
    const repo = mkdtempSync(join(tmpdir(), "s9-logdir-oracle-exlog-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-Execution-Log-002.md"), "log");

    const shell = runShellEngine(repo);
    expect(logdirLines(shell.stdout).some((l) => l.startsWith("FAIL") && l.includes(SPRINT_LOG_OUTSIDE_LOGS_DIR))).toBe(true);

    const ts = evaluate(new FsSprintDirPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.findings[0]?.name).toBe(SPRINT_LOG_OUTSIDE_LOGS_DIR);
  }, ORACLE_TIMEOUT_MS);

  // Finding 1 (reviewer): the four tests above each use exactly ONE misplaced file, so "same named
  // finding, same exit meaning" passed even in the first (buggy, comma-joining) cut of `evaluate()`.
  // This is the test that actually exercises CARDINALITY: reproduced by hand first —
  //   `sh scripts/lib/conformance-engine.sh <dir> | grep LOGDIR` on a dir with SPRINT-001-x-log.md
  //   AND SPRINT-Execution-Log-002.md prints exactly TWO `FAIL sprint-log-outside-logs-dir` lines,
  //   one per file, each with its own detail — never one line naming both.
  // TS must report the same COUNT, not just the same name.
  test("TWO simultaneously misplaced logs: Shell emits TWO FAIL lines, TS emits TWO findings — same COUNT", () => {
    const repo = mkdtempSync(join(tmpdir(), "s9-logdir-oracle-two-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), "log");
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-Execution-Log-002.md"), "log");

    const shell = runShellEngine(repo);
    const shellFailLines = logdirLines(shell.stdout).filter((l) => l.startsWith("FAIL"));
    // The independent oracle's OWN count -- not recomputed the way TS counts (tdd anti-tautology).
    expect(shellFailLines).toHaveLength(2);
    expect(shellFailLines.join("\n")).toContain("SPRINT-001-x-log.md");
    expect(shellFailLines.join("\n")).toContain("SPRINT-Execution-Log-002.md");

    const ts = evaluate(new FsSprintDirPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.findings).toHaveLength(shellFailLines.length); // the cardinality claim itself
    expect(ts.findings.every((f) => f.name === SPRINT_LOG_OUTSIDE_LOGS_DIR)).toBe(true);
  }, ORACLE_TIMEOUT_MS);

  // Finding 2 (reviewer), oracle half: Shell's `[ -f ]` guard in `assert_S9_LOGDIR` must agree with
  // `FsSprintDirPort`'s `.isFile()` filter that a DIRECTORY named like a misplaced log is not one.
  // Reproduced by hand first: `sh scripts/lib/conformance-engine.sh <dir> | grep LOGDIR` on a dir
  // whose docs/sprint/ contains ONLY a directory named `SPRINT-001-x-log.md` (plus an ordinary Plan)
  // prints `PASS  S9.LOGDIR ...`, never a FAIL — confirming Shell's `[ -f ]` and TS's `isFile()` treat
  // the same real-world state (a directory, not a file) identically.
  test("a DIRECTORY named like a misplaced log: PASS on both sides, not a FAIL", () => {
    const repo = mkdtempSync(join(tmpdir(), "s9-logdir-oracle-dirname-"));
    mkdirSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), { recursive: true }); // a DIRECTORY
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-a.md"), "# plan");

    const shell = runShellEngine(repo);
    const shellLines = logdirLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.some((l) => l.startsWith("PASS"))).toBe(true);

    const ts = evaluate(new FsSprintDirPort(repo));
    expect(ts.verdict).toBe("pass");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);
});

// --- Tier G evidence (SPRINT-087 T1; RE-RUN at the T1 revise against the FINAL `findings`-array
// code, 18 tests in this file) ------------------------------------------------------------------
// `evaluate()` and `isMisplacedLogName()` in ./sprint-log-outside-logs-dir.ts are Tier G (CLAUDE.md
// ADR-029): a false negative here is silent by construction, same as the Shell assertion it mirrors.
// Seven branches were enumerated from the FINISHED (post-revise) code, not the plan — the widening
// itself added one (#7, the cardinality regression). Each seed: a targeted one-line break, confirmed
// LANDED (`cmp` against a pristine copy saved before seeding), confirmed still parsing and line-count-
// stable (88/88 before and after every seed), confirmed reddening ONLY its own case while every sibling
// test stayed green, then RESTORED and confirmed byte-identical via `sha256sum`
// (`13332423d5c2d655ac7dcb481f16958b712856c965dc9b29b6e1b682ec7db2b4` before every seed and after
// every restore, this session):
//   1. `-log.md` suffix check (`endsWith` -> `startsWith`)               -- 5 reddened / 13 green
//   2. `Execution-Log` substring typo'd (`"Execution-Logg"`)             -- 4 reddened / 14 green
//   3. NOTE branch's verdict flipped to `"pass"`                         -- 2 reddened / 16 green
//   4. FAIL threshold off-by-one (`misplaced.length > 0` -> `> 1`)       -- 3 reddened / 15 green
//   5. PASS branch's verdict flipped to `"note"`                        -- 5 reddened / 13 green
//   6. Over-matching false positive (Execution-Log's `&&` -> `||`)      -- 11 reddened / 7 green
//   7. Cardinality regression: `findings: misplaced.map(findingFor)` reverted to the REJECTED design,
//      `findings: [findingFor(misplaced.join(", "))]` (one comma-joined finding, Finding 1's original
//      defect) -- reddened EXACTLY the two cardinality tests (the "TWO misplaced logs" unit test and
//      the "TWO simultaneously misplaced logs" live-oracle test) / 16 green, proving those two tests
//      are what actually catch a regression back to the design the reviewer flagged.
// No seed left the file in a state `cmp` disagreed with the pristine copy on restore. This block
// records that the exercise was performed as described — the commit history alone does not carry
// that evidence forward.
