#!/usr/bin/env sh
# check-system-verify-block.sh -- a sprint Execution Log recording a system-verify FAIL must not also
# record a silent close (SPRINT-067 T1 / TASK-208).
#
# Why this exists. dispatch.md's "System verify" pass runs the host's own discovered gate against the
# fully-merged tree, once, after the final wave -- and ADR-021 says its FAIL blocks the SILENT close:
# surface -> a recorded owner ruling (attended), or the close itself parks (unattended, night-run.md
# Part 0). Nothing mechanically stopped a `| close |` event from landing in the log anyway once the
# FAIL line was already written and scrolled past -- exactly the L-120 (a) shape ADR-021 was written
# to close (a red verdict existing and not reaching the decision to proceed). This check is that stop.
#
# The recorded-ruling shape this checker asserts on is a CONTRACT, not a private guess: dispatch.md
# § System verify defines it as `owner-ruling: system-verify — <ruling + reason>` and night-run.md
# Part 4 references the same shape for the unattended morning-after case. This checker's regex and
# that documented shape must stay in exact agreement (L-058) -- a checker asserting on a line format
# no procedure actually tells anyone to write would false-positive every real owner override phrased
# any other way, the moment this checker is wired into qa-check.sh's always-on path.
#
# --- the thing this check actually guards ---------------------------------------------------------
# NOT the gate itself, and not whether the FAIL was correct. The guarded failure is a log that shows
# BOTH a `system-verify · FAIL(...)` line AND a `| close |` event, with no recorded owner ruling in
# between -- a FAIL that was surfaced and then closed over anyway, silently. So:
#
#   no `system-verify ·` line at all       -> nothing to verify (pre-dates this pass, or not yet run).
#   FAIL line, no `close` event yet        -> PASS. Correctly still blocking -- nothing closed over it.
#     (the unattended shape: Part 0 parks the close itself, so a genuinely parked run never reaches a
#     `| close |` event at all -- this is what an unattended FAIL looks like in the log, not a separate
#     branch.)
#   FAIL line, `close` event, owner-ruling -> PASS. Attended: surfaced, owner ruled, then closed.
#   FAIL line, `close` event, no ruling    -> FAIL system-verify-fail-silently-closed.
#   PASS / no-gate-discovered line only    -> PASS. Nothing to block on.
#
# Usage: sh check-system-verify-block.sh <sprint-log.md> [<sprint-log.md> ...]
# Archived logs are skipped by path (docs/sprint/archive/) -- closed history is not re-litigated, same
# convention as check-night-run-rollup.sh.
# Prints one PASS/FAIL/note line per file; exits 1 if any FAIL line was printed.
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

[ "$#" -gt 0 ] || { note "system-verify block: no sprint logs given -- nothing verified"; exit 0; }

for lg in "$@"; do
  [ -f "$lg" ] || { bad "system-verify block: file not found: $lg"; continue; }
  case "$lg" in */archive/*) continue ;; esac

  if ! grep -qE '^system-verify ·' "$lg" 2>/dev/null; then
    note "system-verify block: $lg has no system-verify line -- nothing to verify"
    continue
  fi

  if ! grep -qE '^system-verify · FAIL\(' "$lg" 2>/dev/null; then
    ok "system-verify block $lg (PASS / no-gate-discovered verdict -- nothing to block on)"
    continue
  fi

  if ! grep -qE '^### .*\| *close *\|' "$lg" 2>/dev/null; then
    ok "system-verify block $lg (FAIL recorded, no close event yet -- correctly still blocking)"
    continue
  fi

  if grep -qE '^owner-ruling: *system-verify' "$lg" 2>/dev/null; then
    ok "system-verify block $lg (FAIL recorded, close gated by a recorded owner ruling)"
  else
    bad "system-verify-fail-silently-closed: $lg carries a 'system-verify · FAIL(...)' line and a '| close |' event with no recorded owner ruling -- the FAIL was surfaced and then closed over anyway"
  fi
done

exit "$fail"
