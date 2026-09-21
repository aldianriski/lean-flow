#!/usr/bin/env sh
# qa-budget-check.sh -- a wall-clock budget guard for scripts/qa-check.sh's default (fast) profile
# (SPRINT-084 T1, TD-084).
#
# TD-084's own evidence: three runs of qa-check.sh were killed by an EXTERNAL timeout (5min / 10min /
# a reaped background job) with NO verdict line printed at all -- the silent-truncation failure mode a
# Tier-G gate must never produce, because a false negative there is silent by construction (ADR-029).
# This task fixed the two measured DOMINANT legs directly (scripts/gen-index.sh's per-item spawns,
# qa-check.sh leg 4's corpus walk, leg 2f-ter's now-reduced default spec) -- profiled first, per
# TD-084's own "do not act on (a) before (b)" mitigation clause. What THIS file adds is a forward
# guard, not another speed fix: if some future change reintroduces heavy per-item work anywhere in the
# default profile (leg 12's 23 eval harnesses are the likeliest repeat offender -- TD-073 was exactly
# this shape once already), the gate REPORTS the overrun as a named, gating finding and stops running
# further skippable work, instead of quietly running past whatever external limit kills it with zero
# output. Reported rather than silently truncated -- literally.
#
# Usage: qa_budget_check <start-epoch-seconds> <budget-seconds> <full-flag>
#   prints "OVER <elapsed> <budget>" and returns 1 when elapsed > budget and full-flag != "1"
#   prints "OK <elapsed> <budget>" and returns 0 otherwise -- including whenever full-flag == "1":
#   QA_FULL opts a run INTO the heavy/opt-in legs on purpose, so the budget does not apply to it
#   (constraint: heavy legs stay reachable, not deleted, under their explicit flag).
#
# Sourced, not executed -- `. "$ROOT/scripts/lib/qa-budget-check.sh"` from qa-check.sh or a fixture.
qa_budget_check() {
  _qb_start=$1; _qb_budget=$2; _qb_full=$3
  if [ "$_qb_full" = "1" ]; then
    printf 'OK %s %s\n' 0 "$_qb_budget"
    return 0
  fi
  # A NON-NUMERIC BUDGET MUST REFUSE, NOT PASS (SPRINT-105 T3, outside review F4).
  #
  # Without this, `[ "$elapsed" -gt "$budget" ]` ERRORS on a non-numeric budget (rc 2, "integer
  # expression expected" on stderr), the `if` reads that as false, and the function falls through
  # to `printf 'OK ...'` and `return 0` -- every time, forever. Measured: `qa_budget_check 0 abc 0`
  # returned `OK 1790032685 abc`, rc 0. The guard reports OK at 1.79 BILLION seconds elapsed.
  #
  # That is a silent false negative in the mechanism whose whole job is bounding a run, and it is
  # reachable from any caller that passes an env var through unvalidated -- which is exactly what a
  # night-run.sh budget raise did before it was reverted. Fixing it HERE rather than at that one
  # caller is deliberate: the hole belongs to this function, and a per-caller guard would leave the
  # next caller to rediscover it.
  #
  # Refuses by NAME on stderr and returns 2 -- distinct from 1 (OVER), so a caller can tell
  # "budget exceeded" from "budget unusable" instead of conflating them (the L-045 shape).
  case "$_qb_budget" in
    ''|*[!0-9]*)
      printf 'qa_budget_check: budget must be a non-negative integer, got: %s\n' "$_qb_budget" >&2
      printf 'UNUSABLE 0 %s\n' "$_qb_budget"
      return 2
      ;;
  esac
  _qb_now=$(date +%s)
  _qb_elapsed=$(( _qb_now - _qb_start ))
  if [ "$_qb_elapsed" -gt "$_qb_budget" ]; then
    printf 'OVER %s %s\n' "$_qb_elapsed" "$_qb_budget"
    return 1
  fi
  printf 'OK %s %s\n' "$_qb_elapsed" "$_qb_budget"
  return 0
}

# --- truncation as an OUTCOME, not a failure (SPRINT-099 T2, TD-117 + TD-128) -------------------
# TD-117's ruled direction (D3): make the skipped set its own named outcome. The problem it fixes is
# not that truncation goes unreported -- leg 12 already `note`s each skipped harness -- but that the
# VERDICT is byte-indistinguishable from an ordinary red gate. SPRINT-099 T1 reproduced that five
# times out of five: every completed run printed `N pass, 1 fail` while having skipped 13 harnesses,
# two of them the guards of this very budget mechanism.
#
# These are pure formatting/selection functions rather than inline code in qa-check.sh for one
# reason: the only way to exercise logic living inside qa-check.sh is to RUN qa-check.sh, which
# measures ~550s on this host and truncates. A guard that can only be tested by a run that truncates
# cannot be a fixture. Here they are callable in milliseconds (evals/run-qa-budget-fixtures.sh).
#
# The verdict line `QA-CHECK: N pass, M fail` is deliberately NOT changed by any of this.
# scripts/qa-verdict.ts matches it with /^QA-CHECK: (\d+) pass, (\d+) fail$/m -- anchored at BOTH
# ends -- so any edit to that line would make every run report as verdict-less, which is the exact
# failure TD-143's cheap half shipped to prevent. Truncation therefore arrives as its own ADDITIONAL
# line and the verdict line is left alone (L-020: the consumer was enumerated before the change).

