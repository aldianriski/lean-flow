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
#   terminal contradicts a
#     per-task line             -> FAIL, separately named (SPRINT-093 T1). The shape checks above
#                                  never read whether the *content* agrees with itself -- this is
#                                  exactly the gap SPRINT-089's committed rollup exploited:
#                                  `terminal · PLAN_EXHAUSTED` sat next to a task the run's own log
#                                  called `parked-hitl`, and the three checks above all still passed,
#                                  because none of them compares the terminal line against the
#                                  per-task lines beside it. See "the agreement check" below.
#   completed, both present,
#     terminal agrees           -> PASS.
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

  hdr=0; cal=0; term=0
  grep -qE '^run · [0-9]+ of [0-9]+ DoD ticked' "$lg" 2>/dev/null && hdr=1
  grep -qE '^run · .* · .* · .* · [0-9]+ of [0-9]+ units · ' "$lg" 2>/dev/null && cal=1
  # Anchored at column 1 and restricted to the five states the contract defines (Part 0b). An
  # unrecognised state must NOT satisfy this: `terminal · FINISHED · ...` parses as a terminal line
  # and means nothing, which is the malformed-record failure -- a record nobody can act on looks like
  # evidence and is worse than none (the gates-signed family's own ruling).
  grep -qE '^terminal · (PLAN_EXHAUSTED|AUTHORITY_BOUNDARY|HARD_FAILURE|BUDGET_STOP|USER_STOP) · ' "$lg" 2>/dev/null && term=1

  if [ "$hdr" -eq 0 ]; then
    bad "night-run rollup: $lg records a completed run but carries no 'run · N of M DoD ticked' header -- a run that finished part of the Plan is indistinguishable from one that finished all of it (Part 4)"
  fi
  if [ "$cal" -eq 0 ]; then
    bad "night-run rollup: $lg records a completed run but carries no Part 4 calibration row (run · cost · turns · wall · N of M units · shape) -- the series it feeds is what lets the next promote size a batch"
  fi
  if [ "$term" -eq 0 ]; then
    bad "night-run rollup: $lg records a completed run but carries no 'terminal · <STATE> · <reason>' line naming one of PLAN_EXHAUSTED | AUTHORITY_BOUNDARY | HARD_FAILURE | BUDGET_STOP | USER_STOP -- a run that stopped for a reason nobody declared is indistinguishable from one that finished (Part 0b). The count says how much of the Plan is done; the state says why the run stopped being the thing that does it"
  fi

  # --- the agreement check (SPRINT-093 T1) -----------------------------------------------------
  # Everything above asserts SHAPE: that a header/calibration/terminal line exists somewhere. None
  # of them read whether the terminal line's claim is consistent with the per-task lines sitting
  # right beside it -- which is exactly how SPRINT-089's false `PLAN_EXHAUSTED` rollup passed this
  # checker with a task logged `· parked-hitl ·` in the very same file.
  #
  # The matrix comes directly from night-run.md Part 0b's own paragraph ("`PLAN_EXHAUSTED` means
  # every task reached a `done` state -- nothing weaker"), which maps each of the six Part 4 task
  # states to exactly one terminal state:
  #   done                    -> (needs no line at all -- Part 4: "done tasks need no per-task line")
  #   parked-hitl | blocked   -> AUTHORITY_BOUNDARY
  #   stalled | denied-tool   -> HARD_FAILURE
  #   unattempted             -> BUDGET_STOP
  # A terminal line naming a DIFFERENT state than the one a present per-task line maps to is a
  # contradiction, and per that same paragraph "the state is the half that is wrong" -- so this
  # FAILs the terminal line's claim, never the per-task line's.
  #
  # HARD_FAILURE and USER_STOP are deliberately NOT asserted against, in either direction. Both can
  # be produced by something this checker cannot see from the log text alone: HARD_FAILURE also
  # fires on a bare non-zero process exit (night-run.sh's reap(), the wrapped-process-exit branch),
  # which can land after a task already logged `done`, `parked-hitl` or `unattempted` -- so a
  # HARD_FAILURE next to any of those is not necessarily wrong. USER_STOP is an external interrupt
  # (night-run.sh: "an external kill never reaches this code path at all") and can land mid-task in
  # any state. night-run.md's contract is silent on what per-task states those two rule OUT, so
  # nothing is asserted for them here rather than guessing at a rule the doc does not state.
  agree_bad=0
  if [ "$term" -eq 1 ]; then
    term_state=$(grep -oE '^terminal · (PLAN_EXHAUSTED|AUTHORITY_BOUNDARY|HARD_FAILURE|BUDGET_STOP|USER_STOP) ·' "$lg" 2>/dev/null \
      | head -n1 | sed -E 's/^terminal · ([A-Z_]+) ·.*/\1/')
    case "$term_state" in
      PLAN_EXHAUSTED)
        bad_line=$(grep -E '^T[0-9]+ · (blocked|parked-hitl|stalled|denied-tool|unattempted) · ' "$lg" 2>/dev/null | head -n1)
        if [ -n "$bad_line" ]; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · PLAN_EXHAUSTED but carries a non-done per-task line -- '$bad_line' -- Part 0b: PLAN_EXHAUSTED means every task reached a done state, nothing weaker; this is the SPRINT-089 shape exactly"
        fi
        ;;
      AUTHORITY_BOUNDARY)
        bad_line=$(grep -E '^T[0-9]+ · (stalled|denied-tool|unattempted) · ' "$lg" 2>/dev/null | head -n1)
        if [ -n "$bad_line" ]; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · AUTHORITY_BOUNDARY but carries a per-task line Part 0b maps elsewhere (stalled/denied-tool -> HARD_FAILURE, unattempted -> BUDGET_STOP) -- '$bad_line'"
        fi
        ;;
      BUDGET_STOP)
        bad_line=$(grep -E '^T[0-9]+ · (blocked|parked-hitl|stalled|denied-tool) · ' "$lg" 2>/dev/null | head -n1)
        if [ -n "$bad_line" ]; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · BUDGET_STOP but carries a per-task line Part 0b maps elsewhere (blocked/parked-hitl -> AUTHORITY_BOUNDARY, stalled/denied-tool -> HARD_FAILURE) -- '$bad_line'"
        fi
        ;;
      HARD_FAILURE|USER_STOP) : ;;  # contract silent on what these two rule out -- left unasserted
    esac
  fi

  [ "$hdr" -eq 1 ] && [ "$cal" -eq 1 ] && [ "$term" -eq 1 ] && [ "$agree_bad" -eq 0 ] \
    && ok "night-run rollup $lg (DoD header + terminal state + calibration row present, and agrees with its per-task lines)"
done

exit "$fail"
