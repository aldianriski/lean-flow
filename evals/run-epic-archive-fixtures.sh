#!/bin/sh
# run-epic-archive-fixtures.sh -- must-FAIL/must-PASS fixtures for scripts/lib/check-epic-archive.sh,
# the checker qa-check.sh delegates STANDARD §11's epic retention row to (SPRINT-055 T2, TASK-167).
#
# The §11 row shipped with the epic layer and `close` never executed it, so the rule had never run
# once -- EPIC-001 sat closed and fully ticked in docs/epic/ across five sprints while every gate
# reported green. A retention rule nothing enforces does not announce that it stopped.
#
# Both directions get fixtures because both are silent:
#   premature / no-conditions  -- archived without earning it (what §11 explicitly warns about)
#   eligible-unarchived        -- earned it and never moved (what actually happened)
# Testing only the first would pass the exact repo state this task was filed to fix.
#
# Retained, never deleted with the scaffolding that built them (L-058, TD-012's lesson).
# Dependency-free POSIX sh. Run bare: sh evals/run-epic-archive-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-epic-archive.sh"
fx="$here/fixtures/epic-archive"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture dir not found at $fx"; exit 2; }

fail=0

# --- case 1: archived while an exit condition is still open -> FAIL ------------------------------
# Every member sprint had closed, so a count-based rule would have waved this through. That is the
# failure §11's row names in its own text.
run_case_anywhere "premature" 1 \
  "archived with 1 § Closed when condition(s) still open" -- \
  sh "$checker" "$fx/premature"

# --- case 2: eligible and still sitting in docs/epic/ -> FAIL -----------------------------------
# The recorded shape: EPIC-001, closed and fully ticked, unmoved for five sprints.
run_case_anywhere "eligible-unarchived" 1 \
  "is closed with every § Closed when condition met" -- \
  sh "$checker" "$fx/eligible-unarchived"

# --- case 3: archived with NO exit conditions at all -> FAIL ------------------------------------
# "All conditions met" is vacuously true for an epic that states none, so the empty section has to
# be its own finding rather than the happy path.
run_case_anywhere "no-conditions" 1 \
  "archived with no § Closed when conditions at all" -- \
  sh "$checker" "$fx/no-conditions"

# --- case 4: correctly archived -> exit 0 (control) ----------------------------------------------
run_case_anywhere "properly-archived" 0 \
  "archived correctly (2 condition(s), all met, status closed" -- \
  sh "$checker" "$fx/properly-archived"

# --- case 5: live epic with work left -> exit 0 (control) ---------------------------------------
# Without cases 4 and 5, a checker that FAILed unconditionally would satisfy every case above.
run_case_anywhere "live-open" 0 \
  "correctly live (status 'active', 1 of 2 condition(s) open)" -- \
  sh "$checker" "$fx/live-open"


# --- case 6: archived while a member sprint is still open -> FAIL --------------------------------
# §11's trigger is a genuine TWO-PART test and this checker enforced only the second half until
# SPRINT-080 T4. This is the silent direction: every exit condition ticked, so a conditions-only rule
# waves it through while a sprint that belongs to the epic is still running. §11 names exactly this
# -- "never archive on member-sprint count alone -- an epic whose last sprint closed with exit
# conditions unmet is unfinished, not done, and archiving it hides that".
run_case_anywhere "archived-member-open" 1 \
  "archived while member sprint(s) 906 are still open" -- \
  sh "$checker" "$fx/archived-member-open"

# --- case 7: closed and fully ticked, but a member sprint is open -> exit 0 (control) -------------
# The state that was previously unrepresentable, and the false positive that fired on EPIC-004 at
# SPRINT-080 T4: the epic is finished, the sprint that finished it is not. Demanding the move here
# would ask for an archive §11 forbids. Without this control, case 6 is satisfied by a checker that
# simply refuses every epic naming an open member.
run_case_anywhere "closed-member-open" 0 \
  "correctly NOT yet archived" -- \
  sh "$checker" "$fx/closed-member-open"
echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "EPIC-ARCHIVE FIXTURES: all green"; else echo "EPIC-ARCHIVE FIXTURES: at least one FAIL"; fi
exit $fail
