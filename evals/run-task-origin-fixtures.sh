#!/bin/sh
# run-task-origin-fixtures.sh -- must-FAIL/must-PASS fixtures for scripts/lib/check-task-origin.sh
# (SPRINT-055 T6, TASK-172; retargeted onto the docs/work/ store at TASK-382, owner ruling C).
#
# G1 fast-paths a "decomposer-approved task" to a one-line scope confirm, and until T6 nothing
# recorded whether a task had met the intake grill -- so the clause was unverifiable prose. A
# close-Retro follow-up and a /triage-converted bug both reach G1 having never been grilled, and
# nothing distinguished them from a decomposer entry that had.
#
# The legacy TODO.md cases map to the three ways the field fails to do its job:
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
# POPULATION (owner ruling C, L-186): the checker now reads TWO sources -- every
# docs/work/<folder>/TASK-NNN-*.md across all six status folders, PLUS TODO.md's own § Backlog
# while it exists. The three legacy cases above exercise TODO.md; store-missing/store-invalid/
# store-stamped below exercise the SAME three shapes against the store instead, and
# store-no-todo/store-other-folders vary the SELECTION (no TODO.md at all; a task outside todo/).
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

# --- legacy population: TODO.md § Backlog --------------------------------------------------------

# --- case 1: no origin: at all -> FAIL -----------------------------------------------------------
run_case_anywhere "missing-origin" 1 \
  "TASK-800 (TODO.md: legacy backlog) declares no origin:" -- \
  sh "$checker" "$fx/missing-origin"

# --- case 2: origin outside the vocabulary -> FAIL -----------------------------------------------
run_case_anywhere "invalid-origin" 1 \
  "TASK-801 (TODO.md: legacy backlog) has origin: 'grilled', which is not one of:" -- \
  sh "$checker" "$fx/invalid-origin"

# --- case 3: stamped entries -> exit 0 (control) -------------------------------------------------
run_case_anywhere "stamped" 0 \
  "TASK-803 (TODO.md: legacy backlog) origin: triage-bug" -- \
  sh "$checker" "$fx/stamped"

# --- store population: docs/work/<folder>/TASK-NNN-*.md -------------------------------------------

# --- case 4 (must-FAIL, retained): a store task with no origin: at all -----------------------------
run_case_anywhere "store-missing" 1 \
  "TASK-900 (store: docs/work/todo/) declares no origin:" -- \
  sh "$checker" "$fx/store-missing"

# --- case 4b (L-142 sibling control, same file): the declared sibling stays green -------------------
run_case_anywhere "store-missing-sibling-control" 1 \
  "TASK-901 (store: docs/work/todo/) origin: decomposer" -- \
  sh "$checker" "$fx/store-missing"

# --- case 5 (must-FAIL): a store task with an origin outside the vocabulary -------------------------
run_case_anywhere "store-invalid" 1 \
  "TASK-902 (store: docs/work/todo/) has origin: 'grilled', which is not one of:" -- \
  sh "$checker" "$fx/store-invalid"

# --- case 6 (control): a store task with a valid origin: -> PASS ------------------------------------
run_case_anywhere "store-stamped" 0 \
  "TASK-903 (store: docs/work/todo/) origin: manual" -- \
  sh "$checker" "$fx/store-stamped"

# --- case 7 (L-186 selection): a task reached only via a NON-todo/ folder --------------------------
# Population enumeration: the six status folders. Every case above uses todo/; this one proves
# backlog/, in_progress/, review/, done/ and cancel/ are examined too, not just the default folder
# a hand-written fixture would default to.
run_case_anywhere "store-other-folders" 1 \
  "TASK-904 (store: docs/work/backlog/) declares no origin:" -- \
  sh "$checker" "$fx/store-other-folders"
run_case_anywhere "store-other-folders-in-progress" 1 \
  "TASK-905 (store: docs/work/in_progress/) declares no origin:" -- \
  sh "$checker" "$fx/store-other-folders"
run_case_anywhere "store-other-folders-review" 1 \
  "TASK-906 (store: docs/work/review/) declares no origin:" -- \
  sh "$checker" "$fx/store-other-folders"
run_case_anywhere "store-other-folders-done" 1 \
  "TASK-907 (store: docs/work/done/) declares no origin:" -- \
  sh "$checker" "$fx/store-other-folders"
run_case_anywhere "store-other-folders-cancel" 1 \
  "TASK-908 (store: docs/work/cancel/) declares no origin:" -- \
  sh "$checker" "$fx/store-other-folders"

# --- case 8 (L-186 selection, must-FAIL): store task files AND no TODO.md at all -- the guard the
# owner-ruling C frozen contract exists for: "must NOT print skip (missing): TODO.md and exit clean
# without checking the task files."
run_case_anywhere "store-no-todo" 1 \
  "TASK-909 (store: docs/work/todo/) declares no origin:" -- \
  sh "$checker" "$fx/store-no-todo"
out=$(sh "$checker" "$fx/store-no-todo" 2>&1)
case "$out" in
  *"skip (missing): TODO.md"*)
    echo "FAIL fixture(store-no-todo-never-skips): printed the old 'skip (missing): TODO.md' line and never checked docs/work/ -- got: $out"
    fail=1
    ;;
  *)
    echo "PASS fixture(store-no-todo-never-skips): no TODO.md-missing skip printed, docs/work/ examined instead"
    ;;
esac

# --- case 9 (both populations at once, control): a store task AND a legacy TODO.md task, both
# valid -> exit 0. Proves the two populations combine (union), neither shadowing the other.
run_case_anywhere "store-and-todo-both-valid" 0 \
  "TASK-910 (store: docs/work/todo/) origin: manual" -- \
  sh "$checker" "$fx/store-and-todo"
run_case_anywhere "store-and-todo-both-valid-legacy-side" 0 \
  "TASK-911 (TODO.md: legacy backlog) origin: decomposer" -- \
  sh "$checker" "$fx/store-and-todo"

min_tests=15
n_run=$(grep -c '^run_case_anywhere' "$0")
if [ "$n_run" -lt "$min_tests" ]; then
  echo "FAIL harness: only $n_run case(s) wired in this file, expected at least $min_tests -- coverage SHRANK"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "TASK-ORIGIN FIXTURES: all green"; else echo "TASK-ORIGIN FIXTURES: at least one FAIL"; fi
exit $fail
