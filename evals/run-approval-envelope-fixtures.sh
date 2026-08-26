#!/bin/sh
# run-approval-envelope-fixtures.sh -- retained fixtures for scripts/lib/check-approval-envelope.sh
# (SPRINT-088 T4, TASK-295, EPIC-015 § Closed-when 4). Tier G per this sprint's D4.
#
# The guarded failure is an envelope that SILENTLY WIDENS: a run exceeds an approval it never re-read,
# and nothing anywhere reports having done so. That is invisible by construction, which is what makes
# these cases Tier G rather than a nice-to-have.
#
# --- the load-bearing NON-failure is case 5 -------------------------------------------------------
# An ABSENT approval must be reported as NOT APPROVED and must NOT be a gate failure: a sprint sits
# legitimately unapproved between promote and pre-flight, and a check that reddened there would be
# switched off within a week. But it must equally never be rendered as a PASS -- the exact regression
# the gates-signed family hit when it moved into the engine, where the text survived a migration and
# the verdict label flipped, so an unsigned sprint read as `PASS ... NOT SIGNED`. So this asserts on
# the LABEL, not only on the text and the exit code (L-103).
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-approval-envelope-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-approval-envelope.sh"
fx="$here/fixtures/approval-envelope"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture tree not found at $fx"; exit 2; }

fail=0

# --- case 1 (control): all ten dimensions, pinned -> PASS ----------------------------------------
# The cheap path, correctly earned. Without it, a checker that rejected everything would still pass
# every must-FAIL case below.
run_case_anywhere "complete-passes" 0 "all 10 dimensions covered" -- \
  sh "$checker" "$fx/complete/SPRINT-931-fx.md"

# --- case 2 (must-FAIL): a missing dimension is refused AND NAMED --------------------------------
# Naming it is the requirement, not a nicety: "your approval is incomplete" is not actionable and
# "your approval does not state a budget" is. A checker that reported only "malformed" would pass a
# bare exit-code assertion while being useless at 3am.
run_case_anywhere "missing-dimension-is-named" 1 "does not cover: budget" -- \
  sh "$checker" "$fx/missing-budget/SPRINT-932-fx.md"

# --- case 3 (must-FAIL): an approval with no commit pin approves a moving target ------------------
run_case_anywhere "no-pin-fails" 1 "malformed approval_envelope:" -- \
  sh "$checker" "$fx/no-pin/SPRINT-933-fx.md"

# --- case 3b (must-FAIL): a pin that is not a sha names nothing -----------------------------------
run_case_anywhere "bad-pin-fails" 1 "is not a hex sha" -- \
  sh "$checker" "$fx/bad-pin/SPRINT-934-fx.md"

# --- case 4 (must-FAIL): a SUBSTRING must not satisfy a dimension ---------------------------------
# `out-of-scope` is not `scope`; `budget-ceiling` is not `budget`. A markdown corpus is
# self-describing and an envelope is prose-adjacent, so a naive substring match would be satisfied by
# the very words that describe what is EXCLUDED (L-108 -- a false positive on a substring is a false
# negative on the contract). Both gaps must be named, not just one.
out=$(sh "$checker" "$fx/substring-trap/SPRINT-937-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] && printf '%s\n' "$out" | grep -q 'does not cover: scope budget'; then
  echo "PASS fixture(substring-does-not-satisfy): 'out-of-scope' did not satisfy 'scope' and 'budget-ceiling' did not satisfy 'budget'; both named"
else
  echo "FAIL fixture(substring-does-not-satisfy): exit $rc -- a substring satisfied a dimension, so the envelope can be approved by words that describe its exclusions -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 5: ABSENT is reported, exit 0, and never labelled a PASS -------------------------------
out=$(sh "$checker" "$fx/absent/SPRINT-935-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] &&
   printf '%s\n' "$out" | grep -qE '^ +approval envelope: .* -- NOT APPROVED' &&
   ! printf '%s\n' "$out" | grep -qE '^(PASS|FAIL) +approval envelope: .* -- NOT APPROVED'; then
  echo "PASS fixture(absent-is-not-approval-and-not-a-pass): reported as an unlabelled note, exit 0"
else
  echo "FAIL fixture(absent-is-not-approval-and-not-a-pass): exit $rc -- an absent approval was rendered as a verdict or as a failure; it must be neither -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 6: an unfilled TEMPLATE PLACEHOLDER counts as absent, not as a value --------------------
# Without this the shipped template's own placeholder would parse as "present" and bless a sprint
# nobody approved -- the guarded failure reintroduced through the artifact that creates every sprint.
out=$(sh "$checker" "$fx/placeholder/SPRINT-936-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && printf '%s\n' "$out" | grep -q 'NOT APPROVED'; then
  echo "PASS fixture(placeholder-counts-as-absent): the template's own placeholder does not bless a sprint"
else
  echo "FAIL fixture(placeholder-counts-as-absent): exit $rc -- an unfilled placeholder was read as an approval -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 7 (must-FAIL): a pin too short to name anything ----------------------------------------
# `@ a` is hex, so the alphabet check passes -- and it matches an enormous share of any repository's
# history, pinning essentially nothing while looking exactly like a pin. Git abbreviates to 7 for a
# reason. Found by an independent reviewer; the alphabet check alone had looked sufficient.
run_case_anywhere "short-pin-fails" 1 "hex character(s)" -- \
  sh "$checker" "$fx/short-pin/SPRINT-938-fx.md"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "APPROVAL-ENVELOPE FIXTURES: all green"; else echo "APPROVAL-ENVELOPE FIXTURES: FAILURES above"; fi
exit $fail
