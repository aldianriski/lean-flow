#!/bin/sh
# run-review-depth-fixtures.sh -- fixtures for scripts/lib/check-review-depth.sh (SPRINT-082 T2).
#
# The checker exists because review depth is now chosen from a change's CONSEQUENCE rather than its
# file type (review-scoping.md § Two dimensions), and the old extension-keyed rule failed green: a
# one-line semantic edit to spec/STANDARD.md matched "docs / config / trivial diff" and no agent pass
# ever fired. Retained per L-058 (a gate is exercised once on input that must FAIL, with its own named
# finding) and TD-012 (fixtures survive the prototype rather than being deleted with it).
#
# Each FAIL case asserts on the checker's OWN NAMED FINDING, not merely on a non-zero exit (L-058).
# Case 4 is the load-bearing control: without it, a checker that simply failed every `self-review`
# record would be indistinguishable from one that routes on consequence -- and the correction would
# have swapped a silent pass for a blanket block. Cases 1 and 4 differ in exactly one token.
# Case 5 guards the checker's per-line reading: one log, several tasks, one violation.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-review-depth-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-review-depth.sh"
fx="$here/fixtures/review-depth"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1: governance:high, self-reviewed -> FAIL, named --------------------------------------
# The change the extension-keyed rule waved through: zero behaviour, high governance, `.md`.
run_case_anywhere "governance-self-reviewed-fails" 1 "review-depth-governance-self-reviewed" -- \
  sh "$checker" "$fx/governance-self-reviewed/docs/sprint/logs/SPRINT-950-governance.md"

# --- case 2: behaviour:material, self-reviewed -> FAIL, named ------------------------------------
# The other dimension on its own -- either alone must be able to demand depth.
run_case_anywhere "material-self-reviewed-fails" 1 "review-depth-material-self-reviewed" -- \
  sh "$checker" "$fx/material-self-reviewed/docs/sprint/logs/SPRINT-951-material.md"

# --- case 3: no consequence classes at all, self-reviewed -> FAIL, named -------------------------
# Absence of a marker is not a claim of low impact (ADR-033's no-gate-risk-unmarked reasoning).
run_case_anywhere "unclassified-self-reviewed-fails" 1 "review-depth-unclassified" -- \
  sh "$checker" "$fx/unclassified-self-reviewed/docs/sprint/logs/SPRINT-952-unclassified.md"

# --- case 4: low on both, self-reviewed -> PASS (the control: cheap path preserved) --------------
# Also asserts the denominator is reported, so a vacuous pass is visible (L-156).
run_case_anywhere "low-self-reviewed-passes" 0 "examined and cleared on consequence" -- \
  sh "$checker" "$fx/low-self-reviewed/docs/sprint/logs/SPRINT-953-low.md"

# --- case 5: one log, three tasks, one violation -> FAIL on that task only -----------------------
# Guards per-line reading: an honest self-review must not mask a real violation elsewhere in the file.
run_case_anywhere "multi-task-mixed-fails" 1 "review-depth-governance-self-reviewed" -- \
  sh "$checker" "$fx/multi-task-mixed/docs/sprint/logs/SPRINT-954-mixed.md"

# --- case 6: an ARCHIVED log carrying a violation -> skipped, exit 0 -----------------------------
# Location-scoped, matching system-verify/night-run-rollup/gates-signed convention: a closed sprint is
# history and its record is not re-litigated.
mkdir -p "$fx/archived/docs/sprint/archive/logs"
cp "$fx/governance-self-reviewed/docs/sprint/logs/SPRINT-950-governance.md" \
   "$fx/archived/docs/sprint/archive/logs/SPRINT-955-archived.md" 2>/dev/null
out=$(sh "$checker" "$fx/archived/docs/sprint/archive/logs/SPRINT-955-archived.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && [ -z "$out" ]; then
  printf 'PASS fixture(archived-out-of-scope): exit 0 with no output -- archived log not re-checked\n'
else
  printf 'FAIL fixture(archived-out-of-scope): expected exit 0 and no output -- got rc=%s: %s\n' "$rc" "$out"
  fail=1
fi

# --- case 7: no arguments -> the denominator note, never a silent pass ---------------------------
run_case_anywhere "no-input-reports-nothing-verified" 0 "nothing verified" -- \
  sh "$checker"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "REVIEW-DEPTH FIXTURES: all green"; else echo "REVIEW-DEPTH FIXTURES: at least one FAIL"; fi
exit $fail
