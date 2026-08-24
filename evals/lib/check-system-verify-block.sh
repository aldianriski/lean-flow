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
#   PASS line only                         -> PASS. The gate ran and was green.
#
# --- the no-gate-discovered family (SPRINT-082 T1) ------------------------------------------------
# `no-gate-discovered` used to short-circuit to PASS here on the reasoning "nothing to block on". That
# read absence of evidence as evidence of absence: a BEHAVIOURAL change could close having proved
# nothing, and the log carried no trace that nothing had been proved. dispatch.md § System verify now
# routes on the change's risk class, and the rollup line carries that class so this checker can read
# it -- a verdict a checker cannot read is not enforceable, which is the whole reason the marker
# exists rather than living in the run's head.
#
#   no-gate-discovered(low), close         -> PASS. Unchanged behaviour: cheap path preserved.
#   no-gate-discovered(material), no close -> PASS. Correctly parked (the unattended shape).
#   no-gate-discovered(material), close,
#     with an owner-ruling                 -> PASS. Attended: the owner ruled on closing unproven.
#   no-gate-discovered(material), close,
#     no owner-ruling                      -> FAIL system-verify-no-gate-material-silently-closed.
#   no-gate-discovered UNMARKED, close     -> FAIL no-gate-risk-unmarked. The marker's absence is not
#     a claim of low risk. Defaulting an unmarked line to `low` would reinstate the exact silent close
#     this family exists to stop, and would do it invisibly -- the same reasoning that makes an absent
#     ask channel a BLOCK rather than a default-yes (night-run.md Part 0).
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

  has_close=0; grep -qE '^### .*\| *close *\|' "$lg" 2>/dev/null && has_close=1
  has_ruling=0; grep -qE '^owner-ruling: *system-verify' "$lg" 2>/dev/null && has_ruling=1

  # -- FAIL first: it is the stronger signal, and a log carrying both a FAIL and a no-gate line
  # (two runs, one sprint) must be judged on the FAIL.
  if grep -qE '^system-verify · FAIL\(' "$lg" 2>/dev/null; then
    if [ "$has_close" -eq 0 ]; then
      ok "system-verify block $lg (FAIL recorded, no close event yet -- correctly still blocking)"
    elif [ "$has_ruling" -eq 1 ]; then
      ok "system-verify block $lg (FAIL recorded, close gated by a recorded owner ruling)"
    else
      bad "system-verify-fail-silently-closed: $lg carries a 'system-verify · FAIL(...)' line and a '| close |' event with no recorded owner ruling -- the FAIL was surfaced and then closed over anyway"
    fi
    continue
  fi

  # -- the no-gate-discovered family (SPRINT-082 T1 · ADR-033) -------------------------------------
  if grep -qE '^system-verify · no-gate-discovered' "$lg" 2>/dev/null; then
    if grep -qE '^system-verify · no-gate-discovered\(material\)' "$lg" 2>/dev/null; then
      if [ "$has_close" -eq 0 ]; then
        ok "system-verify block $lg (no-gate-discovered(material), no close event yet -- correctly parked)"
      elif [ "$has_ruling" -eq 1 ]; then
        ok "system-verify block $lg (no-gate-discovered(material), close gated by a recorded owner ruling)"
      else
        bad "system-verify-no-gate-material-silently-closed: $lg records 'no-gate-discovered(material)' and a '| close |' event with no recorded owner ruling -- a material change closed having proved nothing, and the absence of a gate is not a verdict that there was nothing to prove"
      fi
    elif grep -qE '^system-verify · no-gate-discovered\(low\)' "$lg" 2>/dev/null; then
      ok "system-verify block $lg (no-gate-discovered(low) -- cheap path preserved, nothing material to block on)"
    elif [ "$has_close" -eq 1 ]; then
      bad "no-gate-risk-unmarked: $lg records a bare 'no-gate-discovered' with no (low|material) class and a '| close |' event -- the marker's absence is not a claim of low risk, so this cannot be read as the cheap path"
    else
      ok "system-verify block $lg (no-gate-discovered unmarked, no close event yet -- nothing closed over)"
    fi
    continue
  fi

  ok "system-verify block $lg (PASS verdict -- the gate ran and was green)"
done

exit "$fail"
