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


# --- case 9 (must-FAIL / control pair): a log that QUOTES the retry format inside its own window --
# The self-describing-corpus failure (L-108), found by T2's outside review and reproduced verbatim:
# before the fence-stripping fix, this fixture returned `FAIL revise-loop-ceiling-exceeded: T4 fired
# 2 retries` for a run in which no retry ever fired. It is the same incident `reap()` already
# carries a comment about (a `T5 · unattempted ·` line inside a documentation example), recurring
# one function over because the new checker inherited the windowing and not the hardening.
# This case is the CONTROL half -- it must stay green -- and `ceiling-exceeded-fails` above is its
# must-FAIL sibling: identical line shape, differing only in whether the lines sit inside a fence.
fenced="$fx/fenced-doc-example/log.md"
if [ ! -f "$fenced" ]; then
  echo "FAIL harness: fenced-doc-example fixture not found at $fenced -- the L-108 control is gone"
  fail=1
else
  run_case_anywhere "fenced-doc-example-does-not-fire" 0 "revise-loop-ceiling: within ADR-022" -- \
    sh "$night_run" --check-revise-loop "$fenced" 0
fi

# --- case 10 (must-FAIL): a non-numeric base FAILs rather than failing OPEN ----------------------
# Also from the outside review. `--check-revise-loop <log> abc` used to emit a shell error on
# stderr and then print PASS at exit 0 -- for a guard, failing open is the one direction that must
# never happen. reap()'s production caller always passes a clean integer, so this is reachable only
# through the standalone entry; it is guarded anyway, because "unreachable today" is how a guard
# becomes reachable tomorrow.
run_case_anywhere "non-numeric-base-fails-closed" 1 "revise-loop-ceiling-unreadable: base cutoff abc is not a line number" -- \
  sh "$night_run" --check-revise-loop "$fenced" abc

# --- case 11 family (SPRINT-143 T2): rejected and deferred outcomes -------------------------------
# A finding closed without a fix is `rejected (<evidence>)` or `deferred (<impact> → TASK/TD)`. Unattended
# both are judgements, so both park like still-open; a rejection names its evidence INSIDE its own
# parenthesis (test · check · fixture · owner-ruling).
# 11a (must-FAIL): a parked rejection whose parenthesis names no evidence token.
run_case_anywhere "rejection-unevidenced-fails" 1 "revise-loop-rejection-unevidenced: T7 rejected a finding without evidence" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-unevidenced/log.md" 0
# 11b (control, L-142): the SAME rejection with `fixture` inside the parenthesis -> PASS.
run_case_anywhere "rejection-evidenced-sibling" 0 "revise-loop-ceiling: within ADR-022" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-evidenced-sibling/log.md" 0
# 11c (must-vary-SELECTION, L-186): an evidence token in the FINDING text, none in the parenthesis. A
# checker that matched the token anywhere on the line would pass this; only one reading the parenthesis FAILs.
run_case_anywhere "rejection-token-outside-fails" 1 "revise-loop-rejection-unevidenced: T7 rejected a finding without evidence" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-token-outside/log.md" 0
# 11d (must-FAIL): a deferral that never parked -- the escalation rule, reached by the new outcome word.
run_case_anywhere "deferred-escalation-missing-fails" 1 "revise-loop-escalation-missing: T8 retry ended deferred" -- \
  sh "$night_run" --check-revise-loop "$fx/deferred-escalation-missing/log.md" 0
# 11f (must-FAIL): an EVIDENCED rejection that never parked -- without this, dropping `rejected` from the
# escalation rule would leave every case green (Codex R1, SPRINT-143 T2).
run_case_anywhere "rejection-unparked-fails" 1 "revise-loop-escalation-missing: T7 retry ended rejected" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-unparked/log.md" 0
# 11g/11h (must-vary-SELECTION): evidence the checker must NOT read -- a quoted EARLIER outcome on the same
# line, and a token just past the rejection's closing parenthesis. Only the actual outcome's own
# parenthesis counts (Codex R1 parser counterexamples).
run_case_anywhere "rejection-prior-outcome-quoted-fails" 1 "revise-loop-rejection-unevidenced: T7 rejected a finding without evidence" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-prior-outcome-quoted/log.md" 0
run_case_anywhere "rejection-paren-crossing-fails" 1 "revise-loop-rejection-unevidenced: T7 rejected a finding without evidence" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-paren-crossing/log.md" 0
# 11j/11k (must-FAIL, Codex R2): an arrow INSIDE the rejection's own parenthesis must never be read as the
# outcome -- before the depth-aware parse, `rejected (… → fixed)` skipped both the evidence and the park rule.
run_case_anywhere "rejection-inner-arrow-parked-fails" 1 "revise-loop-rejection-unevidenced: T7 rejected a finding without evidence" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-inner-arrow-parked/log.md" 0
run_case_anywhere "rejection-inner-arrow-unparked-fails" 1 "revise-loop-escalation-missing: T7 retry ended rejected" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-inner-arrow-unparked/log.md" 0
# 11l (must-FAIL, Codex R3): an unmatched `(` in the finding text used to hide the real outcome, and the
# checker passed it. A line whose outcome cannot be read now FAILs by name -- fail closed, never open.
run_case_anywhere "outcome-unbalanced-paren-fails" 1 "revise-loop-outcome-unparseable: T7 has a retry line whose outcome cannot be read" -- \
  sh "$night_run" --check-revise-loop "$fx/outcome-unbalanced-paren/log.md" 0
