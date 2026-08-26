#!/usr/bin/env sh
# resolve-run-mode.sh -- resolve an unattended-run mode string to its canonical name
# (SPRINT-088 T3, TASK-294, EPIC-015 § Closed-when 2).
#
# `overnight` is the canonical name, chosen because it names the CONTRACT the mode runs (Part 0b's
# continuation contract) rather than the script that launches it. The names it replaces keep working
# as aliases -- the rename is additive, and an installed consumer whose muscle memory or scripts say
# `night-run` must not break (L-015 · L-016).
#
# --- why an unknown mode is a hard failure, not a default ---------------------------------------
# The tempting behaviour is to fall through to the canonical mode when the string is unrecognised.
# That is precisely the failure Part 0 forbids one level up: a mode signal is DECLARED, never
# inferred, because a wrong guess is unsafe in BOTH directions -- a false AFK self-approves and a
# false HITL stalls. A typo'd `--mode overnite` silently launching an unattended run is the same
# class of error as reading a missing answer as consent. So: resolve, or fail loudly and name the
# string that did not resolve.
#
# Usage: sh resolve-run-mode.sh <mode-string>
# Prints the canonical mode to stdout and exits 0 on success.
# On an unrecognised string, prints a named finding to stderr and exits 1. Prints nothing to stdout
# in that case -- a caller doing `m=$(resolve-run-mode.sh "$x")` must get an empty string, never a
# usable-looking default.
# Dependency-free POSIX sh.
set -u

CANONICAL="overnight"

# Aliases are matched after normalising whitespace and case, so `Sprint-Bulk  Unattended` resolves.
# Normalisation is deliberately narrow: it collapses runs of whitespace and lowercases, and does
# nothing else. It does not strip punctuation or "helpfully" fuzzy-match, because every character it
# discards is a character a typo could hide in.
in=${1:-}
if [ -z "$in" ]; then
  printf 'FAIL  run-mode-unresolved: no mode string given. The mode is declared at the trigger, never inferred (night-run.md Part 0) -- expected one of: %s | night-run | unattended | "sprint-bulk unattended"\n' "$CANONICAL" >&2
  exit 1
fi

norm=$(printf '%s' "$in" | tr 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' 'abcdefghijklmnopqrstuvwxyz' | tr -s ' \t' ' ')
# Strip one leading and one trailing space left by the squeeze above.
norm=${norm# }
norm=${norm% }

case "$norm" in
  overnight)                 printf '%s\n' "$CANONICAL" ;;
  night-run)                 printf '%s\n' "$CANONICAL" ;;
  unattended)                printf '%s\n' "$CANONICAL" ;;
  "sprint-bulk unattended")  printf '%s\n' "$CANONICAL" ;;
  *)
    printf 'FAIL  run-mode-unresolved: '\''%s'\'' is not a known run mode. It is NOT defaulted to %s: a mode signal is declared, never inferred, and a wrong guess is unsafe in both directions -- a false AFK self-approves, a false HITL stalls (night-run.md Part 0). Known: %s (canonical) | night-run | unattended | "sprint-bulk unattended"\n' "$in" "$CANONICAL" "$CANONICAL" >&2
    exit 1
    ;;
esac
exit 0
