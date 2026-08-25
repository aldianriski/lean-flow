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
    expect(r.finding).toBeNull();
  });

  test("docs/sprint/ exists, nothing misplaced: pass", () => {
    const r = evaluate(new InMemorySprintDirPort(["SPRINT-001-x.md"]));
    expect(r.verdict).toBe("pass");
    expect(r.finding).toBeNull();
  });

  test("a misplaced log: fail, named sprint-log-outside-logs-dir, naming the offending file", () => {
    const r = evaluate(new InMemorySprintDirPort(["SPRINT-001-x.md", "SPRINT-001-x-log.md"]));
    expect(r.verdict).toBe("fail");
    expect(r.finding?.name).toBe(SPRINT_LOG_OUTSIDE_LOGS_DIR);
    expect(r.finding?.detail).toContain("SPRINT-001-x-log.md");
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
    expect(fromReal.finding?.name).toBe(fromFake.finding?.name);
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
    expect(ts.finding?.name).toBe(SPRINT_LOG_OUTSIDE_LOGS_DIR);
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
    expect(ts.finding).toBeNull();
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
    expect(ts.finding).toBeNull();
  }, ORACLE_TIMEOUT_MS);

  test("the *Execution-Log* glob shape agrees too, not just *-log.md", () => {
    const repo = mkdtempSync(join(tmpdir(), "s9-logdir-oracle-exlog-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-Execution-Log-002.md"), "log");

    const shell = runShellEngine(repo);
    expect(logdirLines(shell.stdout).some((l) => l.startsWith("FAIL") && l.includes(SPRINT_LOG_OUTSIDE_LOGS_DIR))).toBe(true);

    const ts = evaluate(new FsSprintDirPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.finding?.name).toBe(SPRINT_LOG_OUTSIDE_LOGS_DIR);
  }, ORACLE_TIMEOUT_MS);
});