# qa_unreached_from <current-item>
#   Reads an ordered list on stdin, prints <current-item> AND everything after it. Inclusive because
#   the item a trip fires ON is itself unrun: leg 12 skips the harness it tripped at, and a leg
#   checkpoint fires before its own leg runs.
qa_unreached_from() {
  _qu_cur=$1; _qu_seen=0
  while IFS= read -r _qu_x; do
    [ -n "$_qu_x" ] || continue
    [ "$_qu_x" = "$_qu_cur" ] && _qu_seen=1
    [ "$_qu_seen" -eq 1 ] && printf '%s\n' "$_qu_x"
  done
  return 0
}

# qa_truncation_line <label> <elapsed> <budget> <unrun-NEWLINE-separated>
#   The distinguishing line. Names the ACTUAL elapsed seconds, the budget, where it stopped, and
#   every unrun item BY NAME -- T2's DoD is explicit that a count alone is not enough.
#   An empty unrun set is reported as a DEFECT, not as good news: truncating with nothing left to run
#   is a contradiction, and a guard that cannot derive its own subject says so rather than printing a
#   clean-looking line (L-058).
qa_truncation_line() {
  _qt_label=$1; _qt_elapsed=$2; _qt_budget=$3; _qt_unrun=$4
  # Items are NEWLINE-delimited, and are counted by LINE rather than by word. This is not
  # defensive style: leg labels contain spaces ("leg 2: count consistency"), so word-splitting
  # reported 94 items while naming 21 legs -- found by pointing this at the real gate rather than
  # at the fixtures, every one of which happened to use space-free names like `run-foo.sh` (L-166,
  # L-186). The display join is " | " so a reader can tell two multi-word items apart.
  _qt_n=0; _qt_joined=""
  while IFS= read -r _qt_i; do
    # Skip whitespace-ONLY lines without altering the item: a blank or spaces-only line would
    # otherwise count as a phantom item and inflate the total (adversarial review, latent). The
    # earlier attempt here deleted every space, which mangled multi-word leg labels -- caught
    # immediately by case 10, which is what that case is for.
    case "$_qt_i" in *[![:space:]]*) ;; *) continue ;; esac
    _qt_n=$((_qt_n + 1))
    if [ -z "$_qt_joined" ]; then _qt_joined=$_qt_i; else _qt_joined="$_qt_joined | $_qt_i"; fi
  done <<QTEOF
$_qt_unrun
QTEOF
  if [ "$_qt_n" -eq 0 ]; then
    printf 'QA-CHECK: TRUNCATED at %s after %ss against a %ss budget -- but the unrun set came back EMPTY, which is impossible for a real truncation: the unreached set could not be derived, so this run reports nothing about what it skipped\n' \
      "$_qt_label" "$_qt_elapsed" "$_qt_budget"
    return 1
  fi
  printf 'QA-CHECK: TRUNCATED at %s after %ss against a %ss budget -- %s item(s) UNRUN, named: %s\n' \
    "$_qt_label" "$_qt_elapsed" "$_qt_budget" "$_qt_n" "$_qt_joined"
  return 0
}

# qa_ceiling_check <start-epoch-seconds> <ceiling-seconds>
#   TD-128's missing READER. check-qa-budget-default.sh asserts the CONFIGURED budget against the
#   ceiling and is correct within that scope -- it is deliberately NOT widened (T2 DoD 3). What has
#   never been asserted anywhere is the ACTUAL runtime against that same ceiling, which is why the
#   check could print `PASS 520s < 600s` on a run that took 1450s.
qa_ceiling_check() {
  _qc_ceiling=$2
  _qc_now=$(date +%s)
  _qc_elapsed=$(( _qc_now - $1 ))
  if [ "$_qc_elapsed" -gt "$_qc_ceiling" ]; then
    printf 'OVER-CEILING %s %s\n' "$_qc_elapsed" "$_qc_ceiling"
    return 1
  fi
  printf 'WITHIN-CEILING %s %s\n' "$_qc_elapsed" "$_qc_ceiling"
  return 0
}

# qa_ceiling_info_line <elapsed-seconds> <ceiling-seconds>
#   ADR-042: the ceiling is a property of the INVOCATION (foreground vs detached), not of the run, so
#   an OVER-CEILING result is reported as INFO -- uncounted -- rather than FAIL. Round 15 Finding 2:
#   qa-check.sh runs this check at :1453 and prints its verdict at :1473, twenty lines later; a run
#   killed AT the ceiling reaches neither, so this line can only ever be printed by a run that
#   survived to speak. It is therefore a warning to the NEXT caller about invocation mode -- a
#   FOREGROUND call of this duration would be killed -- never a verdict on the run printing it.
#   A pure formatting function for the same reason as qa_truncation_line above: callable in
#   milliseconds by a fixture, instead of only being reachable by a run that takes ~945-1370s.
qa_ceiling_info_line() {
  _qi_elapsed=$1; _qi_ceiling=$2
  printf 'INFO  qa-runtime-over-ceiling: this run took %ss against the %ss command ceiling -- and was NOT killed: it is printing this line ~20 lines before the QA-CHECK verdict. A FOREGROUND invocation of this duration would be killed by the agent harness before reaching here; a DETACHED one is not. This figure is a warning to the NEXT caller about invocation mode, not a verdict on this run (ADR-042)\n' \
    "$_qi_elapsed" "$_qi_ceiling"
}
