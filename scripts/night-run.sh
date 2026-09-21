#!/usr/bin/env sh
# night-run.sh -- POSIX sh launcher for an unattended headless run.
#
# Fires a command (typically `claude -p ... --permission-mode dontAsk --allowedTools ...`)
# DETACHED, so closing the launching terminal cannot kill it, then reports back after a
# short observation window whether the run is genuinely alive (process up AND making
# progress) or dead on arrival (naming what failed). Pairs with
# skills/orchestrator/references/night-run.md Part 1 (pre-flight) and Part 2 (trigger) --
# read those before firing for real; this script only re-checks the mechanically
# checkable subset of Part 1, never the judgement items (G1/G2 sign-off, allowlist
# completeness, cost estimate).
#
# Usage:
#   sh scripts/night-run.sh [launcher-options] -- <command> [args...]
#
# Launcher options (all optional):
#   --wait-seconds N   Observation window before the verdict (default 150 = ~2.5 min)
#   --poll-seconds N   How often to poll during the window (default 5)
#   --mode NAME        Declare the run mode: overnight (canonical), or the aliases night-run /
#                       unattended / "sprint-bulk unattended". An unrecognised value is a
#                       pre-flight DOA -- never defaulted (night-run.md Part 0)
#   --log FILE         Where the fired command's stdout+stderr is captured
#                       (default: ./night-run-<timestamp>.log in the current directory)
#   --sprint FILE       Declare which sprint Plan this run targets (e.g.
#                       docs/sprint/SPRINT-090-....md). Optional but recommended whenever more
#                       than one sprint may carry `status: active` at once -- without it the
#                       reaper falls back to scanning for the sole active Plan and REFUSES (writes
#                       nothing) if it finds zero or more than one, rather than guessing (TD-112:
#                       SPRINT-089's reaper once guessed and wrote a false rollup into the wrong
#                       sprint's log). Must name a file that exists and carries `status: active`.
#
# Everything after `--` is executed verbatim, detached, exactly as given -- this script
# does not build the command for you; see night-run.md Part 2 for how to build it.
#
# Verdicts (exactly one, to stdout):
#   ALIVE               process is up and making progress (or already finished cleanly)
#   DEAD-ON-ARRIVAL: <reason>   names what failed -- never a bare non-zero
#   UNKNOWN: <reason>   process is up but nothing observable happened in the window --
#                       indeterminate, NOT dead (TD-029). A silent-but-working run looks
#                       identical to a stalled one from outside, and with a buffering output
#                       format (--output-format json) an empty log is expected rather than
#                       diagnostic. Reporting DOA there asserts a cause we cannot see.
#
# Exit 0 on ALIVE, 1 on DEAD-ON-ARRIVAL (including a pre-flight block, which fires before
# anything is launched), 2 on UNKNOWN. Never conflate 1 and 2: 1 means "it failed and here is
# what failed", 2 means "I could not tell".

set -u

wait_seconds=150
poll_seconds=5
logfile=""
run_mode=""
sprint_arg=""
reap=1

# --- the reaper -------------------------------------------------------------
# Runs AFTER the fired command exits, re-entrantly (`sh "$0" --reap ...`) from inside the
# same wrapper that captures the exit code.
#
# WHY it lives here and not in the trigger prompt: a bookkeeping step that happens after
# the work, and that no gate depends on, is the first thing an agent drops as its turn
# winds down. Measured -- a run asked in plain language to write its calibration row and
# to re-check its parks completed every unit of work and did neither (night-run.md Part 2).
# An instruction about the work holds; an instruction about bookkeeping does not. So the
# rollup is emitted by the process wrapper, which outlives the model's sense of completion,
# instead of being requested from the model. Trade-off and alternatives -> ADR-016.
#
# Only CONSTRAINED NUMERIC fields are lifted out of the log. The log is the run's own
# output and this writes into a committed doc, so nothing free-text crosses that boundary:
# a malformed or crafted log line must not be able to inject markdown structure into a
# sprint record. Every extraction below is bounded to [0-9.] by its own pattern.

# Locate the active sprint's Plan file. Shared by the launcher (to record how long the
# Execution Log already was before firing) and by the reaper, so both agree on the target.
#
# TD-112 / SPRINT-093 T1: this used to return the FIRST `status: active` file the glob found and
# stop looking. SPRINT-089's reaper hit exactly that with two sprints active at once (SPRINT-089 and
# SPRINT-090, sorted before it): it silently wrote into SPRINT-089's Plan and log, computed
# `terminal · PLAN_EXHAUSTED` from THAT file's empty task-state history, and the false rollup was
# internally consistent with the wrong input it was reading -- the cross-write, not a broken
# derivation. Guessing among more than one candidate is exactly the failure this whole file's
# discipline forbids (the mode signal, the J-class, the allowlist -- all "declared, never inferred").
# So: exactly one match is resolved; zero or more than one is refused, same as an unrecognised
# --mode is refused rather than defaulted (night-run.md Part 0). The caller (find_sprint's return 1)
# already treats "not found" as "nothing to reap" -- ambiguity now shares that same safe failure
# instead of silently picking one.
find_sprint() {
  fs_root=$1
  [ -n "$fs_root" ] || return 1
  fs_match=""
  fs_count=0
  for f in "$fs_root"/docs/sprint/SPRINT-*.md; do
    [ -f "$f" ] || continue
    grep -q '^status: active' "$f" 2>/dev/null || continue
    fs_count=$((fs_count + 1))
    fs_match=$f
  done
  [ "$fs_count" -eq 1 ] || return 1
  printf '%s' "$fs_match"
  return 0
}

