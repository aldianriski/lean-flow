#!/bin/sh
# run-revise-loop-ceiling-fixtures.sh -- fixtures for scripts/night-run.sh's revise-loop ceiling
# guard (`check_revise_ceiling()`, T2 SPRINT-098 -- EPIC-015 Closed-when 5).
#
# ADR-022 § Decision item 2 sets the ceiling: one retry per review pass, total; still-open after it
# -> parked-hitl, never a second firing. An unbounded loop and a silently-skipped repair both end in
# a green run, and the run's own report cannot tell them apart -- this checker is what tells them
# apart, by reading the run's own `Tn · retry ·` lines (night-run.md Part 4) back at exit. Wired into
# scripts/night-run.sh's reap() so a ceiling breach becomes the run's own `terminal · HARD_FAILURE ·`
# line, never a silent `PLAN_EXHAUSTED`; also exposed standalone as `--check-revise-loop` for this
# harness to drive in isolation.
#
# Each FAIL case asserts on the checker's OWN NAMED FINDING, never a bare non-zero exit (L-058):
#   revise-loop-ceiling-exceeded    -- a task fired more than one retry in the run's window
#   revise-loop-escalation-missing  -- a still-open retry with no matching parked-hitl line
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-revise-loop-ceiling-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
night_run="$repo_root/scripts/night-run.sh"
fx="$here/fixtures/revise-loop-ceiling"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1 (must-FAIL): a task fires two retries in one run -- the ceiling itself ----------------
# Both outcomes read `fixed`; the ceiling is about HOW MANY firings happened, never about whether
# either one worked (ADR-022 § Decision item 2: "one retry per review pass, total" -- a count, not a
# verdict). Deliberately carries no `still-open` anywhere, so it cannot also arm the escalation rule
# (case 5 below asserts that in the negative).
run_case_anywhere "ceiling-exceeded-fails" 1 "revise-loop-ceiling-exceeded: T4 fired 2 retries" -- \
  sh "$night_run" --check-revise-loop "$fx/ceiling-exceeded/log.md" 0

# --- case 2 (control, L-142): the SAME task shape, one retry only -> PASS -------------------------
# Without this, a checker that FAILed every input would satisfy case 1 alone.
run_case_anywhere "ceiling-ok-sibling" 0 "revise-loop-ceiling: within ADR-022" -- \
  sh "$night_run" --check-revise-loop "$fx/ceiling-ok-sibling/log.md" 0

# --- case 3 (must-FAIL): a still-open retry that never escalates ----------------------------------
# The OTHER half of the ceiling contract: ADR-022 requires a second failure to escalate
# (`parked-hitl`), never to loop or to fall through to a clean-looking `done`. Only one retry line
# here, so this cannot also arm the ceiling-count rule (case 6 asserts that in the negative).
run_case_anywhere "escalation-missing-fails" 1 "revise-loop-escalation-missing: T5 retry ended still-open" -- \
  sh "$night_run" --check-revise-loop "$fx/escalation-missing/log.md" 0

# --- case 4 (control, L-142): the SAME still-open finding, correctly escalated -> PASS ------------
run_case_anywhere "escalation-ok-sibling" 0 "revise-loop-ceiling: within ADR-022" -- \
  sh "$night_run" --check-revise-loop "$fx/escalation-ok-sibling/log.md" 0

# --- case 5/6: each must-FAIL case fails for its OWN reason, not incidentally (L-189) --------------
# Both named findings can plausibly fire off the same malformed log (a task that both over-retries
# AND leaves a still-open uncaught), so a checker that always emitted both would pass cases 1 and 3
# without either one actually isolating anything -- the `calibration-case-stays-isolated` /
# `dod-header-case-stays-isolated` pattern in run-night-run-rollup-fixtures.sh, one level down.
out=$(sh "$night_run" --check-revise-loop "$fx/ceiling-exceeded/log.md" 0 2>&1)
if printf '%s\n' "$out" | grep -q 'revise-loop-ceiling-exceeded' &&
   ! printf '%s\n' "$out" | grep -q 'revise-loop-escalation-missing'; then
  echo "PASS fixture(ceiling-case-stays-isolated): fails on the ceiling count alone, not on escalation"