# 11m (control, Codex R3): evidence after a NESTED parenthesis still counts -- read to the MATCHING `)`.
run_case_anywhere "rejection-nested-evidence-sibling" 0 "revise-loop-ceiling: within ADR-022" -- \
  sh "$night_run" --check-revise-loop "$fx/rejection-nested-evidence-sibling/log.md" 0
# 11i (control): the reverse -- a finding quoting an old `-> rejected (...)` whose ACTUAL outcome is `fixed`
# needs no park and no evidence -> PASS.
run_case_anywhere "quoted-rejection-then-fixed-ok" 0 "revise-loop-ceiling: within ADR-022" -- \
  sh "$night_run" --check-revise-loop "$fx/quoted-rejection-then-fixed/log.md" 0
out=$(sh "$night_run" --check-revise-loop "$fx/rejection-unparked/log.md" 0 2>&1)
if printf '%s\n' "$out" | grep -q 'revise-loop-escalation-missing' &&
   ! printf '%s\n' "$out" | grep -qE 'revise-loop-(rejection-unevidenced|ceiling-exceeded)'; then
  echo "PASS fixture(rejection-unparked-stays-isolated): fails on the missing park alone"
else
  echo "FAIL fixture(rejection-unparked-stays-isolated): the unparked-rejection fixture no longer isolates its own failure -- output:"
  printf '%s\n' "$out"
  fail=1
fi
# 11e (L-189): each new must-FAIL case fails for its own reason only.
out=$(sh "$night_run" --check-revise-loop "$fx/rejection-unevidenced/log.md" 0 2>&1)
if printf '%s\n' "$out" | grep -q 'revise-loop-rejection-unevidenced' &&
   ! printf '%s\n' "$out" | grep -qE 'revise-loop-(escalation-missing|ceiling-exceeded)'; then
  echo "PASS fixture(rejection-case-stays-isolated): fails on the missing evidence alone"
else
  echo "FAIL fixture(rejection-case-stays-isolated): the rejection fixture no longer isolates its own failure -- output:"
  printf '%s\n' "$out"
  fail=1
fi
out=$(sh "$night_run" --check-revise-loop "$fx/deferred-escalation-missing/log.md" 0 2>&1)
if printf '%s\n' "$out" | grep -q 'revise-loop-escalation-missing' &&
   ! printf '%s\n' "$out" | grep -qE 'revise-loop-(rejection-unevidenced|ceiling-exceeded)'; then
  echo "PASS fixture(deferred-case-stays-isolated): fails on the missing park alone"
else
  echo "FAIL fixture(deferred-case-stays-isolated): the deferred fixture no longer isolates its own failure -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 12 family (SPRINT-146 T2, TASK-529): the PASS line states what it actually read ---------
# The `Tn · retry ·` lines are written by the model; nothing mechanical forces a retry through a door,
# so an unlogged retry and no retry both PASS (TD-152). The verdict therefore names its N and the limit.
# 12a: zero retry lines -> the scoped line with "0 retry line(s)", never the bare PASS.
run_case_anywhere "pass-scoped-zero-retry-lines" 0 "-- 0 retry line(s) read, all model-reported; an unlogged retry is undetectable (TD-152)" -- \
  sh "$night_run" --check-revise-loop "$fx/no-retry-lines/log.md" 0
# 12b: two tasks, one retry each, within ceiling -> the scoped line with its count.
run_case_anywhere "pass-scoped-counts-retry-lines" 0 "-- 2 retry line(s) read, all model-reported; an unlogged retry is undetectable (TD-152)" -- \
  sh "$night_run" --check-revise-loop "$fx/ceiling-ok-two-tasks/log.md" 0
# 12c (must-vary-SELECTION): fenced `Tn · retry ·` lines are quoted documentation, not counted.
run_case_anywhere "pass-scoped-fenced-not-counted" 0 "-- 0 retry line(s) read, all model-reported" -- \
  sh "$night_run" --check-revise-loop "$fenced" 0
# 12d (window): the selection-window fixture with the derived base counts only THIS run's line.
run_case_anywhere "pass-scoped-window-counts-this-run" 0 "-- 1 retry line(s) read, all model-reported" -- \
  sh "$night_run" --check-revise-loop "$sel_fixture" "$sel_base"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "REVISE-LOOP-CEILING FIXTURES: all green"; else echo "REVISE-LOOP-CEILING FIXTURES: at least one FAIL"; fi
exit $fail
