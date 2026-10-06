#!/bin/sh
# run-qa-budget-position-fixtures.sh -- fixtures for the early qb_checkpoint calls threaded through
# scripts/qa-check.sh legs 2-12 (SPRINT-086 T3, TD-091, lateness path (b)).
#
# SPRINT-085's blocker, attempts 2 and 3: QA_BUDGET_SECONDS was lowered BELOW the 600s command
# ceiling and the guard STILL never fired, because fork exhaustion killed the run before the
# eval-harness loop at leg 12 ever reached its own check -- confirmed live in THIS repo, where a
# bare run just took 9m12s wall-clock with leg 12 not starting until ~84% of its output. The fix
# threads the SAME qa_budget_check function through checkpoints at every leg boundary in legs 2-12,
# each a hard exit on trip (TD-084's own "stops running further skippable work", applied earlier
# than leg 12 alone could reach).
#
# This suite does NOT rely on real fork exhaustion (nondeterministic, unfixturable) or on a wall-
# clock race between two full runs. It proves the STRUCTURAL property instead: given an artificially
# tiny budget (QA_BUDGET_SECONDS=1, guaranteed exceeded after any nonzero elapsed), a real invocation
# of scripts/qa-check.sh --
#   (a) with the shipped checkpoints: reports the NAMED "-early" finding and NEVER prints an "eval
#       harness" line, i.e. never reaches leg 12 -- case 1 below.
#   (b) with the checkpoints seeded away (the ORIGINAL bug, reproduced by removing every
#       `qb_checkpoint` call line and leaving leg 12's own loop-internal check as the only one):
#       the FIRST budget finding is leg 12's own loop-internal one, never an "-early" checkpoint
#       finding -- the exact lateness TD-084 was shipped to stop. Position, not wall-clock (TD-225).
#       Case 2 below.
#   (c) a sibling control (case 3): a GENEROUS budget on the shipped script reports neither finding
#       and completes leg 1 normally, proving the checkpoints don't fire on an in-budget run.
#
# Real qa-check.sh executions, so this is COSTLY (a few to ~20s per case under normal load, more
# under load -- exactly the case 2 window is meant to demonstrate) -- opt-in (QA_FULL=1), not
# always-on. `timeout` bounds every case so a stuck case 2 cannot hang the suite.
#
# Run bare: QA_FULL=1 sh evals/run-qa-budget-position-fixtures.sh

set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
real_qc="$repo_root/scripts/qa-check.sh"
# 60s: generous over what a checkpoint needs (measured live at ~16s for the first one under this
# host's OWN load, legs 1-2f-bis), yet a tiny fraction of what legs 1-11 alone cost when there is no
# checkpoint to stop them (measured live at several minutes of a 9m12s full run in this repo).
WINDOW=60
# Case 2 must REACH leg 12 (minutes on a slow host), so its hang bound is far above WINDOW (TD-225).
LEG12_BOUND=900

[ -f "$real_qc" ] || { echo "FAIL harness: scripts/qa-check.sh not found at $real_qc"; exit 2; }
command -v timeout >/dev/null 2>&1 || { echo "FAIL harness: 'timeout' not found on PATH -- required to bound this suite"; exit 2; }

fail=0
tmpdir=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$tmpdir"' EXIT

# Every inner invocation below explicitly clears QA_FULL (`env -u QA_FULL`) rather than trusting it
# absent. This harness is itself opt-in and gets run WITH QA_FULL=1 (that is how leg 12 selects it) --
# without the -u, that same QA_FULL=1 leaks into the child qa-check.sh invocations and silently
# bypasses qa_budget_check by CONTRACT ("QA_FULL opts a run INTO the heavy legs... the budget does
# not apply to it"), which reproduced live here as every checkpoint failing to trip no matter how far
# past the 1s budget elapsed ran (CLAUDE.md Edit-safety trap (d) -- diff the environments, not just
# the code, when a check behaves differently between two contexts).

