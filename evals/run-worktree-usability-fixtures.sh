#!/bin/sh
# run-worktree-usability-fixtures.sh -- must-degrade fixtures for the worktree-isolation check in
# skills/orchestrator/references/night-run.md (L-058: retain one fixture per outcome).
#
# Extracts the *actual shipped snippet* from night-run.md (between the worktree-usability-check
# anchors) so the fixtures test what a consumer really runs, not a hand-copied duplicate that can
# drift out of sync with it. Dependency-free POSIX sh. Run bare: sh evals/run-worktree-usability-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
nightrun="$here/../skills/orchestrator/references/night-run.md"
[ -f "$nightrun" ] || { echo "FAIL harness: night-run.md not found at $nightrun"; exit 2; }

script_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
trap 'rm -f "$script_tmp"' EXIT

awk '/<!-- worktree-usability-check:start -->/{f=1;next} /<!-- worktree-usability-check:end -->/{f=0} f' "$nightrun" \
  | grep -v '^```' > "$script_tmp"
[ -s "$script_tmp" ] || { echo "FAIL harness: no snippet extracted between the anchors in $nightrun"; exit 2; }

fail=0
run_case() { # <label> <repo-root> <listing-file-or-empty> <expected-exit> <expected-finding-substring>
  label=$1; root=$2; listing=$3; want_exit=$4; want_find=$5
  if [ -n "$listing" ]; then
    out=$(sh "$script_tmp" "$root" "$listing" 2>&1)
  else
    out=$(sh "$script_tmp" "$root" 2>&1)
  fi
  got_exit=$?
  first_line=$(printf '%s\n' "$out" | head -n1)
  if [ "$got_exit" != "$want_exit" ]; then
    echo "FAIL fixture($label): exit $got_exit, expected $want_exit -- output: $first_line"
    fail=1
    return
  fi
  case "$first_line" in
    *"$want_find"*) echo "PASS fixture($label): exit $got_exit, finding matches '$want_find' -- $first_line" ;;
    *)
      echo "FAIL fixture($label): exit matched but finding missing '$want_find' -- got: $first_line"
      fail=1
      ;;
  esac
}

# --- case 1: not a git working tree (path doesn't exist) -> DEGRADE, finding: no-worktree-support -
run_case "no-worktree-support" \
  "$here/fixtures/worktree-usability/no-worktree-support/does-not-exist" \
  "" \
  0 "DEGRADE no-worktree-support"

# --- case 2: canned listing with a leftover linked worktree -> DEGRADE, finding: leftover-worktrees
run_case "leftover-worktrees" \
  "$here/fixtures/worktree-usability/leftover-worktrees" \
  "$here/fixtures/worktree-usability/leftover-worktrees/listing.txt" \
  0 "DEGRADE leftover-worktrees"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "WORKTREE-USABILITY FIXTURES: all green"; else echo "WORKTREE-USABILITY FIXTURES: at least one FAIL"; fi
exit $fail