# --- revise-loop ceiling guard (T2, SPRINT-098 -- EPIC-015 Closed-when 5) --------------------------
# ADR-022 § Decision item 2 (cited, never re-chosen -- A4): "The ceiling is the attended one --
# one retry per review pass, total. Still-open after the retry -> parked-hitl, never a second
# firing." This is the mechanical proof that a run's own Execution Log never crosses that ceiling,
# and that a still-open outcome actually escalated (parked-hitl) rather than the run continuing
# past it -- called from `reap()` below so the check lives where the run's own terminal state is
# derived (DoD 1: wired where the run reads it, not only described in review-scoping.md § The
# revise loop), and exposed as its own CLI entry (`--check-revise-loop`) so a fixture can assert
# on it directly, the same way `--reap` lets a fixture drive the rollup in isolation.
#
# Reads the two line shapes the reaper below already parses: a `Tn · retry · <axis>: <finding> ->
# fixed|still-open` line (night-run.md Part 4) and a task's own `Tn · <state> ·` line. Two named
# findings, so a fixture asserts on which rule fired, never on a bare non-zero exit:
#   revise-loop-ceiling-exceeded   -- a task fired more than one retry in this run's window
#   revise-loop-escalation-missing -- a still-open retry with no matching parked-hitl line
#
# `base` is the SAME 0-indexed "lines already in the file before this run" cutoff `reap()`'s
# rp_base uses (default 0, i.e. the whole file) -- an EARLIER run's retry line for the same task
# number must NOT count against THIS run's ceiling, which is the selection this guard has to get
# right independently of the count math (L-186): two `T3 · retry ·` lines in the file, one before
# the cutoff and one after, is a compliant run, not a breach.
check_revise_ceiling() {
  crc_logdoc=$1
  crc_base=${2:-0}
  if [ ! -f "$crc_logdoc" ]; then
    printf 'FAIL  revise-loop-ceiling-unreadable: %s not found\n' "$crc_logdoc"
    return 1
  fi
  # `base` must be an integer before it reaches the arithmetic below. The standalone
  # `--check-revise-loop` entry accepts it from a caller, and a non-numeric value used to emit a
  # shell error on stderr and then print PASS at exit 0 -- failing OPEN, which for a guard is the
  # one direction that must never happen (outside review, SPRINT-098 T2). Same numeric-safety
  # shape reap() already applies to rp_parked/rp_hard below.
  case "$crc_base" in ''|*[!0-9]*)
    printf 'FAIL  revise-loop-ceiling-unreadable: base cutoff %s is not a line number\n' "$crc_base"
    return 1 ;;
  esac

  # Strip fenced regions BEFORE matching. This is the incident reap() already carries a comment
  # about, recurring one function over: a markdown corpus is self-describing, so a log that quotes
  # the Part 4 format in prose or in a ``` block has `Tn · retry ·` at line start without any retry
  # having fired. Windowing to `base` does not help when the documentation lives inside THIS run's
  # own window. Verbatim reproduction before the fix: a log whose only retry lines sat inside a
  # fenced example returned `FAIL revise-loop-ceiling-exceeded: T4 fired 2 retries` (L-108).
  crc_window=$(tail -n "+$((crc_base + 1))" "$crc_logdoc" 2>/dev/null | awk '
    /^[[:space:]]*```/ { fence = !fence; next }
    !fence
  ')
  crc_fail=0

  crc_tasks=$(printf '%s\n' "$crc_window" | grep -E '^T[0-9]+ · retry · ' | sed -E 's/^(T[0-9]+) .*/\1/' | sort -u)
  for crc_t in $crc_tasks; do
    crc_n=$(printf '%s\n' "$crc_window" | grep -cE "^${crc_t} · retry · ")
    if [ "$crc_n" -gt 1 ]; then
      printf 'FAIL  revise-loop-ceiling-exceeded: %s fired %s retries in one review pass -- ADR-022 § Decision item 2 permits one retry per review pass, total\n' "$crc_t" "$crc_n"
      crc_fail=1
    fi

    # A still-open outcome must escalate (parked-hitl), never fall through to `done` or to
    # silence -- a second firing by a different route, since the ceiling exists precisely so a
    # still-open finding stops the loop rather than being absorbed into a clean-looking state.
    if printf '%s\n' "$crc_window" | grep -qE "^${crc_t} · retry · .*still-open"; then
      printf '%s\n' "$crc_window" | grep -qE "^${crc_t} · parked-hitl · " || {
        printf 'FAIL  revise-loop-escalation-missing: %s retry ended still-open with no %s · parked-hitl · line -- ADR-022 requires a second failure to escalate, never loop\n' "$crc_t" "$crc_t"
        crc_fail=1
      }
    fi
  done

  [ "$crc_fail" -eq 0 ] && printf 'PASS  revise-loop-ceiling: within ADR-022 § Decision item 2 (one retry per review pass, total)\n'
  return $crc_fail
}

# --- typed run outcome (T3, SPRINT-098 -- EPIC-015 Closed-when 6) ----------------------------------
# A3 (owner-ruled 2026-09-11): this is EPIC-015's own LOCAL, non-portable outcome vocabulary, not
# EPIC-008's portable RunEnvelope/WorkItem/RunEvent/Evidence family -- EPIC-008 is `status: proposed`
# with no member sprints and its object set explicitly refuses to assume a repository at all. The
# name `RunSummary` is NOT minted here (binding condition of the ruling); this shape is named for the
# Part 4 rollup it types. EPIC-008 may later subsume or map it -- nothing here assumes it will.
#
# A DETERMINISTIC function of the terminal state alone, never a second, independent re-derivation
# from the per-task lines -- reap()'s own priority order already resolved rp_term once, and deriving
# outcome from anything else risks the two silently disagreeing. An unrecognised terminal token fails
# CLOSED to FAILED, never defaults to the clean-looking DELIVERED (do not fail open).
outcome_for_terminal() {
  case "$1" in
    PLAN_EXHAUSTED) printf 'DELIVERED' ;;
    AUTHORITY_BOUNDARY|BUDGET_STOP|USER_STOP) printf 'PARTIAL' ;;
    HARD_FAILURE) printf 'FAILED' ;;
    *) printf 'FAILED' ;;  # unreachable under reap()'s own case statement; fails closed if it ever is
  esac
}

reap() {
  # 5th positional: the sprint Plan path RESOLVED BY THE LAUNCHER before firing (declared, not
  # re-inferred here) -- see `--sprint` below and the `resolved_sprint` computation near the fire
  # site. Empty means the launcher didn't resolve one either (no --sprint given and find_sprint's
  # scan came back ambiguous or empty); fall back to a direct scan so a bare `--reap` invocation
  # (manual testing, or an older caller) still behaves as before -- now carrying the ambiguity fix
  # above either way.
  rp_log=$1; rp_root=$2; rp_started=$3; rp_base=${4:-0}; rp_sprint_arg=${5:-}
  if [ -n "$rp_sprint_arg" ]; then
    rp_sprint=$rp_sprint_arg
    [ -f "$rp_sprint" ] || return 0
  else
    rp_sprint=$(find_sprint "$rp_root") || return 0
  fi

  rp_logdoc="$rp_root/docs/sprint/logs/$(basename "$rp_sprint")"
  # No Execution Log means the run never opened one -- it did nothing worth a rollup, and
  # creating the file here would be this script inventing a record rather than completing one.
  [ -f "$rp_logdoc" ] || return 0

  # DoD boxes -- the header count.
  rp_done=$(grep -c '^- \[x\]' "$rp_sprint" 2>/dev/null)
  rp_open=$(grep -c '^- \[ \]' "$rp_sprint" 2>/dev/null)
  rp_total=$((rp_done + rp_open))

  # UNITS are Plan tasks, not checkboxes. The calibration series reads "4 of 7 units" and
  # means tasks; reporting DoD boxes in that field would silently redefine every existing
  # row's scale. A unit is delivered when its block has no open box left.
  rp_units=$(grep -c '^### T[0-9]' "$rp_sprint" 2>/dev/null)
  rp_units_done=$(awk '
    /^### T[0-9]+ /{ if (t!="") { if (!o) d++ } t=$2; o=0 }
    /^- \[ \]/{ if (t!="") o=1 }
    END{ if (t!="" && !o) d++; print d+0 }' "$rp_sprint" 2>/dev/null)

  rp_cost=$(grep -o '"total_cost_usd":[0-9.]*' "$rp_log" 2>/dev/null | tail -n1 | cut -d: -f2)
  rp_turns=$(grep -o '"num_turns":[0-9]*' "$rp_log" 2>/dev/null | tail -n1 | cut -d: -f2)
  # Degrade rule (Part 4): where a figure is not exposed, SAY it was unavailable. A row
  # with a stated gap still calibrates; a silently omitted one leaves the next person
  # estimating from nothing.
  if [ -n "$rp_cost" ]; then rp_cost="\$$rp_cost"; else rp_cost="cost unavailable"; fi
  [ -n "$rp_turns" ] || rp_turns="?"

  rp_wall="unavailable"
  if [ -n "$rp_started" ]; then
    rp_now=$(date +%s 2>/dev/null || printf '')
    case "$rp_now$rp_started" in
      ''|*[!0-9]*) ;;
      # Rounded, not truncated. Integer division reported a measured 163s run as "2 min",
      # a 40% under-statement -- negligible on a 64-minute run, material on a short one, and
      # always in the same direction. A series used for estimating must not lean low by
      # construction.
      *) rp_wall="$(( (rp_now - rp_started + 30) / 60 )) min" ;;
    esac
  fi

  # --- terminal state (Part 0b) -------------------------------------------------------------------
  # Derived HERE, in the launcher, for exactly the reason ADR-016 put the DoD count here: a run's own
  # sense of "I am finished" is what is least reliable when it ends early. The wrapper wrote the exit
  # code to $rp_log.exit before invoking this reaper, so the status is on disk and needs no new
  # parameter.
  #
  # The order below is load-bearing, not stylistic:
  #   non-zero exit               -> HARD_FAILURE. A failed process explains the stop.
  #   any stalled | denied-tool   -> HARD_FAILURE. The run could not proceed past a step: the watchdog
  #                                  fired, or `dontAsk` refused a call outside the allowlist.
  #   any unattempted             -> BUDGET_STOP. Tasks were never REACHED. Part 4 defines
  #                                  `unattempted` as "just an exhausted turn"; a turn ceiling is a
  #                                  budget. Ranks ABOVE parks: if some tasks were never reached, the
  #                                  run was not bounded by authority whatever else also happened.
  #   any parked-hitl | blocked   -> AUTHORITY_BOUNDARY. Every task was reached; work remains that
  #                                  needs a human.
  #   otherwise                   -> PLAN_EXHAUSTED. The only clean ending.
  #
  # `blocked`, `stalled` and `denied-tool` are handled EXPLICITLY, and that is the correction an
  # independent review forced. The first version tested only for `unattempted` and `parked-hitl`, so
  # any task carrying one of the other three non-resolved Part 4 states satisfied "has a line about
  # it" and fell through to PLAN_EXHAUSTED -- "the only *clean* ending" reported over a run that was
  # not clean. It was not hypothetical: this sprint's own committed rollup read
  # `terminal · PLAN_EXHAUSTED` with T1, T2 and T4 all logged `· blocked ·`, and the retro entry
  # beside it asserted that verdict was correct. Nothing the author ran could find it; a reviewer
  # reading the state list against the code did, immediately (L-165).
  # USER_STOP is NOT derivable here -- an external kill never reaches this code path at all; it is
  # the die_doa() path's to report. Naming it in the table without emitting it here would be a state
  # nothing can ever produce, so it is named as out-of-scope rather than silently absent (L-166).
  rp_ec=$(cat "$rp_log.exit" 2>/dev/null || printf '')
  rp_unatt=0
  for tn in $(awk '/^### T[0-9]+ /{t=$2} /^- \[ \]/{if(t!=""){print t; t=""}}' "$rp_sprint" 2>/dev/null); do
    tail -n "+$((rp_base + 1))" "$rp_logdoc" 2>/dev/null | grep -q "^$tn · " || rp_unatt=$((rp_unatt + 1))
  done
  # `grep -c` already PRINTS 0 when it matches nothing -- it just exits 1 while doing so. An
  # `|| printf '0'` here therefore appends a SECOND zero and yields "0\n0", which blows up the numeric
  # test below with `integer expression expected`. Caught by running this reaper against a real
  # sprint, not by any fixture: the erroring test simply evaluated false, so the rollup still came out
  # correct and the defect would have shipped behind a right answer.
  rp_parked=$(tail -n "+$((rp_base + 1))" "$rp_logdoc" 2>/dev/null | grep -cE '^T[0-9]+ · (parked-hitl|blocked) · ')
  case "$rp_parked" in ''|*[!0-9]*) rp_parked=0 ;; esac
  rp_hard=$(tail -n "+$((rp_base + 1))" "$rp_logdoc" 2>/dev/null | grep -cE '^T[0-9]+ · (stalled|denied-tool) · ')
  case "$rp_hard" in ''|*[!0-9]*) rp_hard=0 ;; esac

  # T2 (SPRINT-098): the revise-loop ceiling, checked against what the run actually wrote --
  # see check_revise_ceiling() above for the two named findings it can return.
  rp_ceiling_out=$(check_revise_ceiling "$rp_logdoc" "$rp_base")
  rp_ceiling_rc=$?
  rp_ceiling_reason=$(printf '%s\n' "$rp_ceiling_out" | grep '^FAIL' | head -n1)

  case "$rp_ec" in
    ''|0) rp_term_ok=1 ;;
    *)    rp_term_ok=0 ;;
  esac
  if [ "$rp_term_ok" -eq 0 ]; then
    rp_term="HARD_FAILURE"; rp_term_why="wrapped process exited with status $rp_ec"
  elif [ "$rp_ceiling_rc" -ne 0 ]; then
    # Ranked above stalled/denied-tool/parked/exhausted: a breach means the run did something
    # Part 0 never authorised (a second firing, or a still-open that never escalated) -- its
    # own named reason, not folded into rp_hard's bare count (DoD 3: the run does not report a
    # clean completion past this).
    rp_term="HARD_FAILURE"; rp_term_why="$rp_ceiling_reason"
  elif [ "$rp_hard" -gt 0 ]; then
    rp_term="HARD_FAILURE"; rp_term_why="$rp_hard task(s) stalled or denied a tool — the run could not proceed past a step"
  elif [ "$rp_unatt" -gt 0 ]; then
    rp_term="BUDGET_STOP"; rp_term_why="$rp_unatt task(s) never reached — turn/budget ceiling with Plan remaining"
  elif [ "$rp_parked" -gt 0 ]; then
    rp_term="AUTHORITY_BOUNDARY"; rp_term_why="$rp_parked task(s) parked or blocked for a human; the rest completed around them"
  else
    rp_term="PLAN_EXHAUSTED"; rp_term_why="every task reached a resolved state"
  fi

  rp_outcome=$(outcome_for_terminal "$rp_term")

  # --- evidence fields (T3): tasks / parks / repair-cycles / verification / warnings ---------------
  # Each is tagged by provenance in the emitted block below (DoD 2). The reason is TD-152 one level
  # up: a guard read a model-written line as though it were machine output, and the prose around it
  # claimed a mechanical guarantee the code could not give. A verdict presenting a mechanical count
  # and a model-written line at equal confidence repeats that overclaim in the one artifact whose
  # whole job is to say what the run did (T3, owner-ruled 2026-09-11).
  rp_attempted=$((rp_units - rp_unatt))

  # Fence-stripped window, same discipline check_revise_ceiling() already applies (L-108): a
  # documentation example quoting `Tn · retry ·` or `system-verify ·` text inside a ``` block must
  # not be read as this run's own output. Recomputed here (not shared with check_revise_ceiling(),
  # which keeps its own local copy) because that function returns only PASS/FAIL text, not counts.
  rp_window_fs=$(tail -n "+$((rp_base + 1))" "$rp_logdoc" 2>/dev/null | awk '
    /^[[:space:]]*```/ { fence = !fence; next }
    !fence
  ')

  # repair-cycles: MODEL-REPORTED (TD-152's exact case) -- counts whatever `Tn · retry ·` lines the
  # model wrote, not whatever it actually did. A silently-unlogged retry is invisible here, the same
  # limit check_revise_ceiling() already carries and states plainly rather than glosses over.
  rp_retries=$(printf '%s\n' "$rp_window_fs" | grep -cE '^T[0-9]+ · retry · ')

  # verification: MODEL-REPORTED -- the `system-verify ·` line (night-run.md Part 4) is written by
  # the model once, after the final wave's merge-back. Absence means "none logged", never "no
  # verification happened" -- the same absence-is-not-evidence shape as the retry line above.
  rp_verify_line=$(printf '%s\n' "$rp_window_fs" | grep -E '^system-verify · ' | tail -n1)
  if [ -n "$rp_verify_line" ]; then
    # Split on the delimiter, not on whitespace. The first form here was `([^ ]+) ·`, which requires
    # the token to contain no space -- and a `sed` whose pattern does not match does not truncate,
    # it PASSES THE WHOLE LINE THROUGH, so `FAIL(a finding with spaces)` emitted the entire raw line
    # duplicated behind `verification · `. Dormant, because every finding name this repo emits is
    # kebab-case, and named here because the original comment described it as truncation, which is
    # the wrong failure mode to go looking for (T3 outside review, SPRINT-098).
    rp_verify_state=$(printf '%s\n' "$rp_verify_line" | sed -E 's/^system-verify · (.+) · [^·]*$/\1/')
  else
    rp_verify_state="none logged"
  fi

  # warnings: MECHANICAL -- data-quality gaps THIS function detects in its own extraction, never a
  # claim about the model's behaviour. Limited to what it can actually verify: the calibration
  # degrade-rule flags already computed above (Part 4's own "say it was unavailable" rule).
  rp_warn=""
  [ "$rp_cost" = "cost unavailable" ] && rp_warn="${rp_warn}${rp_warn:+; }cost unavailable"
  [ "$rp_turns" = "?" ] && rp_warn="${rp_warn}${rp_warn:+; }turn count unavailable"
  [ -n "$rp_warn" ] || rp_warn="none"

  {
    printf '\n### %s | run-complete | run exited — rollup emitted by the launcher\n\n' "$(date +%Y-%m-%d)"
    printf 'Evidence provenance: mechanical = counted directly from the Plan/log text; model-reported = written by the run, trusted like any other Part 4 state line (TD-152); derived = a function of the fields below it, never more certain than what it reads.\n\n'
    printf '```\nrun · %s of %s DoD ticked  [mechanical]\n' "$rp_done" "$rp_total"
    printf 'outcome · %s · derived from terminal %s  [derived]\n' "$rp_outcome" "$rp_term"
    printf 'terminal · %s · %s  [derived]\n' "$rp_term" "$rp_term_why"
    printf 'tasks · %s attempted / %s completed / %s total  [mechanical]\n' "$rp_attempted" "$rp_units_done" "$rp_units"
    printf 'parks · %s  [model-reported]\n' "$rp_parked"
    printf 'repair-cycles · %s  [model-reported]\n' "$rp_retries"
    printf 'verification · %s  [model-reported]\n' "$rp_verify_state"
    printf 'warnings · %s  [mechanical]\n' "$rp_warn"
    # A task with an open DoD that the run wrote no rollup line for was never spoken about
    # at all. That is `unattempted` -- stated as the fact it is (no line exists), never
    # guessed at: a task the run DID report as blocked/parked/denied already has its line
    # and is left alone.
    #
    # Scoped to what THIS run appended (everything past $rp_base), never the whole file.
    # The Execution Log is append-only, so it accumulates earlier runs' rollups -- and, as
    # this reaper's own first exercise proved, worked examples written in prose: a T1 entry
    # documenting the format contained `T5 · unattempted · ...` at line start, and a
    # whole-file grep read that documentation as this run's output and silently dropped T5
    # from the rollup. A guard that reads the wrong window fails exactly like one that is
    # absent, which is the failure family this whole protocol is about.
    awk '/^### T[0-9]+ /{t=$2} /^- \[ \]/{if(t!=""){print t; t=""}}' "$rp_sprint" | while read -r tn; do
      tail -n "+$((rp_base + 1))" "$rp_logdoc" 2>/dev/null | grep -q "^$tn · " && continue
      printf '%s · unattempted · run ended before this task was started — re-fire; the Plan is unchanged\n' "$tn"
    done
    printf '```\n\nCalibration row (Part 4), transcribed from the harness result event:\n\n'
    printf '```\nrun · %s · %s turns · %s · %s of %s units · inline\n```\n' \
      "$rp_cost" "$rp_turns" "$rp_wall" "$rp_units_done" "$rp_units"
  } >> "$rp_logdoc"
}

