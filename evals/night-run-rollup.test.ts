// evals/night-run-rollup.test.ts -- must-FAIL/sibling-control/population fixtures for
// scripts/lib/check-night-run-rollup.ts (TASK-355: cut the QA gate's wall-clock cost).
//
// WHY THIS FILE EXISTS, AND WHAT IT REPLACES. evals/run-night-run-rollup-fixtures.sh used to invoke
// the shell checker as its own subprocess once per fixture (~31 spawns for the cases below alone) --
// on Windows, each spawn costs ~2.75s of fork() emulation regardless of how little work the checker
// actually does, because the checker itself forks grep/sed/awk/cut dozens of times internally. Moving
// those ~31 cases into ONE Bun process, calling the TS port's exported functions directly instead of
// spawning anything, removes that cost entirely -- this is a SPEED change, not a coverage change:
// every case below asserts the exact same exit code + named finding the shell harness asserted, and
// every must-FAIL case still fails with its own named finding (CLAUDE.md Anti-Patterns Tier G bar).
//
// WHAT DID NOT MOVE HERE, AND WHY. Two case families in run-night-run-rollup-fixtures.sh spawn a
// DIFFERENT script, not this checker, and stay there:
//   - case 9 (the reaper family) drives scripts/night-run.sh --reap directly -- this task ports the
//     CHECKER, not the reaper, and night-run.sh is unmodified shell.
//   - case 12 (the qa-check.sh leg 2g family) extracts and re-executes qa-check.sh's OWN leg 2g body
//     verbatim, which still invokes the checker via `sh scripts/lib/check-night-run-rollup.sh` --
//     qa-check.sh is a HARD-CONSTRAINT file this task must not modify, so leg 2g still calls the shell
//     oracle, and testing that call means shelling out to it.
// Both stay exactly as they were, still spawning subprocesses, still in the .sh harness.
//
// Retained here rather than deleted with the porting work (TD-012): every must-FAIL fixture, its
// sibling control, and the population fixtures (cases 8/11, the real committed SPRINT-089/090/082
// archived logs) that check-night-run-rollup.sh's own header names as load-bearing (L-166).
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { checkNightRunRollup, evaluateLog, isArchivedPath } from "../scripts/lib/check-night-run-rollup.ts";

const FIXTURES = fileURLToPath(new URL("fixtures/night-run-rollup/", import.meta.url));
const REPO_ROOT = fileURLToPath(new URL("../", import.meta.url));

function fx(relPath: string): string {
  return FIXTURES + relPath;
}

function assertFail(path: string, wantFinding: string) {
  const { lines, exitCode } = checkNightRunRollup([path]);
  const out = lines.join("\n");
  expect(exitCode).toBe(1);
  expect(out).toContain(wantFinding);
}

function assertPass(path: string, wantFinding: string) {
  const { lines, exitCode } = checkNightRunRollup([path]);
  const out = lines.join("\n");
  expect(exitCode).toBe(0);
  expect(out).toContain(wantFinding);
}

// --- case 1: completed run, no DoD header -> FAIL. The 4-of-7 case exactly. ----------------------
test("missing-rollup-fails", () => {
  assertFail(fx("missing-rollup/docs/sprint/logs/SPRINT-920-missing-rollup.md"), "carries no 'run · N of M DoD ticked' header");
});

// --- case 2: completed run, no calibration row -> FAIL, separately named -------------------------
test("missing-calibration-fails", () => {
  assertFail(fx("missing-calibration/docs/sprint/logs/SPRINT-921-missing-calibration.md"), "carries no Part 4 calibration row");
});

// --- case 3: both present -> PASS ---------------------------------------------------------------
test("wellformed-passes", () => {
  assertPass(fx("wellformed/docs/sprint/logs/SPRINT-922-wellformed.md"), "DoD header + terminal state + calibration row present");
});

// --- case 4: no completed run yet -> reported, exit 0, never a FAIL ------------------------------
test("midflight-does-not-fire", () => {
  assertPass(fx("no-complete-entry/docs/sprint/logs/SPRINT-923-no-complete-entry.md"), "no completed-run entry yet");
});

