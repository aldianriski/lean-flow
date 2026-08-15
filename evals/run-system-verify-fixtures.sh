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
run_case_anywhere "wellformed-pass-passes" 0 "nothing to block on" -- \
  sh "$checker" "$fx/wellformed-pass/docs/sprint/logs/SPRINT-933-wellformed-pass.md"

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

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "SYSTEM-VERIFY FIXTURES: all green"; else echo "SYSTEM-VERIFY FIXTURES: at least one FAIL"; fi
exit $fail
