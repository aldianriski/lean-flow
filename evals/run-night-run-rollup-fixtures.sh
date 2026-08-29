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

# --- case 7 family (must-FAIL / control): the agreement matrix (SPRINT-093 T1, DoD 1) -------------
# night-run.md Part 0b maps each of the six Part 4 task states to exactly one terminal state:
#   done                  -> no line at all (Part 4: "done tasks need no per-task line")
#   parked-hitl | blocked -> AUTHORITY_BOUNDARY
#   stalled | denied-tool -> HARD_FAILURE
#   unattempted           -> BUDGET_STOP
# Each must-FAIL case below pairs a terminal state with a per-task line the contract maps
# ELSEWHERE, and each "-ok" case is the matching sibling control that must stay green (L-142). The
# `-vs-parked` case is the motivating SPRINT-089 shape in miniature: PLAN_EXHAUSTED beside a parked
# task. HARD_FAILURE and USER_STOP get their own controls below asserting the checker does NOT
# fire on them -- the contract is silent on what per-task states those two rule out (HARD_FAILURE
# can also come from a bare non-zero process exit, invisible in the log text; USER_STOP is an
# external interrupt that can land mid-task in any state), so nothing is asserted rather than
# guessing at a rule night-run.md does not state.
run_case_anywhere "exhausted-vs-blocked-fails" 1 "PLAN_EXHAUSTED but carries a non-done per-task line" -- \
  sh "$checker" "$fx/agreement-exhausted-vs-blocked/docs/sprint/logs/SPRINT-930-agreement-exhausted-vs-blocked.md"
run_case_anywhere "exhausted-vs-parked-fails" 1 "PLAN_EXHAUSTED but carries a non-done per-task line" -- \
  sh "$checker" "$fx/agreement-exhausted-vs-parked/docs/sprint/logs/SPRINT-931-agreement-exhausted-vs-parked.md"
run_case_anywhere "exhausted-vs-stalled-fails" 1 "PLAN_EXHAUSTED but carries a non-done per-task line" -- \
  sh "$checker" "$fx/agreement-exhausted-vs-stalled/docs/sprint/logs/SPRINT-932-agreement-exhausted-vs-stalled.md"
run_case_anywhere "exhausted-vs-denied-fails" 1 "PLAN_EXHAUSTED but carries a non-done per-task line" -- \
  sh "$checker" "$fx/agreement-exhausted-vs-denied/docs/sprint/logs/SPRINT-933-agreement-exhausted-vs-denied.md"
run_case_anywhere "exhausted-vs-unattempted-fails" 1 "PLAN_EXHAUSTED but carries a non-done per-task line" -- \
  sh "$checker" "$fx/agreement-exhausted-vs-unattempted/docs/sprint/logs/SPRINT-934-agreement-exhausted-vs-unattempted.md"
run_case_anywhere "authority-vs-stalled-fails" 1 "AUTHORITY_BOUNDARY but carries a per-task line Part 0b maps elsewhere" -- \
  sh "$checker" "$fx/agreement-authority-vs-stalled/docs/sprint/logs/SPRINT-935-agreement-authority-vs-stalled.md"
run_case_anywhere "authority-vs-unattempted-fails" 1 "AUTHORITY_BOUNDARY but carries a per-task line Part 0b maps elsewhere" -- \
  sh "$checker" "$fx/agreement-authority-vs-unattempted/docs/sprint/logs/SPRINT-936-agreement-authority-vs-unattempted.md"
run_case_anywhere "authority-ok" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/agreement-authority-ok/docs/sprint/logs/SPRINT-937-agreement-authority-ok.md"
# BUDGET_STOP + a LONE blocked/parked-hitl line, no unattempted line at all, is NOT a contradiction
# (SPRINT-093 T1 revise, independent review finding): reap() reaches BUDGET_STOP purely off
# rp_unatt > 0 and never consults rp_parked once it does -- so blocked/parked-hitl never rules
# BUDGET_STOP out, with or without an unattempted line present. Was wrongly asserted must-FAIL
# before the fix; corrected to its true sibling-control shape.
run_case_anywhere "budget-vs-blocked-ok" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/agreement-budget-vs-blocked/docs/sprint/logs/SPRINT-938-agreement-budget-vs-blocked.md"
run_case_anywhere "budget-vs-denied-fails" 1 "BUDGET_STOP but carries a per-task line reap()'s priority order ranks above it" -- \
  sh "$checker" "$fx/agreement-budget-vs-denied/docs/sprint/logs/SPRINT-939-agreement-budget-vs-denied.md"
