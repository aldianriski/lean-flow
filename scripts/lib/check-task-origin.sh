#!/usr/bin/env sh
# check-task-origin.sh -- every task declares where it came from (SPRINT-055 T6, TASK-172;
# retargeted onto the docs/work/ store at TASK-382 / SPRINT-109 T3, owner ruling C).
#
# G1 fast-paths a "decomposer-approved task" to a one-line scope confirm. Until T6 no field recorded
# whether a task had ever met the intake grill, so the clause was unverifiable prose: tasks filed by
# the close-Retro follow-up bucket and converted by /triage bug intake reach G1 having never been
# grilled, and nothing distinguished them from a decomposer entry that had.
#
# `origin:` is a FACT about where the task came from, not a self-assessed "was it grilled?" -- you
# would have to misreport the source to fake it. G1 derives eligibility: only `origin: decomposer`
# fast-paths.
#
# This checker is the mechanical half: no task reaches G1 without a stated origin. G1's own clause is
# the procedural half -- what to do once the origin is known. Neither closes the hole alone, and only
# the first is checkable, so that is what this guards. A MISSING origin is a FAIL rather than a
# default, because "unstamped" is exactly the state the old prose could not distinguish.
#
# POPULATION: every docs/work/<folder>/TASK-NNN-*.md, across ALL SIX status folders (backlog todo
# in_progress review done cancel). The legacy TODO.md § Backlog population was retired (TODO.md
# retired, SPRINT-111 T3 / spec 0.13.0); this checker skips-with-nothing-to-verify only when the
# store has no task files.
#
# Usage: sh check-task-origin.sh <repo-root>
# Prints one PASS/FAIL line per task, naming which population it came from (store: docs/work/<folder>/);
# exits 1 if any FAIL line was printed, 0 otherwise. Dependency-free
# POSIX sh.
set -u

root=${1:?usage: check-task-origin.sh <repo-root>}

VALID='decomposer close-retro triage-bug manual'

out="${TMPDIR:-/tmp}/task-origin.$$"
: > "$out"
seen=0

# --- population 1: docs/work/<folder>/TASK-NNN-*.md, all six status folders ---------------------
for folder in backlog todo in_progress review done cancel; do
  dir="$root/docs/work/$folder"
  [ -d "$dir" ] || continue
  for f in "$dir"/TASK-*.md; do
    [ -f "$f" ] || continue
    seen=1
    tid=$(basename "$f" | sed -n 's/^\(TASK-[0-9][0-9]*\)-.*/\1/p')
    [ -n "$tid" ] || tid=$(basename "$f" .md)
    org=$(awk 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} /^origin:[ \t]*/{sub(/^origin:[ \t]*/,"");print;exit}' "$f")
    if [ -z "$org" ]; then
      printf 'FAIL  %s\n' "task-origin: $tid (store: docs/work/$folder/) declares no origin: -- G1 cannot tell whether it met the intake grill, and an unstamped task is exactly what the old 'decomposer-approved' prose could not distinguish. Stamp decomposer | close-retro | triage-bug | manual" >> "$out"
    else
      case " $VALID " in
        *" $org "*) printf 'PASS  %s\n' "task-origin: $tid (store: docs/work/$folder/) origin: $org" >> "$out" ;;
        *)          printf 'FAIL  %s\n' "task-origin: $tid (store: docs/work/$folder/) has origin: '$org', which is not one of: $VALID" >> "$out" ;;
      esac
    fi
  done
done

# --- population 2 (legacy TODO.md § Backlog) retired: TODO.md retired, SPRINT-111 T3 / spec 0.13.0. --
# A leftover TODO.md is no longer read here; the store above is the only population.

if [ "$seen" -eq 0 ]; then
  printf '      %s\n' "task-origin: skip (no task entries in docs/work/)" >> "$out"
fi

cat "$out"
fail=0
grep -q '^FAIL' "$out" && fail=1
rm -f "$out"
exit $fail
