// scripts/lib/check-night-run-rollup.ts -- TypeScript port of scripts/lib/check-night-run-rollup.sh
// (TASK-355: cut the QA gate's wall-clock cost). Read that file's header first -- it carries the full
// WHY (SPRINT-059 T3, SPRINT-093 T1, SPRINT-098 T3) and is NOT duplicated here. This file only ports
// the HOW, faithfully: every finding, every regex, every ordering rule, copied line for line.
//
// scripts/lib/check-night-run-rollup.sh REMAINS THE SHIPPED ORACLE. qa-check.sh leg 2g still invokes
// it via `sh`, unchanged by this port (that file is out of scope for this task -- see the porting
// agent's final report for the exact diff that would point leg 2g at this file instead, held for the
// coordinator to apply centrally rather than applied here). This port's job is bug-for-bug parity
// with the shell oracle, proven by evals/run-night-run-rollup-differential-parity.sh over every
// fixture this checker has AND every real committed Execution Log in this repo, archived included.
// A divergence found there is a defect in THIS file -- fix it here, never "improve" on the shell
// behaviour (CLAUDE.md Anti-Patterns: bug-for-bug compatibility is the requirement).
//
// TypeScript run by Bun, per the SPRINT-101 T3 owner ruling this repo already applies to
// check-dod-delta.ts -- not POSIX sh (2026-09's "no shell scripts" rule).

import { existsSync, readFileSync, statSync } from "node:fs";

// --- archive-path.sh port (SPRINT-099 T3, TD-145 * TD-151) ---------------------------------------
// Faithful port of scripts/lib/archive-path.sh's lf_is_archived_path():
//   (a) a literal `/archive/` substring match -- cheap, correct for the common (POSIX-spelled) case,
//       checked first and unconditionally, exactly as the shell predicate does.
//   (b) a filesystem-identity walk for a DIFFERENTLY-CASED spelling on a case-insensitive filesystem
//       (`Archive/` sharing one inode with `archive/`), reached only when (a) misses. The shell's
//       `test -ef` ("same device+inode") is reproduced with fs.statSync's `dev`/`ino` pair; a stat
//       that throws (an ancestor, or its sibling "archive", does not exist on disk -- the common case
//       for a fixture path rooted in a scratch tree) is treated the same way the shell's `[ -d ]`
//       guard treats a miss: skip, never throw.
// The shell version's `test -ef` availability probe has no TS equivalent to port -- Node's fs module
// always exposes stat, so branch (b) is always reachable here (a strict widening of the shell's
// conservative "-ef absent -> literal match only" degrade, never a narrowing of it).
export function isArchivedPath(path: string): boolean {
  if (path.length === 0) return false;
  if (path.includes("/archive/")) return true;

  let d = path;
  for (;;) {
    const slash = d.lastIndexOf("/");
    if (slash < 0) break;
    const parent = d.slice(0, slash);
    if (parent.length === 0) break;
    try {
      const dStat = statSync(d);
      const archiveStat = statSync(`${parent}/archive`);
      if (
        dStat.isDirectory() &&
        archiveStat.isDirectory() &&
        dStat.dev === archiveStat.dev &&
        dStat.ino === archiveStat.ino
      ) {
        return true;
      }
    } catch {
      // ancestor, or its sibling "archive", does not exist on disk -- same as the shell's [ -d ] miss
    }
    d = parent;
  }
  return false;
}

// --- regexes, copied verbatim from the shell script's own patterns -------------------------------
const RUN_COMPLETE_HEADER_RE = /^### .*\| *run-complete *\|/;
const NEXT_HEADER_RE = /^### /;
const DOD_HEADER_LINE_RE = /^run · [0-9]+ of [0-9]+ DoD ticked/;
const CALIBRATION_RE = /^run · .* · .* · .* · [0-9]+ of [0-9]+ units · /;
const TERMINAL_RE = /^terminal · (PLAN_EXHAUSTED|AUTHORITY_BOUNDARY|HARD_FAILURE|BUDGET_STOP|USER_STOP) · /;
const OUTCOME_RE = /^outcome · (DELIVERED|PARTIAL|FAILED) · /;
const DOD_COUNT_RE = /^run · ([0-9]+) of ([0-9]+) DoD ticked.*/;

export interface EvaluatedLog {
  readonly lines: readonly string[];
  readonly hadFail: boolean;
}

/**
 * Evaluates ONE Execution Log's content, already known to exist and to be a non-archived path.
 * Ported line-for-line from the shell script's per-log loop body (windowing, shape checks, the
 * agreement matrix, the outcome/DoD consistency check). `lg` is the path as given on the command
 * line -- used only for message text, exactly as the shell script's `$lg` is.
 */
