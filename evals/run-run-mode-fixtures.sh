#!/bin/sh
# run-run-mode-fixtures.sh -- retained fixtures for scripts/lib/resolve-run-mode.sh and the
# launcher's mode-signal gate (SPRINT-088 T3, TASK-294, EPIC-015 § Closed-when 2). Tier G per D4.
#
# `overnight` is canonical; `night-run`, `unattended` and `sprint-bulk unattended` are aliases kept
# working so an installed consumer's trigger does not break (L-015 · L-016).
#
# --- the load-bearing assertion is the EMPTY STDOUT on failure ------------------------------------
# A resolver that printed the canonical mode AND exited non-zero would pass a naive exit-code test
# while handing `m=$(resolve-run-mode.sh "$typo")` a usable-looking default. That is the guarded
# failure -- a typo'd mode silently launching an unattended run -- and it is invisible to any
# assertion that only reads the status. So every failure case below checks stdout is empty, not just
# that the exit code is 1.
#
# --- and the launcher-level case is what makes the rename REAL ------------------------------------
# The resolver alone proves nothing about consumers: night-run.sh has its own mode-signal pre-flight
# that demanded the literal word `unattended`, and until T3 widened it, a consumer who adopted the new
# canonical name would have been rejected BY THE LAUNCHER for not saying the old word. The rename
# would have been additive in the docs and breaking in the tool. Cases 6-8 pin that path.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-run-mode-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
resolver="$repo_root/scripts/lib/resolve-run-mode.sh"
launcher="$repo_root/scripts/night-run.sh"

[ -f "$resolver" ] || { echo "FAIL harness: resolver not found at $resolver"; exit 2; }
[ -f "$launcher" ] || { echo "FAIL harness: launcher not found at $launcher"; exit 2; }

fail=0

# resolves <label> <input> -- must print exactly `overnight` and exit 0
resolves() {
  label=$1; input=$2
  out=$(sh "$resolver" "$input" 2>/dev/null); rc=$?
  if [ "$rc" -eq 0 ] && [ "$out" = "overnight" ]; then
    echo "PASS fixture($label): '$input' -> overnight"
  else
    echo "FAIL fixture($label): '$input' -> exit $rc, stdout '$out' (wanted exit 0 and 'overnight')"
    fail=1
  fi
}

# refuses <label> <input> -- must exit 1, name the finding, and print NOTHING to stdout
refuses() {
  label=$1; input=$2
  out=$(sh "$resolver" "$input" 2>/dev/null); rc=$?
  err=$(sh "$resolver" "$input" 2>&1 >/dev/null)
  if [ "$rc" -ne 0 ] && [ -z "$out" ] && printf '%s' "$err" | grep -q 'run-mode-unresolved'; then
    echo "PASS fixture($label): '$input' refused, stdout empty, finding named"
  else
    echo "FAIL fixture($label): '$input' -> exit $rc, stdout '$out' -- an unresolved mode must exit non-zero AND print nothing usable to stdout, or a caller gets a silent default"
    fail=1
  fi
}

# --- cases 1-4: one per accepted alias, each reaching the same canonical mode --------------------
resolves "canonical-overnight"        "overnight"
resolves "alias-night-run"            "night-run"
resolves "alias-unattended"           "unattended"
resolves "alias-sprint-bulk-unattended" "sprint-bulk unattended"

# --- case 5: normalisation is narrow but real ----------------------------------------------------
resolves "alias-normalised"           "Sprint-Bulk  Unattended"

# --- case 6 (must-FAIL): a near-miss typo is refused, never defaulted ----------------------------
# The whole reason this is Tier G: `overnite` defaulting to `overnight` would start an unattended run
# nobody declared.
refuses "typo-is-refused"             "overnite"
refuses "empty-is-refused"            ""
refuses "unrelated-is-refused"        "quick"

# --- case 7: the LAUNCHER accepts every trigger shape, old and new -------------------------------
# Reachability, not just correctness: the resolver could be perfect and the rename still break at the
# launcher's own gate. Each invocation is expected to get PAST the mode gate and stop at the next
# pre-flight item (--permission-mode), which is what proves the mode signal was accepted.
for shape in "overnight" "night-run" "unattended" "sprint-bulk unattended"; do
  out=$(sh "$launcher" --mode "$shape" --no-reap -- true 2>&1)
  if printf '%s\n' "$out" | grep -q 'run mode: overnight' &&
     ! printf '%s\n' "$out" | grep -q 'mode signal missing'; then
    echo "PASS fixture(launcher-accepts-$(printf '%s' "$shape" | tr ' ' '-')): resolved and passed the mode gate"
  else
    echo "FAIL fixture(launcher-accepts-$(printf '%s' "$shape" | tr ' ' '-')): the launcher did not accept this trigger -- output: $out"
    fail=1
  fi
done

# --- case 8: ...and the launcher still REFUSES a command with no mode signal at all --------------
# The control that stops case 7 from being satisfied by a gate that was simply switched off. This is
# the case that would have gone green if T3 had "fixed" the rename by deleting the check.
out=$(sh "$launcher" --no-reap -- sh -c 'echo hello' 2>&1)
if printf '%s\n' "$out" | grep -q 'mode signal missing'; then
  echo "PASS fixture(launcher-still-refuses-no-signal): a command carrying no mode signal is still refused"
else
  echo "FAIL fixture(launcher-still-refuses-no-signal): widening the mode gate disabled it -- output: $out"
  fail=1
fi

# --- case 9 (must-FAIL): the launcher refuses an unrecognised --mode ------------------------------
out=$(sh "$launcher" --mode overnite --no-reap -- true 2>&1)
if printf '%s\n' "$out" | grep -q "unrecognized --mode 'overnite'"; then
  echo "PASS fixture(launcher-refuses-unknown-mode): refused pre-flight, before anything was launched"
else
  echo "FAIL fixture(launcher-refuses-unknown-mode): an unknown --mode was not refused -- output: $out"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "RUN-MODE FIXTURES: all green"; else echo "RUN-MODE FIXTURES: FAILURES above"; fi
exit $fail