// --- case 5: task-level `complete` does not arm the run-level assertions -> exit 0 ---------------
test("task-level-complete-does-not-arm", () => {
  assertPass(
    fx("task-level-complete-does-not-arm/docs/sprint/logs/SPRINT-924-task-level-complete-does-not-arm.md"),
    "no completed-run entry yet",
  );
});

// --- case 6 (must-FAIL): completed run, no terminal state (SPRINT-088 T2, Part 0b) ---------------
test("missing-terminal-fails", () => {
  assertFail(fx("missing-terminal/docs/sprint/logs/SPRINT-925-missing-terminal.md"), "carries no 'terminal · <STATE> · <reason>' line");
});

// --- case 6b (must-FAIL): parseable terminal line, unrecognised STATE -----------------------------
test("bad-terminal-token-fails", () => {
  assertFail(fx("bad-terminal-token/docs/sprint/logs/SPRINT-926-bad-terminal-token.md"), "carries no 'terminal · <STATE> · <reason>' line");
});

// --- case 6c: the neighbouring cases still fail for their OWN reason, not for the new one ---------
describe("adding a required field must not rot a must-FAIL fixture's isolation", () => {
  test("calibration-case-stays-isolated", () => {
    const { lines } = checkNightRunRollup([fx("missing-calibration/docs/sprint/logs/SPRINT-921-missing-calibration.md")]);
    const out = lines.join("\n");
    expect(out).toContain("carries no Part 4 calibration row");
    expect(out).not.toContain("carries no 'terminal · ");
  });
  test("dod-header-case-stays-isolated", () => {
    const { lines } = checkNightRunRollup([fx("missing-rollup/docs/sprint/logs/SPRINT-920-missing-rollup.md")]);
    const out = lines.join("\n");
    expect(out).toContain("carries no 'run · N of M DoD ticked' header");
    expect(out).not.toContain("carries no 'terminal · ");
  });
});

// --- case 7 family: the agreement matrix (SPRINT-093 T1, DoD 1) -----------------------------------
describe("agreement matrix -- must-FAIL", () => {
  test("exhausted-vs-blocked-fails", () => {
    assertFail(fx("agreement-exhausted-vs-blocked/docs/sprint/logs/SPRINT-930-agreement-exhausted-vs-blocked.md"), "PLAN_EXHAUSTED but carries a non-done per-task line");
  });
  test("exhausted-vs-parked-fails", () => {
    assertFail(fx("agreement-exhausted-vs-parked/docs/sprint/logs/SPRINT-931-agreement-exhausted-vs-parked.md"), "PLAN_EXHAUSTED but carries a non-done per-task line");
  });
  test("exhausted-vs-stalled-fails", () => {
    assertFail(fx("agreement-exhausted-vs-stalled/docs/sprint/logs/SPRINT-932-agreement-exhausted-vs-stalled.md"), "PLAN_EXHAUSTED but carries a non-done per-task line");
  });
  test("exhausted-vs-denied-fails", () => {
    assertFail(fx("agreement-exhausted-vs-denied/docs/sprint/logs/SPRINT-933-agreement-exhausted-vs-denied.md"), "PLAN_EXHAUSTED but carries a non-done per-task line");
  });
  test("exhausted-vs-unattempted-fails", () => {
    assertFail(fx("agreement-exhausted-vs-unattempted/docs/sprint/logs/SPRINT-934-agreement-exhausted-vs-unattempted.md"), "PLAN_EXHAUSTED but carries a non-done per-task line");
  });
  test("authority-vs-stalled-fails", () => {
    assertFail(fx("agreement-authority-vs-stalled/docs/sprint/logs/SPRINT-935-agreement-authority-vs-stalled.md"), "AUTHORITY_BOUNDARY but carries a per-task line Part 0b maps elsewhere");
  });
  test("authority-vs-unattempted-fails", () => {
    assertFail(fx("agreement-authority-vs-unattempted/docs/sprint/logs/SPRINT-936-agreement-authority-vs-unattempted.md"), "AUTHORITY_BOUNDARY but carries a per-task line Part 0b maps elsewhere");
  });
  test("authority-no-evidence-fails", () => {
    assertFail(fx("agreement-authority-no-evidence/docs/sprint/logs/SPRINT-945-agreement-authority-no-evidence.md"), "carries no 'Tn · parked-hitl ·' or 'Tn · blocked ·' line");
  });
  test("budget-no-evidence-fails", () => {
    assertFail(fx("agreement-budget-no-evidence/docs/sprint/logs/SPRINT-944-agreement-budget-no-evidence.md"), "carries no 'Tn · unattempted ·' line");
  });
  test("budget-vs-denied-fails", () => {
    assertFail(fx("agreement-budget-vs-denied/docs/sprint/logs/SPRINT-939-agreement-budget-vs-denied.md"), "BUDGET_STOP but carries a per-task line reap()'s priority order ranks above it");
  });
});

