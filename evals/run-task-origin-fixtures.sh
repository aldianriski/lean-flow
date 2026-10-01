#!/bin/sh
# run-task-origin-fixtures.sh -- must-FAIL/must-PASS fixtures for scripts/lib/check-task-origin.sh
# (SPRINT-055 T6, TASK-172; retargeted onto the docs/work/ store at TASK-382, owner ruling C).
#
# G1 fast-paths a "decomposer-approved task" to a one-line scope confirm, and until T6 nothing
# recorded whether a task had met the intake grill -- so the clause was unverifiable prose. A
# close-Retro follow-up and a /triage-converted bug both reach G1 having never been grilled, and
# nothing distinguished them from a decomposer entry that had.
#
# The three ways the field fails to do its job (each exercised against the store below):
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
# POPULATION (owner ruling C, L-186; TODO.md retired, SPRINT-111 T3 / spec 0.13.0): the checker reads ONE
# source -- every docs/work/<folder>/TASK-NNN-*.md across all six status folders. The legacy TODO.md
# § Backlog population was RETIRED, not retargeted: the three fixtures under legacy-retired-* keep the
# old must-FAIL TODO.md trees (missing / invalid origin) and now prove the retired branch NO LONGER
# FIRES -- exit 0, a skip line, no legacy finding -- while store-missing/store-invalid/store-stamped
# exercise the same three shapes against the store (the sibling controls that still redden), and
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

# --- retired legacy population: TODO.md § Backlog (SPRINT-111 T3 / spec 0.13.0) -------------------
# A leftover TODO.md with an UNSTAMPED or INVALID entry used to FAIL. It must now exit 0, print the
# no-entries skip (the store is empty here), and name no legacy finding. A retired branch that still
# fired would print "(TODO.md: legacy backlog)" or exit 1.
for c in missing-origin invalid-origin stamped; do
  out=$(sh "$checker" "$fx/$c" 2>&1); rc=$?
  case "$rc:$out" in
    0:*"legacy backlog"*) echo "FAIL fixture(legacy-retired-$c): exit 0 but a legacy-backlog line was printed -- got: $out"; fail=1 ;;
    0:*"skip (no task entries in docs/work/)"*) echo "PASS fixture(legacy-retired-$c): TODO.md ignored -- exit 0, skip line, no legacy finding" ;;
    *) echo "FAIL fixture(legacy-retired-$c): expected exit 0 + skip line, got exit $rc -- $out"; fail=1 ;;
  esac
done

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

# --- case 9 (retired branch, must stay silent beside a live store): a store task with a valid origin AND
# a legacy TODO.md task with NO origin -> exit 0. Before the retirement the legacy side FAILed; the
# store-side PASS line proves the store was still examined (the sibling control is store-missing above).
run_case_anywhere "store-and-todo-store-side" 0 \
  "TASK-910 (store: docs/work/todo/) origin: manual" -- \
  sh "$checker" "$fx/store-and-todo"
out=$(sh "$checker" "$fx/store-and-todo" 2>&1)
case "$out" in
  *"TASK-911"*|*"legacy backlog"*)
    echo "FAIL fixture(store-and-todo-legacy-silent): the retired TODO.md population fired -- got: $out"
    fail=1
    ;;
  *)
    echo "PASS fixture(store-and-todo-legacy-silent): unstamped TODO.md entry produced no finding"
    ;;
esac

min_tests=11
n_run=$(grep -c '^run_case_anywhere' "$0")
if [ "$n_run" -lt "$min_tests" ]; then
  echo "FAIL harness: only $n_run case(s) wired in this file, expected at least $min_tests -- coverage SHRANK"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "TASK-ORIGIN FIXTURES: all green"; else echo "TASK-ORIGIN FIXTURES: at least one FAIL"; fi
exit $fail
