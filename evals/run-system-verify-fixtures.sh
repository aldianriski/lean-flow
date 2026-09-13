#!/bin/sh
# run-system-verify-fixtures.sh -- fixtures for evals/lib/check-system-verify-block.sh (SPRINT-067 T1,
# wired into qa-check.sh at SPRINT-068 T2).
#
# The checker exists because ADR-021 says a system-verify FAIL (dispatch.md § System verify) blocks the
# SILENT close, and nothing mechanically stopped a `| close |` event landing in the log after the FAIL
# line anyway -- exactly the L-120 (a) shape (a red verdict that existed and never reached the decision
# to proceed). Retained per L-058 (a gate is exercised once on input that must FAIL, with its own named
# finding) and TD-012 (fixtures survive the prototype rather than being deleted with it).
#
# Promoted here from evals/fixtures/system-verify/run-checks.sh (SPRINT-067 T1 nested it one level
# deeper on purpose, to stay outside qa-check.sh's `evals/run-*.sh` completeness glob while that task's
# own Plan marked qa-check.sh "run, never edited"). T2's job is exactly that wiring, so the harness now
# lives at the standard top-level `evals/run-*.sh` location every other checker harness uses, and is
# registered in qa-check.sh leg 12 below. The checker itself (evals/lib/check-system-verify-block.sh)
# stays where it is -- promoting it to scripts/lib/ (the "full" wiring evals/README.md once floated) is
# out of T2's editable-path scope (evals/** + qa-check.sh only) and not required for registration.
#
# Each FAIL case asserts on the checker's OWN NAMED FINDING, not merely on a non-zero exit (L-058).
# Case 2 is the load-bearing non-failure: an unattended park never reaches a `| close |` event at all,
# so a checker that fired on "FAIL line present" alone would paint every correctly-parked run red.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-system-verify-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/evals/lib/check-system-verify-block.sh"
fx="$here/fixtures/system-verify"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1: FAIL recorded, closed anyway, no owner ruling -> FAIL, named ------------------------
# The silent-close shape ADR-021 exists to close: a red verdict that existed and did not reach the
# decision to proceed.
run_case_anywhere "silently-closed-fails" 1 "system-verify-fail-silently-closed" -- \
  sh "$checker" "$fx/silently-closed/docs/sprint/logs/SPRINT-930-silently-closed.md"

# --- case 2: FAIL recorded, closed, WITH a recorded owner ruling -> PASS (attended path) ---------
run_case_anywhere "owner-ruled-passes" 0 "recorded owner ruling" -- \
  sh "$checker" "$fx/owner-ruled/docs/sprint/logs/SPRINT-931-owner-ruled.md"

# --- case 3: FAIL recorded, no close event -- the unattended park shape -> PASS ------------------
# A genuinely parked close never runs `/lean-doc-generator close`, so no `| close |` event appears at
# all. This is what a correctly-parked unattended FAIL looks like in the log, not a separate branch.
run_case_anywhere "parked-unattended-passes" 0 "no close event yet" -- \
  sh "$checker" "$fx/parked-unattended/docs/sprint/logs/SPRINT-932-parked-unattended.md"

# --- case 4: system-verify PASS, closed normally -> PASS -----------------------------------------
run_case_anywhere "wellformed-pass-passes" 0 "the gate ran and was green" -- \
  sh "$checker" "$fx/wellformed-pass/docs/sprint/logs/SPRINT-933-wellformed-pass.md"

# --- the no-gate-discovered family (SPRINT-082 T1 · ADR-033) ------------------------------------
# Before T1, every one of these five logs was reported PASS by the same short-circuit ("PASS /
# no-gate-discovered verdict -- nothing to block on"), which is why the family needed both a
# must-FAIL and a control that differ ONLY in the marker: a rule that stopped the silent close by
# blocking every gate-less repo would be a worse rule, and only case 7 can tell the two apart.

# --- case 6: material change, no gate, closed anyway, no ruling -> FAIL, named -------------------
run_case_anywhere "no-gate-material-closed-fails" 1 "system-verify-no-gate-material-silently-closed" -- \
  sh "$checker" "$fx/no-gate-material-closed/docs/sprint/logs/SPRINT-940-no-gate-material-closed.md"

# --- case 7: doc-only change, no gate, closed -> PASS (the control: cheap path preserved) --------
run_case_anywhere "no-gate-low-closed-passes" 0 "cheap path preserved" -- \
  sh "$checker" "$fx/no-gate-low-closed/docs/sprint/logs/SPRINT-941-no-gate-low-closed.md"

# --- case 8: material, no gate, close PARKED (no close event) -> PASS ---------------------------
run_case_anywhere "no-gate-material-parked-passes" 0 "correctly parked" -- \
  sh "$checker" "$fx/no-gate-material-parked/docs/sprint/logs/SPRINT-942-no-gate-material-parked.md"

