#!/bin/sh
# run-qa-budget-fixtures.sh -- fixtures for scripts/lib/qa-budget-check.sh (SPRINT-084 T1, TD-084).
#
# TD-084: qa-check.sh was killed three times by an EXTERNAL timeout with no verdict line printed at
# all. This suite guards the mechanism that keeps a FUTURE regression from reproducing that shape
# silently: qa_budget_check must actually detect an over-budget run and say so (case 2), must stay
# quiet on an ordinary in-budget run (case 1, the sibling control), and must not fire at all when a
# run has deliberately opted into the heavy legs via QA_FULL (case 3 -- the "heavy legs stay
# reachable" constraint depends on the budget NOT gating that path). Every case here runs the real
# function against a synthetic start time -- no sleeping, no real over-budget run needed to prove the
# detection fires.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-qa-budget-fixtures.sh

set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
lib="$repo_root/scripts/lib/qa-budget-check.sh"
. "$here/lib/harness-common.sh"

[ -f "$lib" ] || { echo "FAIL harness: lib not found at $lib"; exit 2; }

fail=0
now=$(date +%s)
far_past=$((now - 9999))

# --- case 1 (PASS control): an ordinary in-budget run reports OK, exit 0 -------------------------
# `start` is "now", budget is generous -- elapsed is ~0s, nowhere near the budget. This is the sibling
# control the must-FAIL case below is checked against: it must stay green when the mechanism is
# working AND stay green even when case 2's break is seeded (the break below only inverts the
# over-budget comparison, which this case's near-zero elapsed never reaches either way).
#
# NOT an exact "OK 0 300" match: `now` is captured once above, and qa_budget_check takes its OWN
# `date +%s` reading a moment later -- if a wall-clock second boundary falls between the two calls,
# elapsed reads 1, not 0. Caught live: this exact line flaked green-then-red across two otherwise
# identical runs of this file before the pattern below replaced the exact match (self-referential,
# but the fixture's own history is the evidence). A handful of seconds is still nowhere near a
# 300s budget, which is the property being proved.
out1=$(sh -c ". '$lib' && qa_budget_check $now 300 0" 2>&1); rc1=$?
if [ "$rc1" -eq 0 ] && printf '%s' "$out1" | grep -qE '^OK [0-9] 300$'; then
  echo "PASS fixture(in-budget-reports-ok): exit $rc1, $out1"
else
  echo "FAIL fixture(in-budget-reports-ok): exit $rc1 -- output: $out1"; fail=1
fi

# --- case 2 (must-FAIL of the SCENARIO / must-PASS of the fixture): a run whose start is far in the
# past against a tiny budget is detected as OVER, exit 1, and the elapsed/budget numbers are the ones
# named -- never silently reported as OK. This is TD-084's shape in miniature: a run that WOULD run
# past its budget must say so, not just keep going. If qa_budget_check's comparison is ever broken
# (see the discrimination proof this fixture's own history records), THIS case is the one that reddens.
out=$(sh -c ". '$lib' && qa_budget_check $far_past 1 0" 2>&1); rc=$?
# Elapsed is measured a second time INSIDE qa_budget_check (a fresh `date +%s`), so it can read one
# second higher than `far_past`'s own computation here -- exact-second matching would be flaky by
# construction. The budget figure and the OVER/rc=1 shape are what the case is actually proving.
if [ "$rc" -eq 1 ] && printf '%s' "$out" | grep -qE '^OVER [0-9]+ 1$'; then
  echo "PASS fixture(over-budget-reports-over): exit $rc, $out"
else
  echo "FAIL fixture(over-budget-reports-over): exit $rc -- output: $out"; fail=1
fi

# --- case 3 (PASS control): QA_FULL's bypass -- a run that opted into the heavy legs is NEVER
# reported as over-budget, however far in the past its start is. Constraint: heavy legs remain
# reachable under their explicit flag, not squeezed by this guard.
run_case_anywhere "qa-full-bypasses-budget" 0 "OK 0 1" -- \
  sh -c ". '$lib' && qa_budget_check $far_past 1 1"

[ "$fail" -eq 0 ] && echo "PASS harness: qa-budget-check discriminates (case 2 reddens on an over-budget scenario; cases 1/3 stay green)"
exit $fail
