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

# --- by-reference (v2) sprints: the DoD is the MEMBERS' `## Done when` boxes (SPRINT-110 T4 · TASK-392) ---
# Before the retarget reap() counted `- [x]`/`- [ ]` and `### T` blocks in the sprint FILE, so a
# by-reference sprint (whose Plan carries no boxes) reported `0 of 0` over any run. Each case copies a
# fixture tree from fixtures/night-run-reaper/, appends a log body, runs the real reaper, and asserts
# EVERY pattern given (each `grep -q` on the rollup the reaper appended). v2-by-reference varies the
# SELECTION on purpose: a stale `## Members` path (TASK-9611 listed under todo/, file in in_progress/),
# a member reached only by its `sprint:` stamp (TASK-9613), a unit citing two members (T2), a unit
# citing no current member (T4, scoped out), and a box under `## Touches` that is not DoD.
# Hand count for v2-by-reference: ticked 1+2+0 = 3, open 1+0+2 = 3 -> `3 of 6`; units T1 T2 T3 = 3, none
# delivered (each cites a member with an open box) -> `0 completed / 3 total`.
fxdir="$here/fixtures/night-run-reaper"
# case_fx <label> <fixture> <log-body> <pattern>...   (patterns are fixed strings, ALL must appear)
case_fx() {
  label=$1; fxn=$2; body=$3; shift 3
  d="$work/$label"
  mkdir -p "$d" && cp -R "$fxdir/$fxn/." "$d/" || { echo "FAIL fixture($label): could not copy $fxn"; fail=1; return; }
  mkdir -p "$d/docs/sprint/logs"
  printf '# log\n%s\n' "$body" > "$d/docs/sprint/logs/SPRINT-961-v2.md"
  : > "$d/run.log"
  err=$(sh "$launcher" --reap "$d/run.log" "$d" "" 0 2>&1 >/dev/null)
  rolled=$(cat "$d/docs/sprint/logs/SPRINT-961-v2.md")
  miss=""
  for pat in "$@"; do
    printf '%s\n' "$rolled" | grep -qF -- "$pat" || miss="$miss [$pat]"
  done
  if [ -z "$miss" ] && [ -z "$err" ]; then
    echo "PASS fixture($label): $# assertion(s) on the rollup"
  else
    echo "FAIL fixture($label): missing${miss:- none}${err:+ -- stderr: $err}"
    printf '%s\n' "$rolled" | sed 's/^/    | /'
    fail=1
  fi
}
# must-FAIL: the motivating shape. Not `0 of 0`; the members' boxes, and the two-member unit stays open.
case_fx "v2-counts-member-boxes" "v2-by-reference" "T1 · done · a
T2 · done · b
T3 · blocked · c" \
  "run · 3 of 6 DoD ticked  [mechanical]" "tasks · 3 attempted / 0 completed / 3 total" "0 of 3 units" \
  "terminal · AUTHORITY_BOUNDARY"
# a unit with an open member and no log line is unattempted; the scoped-out T4 and a logged T1 are not
case_fx "v2-unattempted-from-members" "v2-by-reference" "T1 · done · a" \
  "terminal · BUDGET_STOP" "tasks · 1 attempted / 0 completed / 3 total" \
  "T2 · unattempted ·" "T3 · unattempted ·"
# sibling control: every member ticked -> every unit delivered, the only clean ending
case_fx "v2-all-ticked-delivered" "v2-all-ticked" "T1 · done · a
T2 · done · b
T3 · done · c" \
  "run · 6 of 6 DoD ticked  [mechanical]" "tasks · 3 attempted / 3 completed / 3 total" "3 of 3 units" \
  "terminal · PLAN_EXHAUSTED"
# must-FAIL: a listed member that resolves to no file is HARD_FAILURE, named -- never a clean 0 of 0
case_fx "v2-unresolved-member-hard-failure" "v2-unresolved-member" "T1 · done · a
T2 · done · b
T3 · done · c" \
  "terminal · HARD_FAILURE · " "SPRINT-MEMBER-UNRESOLVED" "member DoD unreadable: SPRINT-MEMBER-UNRESOLVED: TASK-9619"
# v1 stays exactly as before even when the tree also has an unrelated docs/work store
case_fx "v1-counts-unchanged-beside-store" "v1-with-unrelated-store" "T1 · done · a
T2 · done · b" \
  "run · 1 of 3 DoD ticked  [mechanical]" "tasks · 2 attempted / 0 completed / 2 total" "terminal · PLAN_EXHAUSTED"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "REAP-TERMINAL FIXTURES: all green"; else echo "REAP-TERMINAL FIXTURES: FAILURES above"; fi
exit $fail