if [ "${1:-}" = "--reap" ]; then
  reap "${2:-}" "${3:-}" "${4:-}" "${5:-0}" "${6:-}"
  exit 0
fi

# Standalone entry for the T2 revise-loop ceiling guard, so a fixture can drive it in
# isolation -- the same reason `--reap` above exists as its own re-entry point.
#   sh night-run.sh --check-revise-loop <logdoc> [base]
if [ "${1:-}" = "--check-revise-loop" ]; then
  crc_msg=$(check_revise_ceiling "${2:-}" "${3:-0}")
  crc_rc=$?
  printf '%s\n' "$crc_msg"
  exit $crc_rc
fi

die_doa() {
  printf 'DEAD-ON-ARRIVAL: %s\n' "$1"
  exit 1
}

# Third verdict (TD-029). Silence is not death: when the process is still alive and simply has not
# written anything, we know the run is UP and we do not know whether it is WORKING. Reporting DOA
# there asserts a cause we cannot observe -- and the operator acts on the headline, so a confidently
# wrong verdict is worse than an honest "indeterminate" (L-087: prefer "not established" over a
# plausible story). Distinct exit code so it can never be mistaken for either ALIVE or DOA.
report_unknown() {
  printf 'UNKNOWN: %s\n' "$1"
  exit 2
}

