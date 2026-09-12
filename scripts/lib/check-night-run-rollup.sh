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
#
# Windowed to the LAST `run-complete` entry (SPRINT-093 T1 revise 3). Execution Logs are
# append-only, so a sprint that survives more than one night accumulates more than one
# `run-complete` block -- every check below reads only the most recent one, the same discipline
# night-run.sh's reap() already applies to its own append window (`tail -n "+$((rp_base + 1))"`,
# commented there: "a guard reading the wrong window fails exactly like one that is absent"). A
# checker reading the whole file would validate an EARLIER block's terminal state against an
# EARLIER block's evidence, or against nothing at all -- silently passing a contradiction two
# blocks later. See `win()` below.
set -u

# Shared archive predicate (SPRINT-099 T3, TD-145 · TD-151). Ten checkers each carried the same
# string glob `case "$x" in */archive/*)`, which admits `docs/sprint/Archive/...` -- the SAME
# directory, one inode, on any case-insensitive filesystem. One predicate, asked of the filesystem.
# Missing file is FATAL rather than a local fallback: a fallback copy here would rebuild the ten
# copies this task exists to remove.
_lf_ap=$(dirname -- "$0")/archive-path.sh
[ -f "$_lf_ap" ] || { echo "FAIL night-run rollup: shared archive predicate not found at $_lf_ap"; exit 2; }
. "$_lf_ap"

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

[ "$#" -gt 0 ] || { note "night-run rollup: no sprint logs given -- nothing verified"; exit 0; }

