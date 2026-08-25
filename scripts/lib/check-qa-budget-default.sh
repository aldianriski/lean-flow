#!/usr/bin/env sh
# check-qa-budget-default.sh -- guards ONE invariant: scripts/qa-check.sh's own default-profile
# budget (QA_BUDGET_SECONDS's fallback) must sit BELOW the external command ceiling it exists to
# beat (SPRINT-086 T3, TD-091). SPRINT-085's blocker named this "lateness path (a)": the default
# shipped at 900s while this environment's command ceiling is 600s, so the guard could only trip
# after fifteen minutes somewhere nothing survives ten -- an absent guard wearing the shape of a
# present one (L-105). The threshold was chosen without checking it against the ceiling; this
# checker makes that comparison mechanical instead of trusting the next edit to remember it.
#
# Usage: sh check-qa-budget-default.sh <path-to-qa-check.sh> [ceiling-seconds, default 600]
# Prints PASS/FAIL + a note, exits 0/1. Pointed at a real file so a fixture can seed a doctored
# COPY with a bad default and prove the FAIL fires, without touching the shipped script.

set -u

qc=${1:-}
ceiling=${2:-600}

[ -n "$qc" ] || { echo "FAIL qa-budget-default-arg: no qa-check.sh path given"; exit 2; }
[ -f "$qc" ] || { echo "FAIL qa-budget-default-not-found: $qc does not exist"; exit 2; }

# The default lives in a `QA_BUDGET_SECONDS=${QA_BUDGET_SECONDS:-N}` assignment -- extract N from
# the FIRST such line (there is exactly one in the shipped script; a doctored fixture copy keeps the
# same shape). A line with no integer fallback is a named FAIL, never a silent skip (L-058).
line=$(grep -m1 'QA_BUDGET_SECONDS=\${QA_BUDGET_SECONDS:-[0-9]*}' "$qc")
default=$(printf '%s' "$line" | grep -oE ':-[0-9]+' | grep -oE '[0-9]+')

if [ -z "$default" ]; then
  echo "FAIL qa-budget-default-not-found: no QA_BUDGET_SECONDS default assignment found in $qc"
  exit 1
fi

if [ "$default" -ge "$ceiling" ]; then
  echo "FAIL qa-budget-default-exceeds-ceiling: default ${default}s >= ${ceiling}s command ceiling in $qc -- the guard can only trip after the ceiling has already killed the run (TD-091)"
  exit 1
fi

echo "PASS qa-budget-default: ${default}s < ${ceiling}s command ceiling ($qc)"
exit 0