# --- parse launcher options, stop at `--` -----------------------------------
while [ $# -gt 0 ]; do
  case "$1" in
    --wait-seconds) shift; wait_seconds=${1:-}; shift ;;
    --poll-seconds) shift; poll_seconds=${1:-}; shift ;;
    --log) shift; logfile=${1:-}; shift ;;
    --mode) shift; run_mode=${1:-}; shift ;;
    --sprint) shift; sprint_arg=${1:-}; shift ;;
    --no-reap) reap=0; shift ;;
    --) shift; break ;;
    *) die_doa "unrecognized launcher option: $1 (expected --wait-seconds/--poll-seconds/--log/--mode/--sprint/--no-reap, then -- <command>)" ;;
  esac
done

[ $# -gt 0 ] || die_doa "no command given -- usage: sh scripts/night-run.sh [options] -- <command> [args...]"

# --- resolve the declared sprint target, if one was given (TD-112 / SPRINT-093 T1) -----------------
# Validated BEFORE anything is launched, same discipline as --mode: a declared target that does not
# exist or is not active is a pre-flight DOA, never silently ignored in favour of the scan fallback.
if [ -n "$sprint_arg" ]; then
  [ -f "$sprint_arg" ] || die_doa "--sprint '$sprint_arg' not found"
  grep -q '^status: active' "$sprint_arg" 2>/dev/null \
    || die_doa "--sprint '$sprint_arg' does not have status: active -- refusing to target a Plan that is not the active one"
fi

case "$wait_seconds" in ''|*[!0-9]*) die_doa "--wait-seconds must be a positive integer, got: '$wait_seconds'" ;; esac
case "$poll_seconds" in ''|*[!0-9]*) die_doa "--poll-seconds must be a positive integer, got: '$poll_seconds'" ;; esac

