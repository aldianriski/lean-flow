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
  _qb_now=$(date +%s)
  _qb_elapsed=$(( _qb_now - _qb_start ))
  if [ "$_qb_elapsed" -gt "$_qb_budget" ]; then
    printf 'OVER %s %s\n' "$_qb_elapsed" "$_qb_budget"
    return 1
  fi
  printf 'OK %s %s\n' "$_qb_elapsed" "$_qb_budget"
  return 0
}
