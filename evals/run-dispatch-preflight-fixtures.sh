#!/bin/sh
# run-dispatch-preflight-fixtures.sh -- must-FAIL fixtures for the pre-dispatch preflight snippet
# shipped in skills/orchestrator/references/dispatch.md (cycle / shared-file-ownership / base-ref).
#
# TD-012: this snippet was negative-tested by three must-FAIL fixtures that lived in a scratch dir
# and were deleted with their prototype, leaving the shipped sh/awk block with no retained
# regression guard (L-058's exact worst case -- a gate that can degrade silently). This runner
# adopts the same fixture shape into the harness that TD-012 itself named as the natural carrier.
#
# Extraction note: dispatch.md predates the `<!-- name:start/end -->` anchor convention T1 shipped
# in night-run.md (skills/** is frozen for this task, so no anchors were added). dispatch.md has
# exactly ONE ```sh fenced block, so extract_sole_fenced_block pulls it unambiguously instead --
# still testing the real shipped snippet, never a hand-copied duplicate (harness-common.sh checks
# the fence count and fails loud if a second ```sh block is ever added, rather than silently
# extracting the wrong one).
#
# The snippet's git calls (`git rev-parse HEAD`, `git rev-parse <declared-base>`) are bare -- no
# `-C <repo>` flag -- so they resolve against the CALLER's cwd. Every case below runs the extracted
# script from this repo's own root; all three git calls are `rev-parse` (read-only, zero writes).
#
# Dependency-free POSIX sh. Run bare: sh evals/run-dispatch-preflight-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
dispatch_md="$repo_root/skills/orchestrator/references/dispatch.md"
. "$here/lib/harness-common.sh"

script_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
trap 'rm -f "$script_tmp"' EXIT
extract_sole_fenced_block "$dispatch_md" "sh" "$script_tmp"

live_head=$(git -C "$repo_root" rev-parse HEAD 2>/dev/null)
[ -n "$live_head" ] || { echo "FAIL harness: could not resolve live HEAD in $repo_root"; exit 2; }
# A declared base guaranteed to differ from live HEAD -- computed relative to HEAD (never a
# hardcoded sha) so the fixture stays valid as this repo's history grows.
drifted_base="${live_head}~5"

fail=0

# --- case 1: T1<->T2 depend on each other -> no valid dispatch order -> FAIL cycle-detected ------
run_case_anywhere "cycle" 1 "FAIL cycle-detected" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/cycle/sprint.md\" \"$live_head\""

# --- case 2: T1 and T2 both name shared.md, no Depends-on edge -> FAIL shared-file-unowned -------
run_case_anywhere "shared-file-unowned" 1 "FAIL shared-file-unowned" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/shared-file-unowned/sprint.md\" \"$live_head\""

# --- case 3: declared base != live HEAD -> FAIL base-ref-drift -----------------------------------
run_case_anywhere "base-ref-drift" 1 "FAIL base-ref-drift" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/base-ref-drift/sprint.md\" \"$drifted_base\""

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "DISPATCH-PREFLIGHT FIXTURES: all green"; else echo "DISPATCH-PREFLIGHT FIXTURES: at least one FAIL"; fi
exit $fail