# --- resolve the run mode, if one was declared (SPRINT-088 T3) ----------------
# `overnight` is canonical; `night-run`, `unattended` and `sprint-bulk unattended` are aliases, so an
# installed consumer's existing trigger keeps working (L-015 · L-016). An UNRECOGNISED string is a
# pre-flight DOA and is never defaulted to the canonical mode -- Part 0's rule is that the mode is
# declared, never inferred, because a wrong guess is unsafe in both directions. Failing here, before
# anything is launched, is the whole point: the alternative is a typo silently starting an unattended
# run.
# --mode stays OPTIONAL so every existing invocation keeps working unchanged; the rename adds a way
# to declare the mode, it does not add a requirement.
if [ -n "$run_mode" ]; then
  nr_mode_resolver="$(dirname -- "$0")/lib/resolve-run-mode.sh"
  [ -f "$nr_mode_resolver" ] || die_doa "--mode given but the resolver is missing at $nr_mode_resolver"
  run_mode_canonical=$(sh "$nr_mode_resolver" "$run_mode" 2>/dev/null) \
    || die_doa "unrecognized --mode '$run_mode' -- not defaulted to a mode, because a mode signal is declared and never inferred (night-run.md Part 0). Known: overnight (canonical) | night-run | unattended | 'sprint-bulk unattended'"
  printf 'run mode: %s (declared as %s)\n' "$run_mode_canonical" "$run_mode"
fi

target=$1
allargs="$*"

# --- Part 1 pre-flight: mechanically-checkable subset only -------------------
# Judgement items (G1/G2 sign-off, allowlist completeness, the stated cost estimate)
# are human pre-flight and cannot be inferred from a command line -- see night-run.md
# Part 1 for those. This is the subset a shell can actually verify.

command -v "$target" >/dev/null 2>&1 \
  || die_doa "target command not found on PATH: $target"

case " $allargs " in
  *"--dangerously-skip-permissions"*|*"--allow-dangerously-skip-permissions"*)
    die_doa "--dangerously-skip-permissions is forbidden for an unattended run (night-run.md Part 0 contract)" ;;
esac

# The mode signal may be carried by ANY of the accepted trigger names, not just `unattended`.
# `overnight` became canonical at SPRINT-088 T3 and this check is exactly where the rename could have
# stopped being additive: a consumer who updated their trigger to the new canonical name would have
# been rejected by the launcher for not saying the OLD word. Found by tracing the consumer path
# (L-016), not by dogfooding -- this repo's own triggers all still said `unattended`, so nothing here
# would have failed. `--mode` (resolved above) satisfies it too, since declaring the mode explicitly
# is a stronger signal than mentioning it in the prompt.
case "$allargs$run_mode" in
  *unattended*|*overnight*|*night-run*) ;;
  *) die_doa "mode signal missing -- the command carries none of 'overnight' (canonical), 'unattended' or 'night-run', and no --mode was declared (night-run.md Part 0)" ;;
esac

perm_mode=""
allowed_tools=""
settings_arg=""
prev=""
for a in "$@"; do
  case "$prev" in
    --permission-mode) perm_mode=$a ;;
    --allowedTools|--allowed-tools) allowed_tools=$a ;;
    --settings) settings_arg=$a ;;
  esac
  prev=$a
done

[ -n "$perm_mode" ] \
  || die_doa "--permission-mode not set -- an unattended run must declare a permission mode"
[ "$perm_mode" = "dontAsk" ] \
  || die_doa "--permission-mode is '$perm_mode', not 'dontAsk' -- the only mode the unattended contract allows"

# A scoped allowlist must come from SOMEWHERE, but it need not be an inline string: the
# preferred home is the project's settings permissions (night-run.md Part 1), so accept any
# of the three sources and only refuse when none is present. Requiring --allowedTools here
# would reject the very invocation the pre-flight now recommends.
perm_source=""
[ -n "$allowed_tools" ] && perm_source="--allowedTools"
if [ -z "$perm_source" ] && [ -n "$settings_arg" ]; then
  perm_source="--settings $settings_arg"
fi
if [ -z "$perm_source" ]; then
  for s in ".claude/settings.local.json" ".claude/settings.json"; do
    [ -f "$s" ] || continue
    grep -q '"allow"' "$s" 2>/dev/null || continue
    perm_source="$s"
    break
  done
fi
[ -n "$perm_source" ] \
  || die_doa "no scoped allowlist found -- pass --allowedTools or --settings, or add a permissions.allow block to .claude/settings.json (night-run.md Part 1). Running unattended on default permissions is not allowed"

repo_root=$(git rev-parse --show-toplevel 2>/dev/null || true)

# Resolve the target sprint HERE, before the gate runs -- not only later at the reap() call site.
# TD-110/SPRINT-093 T3's named-exception grant (below) has to be read from a file that was written
# BEFORE this process started, so the resolution has to happen before the gate that consults it, not
# after. `$resolved_sprint` is reused unchanged at the reap() call site further down; the second,
# later resolution that used to duplicate this logic is removed there -- one resolution, agreed
# everywhere, is the same discipline TD-112 already put on the reaper's own target.
resolved_sprint=""
if [ -n "$sprint_arg" ]; then
  resolved_sprint=$sprint_arg
