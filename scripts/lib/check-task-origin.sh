#!/usr/bin/env sh
# check-task-origin.sh -- every TODO.md Backlog task declares where it came from (SPRINT-055 T6,
# TASK-172).
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
# Usage: sh check-task-origin.sh <repo-root>
# Reads the § Backlog section of TODO.md only -- the Active Sprint pointer and closed history are not
# task entries. Prints one PASS/FAIL line; exits 1 if any FAIL line was printed, 0 otherwise.
# Dependency-free POSIX sh.
set -u

root=${1:?usage: check-task-origin.sh <repo-root>}
todo="$root/TODO.md"
[ -f "$todo" ] || { printf '      %s\n' "task-origin: skip (missing): TODO.md"; exit 0; }

VALID='decomposer close-retro triage-bug manual'

# Emit "<TASK-id>\t<origin-or-empty>" for every task entry inside § Backlog. A task block runs from
# its "- [ ] TASK-NNN" line to the next one or the next "## " heading, so an origin: line is only
# ever attributed to the task it sits under.
records=$(awk '
  /^## Backlog/     { inb=1; next }
  /^## /            { if (inb) { if (tid != "") print tid "\t" org; tid=""; org=""; inb=0 } }
  !inb              { next }
  /^- \[[ x]\] TASK-/ {
      if (tid != "") print tid "\t" org
      tid=$0; sub(/^- \[[ x]\] /,"",tid); sub(/ .*/,"",tid); org=""; next
  }
  /^[ \t]*origin:/  { if (tid != "") { o=$0; sub(/^[ \t]*origin:[ \t]*/,"",o); sub(/[ \t].*$/,"",o); org=o } }
  END               { if (tid != "") print tid "\t" org }
' "$todo")

fail=0
n=0
if [ -z "$records" ]; then
  printf '      %s\n' "task-origin: skip (no task entries in TODO.md § Backlog)"
  exit 0
fi

printf '%s\n' "$records" | while IFS="$(printf '\t')" read -r tid org; do
  [ -n "$tid" ] || continue
  if [ -z "$org" ]; then
    printf 'FAIL  %s\n' "task-origin: $tid declares no origin: -- G1 cannot tell whether it met the intake grill, and an unstamped task is exactly what the old 'decomposer-approved' prose could not distinguish. Stamp decomposer | close-retro | triage-bug | manual"
  else
    case " $VALID " in
      *" $org "*) printf 'PASS  %s\n' "task-origin: $tid origin: $org" ;;
      *)          printf 'FAIL  %s\n' "task-origin: $tid has origin: '$org', which is not one of: $VALID" ;;
    esac
  fi
done > "${TMPDIR:-/tmp}/task-origin.$$" 2>&1

cat "${TMPDIR:-/tmp}/task-origin.$$"
grep -q '^FAIL' "${TMPDIR:-/tmp}/task-origin.$$" && fail=1
rm -f "${TMPDIR:-/tmp}/task-origin.$$"
n=$n
exit $fail