run_case_anywhere "budget-ok" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/agreement-budget-ok/docs/sprint/logs/SPRINT-940-agreement-budget-ok.md"
# The missing mixed-case (independent review finding): TWO different non-done states present at
# once -- unattempted AND parked-hitl together under BUDGET_STOP -- is the actual motivating shape
# (a run parks a J2 task per Part 0, continues disjoint AFK work, then exhausts its budget on a
# later task). Every other fixture in this suite has exactly ONE non-done state, which is why the
# BUDGET_STOP-vs-blocked defect got through undetected.
run_case_anywhere "budget-mixed-with-parked-ok" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/agreement-budget-mixed-with-parked-ok/docs/sprint/logs/SPRINT-943-agreement-budget-mixed-with-parked-ok.md"
run_case_anywhere "hardfailure-unasserted-stays-green" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/agreement-hardfailure-unasserted/docs/sprint/logs/SPRINT-941-agreement-hardfailure-unasserted.md"
run_case_anywhere "userstop-unasserted-stays-green" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/agreement-userstop-unasserted/docs/sprint/logs/SPRINT-942-agreement-userstop-unasserted.md"

# --- case 8: the SPRINT-089 real committed artifact (SPRINT-093 T1, DoD 2) -------------------------
# L-166: the fixture must point at the REAL committed rollup, not a synthetic reconstruction. The
# false rollup the reaper actually wrote is committed at
# docs/sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md, but quoted INDENTED inside a
# fenced code block on purpose (L-108/L-176: "a guard must never read an example of a rollup as a
# rollup") -- so it does not arm this checker in its committed form, by design. Reproduced the same
# way that log's own independent reviewer reproduced TD-112 (same file: "reconstructed the reaper's
# raw un-indented lines, appended them at column 1 to a copy of the pre-fix log, and watched
# check-night-run-rollup.sh PASS the false rollup"): every string below is `grep`-extracted from a
# committed file at run time, none hand-typed, so an edit to either archived log makes this fail
# loud rather than silently drift from its source. Retained here rather than deleted with the
# prototype (TD-012).
s89="$repo_root/docs/sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md"
s90="$repo_root/docs/sprint/archive/logs/SPRINT-090-run-evidence-vehicle.md"
[ -f "$s89" ] || { echo "FAIL harness: SPRINT-089 archived log not found at $s89"; fail=1; }
[ -f "$s90" ] || { echo "FAIL harness: SPRINT-090 archived log not found at $s90"; fail=1; }

s89_dod=$(grep -m1 -oE 'run · [0-9]+ of [0-9]+ DoD ticked' "$s89" 2>/dev/null)
s89_term=$(grep -m1 -oE 'terminal · PLAN_EXHAUSTED · .*' "$s89" 2>/dev/null)
s89_cal=$(grep -m1 -oE 'run · \$[0-9.]+ · [0-9]+ turns · [0-9]+ min · [0-9]+ of [0-9]+ units · inline' "$s89" 2>/dev/null)
# T2's true state -- pulled from SPRINT-090's real, already-column-1, correctly-targeted rollup
# (never indented, because it was written to the RIGHT file). SPRINT-089's own log only ever
# CITES this fact in prose ("Rollup: `run · 6 of 6 DoD ticked`, `T1 · done`, `T2 · parked-hitl`.");
# the full reason text lives in SPRINT-090's own committed rollup line.
s90_t2=$(grep -m1 -E '^T2 · parked-hitl · ' "$s90" 2>/dev/null)
s90_t1=$(grep -m1 -E '^T1 · done · ' "$s90" 2>/dev/null)
s90_dod=$(grep -m1 -oE '^run · [0-9]+ of [0-9]+ DoD ticked' "$s90" 2>/dev/null)
s90_term=$(grep -m1 -oE '^terminal · AUTHORITY_BOUNDARY · .*' "$s90" 2>/dev/null)
s90_cal=$(grep -m1 -oE '^run · cost unavailable · .* · [0-9]+ of [0-9]+ units · inline' "$s90" 2>/dev/null)
s90_hdr=$(grep -m1 -E '^### .*\| *run-complete *\|' "$s90" 2>/dev/null)