else
  resolved_sprint=$(find_sprint "$repo_root" || printf '')
fi

if [ -n "$repo_root" ] && [ -f "$repo_root/scripts/qa-check.sh" ]; then
  # Run the gate with MSYS_NO_PATHCONV cleared. On Git-Bash/MSYS hosts that variable is
  # commonly exported to stop a leading-slash argument (a `/skill` prompt) being rewritten
  # into a Windows path -- but it is INHERITED, and it disables path translation for every
  # child too. Any check that hands a POSIX path to a native git then fails, so a gate that
  # is green in a normal shell blocks here for a reason that has nothing to do with the repo.
  # Measured on this host: the dispatch-preflight harness fails with "could not resolve live
  # HEAD" under it and passes without it. Cleared in a subshell (POSIX) rather than with
  # `env -u`, and only around the gate -- the fired command keeps the caller's environment.
  # THIS CALLER IS DETACHED, SO IT RAISES THE BUDGET (SPRINT-105 T3, ADR-042).
  #
  # ADR-042 ruled the 600s command ceiling is a property of the INVOCATION MODE, not of the run:
  # "a caller that knows it is detached may raise it". night-run.sh IS that caller -- it is the
  # unattended launcher, nothing is waiting on a foreground timeout -- and it was nonetheless
  # invoking the gate with the foreground default of 520s. Measured 2026-09-21 the gate needs
  # ~679s, so every pre-flight here truncated, skipping ~16 harnesses before deciding whether to
  # FIRE AN UNATTENDED RUN. A truncated gate is silent about those checks, and this is the worst
  # place in the repo to act on a verdict that is quietly incomplete.
  #
  # SPRINT-101's log records the owner ruling exactly this fix by hand -- "raise
  # QA_BUDGET_SECONDS and re-run, so the 13 skipped harnesses actually execute" -- and a run at
  # 1200s completing in 945s. That ruling lived in a sprint log and no procedure read it, which is
  # L-020's shipping-is-not-wiring and L-151's decision-filed-where-its-reader-cannot-reach-it.
  # This line is that ruling, wired.
  #
  # Overridable, and only a FLOOR: a caller that already set a higher budget keeps it.
  nr_budget=${QA_BUDGET_SECONDS:-0}
  [ "$nr_budget" -lt 1200 ] 2>/dev/null && nr_budget=1200
  qa_out=$( unset MSYS_NO_PATHCONV; QA_BUDGET_SECONDS="$nr_budget" sh "$repo_root/scripts/qa-check.sh" 2>&1 ); qa_code=$?

  # Read the gate's OWN PRINTED VERDICT, never a bare $? (L-045/L-120) -- doubly so here, because
  # this code is using the answer to decide whether to FIRE an unattended run, which is the exact
  # shape L-120 records going wrong five times. $qa_code says the wrapper survived; it is not the
  # verdict. qa-check.sh prints `QA-CHECK: N pass, M fail` on EVERY exit path, including its own
  # early-budget-exceeded exit (leg 12's qb_checkpoint), so the line is always present unless the
  # gate died before printing anything at all (the `cd "$ROOT" || exit 2` path) -- handled below.
  qa_summary=$(printf '%s\n' "$qa_out" | grep -E '^QA-CHECK: [0-9]+ pass, [0-9]+ fail$' | tail -n1)
  if [ -z "$qa_summary" ]; then
    # L-058: "no failing checks found" must never be reachable by failing to look. A gate report
    # whose verdict line cannot be found is a REFUSAL, never a pass -- the alternative (falling
    # through to "no FAIL lines were seen, so continue") would silently treat an unreadable report
    # the same as a clean one, which is exactly the false-negative shape this whole file exists to
    # close.
    qa_tail=$(printf '%s\n' "$qa_out" | tail -n3 | tr '\n' ' ')
    die_doa "pre-flight gate scripts/qa-check.sh produced no readable 'QA-CHECK: N pass, M fail' summary line (wrapper exit $qa_code) -- refusing rather than guessing at a pass. Last output: $qa_tail"
  fi
  qa_failn=$(printf '%s' "$qa_summary" | sed -E 's/^QA-CHECK: [0-9]+ pass, ([0-9]+) fail$/\1/')

  if [ "$qa_failn" -eq 0 ] && [ "$qa_code" != "0" ] && [ -n "$qa_code" ]; then
    # Defensive, not reachable under qa-check.sh's own current exit logic (exit ties 1:1 to fail>0)
    # -- but a printed "0 fail" that disagrees with a non-zero wrapper exit is a contradiction, and
    # the contradiction is refused rather than read as a pass, same posture as the reaper's own
    # non-`done`-under-`PLAN_EXHAUSTED` guard (T1, this sprint).
    die_doa "pre-flight gate scripts/qa-check.sh printed a clean 'QA-CHECK: 0 fail' summary but the wrapper exited $qa_code -- a summary and an exit code that disagree is refused, never read as a pass"
  fi

  if [ "$qa_failn" -gt 0 ]; then
    # --- OWNER RULING (TD-110 / SPRINT-093 T3): a narrow, named exception -- never a blanket one ---
    # A run may fire against SPECIFIC, NAMED, PRE-APPROVED failing checks. There is no
    # --force/--skip-gate flag anywhere in this file and none is added here: the only door is
    # `gate_exceptions:` in the TARGET SPRINT'S OWN frontmatter -- read from disk, at the pin it
    # names, resolved above BEFORE this gate ran. A run cannot grant itself an exception at fire
    # time, because the only place one can be written is a file this process only reads.
    #
    # WHOLE-LINE matching, not a canonicalised prefix (SPRINT-093 T3 retry, Finding 2). The first
    # cut split each FAIL line at its first ': ' or ' (' and matched THAT prefix -- an independent
    # reviewer found qa-check.sh leg 13 prints three semantically distinct FAILs per file
    # (file-not-found / ask-channel-probe-missing / park-record-instruction-missing) that all share
    # the identical prefix `headless park-record cue <path>`, so one grant naming that prefix
    # silently pre-approved whichever of the three actually failed, unreviewed. A prefix cannot be
    # narrow by construction when the SAME prefix can front more than one distinct check -- only the
    # gate's own complete, verbatim line is guaranteed to identify exactly what it identifies (if
    # qa-check.sh cannot tell two failures apart in its own printed text, nothing reading that text
    # safely can either). So a configured exception must equal a FAIL line's FULL text, byte for
    # byte, via a fixed-string whole-line match (`grep -Fx`) -- narrower than before, and the
    # tradeoff is stated plainly: an exception can go stale if the SAME check's own message text
    # shifts for any reason, which fails safe (a refusal), never unsafe.
    qa_fail_lines=$(printf '%s\n' "$qa_out" | grep -E '^FAIL  ')
    if [ -z "$qa_fail_lines" ]; then
      # L-058 again, one level down: the summary says N>0 FAILing checks, but no 'FAIL  ...' line
      # can be found to name them. Nothing to compare against gate_exceptions: is not evidence that
      # nothing is wrong -- refuse, do not treat an unparseable per-check report as a clean pass.
      die_doa "pre-flight gate scripts/qa-check.sh reported $qa_failn FAILing check(s) in its summary but printed no 'FAIL  ...' line naming them -- refusing rather than firing with nothing to check against gate_exceptions:"
    fi

    # `gate_exceptions:` is a BLOCK LIST, one full FAIL line per `  - ` item, not a single
    # delimiter-joined line. A single-line join was the OTHER half of Finding 2: qa-check.sh's own
    # FAIL text routinely embeds ' · ' (e.g. the night-run-rollup checker's "carries no 'terminal ·
    # <STATE> · <reason>' line") and even '|' (leg 13's own siblings, elsewhere), so no punctuation
    # delimiter can safely join more than one WHOLE FAIL line on one frontmatter scalar without risking
    # collision with an item's own text. A newline can never appear inside one -- every bad()/FAIL
    # message this codebase prints is built and flattened to a single line before printf (`tr '\n'
    # ' '`/`tr '\n' ';'` at every site that could embed one) -- so newline-per-item is the one
    # separator with no collision risk, not a stylistic choice.
    #
    #   gate_exceptions:
    #     - <verbatim FAIL line text 1>
    #     - <verbatim FAIL line text 2>
    #   gate_exceptions_pin: <sha>
    #
    # `tr -d '\r'` first: this sprint file is read off a real CRLF Windows checkout (L-169's own
    # environment), and a `- ` item's own trailing content must never carry a stray \r into the
    # exact match below.
    qa_exc_items=""
    qa_exc_pin=""
    if [ -n "$resolved_sprint" ] && [ -f "$resolved_sprint" ]; then
      qa_exc_raw=$(tr -d '\r' < "$resolved_sprint" | awk '
        NR==1 && $0!="---" { exit }
        NR==1 { next }
        $0=="---" { exit }
        /^gate_exceptions:[ \t]*$/ { collecting=1; next }
        collecting && /^[ \t]+-[ \t]/ {
          line=$0
          sub(/^[ \t]+-[ \t]/, "", line)
          print line
          next
        }
        { collecting=0 }
      ')
      # An unfilled template placeholder item counts as absent -- same rule
      # check-approval-envelope.sh already applies to `approval_envelope:`, so the shipped
      # template blesses nothing. A blank line (no items at all) is dropped the same way.
      qa_exc_items=$(printf '%s\n' "$qa_exc_raw" | grep -v '^\[' | grep -v '^$')

      qa_exc_pin=$(tr -d '\r' < "$resolved_sprint" | awk 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} /^gate_exceptions_pin:[ \t]*/{sub(/^gate_exceptions_pin:[ \t]*/,"");print;exit}')
      case "$qa_exc_pin" in "["*) qa_exc_pin="" ;; esac
      case "$qa_exc_pin" in
        ''|*[!0-9a-f]*) qa_exc_items="" ;;              # not a hex pin -- names a moving target, granted nothing
        ?|??|???|????|?????|??????) qa_exc_items="" ;;  # shorter than git's own 7-char abbreviation floor
      esac
    fi

    # Every FAIL line's FULL text must equal a configured item EXACTLY (fixed-string, whole-line --
    # `grep -qFx`, never a substring: L-108's own trap) or it is reported UNNAMED. Captured through
    # a command substitution around the whole loop, not a variable set inside it, so the result
    # survives the `| while read` subshell (POSIX sh has no process substitution); the inner match
    # uses the pipeline's own exit status rather than a second nested `| while read` (which would
    # hit the exact same subshell-scoping trap one level deeper).
    qa_unnamed=$(
      printf '%s\n' "$qa_fail_lines" | sed -E 's/^FAIL  //' | while IFS= read -r nrg_detail; do
        [ -n "$nrg_detail" ] || continue
        nrg_hit=0
        if [ -n "$qa_exc_items" ]; then
          printf '%s\n' "$qa_exc_items" | grep -qFx "$nrg_detail" && nrg_hit=1
        fi
        [ "$nrg_hit" -eq 1 ] || printf '%s\n' "$nrg_detail"
      done
    )

    if [ -n "$qa_unnamed" ]; then
      qa_unnamed_flat=$(printf '%s\n' "$qa_unnamed" | grep -v '^$' | tr '\n' ';' | sed 's/;$//')
      qa_where="no sprint resolved to read a gate_exceptions: grant from -- pass --sprint, or ensure exactly one sprint carries status: active"
      [ -n "$resolved_sprint" ] && qa_where="gate_exceptions: in $resolved_sprint${qa_exc_pin:+ (pinned @ $qa_exc_pin)}"
      die_doa "pre-flight gate scripts/qa-check.sh failed ($qa_failn check(s) FAILing) and at least one is NOT on the pre-approved exception list: $qa_unnamed_flat -- refusing rather than firing against an unnamed red check. Consulted: $qa_where. There is no --force/--skip-gate; the only grant is a named, pinned gate_exceptions: block recorded before this run started (night-run.md Part 1a step 4c)"
    fi

    printf 'pre-flight: qa-check.sh reported %s FAILing check(s), all pre-approved by gate_exceptions: in %s (@ %s) -- firing\n' "$qa_failn" "$resolved_sprint" "$qa_exc_pin"
  fi