export function evaluateLog(lg: string, content: string): EvaluatedLog {
  const out: string[] = [];
  let hadFail = false;
  const bad = (msg: string) => {
    out.push(`FAIL  ${msg}`);
    hadFail = true;
  };
  const ok = (msg: string) => out.push(`PASS  ${msg}`);
  const note = (msg: string) => out.push(`      ${msg}`);

  const allLines = content.split(/\r?\n/);

  // A completed run announces itself with a `run-complete` event in the log's entry header
  // (TD-055: renamed from the bare `complete`, which collided with a task-level "this task is
  // complete" entry and misfired mid-SPRINT-064). Anchored to the delimited event field (L-108).
  const rcIndices: number[] = [];
  allLines.forEach((l, i) => {
    if (RUN_COMPLETE_HEADER_RE.test(l)) rcIndices.push(i);
  });
  if (rcIndices.length === 0) {
    note(`night-run rollup: ${lg} has no completed-run entry yet -- nothing to verify`);
    return { lines: out, hadFail };
  }

  // --- windowing (SPRINT-093 T1 revise 3) ---------------------------------------------------------
  // Everything below reads only the LAST run-complete block: Execution Logs are append-only, so a
  // sprint that survives more than one night accumulates more than one block, and reading the whole
  // file would validate an earlier block's terminal state against an earlier (or absent) evidence
  // set. The window runs from the LAST `run-complete` header (inclusive) to the next `### ` entry
  // header (exclusive), or EOF if there is none.
  const rcStart = rcIndices[rcIndices.length - 1]!;
  let rcEnd = allLines.length;
  for (let i = rcStart + 1; i < allLines.length; i++) {
    if (NEXT_HEADER_RE.test(allLines[i]!)) {
      rcEnd = i;
      break;
    }
  }
  const win = allLines.slice(rcStart, rcEnd);

  const hdr = win.some((l) => DOD_HEADER_LINE_RE.test(l));
  const cal = win.some((l) => CALIBRATION_RE.test(l));
  const term = win.some((l) => TERMINAL_RE.test(l));

  if (!hdr) {
    bad(
      `night-run rollup: ${lg} records a completed run but carries no 'run · N of M DoD ticked' header -- a run that finished part of the Plan is indistinguishable from one that finished all of it (Part 4)`,
    );
  }
  if (!cal) {
    bad(
      `night-run rollup: ${lg} records a completed run but carries no Part 4 calibration row (run · cost · turns · wall · N of M units · shape) -- the series it feeds is what lets the next promote size a batch`,
    );
  }
  if (!term) {
    bad(
      `night-run rollup: ${lg} records a completed run but carries no 'terminal · <STATE> · <reason>' line naming one of PLAN_EXHAUSTED | AUTHORITY_BOUNDARY | HARD_FAILURE | BUDGET_STOP | USER_STOP -- a run that stopped for a reason nobody declared is indistinguishable from one that finished (Part 0b). The count says how much of the Plan is done; the state says why the run stopped being the thing that does it`,
    );
  }

  // --- the agreement check (SPRINT-093 T1) ----------------------------------------------------------
  // Reads whether the terminal line's claim is consistent with the per-task lines beside it -- the
  // SPRINT-089 gap: a false PLAN_EXHAUSTED rollup passed the shape checks above with a
  // `· parked-hitl ·` task line sitting in the same file. See the shell script's own long comment for
  // the reap() priority table this matrix is derived from; not re-duplicated here.
  let agreeBad = false;
  if (term) {
    let termState: string | null = null;
    for (const l of win) {
      const m = TERMINAL_RE.exec(l);
      if (m) {
        termState = m[1]!;
        break;
      }
    }
    if (termState === "PLAN_EXHAUSTED") {
      const badLine = win.find((l) => /^T[0-9]+ · (blocked|parked-hitl|stalled|denied-tool|unattempted) · /.test(l));
      if (badLine !== undefined) {
        agreeBad = true;
        bad(
          `night-run rollup: ${lg} claims terminal · PLAN_EXHAUSTED but carries a non-done per-task line -- '${badLine}' -- Part 0b: PLAN_EXHAUSTED means every task reached a done state, nothing weaker; this is the SPRINT-089 shape exactly`,
        );
      }
    } else if (termState === "AUTHORITY_BOUNDARY") {
      const badLine = win.find((l) => /^T[0-9]+ · (stalled|denied-tool|unattempted) · /.test(l));
      if (badLine !== undefined) {
        agreeBad = true;
        bad(
          `night-run rollup: ${lg} claims terminal · AUTHORITY_BOUNDARY but carries a per-task line Part 0b maps elsewhere (stalled/denied-tool -> HARD_FAILURE, unattempted -> BUDGET_STOP) -- '${badLine}'`,
        );
      }
      // Positive half (SPRINT-093 T1 revise 2): reap() only reaches AUTHORITY_BOUNDARY when at least
      // one task parked or was blocked (night-run.sh:212). Absence of that evidence IS the
      // contradiction, the same DoD 1 class through omission rather than a wrong line.
      if (!win.some((l) => /^T[0-9]+ · (parked-hitl|blocked) · /.test(l))) {
        agreeBad = true;
        bad(
          `night-run rollup: ${lg} claims terminal · AUTHORITY_BOUNDARY but carries no 'Tn · parked-hitl ·' or 'Tn · blocked ·' line -- reap() only reaches AUTHORITY_BOUNDARY when at least one task parked or was blocked (night-run.sh:212); missing that evidence, the terminal claim has nothing behind it`,
        );
      }
    } else if (termState === "BUDGET_STOP") {
      // blocked/parked-hitl are NOT a contradiction here: reap() picks BUDGET_STOP as soon as any
      // task is unattempted, without ever checking whether another task also parked.
      const badLine = win.find((l) => /^T[0-9]+ · (stalled|denied-tool) · /.test(l));
      if (badLine !== undefined) {
        agreeBad = true;
        bad(
          `night-run rollup: ${lg} claims terminal · BUDGET_STOP but carries a per-task line reap()'s priority order ranks above it (stalled/denied-tool -> HARD_FAILURE outranks BUDGET_STOP) -- '${badLine}'`,
        );
      }
      // Positive half (SPRINT-093 T1 revise 2): reap() only reaches BUDGET_STOP when at least one
      // task was never reached (night-run.sh:210).
      if (!win.some((l) => /^T[0-9]+ · unattempted · /.test(l))) {
        agreeBad = true;
        bad(
          `night-run rollup: ${lg} claims terminal · BUDGET_STOP but carries no 'Tn · unattempted ·' line -- reap() only reaches BUDGET_STOP when at least one task was never reached (night-run.sh:210); missing that evidence, the terminal claim has nothing behind it`,
        );
      }
    }
    // HARD_FAILURE | USER_STOP: contract silent on what these two rule out -- left unasserted,
    // exactly as the shell script leaves them (`: ;;`).
  }

  // --- outcome / DoD consistency (SPRINT-098 T3 -- EPIC-015 Closed-when 6) --------------------------
  // `outcome ·` is grandfathered absent for pre-T3 logs -- only checked when the line IS present.
  const outc = win.some((l) => OUTCOME_RE.test(l));
  if (outc) {
    let outcTok: string | null = null;
    for (const l of win) {
      const m = OUTCOME_RE.exec(l);
      if (m) {
        outcTok = m[1]!;
        break;
      }
    }
    let dodLine: string | null = null;
    for (const l of win) {
      if (DOD_HEADER_LINE_RE.test(l)) {
        dodLine = l;
        break;
      }
    }
    let dodN: string | null = null;
    let dodM: string | null = null;
    if (dodLine !== null) {
      const m = DOD_COUNT_RE.exec(dodLine);
      if (m) {
        dodN = m[1]!;
        dodM = m[2]!;
      }
    }
    if (outcTok === "DELIVERED" && dodN !== null && dodM !== null && dodN !== dodM) {
      agreeBad = true;
      bad(
        `night-run rollup: ${lg} claims outcome · DELIVERED but only ${dodN} of ${dodM} DoD are ticked -- outcome-delivered-with-open-dod: DELIVERED means the Plan finished, never a mid-Plan stop reporting itself delivered (SPRINT-098 T3, EPIC-015 Closed-when 6)`,
      );
    }
  }

  if (hdr && cal && term && !agreeBad) {
    ok(`night-run rollup ${lg} (DoD header + terminal state + calibration row present, and agrees with its per-task lines)`);
  }

  return { lines: out, hadFail };
}