# --- case 1 (must-PASS: the FIX reaches a checkpoint early) --------------------------------------
# Real script, real repo, budget=1s -- any checkpoint past leg 1 trips. Must print the "-early"
# finding and must NEVER reach leg 12's per-harness report lines. NOT a bare 'eval harness' substring
# search -- the "-early" finding's OWN prose names "leg 12's eval-harness loop" and "all eval
# harnesses", so that substring is always present once the checkpoint fires. The unambiguous signal
# leg 12 actually STARTED is one of its per-item report lines, always "PASS  eval harness <name>" or
# "FAIL  eval harness <name>" (leg 12's ok()/bad() calls) -- never present until the loop runs.
out1=$(cd "$repo_root" && timeout "$WINDOW" env -u QA_FULL QA_BUDGET_SECONDS=1 sh "$real_qc" 2>&1)
if printf '%s\n' "$out1" | grep -qE '^FAIL  qa-check-budget-exceeded-early:' \
   && ! printf '%s\n' "$out1" | grep -qE '^(PASS|FAIL)  eval harness '; then
  echo "PASS fixture(fixed-copy-checkpoints-early, within ${WINDOW}s): finding present, leg 12 never reached"
else
  echo "FAIL fixture(fixed-copy-checkpoints-early, within ${WINDOW}s): expected the -early finding and no 'eval harness' line -- got:"
  printf '%s\n' "$out1" | tail -5
  fail=1
fi

# --- case 2 (must-FAIL of the SCENARIO / must-PASS of the fixture): the ORIGINAL bug reproduced --
# Strip every `qb_checkpoint ...` call line, leaving leg 12's own loop-internal check as the ONLY
# one (exactly SPRINT-085's shipped shape). Same budget, same window. Must print NEITHER budget
# finding -- the checkpoint it would have used no longer exists, and leg 12 is minutes away under
# load (measured live: legs 1-11 alone took the bulk of a 9m12s run in this repo).
broken_qc="$tmpdir/qa-check-no-checkpoints.sh"
sed '/^qb_checkpoint /d' "$real_qc" > "$broken_qc"
if ! cmp -s "$broken_qc" "$real_qc"; then
  removed=$(( $(grep -c '^qb_checkpoint ' "$real_qc") ))
  # TD-225: assert WHERE the first budget finding lands, not silence in a wall-clock window (a fast host
  # reaches leg 12 in seconds). With the checkpoints gone the ONLY budget finding possible is leg 12's
  # loop-internal one ("qa-check-budget-exceeded:" naming an eval harness); an "-early" finding means a
  # checkpoint survived the seed. LEG12_BOUND only ends a hang -- it is generous, never the verdict.
  out2=$(cd "$repo_root" && timeout "$LEG12_BOUND" env -u QA_FULL QA_BUDGET_SECONDS=1 sh "$broken_qc" 2>&1)
  if printf '%s\n' "$out2" | grep -qE "^FAIL  qa-check-budget-exceeded: .*reached at eval harness '" \
     && ! printf '%s\n' "$out2" | grep -q 'qa-check-budget-exceeded-early'; then
    echo "PASS fixture(broken-copy-first-finding-at-leg-12): $removed checkpoint call(s) removed, first budget finding is leg 12's loop-internal check, no -early checkpoint finding -- TD-084's late shape reproduced"
  else
    echo "FAIL fixture(broken-copy-first-finding-at-leg-12): expected leg 12's loop-internal finding and NO -early finding -- got:"
    printf '%s\n' "$out2" | grep -o 'qa-check-budget-exceeded[-a-z]*:[^.]*' | head -3
    fail=1
  fi
else
  echo "FAIL fixture(broken-copy-first-finding-at-leg-12): seed did not change the file (cmp saw no diff) -- nothing was actually tested"
  fail=1
fi

# --- case 3 (PASS control): a generous budget on the SHIPPED script trips neither finding and
# clears leg 1 (at least one "cap " PASS line), proving the checkpoints stay quiet in-budget.
out3=$(cd "$repo_root" && timeout "$WINDOW" env -u QA_FULL QA_BUDGET_SECONDS=600 sh "$real_qc" 2>&1 | head -n 40)
if ! printf '%s\n' "$out3" | grep -q 'qa-check-budget-exceeded' \
   && printf '%s\n' "$out3" | grep -qE '^PASS  cap '; then
  echo "PASS fixture(in-budget-run-stays-quiet): no budget finding in the first 40 lines, leg 1 progressing normally"
else
  echo "FAIL fixture(in-budget-run-stays-quiet): got:"
  printf '%s\n' "$out3" | head -5
  fail=1
fi

[ "$fail" -eq 0 ] && echo "PASS harness: qa-budget-position discriminates (case 1 fires early on the fix; case 2 first lands at leg 12's own check, never an -early checkpoint, when the checkpoints are seeded away; case 3 stays quiet in-budget)"
exit $fail
