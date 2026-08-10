#!/bin/sh
# run-night-run-rollup-fixtures.sh -- fixtures for scripts/lib/check-night-run-rollup.sh (SPRINT-059 T3).
#
# The checker exists because a headless sprint-bulk run can end mid-Plan and exit `success`: measured
# at 4 of 7 units on a consumer's host, every commit correct, three tasks never begun, nothing written
# about them. Part 4 now mandates a rollup at every exit and ADR-016 puts the writing of it in the
# launcher's wrapper; this checker refuses to let a missing one pass review, which is what makes the
# step gated rather than merely requested.
#
# Each FAIL case asserts on the checker's OWN NAMED FINDING, not merely on a non-zero exit (L-058).
# A gate's worst failure is the silent false negative, and its second-worst is a red that does not
# say which check tripped -- asserting on the message is what tells those apart. Case 4 is the
# load-bearing NON-failure: a sprint mid-flight has finished nothing yet, and a checker that fired
# there would paint every live sprint red and be switched off within a week.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-night-run-rollup-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-night-run-rollup.sh"
fx="$here/fixtures/night-run-rollup"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1: completed run, no DoD header -> FAIL. The 4-of-7 case exactly. ----------------------
run_case_anywhere "missing-rollup-fails" 1 "carries no 'run · N of M DoD ticked' header" -- \
  sh "$checker" "$fx/missing-rollup/docs/sprint/logs/SPRINT-920-missing-rollup.md"

# --- case 2: completed run, no calibration row -> FAIL, separately named -------------------------
# Both field-report runs finished without writing theirs, and a human reconstructed both rows from
# the harness payload afterwards. That is the failure this case pins.
run_case_anywhere "missing-calibration-fails" 1 "carries no Part 4 calibration row" -- \
  sh "$checker" "$fx/missing-calibration/docs/sprint/logs/SPRINT-921-missing-calibration.md"

# --- case 3: both present -> PASS ---------------------------------------------------------------
run_case_anywhere "wellformed-passes" 0 "DoD header + calibration row present" -- \
  sh "$checker" "$fx/wellformed/docs/sprint/logs/SPRINT-922-wellformed.md"

# --- case 4: no completed run yet -> reported, exit 0, never a FAIL ------------------------------
# The one that keeps the check usable. A live sprint has an Execution Log full of `progress` entries
# and no `complete` event; treating that as a missing rollup would make the gate red for the entire
# duration of every sprint.
run_case_anywhere "midflight-does-not-fire" 0 "no completed-run entry yet" -- \
  sh "$checker" "$fx/no-complete-entry/docs/sprint/logs/SPRINT-923-no-complete-entry.md"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "NIGHT-RUN-ROLLUP FIXTURES: all green"; else echo "NIGHT-RUN-ROLLUP FIXTURES: at least one FAIL"; fi
exit $fail