export interface CheckOutcome {
  readonly lines: readonly string[];
  readonly exitCode: 0 | 1;
}

/**
 * Full CLI-equivalent check over one or more Execution Log paths, faithfully replicating
 * check-night-run-rollup.sh's own per-file loop: a missing file is FATAL (not a skip -- it is exactly
 * the silence a died-before-writing run leaves behind); an archived path is silently skipped (no
 * output for that entry at all, matching `continue` in the shell loop); everything else is evaluated
 * by evaluateLog(). Exit code is 1 if ANY FAIL was printed across ANY file, 0 otherwise.
 */
export function checkNightRunRollup(paths: readonly string[]): CheckOutcome {
  if (paths.length === 0) {
    return { lines: [`      night-run rollup: no sprint logs given -- nothing verified`], exitCode: 0 };
  }

  const lines: string[] = [];
  let fail = false;
  for (const lg of paths) {
    if (!existsSync(lg)) {
      lines.push(
        `FAIL  night-run rollup: no Execution Log found at ${lg} -- an absent log is exactly the silence this check exists to catch, not something to skip`,
      );
      fail = true;
      continue;
    }
    if (isArchivedPath(lg)) continue;
    const content = readFileSync(lg, "utf8");
    const result = evaluateLog(lg, content);
    lines.push(...result.lines);
    if (result.hadFail) fail = true;
  }
  return { lines, exitCode: fail ? 1 : 0 };
}

if (import.meta.main) {
  const paths = process.argv.slice(2);
  const { lines, exitCode } = checkNightRunRollup(paths);
  for (const l of lines) console.log(l);
  process.exit(exitCode);
}