fi

# --- fire, detached ------------------------------------------------------------
ts=$(date +%Y%m%d-%H%M%S)
[ -n "$logfile" ] || logfile="night-run-$ts.log"
: > "$logfile" 2>/dev/null || die_doa "cannot create log file: $logfile"
ecfile="$logfile.exit"
pidfile="$logfile.pid"
rm -f "$ecfile" "$pidfile" 2>/dev/null || true

pre_commit=""
[ -n "$repo_root" ] && pre_commit=$(git -C "$repo_root" rev-parse HEAD 2>/dev/null || true)

# Detach without relying on setsid/disown (neither is guaranteed present -- this host
# has neither): nohup makes the fired command ignore SIGHUP outright, its stdin/stdout/
# stderr are fully redirected off the controlling terminal so it never blocks or dies
# writing to a tty that is gone, the exit code is captured explicitly to a sibling file
# (so a fast, successful finish is distinguishable from a crash), and the whole thing is
# started from a subshell that backgrounds it and returns immediately -- by the time this
# script reads the pid back, the fired process is no longer tied to this shell's job
# table. This combination (nohup + full fd redirection + immediate-return subshell) is
# POSIX-portable; it does not depend on any single non-standard utility.
# The reaper fires for every run that reaches this point, because reaching this point already
# PROVES a recognised mode signal was present -- the mode-signal gate above
# (`die_doa "mode signal missing"`) already required $allargs$run_mode to contain one of the
# accepted aliases, or the process would already have exited. `--no-reap` is the ONLY opt-out.
#
# PRE-EXISTING DEFECT, surfaced through this file by an independent reviewer (SPRINT-093 T3
# retry): this line used to re-test `case "$allargs" in *sprint-bulk*) ;; *) reap=0 ;; esac` --
# a LITERAL SUBSTRING left over from before SPRINT-088 T3 renamed the canonical mode to
# `overnight` and made `sprint-bulk unattended` one alias among four (night-run.md Part 0).
# Firing the now-documented canonical form (`--mode overnight`, or a trigger prompt that never
# says the word "sprint-bulk") satisfied the mode-signal gate above and then silently reap=0'd
# anyway -- no `terminal ·` line was ever written. `check-authority.sh` (SPRINT-093 T5) trusts
# that line as its ONLY unattended-mode signal; reproduced live, a genuinely unattended, unparked
# J2 task then read as an attended completion -- exactly the silent false negative a J2-authority
# guard exists to prevent.
#
# Fixed by DELETING the re-test rather than adding `overnight` to it: a second, hand-copied alias
# list is itself the defect (the next rename breaks it the same way again). The mode-signal gate
# above is the ONE place that vocabulary is allowed to live -- this line now trusts its verdict
# instead of re-deriving a narrower, staler one.
started=$(date +%s 2>/dev/null || printf '')

