#!/bin/sh
# assert-park-revisit.sh -- artifact-contract assertion for night-run.md Part 0 step 4
# (SPRINT-059 T4): an open park whose unblock condition names a task the SAME run later completed
# must be revisited, or else say so in the rollup. Takes a completed run's repo directory.
#
# Same framing as its siblings assert-boundary-park.sh / assert-noaction-park.sh, and the same limit
# (evals/README.md): this never proves model compliance in general, only that the observable artifact
# contract held on the run in front of it. One caught instance is not exhaustive proof.
#
# The case it encodes is real and measured, on a consumer's host: a field was parked as "saved but
# not rendered; pick up when the next task owns the renderer". THREE subsequent tasks owned that
# renderer. None revisited it, and the field is still written and never read. The park protocol was
# written for parks that outlive the run, and had nothing to say about one the run itself unblocks.
#
# The contract, deliberately narrow:
#   for each park record naming an unblock condition that references a task Tn,
#     if that Tn is ticked [x] in the Plan by the end of the run,
#       then the log must carry EITHER a later entry revisiting that park
#       OR a rollup line for the parked task saying it is still not actionable.
#   Silence is the failure. Doing the work and doing neither is what happened.
#
# Usage: sh evals/assert-park-revisit.sh <completed-run-repo-dir>
set -u

fail=0
ok()  { printf 'PASS  %s\n' "$1"; }
bad() { fail=1; printf 'FAIL  %s\n' "$1"; }

dir=${1:-}
[ -n "$dir" ] || { printf 'usage: sh evals/assert-park-revisit.sh <completed-run-repo-dir>\n'; exit 2; }
[ -d "$dir" ] || { bad "park-revisit: not a directory: $dir"; exit 1; }

sp=""
for f in "$dir"/docs/sprint/SPRINT-*.md; do [ -f "$f" ] && { sp=$f; break; }; done
[ -n "$sp" ] || { bad "park-revisit: no sprint Plan found under $dir/docs/sprint/"; exit 1; }
lg="$dir/docs/sprint/logs/$(basename "$sp")"
[ -f "$lg" ] || { bad "park-revisit: no Execution Log alongside $(basename "$sp")"; exit 1; }

# Park records name their unblock task, e.g.
#   T2 · parked-hitl · saved but not rendered; pick up when T4 owns the renderer
parks=$(grep -oE '^T[0-9]+ · parked[^·]*· .*' "$lg" 2>/dev/null || true)
[ -n "$parks" ] || { ok "park-revisit: no park records in $(basename "$lg") -- contract vacuous"; exit 0; }

# NOTE: fed by REDIRECT, never by a pipe. `... | while read` runs the loop body in a subshell, so
# every `fail=1` set inside would be discarded and this assertion would exit 0 no matter what it
# found -- a checker that can only ever pass, which is the exact silent false-negative L-058 is
# about. Caught here before shipping; keep the redirect.
tmp="${TMPDIR:-/tmp}/park-revisit-$$"
printf '%s\n' "$parks" > "$tmp"
while IFS= read -r line; do
  parked=${line%% *}
  # the unblock task this park is waiting on
  unblock=$(printf '%s' "$line" | grep -oE 'T[0-9]+' | sed -n '2p')
  [ -n "$unblock" ] || continue

  # did that task complete? its block has no open box left
  done_ok=$(awk -v want="$unblock" '
    /^### T[0-9]+ /{ cur=$2 }
    /^- \[ \]/{ if (cur==want) o=1 }
    END{ print (o?0:1) }' "$sp")
  [ "$done_ok" = "1" ] || continue   # unblock task never finished -- park legitimately still open

  # STRUCTURAL, never a keyword sweep of the file. The first draft grepped the whole log for
  # "revisit|resolved|..." and the must-FAIL fixture PASSED -- because the fixture's own slug
  # (`unrevisited`) contains "revisit". Same substring trap as `in-stalled` matching "installed"
  # earlier this sprint. A contract is a line in a known shape, not a word appearing somewhere.
  #
  # Resolution = a LATER line for the same task that is not the park record itself: either the task
  # reached `done`, or it is explicitly still not actionable.
  resolved=$(grep -cE "^$parked · (done|complete) · " "$lg" 2>/dev/null)
  stated=$(grep -cE "^$parked · .*(still not actionable|remains parked)" "$lg" 2>/dev/null)
  if [ "$resolved" -gt 0 ]; then
    ok "park-revisit: $parked's unblock task $unblock completed and the log records $parked reaching done"
  elif [ "$stated" -gt 0 ]; then
    ok "park-revisit: $parked still not actionable at exit, and the rollup says so"
  else
    bad "park-revisit: $parked was parked pending $unblock, $unblock completed in the same run, and the log records NEITHER a revisit NOR a rollup line saying it stayed blocked -- the park survived a night it did not need to"
  fi
done < "$tmp"
rm -f "$tmp"

exit "$fail"
