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
run_case_anywhere "wellformed-passes" 0 "DoD header + terminal state + calibration row present" -- \
  sh "$checker" "$fx/wellformed/docs/sprint/logs/SPRINT-922-wellformed.md"

# --- case 4: no completed run yet -> reported, exit 0, never a FAIL ------------------------------
# The one that keeps the check usable. A live sprint has an Execution Log full of `progress` entries
# and no `run-complete` event; treating that as a missing rollup would make the gate red for the
# entire duration of every sprint.
run_case_anywhere "midflight-does-not-fire" 0 "no completed-run entry yet" -- \
  sh "$checker" "$fx/no-complete-entry/docs/sprint/logs/SPRINT-923-no-complete-entry.md"

# --- case 5: task-level `complete` does not arm the run-level assertions -> exit 0 ---------------
# The TD-055 misfire shape, pinned as a passing case: an entry header saying a TASK completed
# (`| complete |`) with no rollup block must read as mid-flight, not as a completed run. Before the
# `run-complete` rename this exact log turned the gate red mid-SPRINT-064 (TASK-211).
run_case_anywhere "task-level-complete-does-not-arm" 0 "no completed-run entry yet" -- \
  sh "$checker" "$fx/task-level-complete-does-not-arm/docs/sprint/logs/SPRINT-924-task-level-complete-does-not-arm.md"

# --- case 6 (must-FAIL): completed run, no terminal state (SPRINT-088 T2, Part 0b) ---------------
# The continuation contract's guarded failure, one level up from case 1's. Case 1 catches a run that
# does not say how much of the Plan it finished; this catches one that does not say why it stopped
# being the thing that finishes it. A run can be `9 of 9` and still have stopped for a reason worth
# reading, which is why a full DoD count does not satisfy this and the fixture is deliberately 9-of-9.
run_case_anywhere "missing-terminal-fails" 1 "carries no 'terminal · <STATE> · <reason>' line" -- \
  sh "$checker" "$fx/missing-terminal/docs/sprint/logs/SPRINT-925-missing-terminal.md"

# --- case 6b (must-FAIL): parseable terminal line, unrecognised STATE -----------------------------
# The sibling branch, and the one a regression would ship green: `terminal · FINISHED · ...` has the
# shape and carries no meaning. Without this case a checker that stopped validating the token would
# pass every other case here -- the silent false-negative L-058 is about. Same reasoning the
# gates-signed family already applied to `G1,X2` (its bad-gate-token case).
run_case_anywhere "bad-terminal-token-fails" 1 "carries no 'terminal · <STATE> · <reason>' line" -- \
  sh "$checker" "$fx/bad-terminal-token/docs/sprint/logs/SPRINT-926-bad-terminal-token.md"

# --- case 6c: the neighbouring cases still fail for their OWN reason, not for the new one ---------
# Adding a required field to a checker silently converts every existing must-FAIL fixture into one
# that fails for two reasons, at which point none of them isolates anything. `missing-calibration`
# and `missing-rollup` were each given a valid terminal line for exactly this reason; these two
# assertions are what stop that from rotting back.
out=$(sh "$checker" "$fx/missing-calibration/docs/sprint/logs/SPRINT-921-missing-calibration.md" 2>&1)
if printf '%s\n' "$out" | grep -q 'carries no Part 4 calibration row' &&
   ! printf '%s\n' "$out" | grep -q "carries no 'terminal · "; then
  echo "PASS fixture(calibration-case-stays-isolated): fails on the calibration row alone, not on the terminal state"
else
  echo "FAIL fixture(calibration-case-stays-isolated): the calibration fixture no longer isolates its own failure -- output:"
  printf '%s\n' "$out"
  fail=1
fi
out=$(sh "$checker" "$fx/missing-rollup/docs/sprint/logs/SPRINT-920-missing-rollup.md" 2>&1)
if printf '%s\n' "$out" | grep -q "carries no 'run · N of M DoD ticked' header" &&
   ! printf '%s\n' "$out" | grep -q "carries no 'terminal · "; then
  echo "PASS fixture(dod-header-case-stays-isolated): fails on the DoD header alone, not on the terminal state"
else
  echo "FAIL fixture(dod-header-case-stays-isolated): the DoD-header fixture no longer isolates its own failure -- output:"
  printf '%s\n' "$out"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "NIGHT-RUN-ROLLUP FIXTURES: all green"; else echo "NIGHT-RUN-ROLLUP FIXTURES: at least one FAIL"; fi
exit $fail