describe("agreement matrix -- sibling controls (L-142)", () => {
  test("authority-ok", () => {
    assertPass(fx("agreement-authority-ok/docs/sprint/logs/SPRINT-937-agreement-authority-ok.md"), "agrees with its per-task lines");
  });
  // BUDGET_STOP + a LONE blocked/parked-hitl line is NOT a contradiction by itself (reap() reaches
  // BUDGET_STOP purely off rp_unatt > 0 and never consults rp_parked once it does).
  test("budget-vs-blocked-ok", () => {
    assertPass(fx("agreement-budget-vs-blocked/docs/sprint/logs/SPRINT-938-agreement-budget-vs-blocked.md"), "agrees with its per-task lines");
  });
  test("budget-ok", () => {
    assertPass(fx("agreement-budget-ok/docs/sprint/logs/SPRINT-940-agreement-budget-ok.md"), "agrees with its per-task lines");
  });
  // The mixed case (independent-review finding): TWO non-done states at once -- unattempted AND
  // parked-hitl together under BUDGET_STOP -- is the real motivating shape (a run parks a J2 task,
  // continues disjoint AFK work, then exhausts its budget on a later task).
  test("budget-mixed-with-parked-ok", () => {
    assertPass(fx("agreement-budget-mixed-with-parked-ok/docs/sprint/logs/SPRINT-943-agreement-budget-mixed-with-parked-ok.md"), "agrees with its per-task lines");
  });
  test("hardfailure-unasserted-stays-green", () => {
    assertPass(fx("agreement-hardfailure-unasserted/docs/sprint/logs/SPRINT-941-agreement-hardfailure-unasserted.md"), "agrees with its per-task lines");
  });
  test("userstop-unasserted-stays-green", () => {
    assertPass(fx("agreement-userstop-unasserted/docs/sprint/logs/SPRINT-942-agreement-userstop-unasserted.md"), "agrees with its per-task lines");
  });
});

