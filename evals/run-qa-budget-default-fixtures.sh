#!/bin/sh
# run-qa-budget-default-fixtures.sh -- fixtures for scripts/lib/check-qa-budget-default.sh
# (SPRINT-086 T3, TD-091, lateness path (a)).
#
# SPRINT-085's blocker: QA_BUDGET_SECONDS defaulted to 900s while this environment's command
# ceiling is 600s, so the forward guard TD-084 shipped could only trip after the ceiling had
# already killed the run with no verdict line -- an absent guard wearing the shape of a present
# one (L-105). This suite proves the checker catches a default at-or-above the ceiling (case 2,
# the must-FAIL scenario), stays quiet on a default safely below it (case 1, the sibling control
# -- exercised against the REAL shipped file, not a synthetic copy), and does not mistake a
# missing/malformed default for a passing one (case 3, a second control on the same failure axis
# as case 2 but a different named finding).
#
# Dependency-free POSIX sh, no git needed, no real qa-check.sh execution -- pure text fixtures.
# Run bare: sh evals/run-qa-budget-default-fixtures.sh

set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-qa-budget-default.sh"
real_qc="$repo_root/scripts/qa-check.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -f "$real_qc" ] || { echo "FAIL harness: scripts/qa-check.sh not found at $real_qc"; exit 2; }

fail=0
tmpdir=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$tmpdir"' EXIT

# --- case 1 (PASS control): the REAL shipped default, checked against the real 600s ceiling ------
# Run against the actual scripts/qa-check.sh, not a copy -- this is the case that proves the shipped
# value satisfies its own invariant, not just that the checker CAN pass something.
out1=$(sh "$checker" "$real_qc" 600 2>&1); rc1=$?
if [ "$rc1" -eq 0 ] && printf '%s' "$out1" | grep -qE '^PASS qa-budget-default:'; then
  echo "PASS fixture(shipped-default-below-ceiling): exit $rc1, $out1"
else
  echo "FAIL fixture(shipped-default-below-ceiling): exit $rc1 -- output: $out1"; fail=1
fi

# --- case 2 (must-FAIL of the SCENARIO / must-PASS of the fixture): a doctored copy with the
# default set to SPRINT-085's own 900s figure, checked against the SAME 600s ceiling. This is
# TD-091's shape reproduced exactly -- the checker must name it, not pass it quietly.
bad_qc="$tmpdir/qa-check-bad-default.sh"
sed 's/QA_BUDGET_SECONDS:-[0-9]*/QA_BUDGET_SECONDS:-900/' "$real_qc" > "$bad_qc"
out2=$(sh "$checker" "$bad_qc" 600 2>&1); rc2=$?
if [ "$rc2" -eq 1 ] && printf '%s' "$out2" | grep -qE '^FAIL qa-budget-default-exceeds-ceiling: default 900s >= 600s'; then
  echo "PASS fixture(default-at-900-exceeds-600-ceiling): exit $rc2, $out2"
else
  echo "FAIL fixture(default-at-900-exceeds-600-ceiling): exit $rc2 -- output: $out2"; fail=1
fi

# --- case 3 (PASS control, distinct finding axis): a file with NO QA_BUDGET_SECONDS default line
# at all must FAIL named "qa-budget-default-not-found", never silently pass as "nothing to check"
# (L-058's silent-skip shape) and never collide with case 2's finding name.
missing_qc="$tmpdir/qa-check-no-default.sh"
grep -v 'QA_BUDGET_SECONDS=\${QA_BUDGET_SECONDS:-' "$real_qc" > "$missing_qc"
out3=$(sh "$checker" "$missing_qc" 600 2>&1); rc3=$?
if [ "$rc3" -eq 1 ] && printf '%s' "$out3" | grep -qE '^FAIL qa-budget-default-not-found:'; then
  echo "PASS fixture(missing-default-line-named-not-found): exit $rc3, $out3"
else
  echo "FAIL fixture(missing-default-line-named-not-found): exit $rc3 -- output: $out3"; fail=1
fi

[ "$fail" -eq 0 ] && echo "PASS harness: qa-budget-default discriminates (case 2 reddens on a >=ceiling default; cases 1/3 stay green on distinct axes)"
exit $fail
