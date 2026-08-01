#!/bin/sh
# run-worktree-usability-fixtures.sh -- must-degrade fixtures for the worktree-isolation check in
# skills/orchestrator/references/night-run-checks.md (L-058: retain one fixture per outcome).
#
# Extracts the *actual shipped snippet* from night-run-checks.md (between the worktree-usability-check
# anchors) so the fixtures test what a consumer really runs, not a hand-copied duplicate that can
# drift out of sync with it. Dependency-free POSIX sh. Run bare: sh evals/run-worktree-usability-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
nightrun="$here/../skills/orchestrator/references/night-run-checks.md"
. "$here/lib/harness-common.sh"

script_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
trap 'rm -f "$script_tmp"' EXIT
extract_between_anchors "$nightrun" "<!-- worktree-usability-check:start -->" "<!-- worktree-usability-check:end -->" "$script_tmp"

fail=0

# --- case 1: not a git working tree (path doesn't exist) -> DEGRADE, finding: no-worktree-support -
run_case_firstline "no-worktree-support" 0 "DEGRADE no-worktree-support" -- \
  sh "$script_tmp" "$here/fixtures/worktree-usability/no-worktree-support/does-not-exist"

# --- case 2: canned listing with a leftover linked worktree -> DEGRADE, finding: leftover-worktrees
run_case_firstline "leftover-worktrees" 0 "DEGRADE leftover-worktrees" -- \
  sh "$script_tmp" \
  "$here/fixtures/worktree-usability/leftover-worktrees" \
  "$here/fixtures/worktree-usability/leftover-worktrees/listing.txt"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "WORKTREE-USABILITY FIXTURES: all green"; else echo "WORKTREE-USABILITY FIXTURES: at least one FAIL"; fi
exit $fail