for lg in "$@"; do
  # An absent log is not a skip -- it is exactly the state a run that died before writing anything
  # leaves behind (SPRINT-098 T1 DoD 1). Named distinctly from "no completed-run entry yet" below:
  # that case has a real file recording real (mid-flight) progress; this one has none at all.
  [ -f "$lg" ] || { bad "night-run rollup: no Execution Log found at $lg -- an absent log is exactly the silence this check exists to catch, not something to skip"; continue; }
  # A1 (SPRINT-098 T1, owner-ruled 2026-09-11): grandfathered by scoping to LIVE sprints, not by a
  # maintained allowlist -- the archived sprints carrying open Plan DoD fall out of scope by
  # construction, exactly because their path matches here. (Count deliberately not stated: it is a
  # query result, it moves with every close, and a reader here cannot re-derive it. The figure that
  # was first written into this comment -- "36 of 97" -- was wrong: it counted any open checkbox in
  # the file, including `## Owner-action checklist` items. Scoped to `## Plan`, where DoD live, it
  # is 5 archived sprints, 4 of them without a rollup. See the 2026-09-11 correction entry in
  # docs/sprint/logs/SPRINT-098-*.md.) This inherits TASK-342's known defect:
  # the exclusion below is a case-sensitive STRING glob, not a filesystem-identity predicate, so a
  # differently-cased or differently-separated archive path (e.g. a case-insensitive filesystem's
  # `Archive/`) would not be excluded. Named rather than fixed here -- TASK-342 owns the repair.
  lf_is_archived_path "$lg" && continue

  # A completed run announces itself with a `run-complete` event in the log's entry header.
  # Renamed from the bare `complete` (TD-055): that word collided with a task-level "this task
  # is complete" entry, which silently armed these run-level assertions on a mid-Plan log
  # (misfired mid-SPRINT-064). Anchored to the delimited event field, not a bare substring
  # (L-108) -- a task-level `| complete |` header no longer arms anything here.
  if ! grep -qE '^### .*\| *run-complete *\|' "$lg" 2>/dev/null; then
    note "night-run rollup: $lg has no completed-run entry yet -- nothing to verify"
    continue
  fi

  # --- windowing (SPRINT-093 T1 revise 3) --------------------------------------------------------
  # Everything below must read only the LAST run-complete entry, never the whole file. Execution
  # Logs are append-only (STANDARD §9 / ADR-014), so a sprint that survives more than one night
  # accumulates more than one `run-complete` block -- SPRINT-082's committed log already has two.
  # Every grep below used to scan `"$lg"` directly, which means a CONTRADICTION in the second block
  # (a real SPRINT-089 shape) would be checked against the FIRST block's terminal state and the
  # FIRST block's evidence lines -- or pass outright if the first block happens to be clean. This
  # copies the pattern night-run.sh's reap() already uses and names why in its own comment: "a guard
  # reading the wrong window fails exactly like one that is absent." The window is derived the same
  # way, just anchored by the file's own last header instead of an externally-passed rp_base.
  rc_start=$(grep -nE '^### .*\| *run-complete *\|' "$lg" 2>/dev/null | tail -n1 | cut -d: -f1)
  # The window ends at EOF, or at the next `### ` entry header if a later (non-run-complete) entry
  # was appended afterward -- e.g. a reviewer's follow-up note. Without this upper bound, that later
  # entry's prose could itself be misread as evidence (the exact worked-example contamination
  # reap()'s own comment warns about: a documentation line starting `T5 · unattempted · ...` read as
  # real output).
  rc_end=$(awk -v s="$rc_start" 'NR>s && /^### /{print NR; exit}' "$lg" 2>/dev/null)
  win() {
    if [ -n "$rc_end" ]; then
      sed -n "${rc_start},$((rc_end - 1))p" "$lg" 2>/dev/null
    else
      sed -n "${rc_start},\$p" "$lg" 2>/dev/null
    fi
  }

  hdr=0; cal=0; term=0
  win | grep -qE '^run · [0-9]+ of [0-9]+ DoD ticked' && hdr=1
  win | grep -qE '^run · .* · .* · .* · [0-9]+ of [0-9]+ units · ' && cal=1
  # Anchored at column 1 and restricted to the five states the contract defines (Part 0b). An
  # unrecognised state must NOT satisfy this: `terminal · FINISHED · ...` parses as a terminal line
  # and means nothing, which is the malformed-record failure -- a record nobody can act on looks like
  # evidence and is worse than none (the gates-signed family's own ruling).
  win | grep -qE '^terminal · (PLAN_EXHAUSTED|AUTHORITY_BOUNDARY|HARD_FAILURE|BUDGET_STOP|USER_STOP) · ' && term=1

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
    term_state=$(win | grep -oE '^terminal · (PLAN_EXHAUSTED|AUTHORITY_BOUNDARY|HARD_FAILURE|BUDGET_STOP|USER_STOP) ·' \
      | head -n1 | sed -E 's/^terminal · ([A-Z_]+) ·.*/\1/')
    case "$term_state" in
      PLAN_EXHAUSTED)
        bad_line=$(win | grep -E '^T[0-9]+ · (blocked|parked-hitl|stalled|denied-tool|unattempted) · ' | head -n1)
        if [ -n "$bad_line" ]; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · PLAN_EXHAUSTED but carries a non-done per-task line -- '$bad_line' -- Part 0b: PLAN_EXHAUSTED means every task reached a done state, nothing weaker; this is the SPRINT-089 shape exactly"
        fi
        ;;
      AUTHORITY_BOUNDARY)
        bad_line=$(win | grep -E '^T[0-9]+ · (stalled|denied-tool|unattempted) · ' | head -n1)
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
        if ! win | grep -qE '^T[0-9]+ · (parked-hitl|blocked) · '; then
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
        bad_line=$(win | grep -E '^T[0-9]+ · (stalled|denied-tool) · ' | head -n1)
        if [ -n "$bad_line" ]; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · BUDGET_STOP but carries a per-task line reap()'s priority order ranks above it (stalled/denied-tool -> HARD_FAILURE outranks BUDGET_STOP) -- '$bad_line'"
        fi
        # Positive half (SPRINT-093 T1 revise 2, independent review): reap() only ever REACHES
        # BUDGET_STOP when rp_unatt > 0 (night-run.sh:210). Same reasoning as AUTHORITY_BOUNDARY's
        # positive check above -- a BUDGET_STOP with zero `Tn · unattempted ·` lines is contradicted
        # by omission, not merely unproven: its own `why` text ("N task(s) never reached") names
        # evidence the per-task lines do not carry.
        if ! win | grep -qE '^T[0-9]+ · unattempted · '; then
          agree_bad=1
          bad "night-run rollup: $lg claims terminal · BUDGET_STOP but carries no 'Tn · unattempted ·' line -- reap() only reaches BUDGET_STOP when at least one task was never reached (night-run.sh:210); missing that evidence, the terminal claim has nothing behind it"
        fi
        ;;
      HARD_FAILURE|USER_STOP) : ;;  # contract silent on what these two rule out -- left unasserted
    esac
  fi

  # --- outcome / DoD consistency (SPRINT-098 T3 -- EPIC-015 Closed-when 6) ------------------------
  # `outcome ·` is a NEW field (reap() now emits it beside `run ·`/`terminal ·`) and is deliberately
  # NOT added to the hdr/cal/term shape requirement above: every log written before T3 shipped --
  # every retained fixture in this suite, and the real committed SPRINT-067/082/089/090 archives --
  # has no `outcome ·` line at all, and requiring one here would retroactively FAIL every one of them.
  # Grandfathered the same way A1 grandfathered the archived-sprint population: absent because it
  # predates the field, not because something is wrong. Going forward every `--reap` run emits it
  # mechanically, so this is a closing gap, not a permanent hole. The ONE thing checked, when the
  # line IS present, is the exact silent false negative DoD 4 names: a run that stopped mid-Plan
  # (an open DoD box remains) reporting itself DELIVERED.
  #
  # Self-describing-corpus guard (L-108), and it is a real risk HERE specifically because this
  # checker's own convention (unlike check_revise_ceiling()'s) reads INSIDE the ``` fence -- that
  # fence wraps reap()'s genuine machine-emitted lines, so blanket fence-stripping would discard the
  # real evidence along with any illustrative aside. What actually protects this check is emission
  # ORDER: reap() writes the real `outcome ·`/`run ·` lines FIRST, at the top of its block, in one
  # atomic append; the Execution Log's own append-only rule (STANDARD §9 / ADR-014, restated in this
  # file's own header comment) means any later illustrative aside quoting the format inside the SAME
  # window can only be appended AFTER the real lines, never before. `head -n1` below always selects
  # the genuine, reaper-authored occurrence -- proven by the `outcome-illustrative-aside-after-real`
  # fixture (evals/fixtures/night-run-outcome/), which appends a contradicting illustrative example
  # AFTER correct real evidence in the same window and asserts the verdict does not flip.
  # KNOWN GAP, recorded by the coordinator and routed to T3's outside review rather than patched
  # blind (SPRINT-098 T3). The emission-order argument above holds for an aside appended AFTER the
  # reaper's block, but the window is anchored at the LAST `run-complete` header, and a HAND-WRITTEN
  # `run-complete` entry can carry an illustrative example BEFORE its real evidence — at which point
  # `head -n1` selects the example. Reproduced: an entry quoting `run · 9 of 9 DoD ticked` above real
  # evidence of `run · 1 of 5` plus `outcome · DELIVERED` returns PASS, a mid-Plan stop reporting
  # itself delivered. `head -n1` is a SELECTION rule and it selects the wrong occurrence (L-186).
  # Zero real logs carry the shape today. A first-fenced-block fix was tried and is WRONG: in a
  # hand-written entry the example IS the first block, and it also reddened the retained fixtures.
  # The discriminator is not ordering — it needs to be something only the reaper emits.
  outc=0
  win | grep -qE '^outcome · (DELIVERED|PARTIAL|FAILED) · ' && outc=1
  if [ "$outc" -eq 1 ]; then
    outc_tok=$(win | grep -oE '^outcome · (DELIVERED|PARTIAL|FAILED) ·' | head -n1 | sed -E 's/^outcome · ([A-Z]+) ·.*/\1/')
    dod_line=$(win | grep -E '^run · [0-9]+ of [0-9]+ DoD ticked' | head -n1)
    dod_n=$(printf '%s\n' "$dod_line" | sed -E 's/^run · ([0-9]+) of ([0-9]+) DoD ticked.*/\1/')
    dod_m=$(printf '%s\n' "$dod_line" | sed -E 's/^run · ([0-9]+) of ([0-9]+) DoD ticked.*/\2/')
    if [ "$outc_tok" = "DELIVERED" ] && [ -n "$dod_n" ] && [ -n "$dod_m" ] && [ "$dod_n" != "$dod_m" ]; then
      agree_bad=1
      bad "night-run rollup: $lg claims outcome · DELIVERED but only $dod_n of $dod_m DoD are ticked -- outcome-delivered-with-open-dod: DELIVERED means the Plan finished, never a mid-Plan stop reporting itself delivered (SPRINT-098 T3, EPIC-015 Closed-when 6)"
    fi
  fi

  [ "$hdr" -eq 1 ] && [ "$cal" -eq 1 ] && [ "$term" -eq 1 ] && [ "$agree_bad" -eq 0 ] \
    && ok "night-run rollup $lg (DoD header + terminal state + calibration row present, and agrees with its per-task lines)"
done

exit "$fail"
