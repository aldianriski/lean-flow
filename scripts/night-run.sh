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
#
# Exit 0 on ALIVE, exit 1 on DEAD-ON-ARRIVAL (including a pre-flight block, which fires
# before anything is launched).

set -u

wait_seconds=150
poll_seconds=5
logfile=""

die_doa() {
  printf 'DEAD-ON-ARRIVAL: %s\n' "$1"
  exit 1
}

# --- parse launcher options, stop at `--` -----------------------------------
while [ $# -gt 0 ]; do
  case "$1" in
    --wait-seconds) shift; wait_seconds=${1:-}; shift ;;
    --poll-seconds) shift; poll_seconds=${1:-}; shift ;;
    --log) shift; logfile=${1:-}; shift ;;
    --) shift; break ;;
    *) die_doa "unrecognized launcher option: $1 (expected --wait-seconds/--poll-seconds/--log, then -- <command>)" ;;
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
(
  NR_LOG="$logfile" NR_EC="$ecfile" nohup sh -c '
    "$@" >"$NR_LOG" 2>&1 </dev/null
    printf "%s" "$?" >"$NR_EC"
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
  die_doa "process (pid $child_pid) is up but showed no observable progress in ${wait_seconds}s -- no log output and no new commit; a live pid alone is not enough (the prompt may have been rejected)"
fi

printf 'ALIVE\n'
exit 0
