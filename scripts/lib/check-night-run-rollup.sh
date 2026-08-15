#!/usr/bin/env sh
# check-night-run-rollup.sh -- a sprint Execution Log that records a COMPLETED run must carry the
# Part 4 rollup: a `run · N of M DoD ticked` header and a calibration row (SPRINT-059 T3).
#
# Why this exists. An unattended sprint-bulk loop is run by the model, and nothing outside it checks
# the Plan was exhausted. A run that ends a turn mid-Plan ends the session with `subtype: success`,
# `stop_reason: end_turn`, no error -- measured on a consumer's host at 4 of 7 units, every commit
# correct, three tasks never begun and not one line written about them. Part 4 now requires a rollup
# at every exit and ADR-016 moves the writing of it into the launcher's wrapper, so the model cannot
# drop it. This check is the other half of that pair: the reaper EMITS, and this refuses to let a
# missing one pass review. Finding 12's prescription was that these steps be gated the way a commit
# is rather than merely requested -- a step nothing depends on is not a step.
#
# --- the thing this check actually guards ---------------------------------------------------------
# NOT malformed output. The guarded failure is SILENCE that reads as success: a log saying a run
# finished, with nothing saying how much of the Plan it finished. So:
#
#   no completed-run entry      -> nothing to verify. A sprint mid-flight has not finished anything
#                                  yet, and firing here would make every live sprint red.
#   completed, no DoD header    -> FAIL. This is the exact 4-of-7 case.
#   completed, no calibration   -> FAIL, separately named: both field-report runs finished without
#                                  writing theirs, and both rows were reconstructed by a human.
#   completed, both present     -> PASS.
#
# Usage: sh check-night-run-rollup.sh <sprint-log.md> [<sprint-log.md> ...]
# Archived logs are skipped by path (docs/sprint/archive/) -- closed history is not re-litigated.
# Prints one PASS/FAIL/note line per file; exits 1 if any FAIL line was printed.
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

[ "$#" -gt 0 ] || { note "night-run rollup: no sprint logs given -- nothing verified"; exit 0; }

for lg in "$@"; do
  [ -f "$lg" ] || { bad "night-run rollup: file not found: $lg"; continue; }
  case "$lg" in */archive/*) continue ;; esac

  # A completed run announces itself with a `run-complete` event in the log's entry header.
  # Renamed from the bare `complete` (TD-055): that word collided with a task-level "this task
  # is complete" entry, which silently armed these run-level assertions on a mid-Plan log
  # (misfired mid-SPRINT-064). Anchored to the delimited event field, not a bare substring
  # (L-108) -- a task-level `| complete |` header no longer arms anything here.
  if ! grep -qE '^### .*\| *run-complete *\|' "$lg" 2>/dev/null; then
    note "night-run rollup: $lg has no completed-run entry yet -- nothing to verify"
    continue
  fi

  hdr=0; cal=0
  grep -qE '^run · [0-9]+ of [0-9]+ DoD ticked' "$lg" 2>/dev/null && hdr=1
  grep -qE '^run · .* · .* · .* · [0-9]+ of [0-9]+ units · ' "$lg" 2>/dev/null && cal=1

  if [ "$hdr" -eq 0 ]; then
    bad "night-run rollup: $lg records a completed run but carries no 'run · N of M DoD ticked' header -- a run that finished part of the Plan is indistinguishable from one that finished all of it (Part 4)"
  fi
  if [ "$cal" -eq 0 ]; then
    bad "night-run rollup: $lg records a completed run but carries no Part 4 calibration row (run · cost · turns · wall · N of M units · shape) -- the series it feeds is what lets the next promote size a batch"
  fi
  [ "$hdr" -eq 1 ] && [ "$cal" -eq 1 ] && ok "night-run rollup $lg (DoD header + calibration row present)"
done

exit "$fail"
