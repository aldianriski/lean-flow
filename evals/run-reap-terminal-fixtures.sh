#!/bin/sh
# run-reap-terminal-fixtures.sh -- fixtures for the TERMINAL-STATE DERIVATION in scripts/night-run.sh
# reap() (SPRINT-088 T2, Part 0b). Tier G per this sprint's D4.
#
# --- why this file exists at all ------------------------------------------------------------------
# It was written after an independent review pointed out that `--reap` had NO fixture coverage
# whatsoever -- `grep -r -- --reap evals/` returned nothing -- while carrying Tier G derivation logic
# that decides how a whole unattended run is reported. Every other guard in this sprint had a harness;
# the one piece that EMITS the verdict had none, so its first defect shipped and was reported as a
# clean result on real committed data (`terminal · PLAN_EXHAUSTED` over three `blocked` tasks).
#
# The lesson generalises: a checker that VALIDATES a field is easy to remember to test; the code that
# PRODUCES the field is the half that gets forgotten, because its output looks like data rather than
# like a claim. `check-night-run-rollup.sh` only ever asserted the terminal line's SHAPE -- it cannot
# tell whether the named state is the right one, and nothing else was looking.
#
# Each case builds a throwaway repo-shaped tree under mktemp, drives the real reaper, and asserts the
# state it emits. No git, no network.
#
# Dependency-free POSIX sh. Run bare: sh evals/run-reap-terminal-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
launcher="$repo_root/scripts/night-run.sh"

[ -f "$launcher" ] || { echo "FAIL harness: launcher not found at $launcher"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

# case <label> <want-state> <dod-box> <log-body> [<exit-code>]
case_reap() {
  label=$1; want=$2; box=$3; body=$4; ec=${5:-}
  d="$work/$label"
  mkdir -p "$d/docs/sprint/logs"
  cat > "$d/docs/sprint/SPRINT-960-fx.md" <<EOF
---
sprint: 960
status: active
---

## Plan

### T1 — x \`[size: S · risk: low · class: execution · AFK · J1]\`
Layers: \`a.md\`

**DoD:**
- [$box] a thing
EOF
  printf '# log\n%s\n' "$body" > "$d/docs/sprint/logs/SPRINT-960-fx.md"
  : > "$d/run.log"
  [ -n "$ec" ] && printf '%s' "$ec" > "$d/run.log.exit"

  err=$(sh "$launcher" --reap "$d/run.log" "$d" "" 0 2>&1 >/dev/null)
  got=$(grep -oE '^terminal · [A-Z_]+' "$d/docs/sprint/logs/SPRINT-960-fx.md" 2>/dev/null | sed 's/^terminal · //')

  if [ "$got" = "$want" ] && [ -z "$err" ]; then
    echo "PASS fixture($label): terminal · $got"
  else
    echo "FAIL fixture($label): got '${got:-<none>}', wanted '$want'${err:+ -- stderr: $err}"
    fail=1
  fi
}

# --- the clean ending, and it is the only one ----------------------------------------------------
case_reap "done-is-plan-exhausted"      "PLAN_EXHAUSTED"     "x" "T1 · done · 1 of 1 DoD"

# --- work remains that needs a human -------------------------------------------------------------
# `blocked` is the case that shipped WRONG: it satisfies "has a line about it" and, before the fix,
# fell straight through to PLAN_EXHAUSTED -- "the only clean ending" over a run that was not clean.
case_reap "blocked-is-authority-boundary" "AUTHORITY_BOUNDARY" " " "T1 · blocked · needs a human decision"
case_reap "parked-is-authority-boundary"  "AUTHORITY_BOUNDARY" " " "T1 · parked-hitl · waiting on the owner"

# --- the run could not proceed past a step -------------------------------------------------------
case_reap "stalled-is-hard-failure"     "HARD_FAILURE"       " " "T1 · stalled · watchdog fired"
case_reap "denied-is-hard-failure"      "HARD_FAILURE"       " " "T1 · denied-tool · dontAsk refused a call outside the allowlist"

# --- never reached at all ------------------------------------------------------------------------
# No line mentioning T1 anywhere: the reaper must call that `unattempted`, and an exhausted turn is a
# budget stop. The log body deliberately mentions the task in PROSE to confirm the match is anchored
# at column 1 and not a loose substring (L-108).
case_reap "unreached-is-budget-stop"    "BUDGET_STOP"        " " "some prose that mentions T1 · done in passing"

# --- precedence, which is the part most likely to rot ---------------------------------------------
# A non-zero process exit explains the stop and outranks everything derived from the log.
case_reap "nonzero-exit-outranks-all"   "HARD_FAILURE"       "x" "T1 · done · 1 of 1 DoD" "1"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "REAP-TERMINAL FIXTURES: all green"; else echo "REAP-TERMINAL FIXTURES: FAILURES above"; fi
exit $fail