# --- case 9: material, no gate, closed WITH a recorded owner ruling -> PASS (attended path) ------
run_case_anywhere "no-gate-material-ruled-passes" 0 "recorded owner ruling" -- \
  sh "$checker" "$fx/no-gate-material-ruled/docs/sprint/logs/SPRINT-943-no-gate-material-ruled.md"

# --- case 10: bare no-gate-discovered, no class, closed -> FAIL, named ---------------------------
# The marker's absence is not a claim of low risk.
run_case_anywhere "no-gate-unmarked-closed-fails" 1 "no-gate-risk-unmarked" -- \
  sh "$checker" "$fx/no-gate-unmarked-closed/docs/sprint/logs/SPRINT-944-no-gate-unmarked-closed.md"

# --- the positional-link family (SPRINT-100 T3, TD-086) -----------------------------------------
# Every case above carries exactly ONE `system-verify ·` occurrence. None of them can tell a
# windowed implementation apart from the original whole-file-grep one, because with a single
# occurrence the window IS the whole file from that line on -- the masking bug only shows up once a
# log carries a SECOND occurrence. Reproduced directly (SPRINT-084 T2's independent review, re-run
# against this checker before this fix landed): a day-1 FAIL *with* its ruling, followed by a day-2
# unresolved FAIL *without* one, returned PASS/exit 0 under the old whole-file `has_close`/
# `has_ruling`, because day-1's ruling and day-2's close were both found ANYWHERE in the file. Case
# 11/12 differ ONLY in whether the SECOND entry carries its own ruling -- the minimal pair that
# discriminates a windowed fix from the masking bug it replaces.

# --- case 11: day-1 FAIL+ruling, day-2 FAIL with NO ruling of its own, then close -> FAIL, named ---
# The must-FAIL: day-1's resolved occurrence must not mask day-2's unresolved one.
run_case_anywhere "second-entry-unruled-fails" 1 "system-verify-fail-silently-closed" -- \
  sh "$checker" "$fx/second-entry-unruled/docs/sprint/logs/SPRINT-945-second-entry-unruled.md"

# --- case 12: day-1 FAIL+ruling, day-2 FAIL+ITS OWN ruling, then close -> PASS (sibling control) ---
# Same two-entry shape as case 11, differing only in whether day-2 carries its own ruling.
run_case_anywhere "second-entry-ruled-passes" 0 "recorded owner ruling" -- \
  sh "$checker" "$fx/second-entry-ruled/docs/sprint/logs/SPRINT-946-second-entry-ruled.md"

# --- case 5: an ARCHIVED log carrying the exact silently-closed shape -> skipped, exit 0 ---------
# Location-scoped, matching night-run-rollup/gates-signed/sprint-close's own archive convention: a
# closed sprint is history and its record is not re-litigated. The fixture content is deliberately
# the case-1 violation verbatim (FAIL + close + no ruling) so a regression that started re-checking
# archives would fail loudly here rather than quietly re-opening a settled sprint.
out=$(sh "$checker" "$fx/archived/docs/sprint/archive/logs/SPRINT-935-archived.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && [ -z "$out" ]; then
  echo "PASS fixture(archived-out-of-scope): exit 0 with no output -- archived log not re-checked"
else
  echo "FAIL fixture(archived-out-of-scope): exit $rc, output: $out"; fail=1
fi

# --- live-log reachability (SPRINT-100 T3, TD-086) -----------------------------------------------
# Every case above points at evals/fixtures/ -- a guard that has only ever seen evals/fixtures/ has
# not been shown to reach this repository at all (L-166). qa-check.sh leg 2b carries that exact
# sentence as a comment for check-review-depth.sh's own live-log invocation; this checker's harness
# never had an equivalent, so it had only ever been proven against its own fixtures. Run here
# against THIS repository's real, non-archived Execution Log(s) under docs/sprint/logs/ -- reported,
# never asserted: the repository's live state is not a fixed fixture, and a real FAIL surfaced here
# is a genuine finding for a human to read, not a harness defect to paper over by baking in today's
# answer.
live_files=""
for live_f in "$repo_root"/docs/sprint/logs/*.md; do
  [ -f "$live_f" ] && live_files="$live_files $live_f"
done
echo "----------------------------------------"
if [ -z "$live_files" ]; then
  echo "NOTE live-log reachability: no non-archived sprint log found under docs/sprint/logs/ -- nothing to point the guard at"
else
  live_out=$(sh "$checker" $live_files 2>&1); live_code=$?
  echo "-- live-log run against docs/sprint/logs/ (informational, not asserted) --"
  printf '%s\n' "$live_out"
  echo "-- live-log run exit: $live_code --"
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "SYSTEM-VERIFY FIXTURES: all green"; else echo "SYSTEM-VERIFY FIXTURES: at least one FAIL"; fi
exit $fail
