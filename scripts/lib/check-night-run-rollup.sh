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
  # The matrix is derived from night-run.sh's reap() itself (the code that PRODUCES the terminal
  # line), not from night-run.md Part 0b's prose in isolation -- an independent review of this task
  # (SPRINT-093 T1 revise) found Part 0b's "maps each task state to exactly one terminal state"
  # reads as a bijection that the implementation does not honour. reap() picks the terminal state by
  # PRIORITY, first match wins, and does not require the lower-priority conditions to be false of
  # anything except each other:
  #   1. wrapped process exit != 0        -> HARD_FAILURE
  #   2. any stalled | denied-tool        -> HARD_FAILURE
  #   3. any unattempted                  -> BUDGET_STOP        (checked BEFORE parked/blocked)
  #   4. any parked-hitl | blocked        -> AUTHORITY_BOUNDARY
  #   5. otherwise                        -> PLAN_EXHAUSTED
  # So BUDGET_STOP is NOT "unattempted and nothing else" -- it is "no hard-failure condition, and at
  # least one unattempted", full stop. A run can legitimately park a J2 task (Part 0's protocol:
  # continue disjoint AFK work) and THEN exhaust its budget on a later task, landing
  # `terminal · BUDGET_STOP` beside both a `parked-hitl` line and an `unattempted` line -- reap()
  # picks BUDGET_STOP at step 3 without ever looking at rp_parked. Flagging that as a contradiction
  # was itself a defect (over-broad guard, noise instead of the silence this task exists to fix).
  # Re-audited row by row against the priority reading, not assumed:
  #   PLAN_EXHAUSTED     -- reached only when steps 1-4 ALL miss. Contradicted by ANY of the five
  #                         non-done states. Unchanged.
  #   AUTHORITY_BOUNDARY -- reached only when steps 1-3 miss and step 4 hits. Contradicted by
  #                         stalled/denied-tool (outrank it at step 2) or unattempted (outranks it
  #                         at step 3). Unchanged.
  #   BUDGET_STOP        -- reached when steps 1-2 miss and step 3 hits; step 4 (parked/blocked) is
  #                         never even consulted once step 3 fires. Contradicted ONLY by
  #                         stalled/denied-tool (outrank it at step 2). blocked/parked-hitl must NOT
  #                         be flagged.
  #
  # SPRINT-093 T1 revise 2, independent review's own second finding: everything above asserts what
  # each state is INCOMPATIBLE with -- never what it REQUIRES. `terminal · BUDGET_STOP` with zero
  # `unattempted` lines, or `terminal · AUTHORITY_BOUNDARY` with zero `parked-hitl`/`blocked` lines,
  # both PASSED, and neither is a shape reap() can emit (step 3 needs rp_unatt>0 to pick
  # BUDGET_STOP; step 4 needs rp_parked>0 to pick AUTHORITY_BOUNDARY). Per-task lines are sparse --
  # a `done` task carries no line at all (Part 4) -- so the ABSENCE of the one state-defining line
  # is itself the contradiction, the same DoD 1 class through omission rather than through a wrong
  # line. Added as a positive requirement on exactly these two rows:
  #   BUDGET_STOP        -- requires >=1 `Tn · unattempted ·` line (night-run.sh:210).
  #   AUTHORITY_BOUNDARY -- requires >=1 `Tn · parked-hitl ·` or `Tn · blocked ·` line (:212).
  # PLAN_EXHAUSTED gets no separate positive check: its requirement IS the absence of all four
  # other states, which its existing negative rule already enforces in full. HARD_FAILURE and
  # USER_STOP get no positive check either -- see why below; requiring evidence for either would
  # false-FAIL a real run.
  #
  # HARD_FAILURE and USER_STOP are deliberately NOT asserted against, in either direction. Both can
  # be produced by something this checker cannot see from the log text alone: HARD_FAILURE also
  # fires on a bare non-zero process exit (reap()'s step 1), which can land after a task already
  # logged `done`, `parked-hitl` or `unattempted` -- so a HARD_FAILURE next to any of those is not
  # necessarily wrong. USER_STOP is an external interrupt (night-run.sh: "an external kill never
  # reaches this code path at all") and can land mid-task in any state. Nothing is asserted for them
  # here rather than guessing at a rule neither the doc nor the code states.
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
        # Positive half (SPRINT-093 T1 revise 2, independent review): reap() only ever REACHES
        # AUTHORITY_BOUNDARY when rp_parked > 0 (night-run.sh:212). Per-task lines are sparse --
        # done tasks carry no line at all -- so zero parked-hitl/blocked lines in the file is not
        # neutral, it is the absence of the ONE thing this terminal state requires. That is the
        # same contradiction-by-omission DoD 1 names, just on the other side of the rule: the
        # `why` text ("work remains, all of it J2 or blocked behind a park") asserts evidence the
        # per-task lines do not carry.
        if ! grep -qE '^T[0-9]+ · (parked-hitl|blocked) · ' "$lg" 2>/dev/null; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · AUTHORITY_BOUNDARY but carries no 'Tn · parked-hitl ·' or 'Tn · blocked ·' line -- reap() only reaches AUTHORITY_BOUNDARY when at least one task parked or was blocked (night-run.sh:212); missing that evidence, the terminal claim has nothing behind it"
        fi
        ;;
      BUDGET_STOP)
        # blocked/parked-hitl are NOT a contradiction here (SPRINT-093 T1 revise): reap() picks
        # BUDGET_STOP as soon as any task is unattempted, without ever checking whether another
        # task also parked. A run that parks a J2 task, continues disjoint AFK work per Part 0,
        # then exhausts its budget on a later task legitimately reports BUDGET_STOP beside BOTH a
        # parked-hitl line and an unattempted line -- see the priority table above.
        bad_line=$(grep -E '^T[0-9]+ · (stalled|denied-tool) · ' "$lg" 2>/dev/null | head -n1)
        if [ -n "$bad_line" ]; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · BUDGET_STOP but carries a per-task line reap()'s priority order ranks above it (stalled/denied-tool -> HARD_FAILURE outranks BUDGET_STOP) -- '$bad_line'"
        fi
        # Positive half (SPRINT-093 T1 revise 2, independent review): reap() only ever REACHES
        # BUDGET_STOP when rp_unatt > 0 (night-run.sh:210). Same reasoning as AUTHORITY_BOUNDARY's
        # positive check above -- a BUDGET_STOP with zero `Tn · unattempted ·` lines is contradicted
        # by omission, not merely unproven: its own `why` text ("N task(s) never reached") names
        # evidence the per-task lines do not carry.
        if ! grep -qE '^T[0-9]+ · unattempted · ' "$lg" 2>/dev/null; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · BUDGET_STOP but carries no 'Tn · unattempted ·' line -- reap() only reaches BUDGET_STOP when at least one task was never reached (night-run.sh:210); missing that evidence, the terminal claim has nothing behind it"
        fi
        ;;
      HARD_FAILURE|USER_STOP) : ;;  # contract silent on what these two rule out -- left unasserted
    esac
  fi

  [ "$hdr" -eq 1 ] && [ "$cal" -eq 1 ] && [ "$term" -eq 1 ] && [ "$agree_bad" -eq 0 ] \
    && ok "night-run rollup $lg (DoD header + terminal state + calibration row present, and agrees with its per-task lines)"
done

exit "$fail"