// --- case 8: the SPRINT-089 real committed artifact (SPRINT-093 T1, DoD 2) -----------------------
// L-166: the fixture must point at the REAL committed rollup, not a synthetic reconstruction. The
// false rollup the reaper actually wrote is committed at
// docs/sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md, quoted INDENTED inside a fenced
// code block on purpose (L-108/L-176: a guard must never read an example of a rollup as a rollup) --
// so it does not arm this checker in its committed form, by design. Every string below is extracted
// from the committed archive at RUN TIME via the same regex family grep used, none hand-typed, so an
// edit to either archived log makes this fail loud rather than silently drift from its source.
describe("case 8 -- real committed SPRINT-089/090 artifacts (L-166)", () => {
  const s89Path = REPO_ROOT + "docs/sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md";
  const s90Path = REPO_ROOT + "docs/sprint/archive/logs/SPRINT-090-run-evidence-vehicle.md";
  const s89Lines = readFileSync(s89Path, "utf8").split(/\r?\n/);
  const s90Lines = readFileSync(s90Path, "utf8").split(/\r?\n/);

  function firstSubstring(lines: string[], re: RegExp): string | null {
    for (const l of lines) {
      const m = re.exec(l);
      if (m) return m[0];
    }
    return null;
  }
  function firstLine(lines: string[], re: RegExp): string | null {
    for (const l of lines) {
      if (re.test(l)) return l;
    }
    return null;
  }

  const s89Dod = firstSubstring(s89Lines, /run · [0-9]+ of [0-9]+ DoD ticked/);
  const s89Term = firstSubstring(s89Lines, /terminal · PLAN_EXHAUSTED · .*/);
  const s89Cal = firstSubstring(s89Lines, /run · \$[0-9.]+ · [0-9]+ turns · [0-9]+ min · [0-9]+ of [0-9]+ units · inline/);
  // T2's true state, pulled from SPRINT-090's own real, already-column-1, correctly-targeted rollup
  // (never indented, because it was written to the RIGHT file).
  const s90T2 = firstLine(s90Lines, /^T2 · parked-hitl · /);
  const s90T1 = firstLine(s90Lines, /^T1 · done · /);
  const s90Dod = firstSubstring(s90Lines, /^run · [0-9]+ of [0-9]+ DoD ticked/);
  const s90Term = firstSubstring(s90Lines, /^terminal · AUTHORITY_BOUNDARY · .*/);
  const s90Cal = firstSubstring(s90Lines, /^run · cost unavailable · .* · [0-9]+ of [0-9]+ units · inline/);
  const s90Hdr = firstLine(s90Lines, /^### .*\| *run-complete *\|/);

  test("extraction from the real committed archives succeeded (the source doc's shape did not drift)", () => {
    for (const [name, val] of Object.entries({ s89Dod, s89Term, s89Cal, s90T2, s90T1, s90Dod, s90Term, s90Cal, s90Hdr })) {
      expect(val, `extraction of '${name}' came back empty -- the source doc changed shape, re-derive the pattern`).not.toBeNull();
    }
  });

  test("sprint089-real-artifact-fails (must-FAIL): PLAN_EXHAUSTED beside a real parked-hitl line", () => {
    const content = [
      "sprint: 989",
      "slug: sprint089-motivating",
      "status: active",
      "",
      "# SPRINT-989 — Execution Log (real-artifact fixture, SPRINT-093 T1 DoD 2)",
      "",
      "### 2026-08-27 | run-complete | run exited",
      "",
      s89Dod!,
      s89Term!,
      s90T2!,
      "",
      s89Cal!,
      "",
    ].join("\n");
    const { lines, hadFail } = evaluateLog("docs/sprint/logs/SPRINT-989-sprint089-motivating.md", content);
    expect(hadFail).toBe(true);
    expect(lines.join("\n")).toContain("PLAN_EXHAUSTED but carries a non-done per-task line");
  });

  // Sibling control (L-142): the SAME real T1/T2 facts, under the terminal state SPRINT-090's own
  // correctly-targeted rollup actually recorded (AUTHORITY_BOUNDARY). Must stay green.
  test("sprint090-real-artifact-ok (sibling control)", () => {
    const content = [
      "sprint: 990",
      "slug: sprint090-groundtruth",
      "status: active",
      "",
      "# SPRINT-990 — Execution Log (real-artifact sibling control, SPRINT-093 T1 DoD 2)",
      "",
      s90Hdr!,
      "",
      s90Dod!,
      s90Term!,
      s90T1!,
      s90T2!,
      "",
      s90Cal!,
      "",
    ].join("\n");
    const { lines, hadFail } = evaluateLog("docs/sprint/logs/SPRINT-990-sprint090-groundtruth.md", content);
    expect(hadFail).toBe(false);
    expect(lines.join("\n")).toContain("agrees with its per-task lines");
  });
});

// --- case 10 family: the checker must read only the LAST run-complete block (SPRINT-093 T1
// revise 3) ------------------------------------------------------------------------------------
test("window-second-block-contradicts-fails", () => {
  assertFail(
    fx("window-second-block-contradicts/docs/sprint/logs/SPRINT-946-window-second-block-contradicts.md"),
    "PLAN_EXHAUSTED but carries a non-done per-task line",
  );
});
// The discriminating sibling: the FIRST block here is itself a genuine contradiction that would fail
// if it were still being read, and the LAST block is fully legitimate. A fix that merely WIDENED the
// search would still catch block one's problem and wrongly FAIL this case.
test("window-second-block-legitimate-ok", () => {
  assertPass(fx("window-second-block-legitimate/docs/sprint/logs/SPRINT-947-window-second-block-legitimate.md"), "agrees with its per-task lines");
});

// --- case 11: the real committed SPRINT-082 2-block artifact (L-166 / TD-012) --------------------
// Neither of SPRINT-082's two blocks carries a `terminal ·` line (both predate Part 0b), so this
// artifact cannot demonstrate a CONTRADICTION on its own; what it proves is windowing itself, by
// contrast: fed in full, the verdict must be driven by the SECOND (last) block's own evidence --
// which supplies both the DoD header and the calibration row, leaving only the missing terminal line
// as a finding. Truncated to end right before the second block, the SAME real text fails all three,
// because block one supplies none of them.
describe("case 11 -- real committed SPRINT-082 two-block artifact (L-166 / TD-012)", () => {
  const s82Path = REPO_ROOT + "docs/sprint/archive/logs/SPRINT-082-foundation-hardening.md";
  const s82Content = readFileSync(s82Path, "utf8");
  const s82Lines = s82Content.split(/\r?\n/);
  const RC_RE = /^### .*\| *run-complete *\|/;
  const rcIndices: number[] = [];
  s82Lines.forEach((l, i) => {
    if (RC_RE.test(l)) rcIndices.push(i);
  });

  test("the retained artifact still carries >=2 run-complete blocks", () => {
    expect(rcIndices.length, "expected >=2 run-complete blocks in SPRINT-082's archived log -- the retained artifact's shape changed, re-derive").toBeGreaterThanOrEqual(2);
  });

  test("sprint082-real-two-block-reads-second: full real 2-block file reads block two, not block one", () => {
    const secondStart = rcIndices[1]!;
    const fullContent = s82Content; // verbatim, unmodified
    const { lines, hadFail } = evaluateLog(s82Path, fullContent);
    void secondStart;
    const out = lines.join("\n");
    expect(hadFail).toBe(true);
    expect(out).toContain("carries no 'terminal · ");
    expect(out).not.toContain("carries no 'run · N of M DoD ticked' header");
    expect(out).not.toContain("carries no Part 4 calibration row");
  });

  test("sprint082-block-one-only-fails-all-three: the SAME real text truncated to block one alone fails all three", () => {
    const secondStart = rcIndices[1]!;
    const truncated = s82Lines.slice(0, secondStart).join("\n");
    const { lines, hadFail } = evaluateLog(s82Path, truncated);
    const out = lines.join("\n");
    expect(hadFail).toBe(true);
    expect(out).toContain("carries no 'run · N of M DoD ticked' header");
    expect(out).toContain("carries no Part 4 calibration row");
    expect(out).toContain("carries no 'terminal · ");
  });
});

// --- isArchivedPath -- the shared predicate this checker ports from archive-path.sh ---------------
describe("isArchivedPath", () => {
  test("a literal /archive/ path segment is excluded", () => {
    expect(isArchivedPath("docs/sprint/archive/logs/SPRINT-045-gate-precision.md")).toBe(true);
  });
  test("a live (non-archived) log path is not excluded", () => {
    expect(isArchivedPath("docs/sprint/logs/SPRINT-950-a.md")).toBe(false);
  });
  test("the empty path is not excluded", () => {
    expect(isArchivedPath("")).toBe(false);
  });
});

// --- file-existence / archived-skip / no-args CLI-level behaviour --------------------------------
describe("checkNightRunRollup -- CLI-level plumbing", () => {
  test("no paths given -> exit 0, a note, never a FAIL", () => {
    const { lines, exitCode } = checkNightRunRollup([]);
    expect(exitCode).toBe(0);
    expect(lines.join("\n")).toContain("no sprint logs given -- nothing verified");
  });
  test("a missing file is FATAL, not a skip", () => {
    const { lines, exitCode } = checkNightRunRollup(["docs/sprint/logs/SPRINT-000-does-not-exist.md"]);
    expect(exitCode).toBe(1);
    expect(lines.join("\n")).toContain("no Execution Log found at");
  });
  test("an archived path is silently skipped -- no output at all for that entry", () => {
    const { lines, exitCode } = checkNightRunRollup([REPO_ROOT + "docs/sprint/archive/logs/SPRINT-045-gate-precision.md"]);
    expect(exitCode).toBe(0);
    expect(lines).toEqual([]);
  });
});
