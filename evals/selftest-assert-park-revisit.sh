#!/bin/sh
# selftest-assert-park-revisit.sh -- proves evals/assert-park-revisit.sh actually FAILS on the
# violation it exists to catch, and passes on the compliant shape (SPRINT-059 T4).
#
# This wrapper is the point, not a formality. The assertion's first draft had TWO defects that a
# green run would have hidden completely:
#   1. the loop was fed by a PIPE, so `fail=1` was set in a subshell and discarded -- the script
#      could only ever exit 0, whatever it found;
#   2. it detected a revisit by grepping the whole log for "revisit|resolved|...", and the must-FAIL
#      fixture PASSED because that fixture's own slug contained the word "revisit".
# Both were caught by running the must-FAIL fixture and seeing it come back green. A gate's worst
# failure is the silent false negative (L-058), and a gate nobody points at a known violation is
# indistinguishable from one that works.
#
# Fixtures are RETAINED, not built and deleted (TD-012): deleting them with the prototype leaves the
# assertion unguarded.
#
# Run bare: sh evals/selftest-assert-park-revisit.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
assert="$here/assert-park-revisit.sh"
fx="$here/fixtures/park-revisit"
fail=0

# --- must FAIL: the field report's real case ------------------------------------------------------
# A field parked pending the renderer; the task owning the renderer completed in the same run; the
# log says nothing further. On the real run, three later tasks owned that renderer and none went back.
out=$(sh "$assert" "$fx/stale-park" 2>&1); rc=$?
if [ "$rc" -ne 0 ] && printf '%s' "$out" | grep -q 'the park survived a night it did not need to'; then
  echo "PASS selftest(stale-park-fails): exit $rc with the named finding"
else
  echo "FAIL selftest(stale-park-fails): expected non-zero + named finding, got exit $rc: $out"; fail=1
fi

# --- must PASS: same shape, park closed once its unblock task landed -------------------------------
out=$(sh "$assert" "$fx/park-closed" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && printf '%s' "$out" | grep -q 'reaching done'; then
  echo "PASS selftest(park-closed-passes): exit 0, revisit recorded structurally"
else
  echo "FAIL selftest(park-closed-passes): expected exit 0, got exit $rc: $out"; fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "PARK-REVISIT SELFTEST: all green"; else echo "PARK-REVISIT SELFTEST: at least one FAIL"; fi
exit $fail