extract_ok=1
for v in s89_dod s89_term s89_cal s90_t2 s90_t1 s90_dod s90_term s90_cal s90_hdr; do
  eval "val=\$$v"
  if [ -z "$val" ]; then
    echo "FAIL harness: extraction of '$v' from the real committed archive came back empty -- the source doc changed shape; re-derive the pattern"
    fail=1
    extract_ok=0
  fi
done

if [ "$extract_ok" -eq 1 ]; then
  work89=$(CDPATH= cd -- "$here" && pwd)/.tmp-sprint089-motivating
  rm -rf "$work89" 2>/dev/null
  mkdir -p "$work89"
  {
    printf 'sprint: 989\nslug: sprint089-motivating\nstatus: active\n\n'
    printf '# SPRINT-989 — Execution Log (real-artifact fixture, SPRINT-093 T1 DoD 2)\n\n'
    printf '### 2026-08-27 | run-complete | run exited\n\n'
    printf '%s\n' "$s89_dod"
    printf '%s\n' "$s89_term"
    printf '%s\n' "$s90_t2"
    printf '\n%s\n' "$s89_cal"
  } > "$work89/rollup.md"
  run_case_anywhere "sprint089-real-artifact-fails" 1 "PLAN_EXHAUSTED but carries a non-done per-task line" -- \
    sh "$checker" "$work89/rollup.md"

  # Sibling control (L-142): the SAME real T1/T2 facts, under the terminal state SPRINT-090's own
  # correctly-targeted rollup actually recorded (`AUTHORITY_BOUNDARY`) -- pulled verbatim from that
  # file's own already-column-1 lines, not reconstructed. Must stay green.
  work90=$(CDPATH= cd -- "$here" && pwd)/.tmp-sprint090-groundtruth
  rm -rf "$work90" 2>/dev/null
  mkdir -p "$work90"
  {
    printf 'sprint: 990\nslug: sprint090-groundtruth\nstatus: active\n\n'
    printf '# SPRINT-990 — Execution Log (real-artifact sibling control, SPRINT-093 T1 DoD 2)\n\n'
    printf '%s\n\n' "$s90_hdr"
    printf '%s\n' "$s90_dod"
    printf '%s\n' "$s90_term"
    printf '%s\n' "$s90_t1"
    printf '%s\n' "$s90_t2"
    printf '\n%s\n' "$s90_cal"
  } > "$work90/rollup.md"
  run_case_anywhere "sprint090-real-artifact-ok" 0 "agrees with its per-task lines" -- \
    sh "$checker" "$work90/rollup.md"
  rm -rf "$work89" "$work90" 2>/dev/null
fi

# --- case 9 family: the reaper writes into the Plan the run was actually pointed at (SPRINT-093 T1,
# DoD 3/4) ------------------------------------------------------------------------------------------
# TD-112: SPRINT-089's reaper found two `status: active` sprint files (SPRINT-089, SPRINT-090) and
# silently wrote into the alphabetically-first one -- the WRONG sprint's log got the rollup, and the
# terminal state it derived (`PLAN_EXHAUSTED`) was internally consistent with THAT file's empty
# task-state history, which is why it read as correct until someone checked which file it landed in.
# Fixed in night-run.sh: find_sprint() now refuses ambiguity (0 or >1 active matches -> return 1,
# same safe failure as "not found") instead of picking the first match, and a new `--sprint FILE`
# launcher option lets the target be DECLARED rather than re-inferred. Exercised here directly
# against night-run.sh's `--reap` re-entry point -- the exact code path the launcher's detached
# wrapper invokes at exit -- each case copied into a scratch dir first so the checked-in fixture
# tree is never mutated by the test itself (it would otherwise accumulate a rollup block on every
# run of this suite).
fx2="$here/fixtures/night-run-reaper"
night_run="$repo_root/scripts/night-run.sh"

