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
#   --log FILE         Where the fired command's stdout+stderr is captured
#                       (default: ./night-run-<timestamp>.log in the current directory)
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
find_sprint() {
  fs_root=$1
  [ -n "$fs_root" ] || return 1
  for f in "$fs_root"/docs/sprint/SPRINT-*.md; do
    [ -f "$f" ] || continue
    grep -q '^status: active' "$f" 2>/dev/null || continue
    printf '%s' "$f"; return 0
  done
  return 1
}

reap() {
  rp_log=$1; rp_root=$2; rp_started=$3; rp_base=${4:-0}
  rp_sprint=$(find_sprint "$rp_root") || return 0

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
      *) rp_wall="$(( (rp_now - rp_started) / 60 )) min" ;;
    esac
  fi

  {
    printf '\n### %s | complete | run exited — rollup emitted by the launcher\n\n' "$(date +%Y-%m-%d)"
    printf '```\nrun · %s of %s DoD ticked\n' "$rp_done" "$rp_total"
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
  reap "${2:-}" "${3:-}" "${4:-}" "${5:-0}"
  exit 0
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
    --no-reap) reap=0; shift ;;
    --) shift; break ;;
    *) die_doa "unrecognized launcher option: $1 (expected --wait-seconds/--poll-seconds/--log/--no-reap, then -- <command>)" ;;
  esac
done

[ $# -gt 0 ] || die_doa "no command given -- usage: sh scripts/night-run.sh [options] -- <command> [args...]"

case "$wait_seconds" in ''|*[!0-9]*) die_doa "--wait-seconds must be a positive integer, got: '$wait_seconds'" ;; esac
case "$poll_seconds" in ''|*[!0-9]*) die_doa "--poll-seconds must be a positive integer, got: '$poll_seconds'" ;; esac

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

case "$allargs" in
  *unattended*) ;;
  *) die_doa "mode signal missing -- the command does not carry the word 'unattended' anywhere (night-run.md Part 0)" ;;
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
if [ -n "$repo_root" ] && [ -f "$repo_root/scripts/qa-check.sh" ]; then
  # Run the gate with MSYS_NO_PATHCONV cleared. On Git-Bash/MSYS hosts that variable is
  # commonly exported to stop a leading-slash argument (a `/skill` prompt) being rewritten
  # into a Windows path -- but it is INHERITED, and it disables path translation for every
  # child too. Any check that hands a POSIX path to a native git then fails, so a gate that
  # is green in a normal shell blocks here for a reason that has nothing to do with the repo.
  # Measured on this host: the dispatch-preflight harness fails with "could not resolve live
  # HEAD" under it and passes without it. Cleared in a subshell (POSIX) rather than with
  # `env -u`, and only around the gate -- the fired command keeps the caller's environment.
  if ! qa_out=$( unset MSYS_NO_PATHCONV; sh "$repo_root/scripts/qa-check.sh" 2>&1 ); then
    qa_line=$(printf '%s\n' "$qa_out" | tail -n1)
    die_doa "pre-flight gate scripts/qa-check.sh failed: $qa_line"
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
# The reaper fires only for a sprint-bulk run -- that is the only shape with a Plan whose
# DoD boxes mean anything -- and `--no-reap` opts out entirely.
case "$allargs" in *sprint-bulk*) ;; *) reap=0 ;; esac
started=$(date +%s 2>/dev/null || printf '')

# How long the Execution Log already is. The reaper compares only what the run APPENDS
# past this mark against its own rollup lines -- see the note in reap().
logdoc_base=0
if [ "$reap" = "1" ]; then
  base_sprint=$(find_sprint "$repo_root" || printf '')
  if [ -n "$base_sprint" ]; then
    base_doc="$repo_root/docs/sprint/logs/$(basename "$base_sprint")"
    [ -f "$base_doc" ] && logdoc_base=$(awk 'END{print NR}' "$base_doc" 2>/dev/null)
  fi
fi

(
  NR_LOG="$logfile" NR_EC="$ecfile" NR_SELF="$0" NR_ROOT="$repo_root" \
  NR_REAP="$reap" NR_START="$started" NR_BASE="$logdoc_base" nohup sh -c '
    "$@" >"$NR_LOG" 2>&1 </dev/null
    printf "%s" "$?" >"$NR_EC"
    # Emitted here, after the exit code is recorded, so it runs on EVERY exit -- clean
    # finish, early end-of-turn, or non-zero. This is the whole point: the failure being
    # guarded against is a run that ends mid-Plan and reports success (night-run.md Part 4).
    if [ "$NR_REAP" = "1" ]; then
      sh "$NR_SELF" --reap "$NR_LOG" "$NR_ROOT" "$NR_START" "$NR_BASE" >/dev/null 2>&1 || true
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