else
  echo "FAIL fixture(ceiling-case-stays-isolated): the ceiling fixture no longer isolates its own failure -- output:"
  printf '%s\n' "$out"
  fail=1
fi
out=$(sh "$night_run" --check-revise-loop "$fx/escalation-missing/log.md" 0 2>&1)
if printf '%s\n' "$out" | grep -q 'revise-loop-escalation-missing' &&
   ! printf '%s\n' "$out" | grep -q 'revise-loop-ceiling-exceeded'; then
  echo "PASS fixture(escalation-case-stays-isolated): fails on escalation alone, not on the ceiling count"
else
  echo "FAIL fixture(escalation-case-stays-isolated): the escalation fixture no longer isolates its own failure -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 7 family (must-vary-SELECTION, L-186): a run's ceiling never counts an EARLIER run's ----
# retry against it. selection-window/log.md carries two textually-identical `T6 · retry ·` lines --
# one from a PRIOR run's block, one from THIS run's -- separated by a marker comment. Same verdict
# math (crc_n -gt 1) either way; what must differ is which lines enter the window at all.
#
# The cutoff is DERIVED from the fixture, never hand-typed as a line number (L-108/L-130): a
# hardcoded "3" would silently stop matching the moment a comment above it changed the fixture's
# line count, and nothing would say why. This derivation is itself a setup step that can fail
# silently if the marker text ever drifts from the fixture -- guarded explicitly below, and the
# guard is seed-tested (not merely present) per the harness's own README.
sel_fixture="$fx/selection-window/log.md"
sel_marker='<!-- fixture: this-run-window-starts-here -->'
sel_marker_line=$(grep -n "$sel_marker" "$sel_fixture" 2>/dev/null | head -n1 | cut -d: -f1)
if [ -z "${sel_marker_line:-}" ]; then
  echo "FAIL harness: selection-window marker not found in $sel_fixture -- fixture shape changed, re-derive the cutoff"
  fail=1
else
  sel_base=$((sel_marker_line - 1))

  # 7a: fed with base=0 (i.e. as if the window boundary were never applied) -- the two textually
  # identical lines collapse into one task's count, and the guard (correctly, for THIS input) FAILs.
  # This is not the guarantee under test; it is the demonstration of what breaks without it.
  run_case_anywhere "selection-window-wrong-base-fails" 1 "revise-loop-ceiling-exceeded: T6 fired 2 retries" -- \
    sh "$night_run" --check-revise-loop "$sel_fixture" 0

  # 7b: fed with the correctly-derived base -- only this run's single retry is in scope -> PASS.
  # A fixture that varies the verdict alone could pass an unwindowed checker by accident; this one
  # can only pass a checker that actually excludes the prior-run line by membership.
  run_case_anywhere "selection-window-correct-base-ok" 0 "revise-loop-ceiling: within ADR-022" -- \
    sh "$night_run" --check-revise-loop "$sel_fixture" "$sel_base"
fi

# --- case 8 (motivating real artifact, L-166): a genuine attended run that fired the loop twice ---
# in one sprint, once per task, each within ceiling -- docs/sprint/archive/logs/SPRINT-067's own
# committed rollup ("the revise loop fired twice, once per task, both closed at the one-retry
# ceiling"). No real UNATTENDED ADR-022 firing exists in this repo yet (T4, the real unattended
# run, has not happened) -- reported here rather than fabricated, per the brief's own instruction
# that the admission is worth more than a fabricated case. What this case proves instead: the
# guard does not false-positive on a real, compliant, multi-task retry history.
s67="$repo_root/docs/sprint/archive/logs/SPRINT-067-the-proof-layer.md"
if [ ! -f "$s67" ]; then
  echo "FAIL harness: SPRINT-067 archived log not found at $s67 -- the motivating real artifact moved"
  fail=1
else
  run_case_anywhere "sprint067-real-artifact-ok" 0 "revise-loop-ceiling: within ADR-022" -- \
    sh "$night_run" --check-revise-loop "$s67" 0
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "REVISE-LOOP-CEILING FIXTURES: all green"; else echo "REVISE-LOOP-CEILING FIXTURES: at least one FAIL"; fi
exit $fail