# $resolved_sprint was already resolved once, ABOVE the gate check (SPRINT-093 T3), so both the
# gate-exception lookup and the logdoc_base measurement + reap() call below agree on the same
# target -- the whole point of TD-112's fix (SPRINT-089's reaper disagreed with itself about
# nothing; it simply never had a target signal at all and re-scanned into ambiguity). Nothing to
# recompute here; the reaper below only consults it, guarded by `reap`, same as always.

# How long the Execution Log already is. The reaper compares only what the run APPENDS
# past this mark against its own rollup lines -- see the note in reap().
logdoc_base=0
if [ -n "$resolved_sprint" ]; then
  base_doc="$repo_root/docs/sprint/logs/$(basename "$resolved_sprint")"
  [ -f "$base_doc" ] && logdoc_base=$(awk 'END{print NR}' "$base_doc" 2>/dev/null)
fi

(
  NR_LOG="$logfile" NR_EC="$ecfile" NR_SELF="$0" NR_ROOT="$repo_root" \
  NR_REAP="$reap" NR_START="$started" NR_BASE="$logdoc_base" NR_SPRINT="$resolved_sprint" nohup sh -c '
    "$@" >"$NR_LOG" 2>&1 </dev/null
    printf "%s" "$?" >"$NR_EC"
    # Emitted here, after the exit code is recorded, so it runs on EVERY exit -- clean
    # finish, early end-of-turn, or non-zero. This is the whole point: the failure being
    # guarded against is a run that ends mid-Plan and reports success (night-run.md Part 4).
    if [ "$NR_REAP" = "1" ]; then
      sh "$NR_SELF" --reap "$NR_LOG" "$NR_ROOT" "$NR_START" "$NR_BASE" "$NR_SPRINT" >/dev/null 2>&1 || true
    fi
  ' sh "$@" &
  echo $! >"$pidfile"
) &
wait "$!" 2>/dev/null || true

child_pid=$(cat "$pidfile" 2>/dev/null || true)
[ -n "$child_pid" ] || die_doa "failed to capture a pid for the fired command -- it may not have started"

printf 'fired detached: pid=%s log=%s\n' "$child_pid" "$logfile"

# --- observation window: ALIVE needs progress, not merely a live pid ---------
elapsed=0
progress=""
while [ "$elapsed" -lt "$wait_seconds" ]; do
  if [ -f "$ecfile" ]; then
    ec=$(cat "$ecfile" 2>/dev/null || echo "")
    if [ "$ec" = "0" ]; then
      printf 'ALIVE\n'
      exit 0
    else
      tail_line=$(tail -n 1 "$logfile" 2>/dev/null)
      die_doa "process (pid $child_pid) exited with status ${ec:-unknown} -- last log line: ${tail_line:-<empty log>}"
    fi
  fi

  if ! kill -0 "$child_pid" 2>/dev/null; then
    # Gone, and no exit file -- an external kill, not a normal exit we could capture.
    tail_line=$(tail -n 1 "$logfile" 2>/dev/null)
    die_doa "process (pid $child_pid) disappeared without recording an exit code -- last log line: ${tail_line:-<empty log>}"
  fi

  if [ -z "$progress" ]; then
    if [ -s "$logfile" ]; then
      progress="log output"
    elif [ -n "$repo_root" ]; then
      post_commit=$(git -C "$repo_root" rev-parse HEAD 2>/dev/null || true)
      if [ -n "$post_commit" ] && [ -n "$pre_commit" ] && [ "$post_commit" != "$pre_commit" ]; then
        progress="a new commit"
      fi
    fi
  fi

  sleep "$poll_seconds"
  elapsed=$((elapsed + poll_seconds))
done

# Window elapsed. Re-check once more -- the process may have just finished.
if [ -f "$ecfile" ]; then
  ec=$(cat "$ecfile" 2>/dev/null || echo "")
  if [ "$ec" = "0" ]; then
    printf 'ALIVE\n'
    exit 0
  else
    tail_line=$(tail -n 1 "$logfile" 2>/dev/null)
    die_doa "process (pid $child_pid) exited with status ${ec:-unknown} -- last log line: ${tail_line:-<empty log>}"
  fi
fi

if ! kill -0 "$child_pid" 2>/dev/null; then
  tail_line=$(tail -n 1 "$logfile" 2>/dev/null)
  die_doa "process (pid $child_pid) disappeared without recording an exit code -- last log line: ${tail_line:-<empty log>}"
fi

if [ -z "$progress" ]; then
  # The process is still alive (the loop above exits on death or non-zero status), so the only
  # honest statement is that liveness is UNPROVEN -- not that the run is dead. An empty log is
  # especially weak evidence when the fired command uses an output format that buffers until exit:
  # there, no output CAN appear during the window, so its absence means nothing at all.
  case " $* " in
    *" --output-format json "*|*"--output-format=json"*)
      report_unknown "process (pid $child_pid) is up; no log output and no new commit in ${wait_seconds}s -- but the command uses --output-format json, which buffers until exit, so an empty log during the window is EXPECTED and proves nothing either way. Liveness unproven, not refuted. Use --output-format stream-json to make progress observable, or widen --wait-seconds past the first commit" ;;
    *)
      report_unknown "process (pid $child_pid) is up; no log output and no new commit in ${wait_seconds}s. That is indeterminate, not dead -- a silent-but-working process looks identical to a stalled one from outside. Check the log again later, or widen --wait-seconds; if the command buffers its output, prefer a streaming format" ;;
  esac
fi

printf 'ALIVE\n'
exit 0
