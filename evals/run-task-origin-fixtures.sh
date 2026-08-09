#!/bin/sh
# run-task-origin-fixtures.sh -- must-FAIL/must-PASS fixtures for scripts/lib/check-task-origin.sh
# (SPRINT-055 T6, TASK-172).
#
# G1 fast-paths a "decomposer-approved task" to a one-line scope confirm, and until T6 nothing
# recorded whether a task had met the intake grill -- so the clause was unverifiable prose. A
# close-Retro follow-up and a /triage-converted bug both reach G1 having never been grilled, and
# nothing distinguished them from a decomposer entry that had.
#
# The three cases map to the three ways the field fails to do its job:
#   missing-origin  -- the state the old prose could not distinguish (unstamped reads as fine)
#   invalid-origin  -- a plausible-looking value outside the vocabulary, e.g. someone writing
#                      `origin: grilled` because it sounds like what G1 wants to know
#   stamped         -- control, including a triage-bug entry that must PASS the checker while still
#                      being denied G1's fast-path; the checker guards the FIELD, not the decision
#
# That last distinction matters: this checker is the mechanical half (no task reaches G1 unstamped).
# G1's clause is the procedural half (what to do once the origin is known). Only the first is
# checkable, and conflating them would make the suite claim more coverage than it has.
#
# Retained, never deleted with the scaffolding that built them (L-058, TD-012's lesson).
# Dependency-free POSIX sh. Run bare: sh evals/run-task-origin-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-task-origin.sh"
fx="$here/fixtures/task-origin"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture dir not found at $fx"; exit 2; }

fail=0

# --- case 1: no origin: at all -> FAIL -----------------------------------------------------------
run_case_anywhere "missing-origin" 1 \
  "TASK-800 declares no origin:" -- \
  sh "$checker" "$fx/missing-origin"

# --- case 2: origin outside the vocabulary -> FAIL -----------------------------------------------
run_case_anywhere "invalid-origin" 1 \
  "TASK-801 has origin: 'grilled', which is not one of:" -- \
  sh "$checker" "$fx/invalid-origin"

# --- case 3: stamped entries -> exit 0 (control) -------------------------------------------------
run_case_anywhere "stamped" 0 \
  "TASK-803 origin: triage-bug" -- \
  sh "$checker" "$fx/stamped"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "TASK-ORIGIN FIXTURES: all green"; else echo "TASK-ORIGIN FIXTURES: at least one FAIL"; fi
exit $fail