reaper_scratch() {
  rs_name=$1
  rs_dir=$(CDPATH= cd -- "$here" && pwd)/.tmp-reaper-$rs_name
  rm -rf "$rs_dir" 2>/dev/null
  mkdir -p "$rs_dir"
  (cd "$fx2/$rs_name" && tar cf - .) | (cd "$rs_dir" && tar xf -)
  printf '%s' "$rs_dir"
}

# Case 9a (must-NOT-write, both sides): two active sprints, no --sprint declared. The reaper must
# refuse to guess -- neither log may gain a line. This is the ambiguity SPRINT-089 hit for real.
rs=$(reaper_scratch two-active-refuses)
logA_before=$(cat "$rs/docs/sprint/logs/SPRINT-950-a.md")
logB_before=$(cat "$rs/docs/sprint/logs/SPRINT-951-b.md")
sh "$night_run" --reap "$rs/run.log" "$rs" "1700000000" "0" "" >/dev/null 2>&1
logA_after=$(cat "$rs/docs/sprint/logs/SPRINT-950-a.md")
logB_after=$(cat "$rs/docs/sprint/logs/SPRINT-951-b.md")
if [ "$logA_before" = "$logA_after" ] && [ "$logB_before" = "$logB_after" ]; then
  echo "PASS fixture(two-active-refuses): ambiguous target -- neither SPRINT-950's nor SPRINT-951's log gained a line"
else
  echo "FAIL fixture(two-active-refuses): the reaper wrote somewhere despite an ambiguous (2-active) target -- SPRINT-089's cross-write recurred"
  fail=1
fi
rm -rf "$rs" 2>/dev/null

# Case 9b (must-write, correctly targeted): the SAME two-active-sprint tree, but with the target
# DECLARED via the 5th --reap positional (what --sprint resolves to before firing). Only the
# declared sprint's log may change; the other must stay byte-identical to its pristine copy -- this
# is the SPRINT-089 cross-write's exact negative space: "a run pointed at sprint A leaves no line in
# sprint B's log."
rs=$(reaper_scratch two-active-refuses)
logA_before=$(cat "$rs/docs/sprint/logs/SPRINT-950-a.md")
sh "$night_run" --reap "$rs/run.log" "$rs" "1700000000" "0" "$rs/docs/sprint/SPRINT-951-b.md" >/dev/null 2>&1
logA_after=$(cat "$rs/docs/sprint/logs/SPRINT-950-a.md")
if [ "$logA_before" != "$logA_after" ]; then
  echo "FAIL fixture(two-active-declared-targets-correctly): SPRINT-950's (undeclared) log changed when the run was pointed at SPRINT-951"
  fail=1
elif ! grep -qE '^### .*\| *run-complete *\|' "$rs/docs/sprint/logs/SPRINT-951-b.md" 2>/dev/null; then
  echo "FAIL fixture(two-active-declared-targets-correctly): SPRINT-951's (declared) log did NOT gain a rollup"
  fail=1
else
  echo "PASS fixture(two-active-declared-targets-correctly): declared target SPRINT-951 got the rollup; SPRINT-950 stayed untouched"
fi
rm -rf "$rs" 2>/dev/null

# Case 9c (backward-compat control): a single active sprint, no --sprint declared -- the pre-fix
# mainline shape. Must still resolve and write, proving the ambiguity refusal did not also disable
# the ordinary (unambiguous) case.
rs=$(reaper_scratch single-active-baseline)
sh "$night_run" --reap "$rs/run.log" "$rs" "1700000000" "0" "" >/dev/null 2>&1
out=$(sh "$checker" "$rs/docs/sprint/logs/SPRINT-960-solo.md" 2>&1); ec=$?
if [ "$ec" -eq 0 ] && printf '%s\n' "$out" | grep -q 'agrees with its per-task lines'; then
  echo "PASS fixture(single-active-baseline-unaffected): the sole-active-sprint case still resolves and writes a well-formed rollup"
else
  echo "FAIL fixture(single-active-baseline-unaffected): the ambiguity fix broke the ordinary single-sprint case -- output:"
  printf '%s\n' "$out"
  fail=1
fi
rm -rf "$rs" 2>/dev/null

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "NIGHT-RUN-ROLLUP FIXTURES: all green"; else echo "NIGHT-RUN-ROLLUP FIXTURES: at least one FAIL"; fi
exit $fail
