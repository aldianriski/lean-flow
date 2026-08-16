#!/bin/sh
# run-dispatch-preflight-fixtures.sh -- must-FAIL fixtures for the pre-dispatch preflight snippet
# shipped in skills/orchestrator/references/dispatch.md (cycle / shared-file-ownership / base-ref).
#
# TD-012: this snippet was negative-tested by three must-FAIL fixtures that lived in a scratch dir
# and were deleted with their prototype, leaving the shipped sh/awk block with no retained
# regression guard (L-058's exact worst case -- a gate that can degrade silently). This runner
# adopts the same fixture shape into the harness that TD-012 itself named as the natural carrier.
#
# Extraction note: this runner used extract_sole_fenced_block while dispatch.md had exactly ONE ```sh
# block and skills/** was frozen for the task that wrote it. SPRINT-070 T2 added a second ```sh block
# (the worktree-base guard), which is precisely the case that helper fails loud on -- so dispatch.md
# was retrofitted with the `<!-- name:start/end -->` anchor convention and this runner now extracts
# by name. Still the real shipped snippet, never a hand-copied duplicate; the anchors additionally
# make the extraction stable against any future third block.
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
extract_between_anchors "$dispatch_md" \
  "<!-- dispatch-preflight:start -->" "<!-- dispatch-preflight:end -->" "$script_tmp"

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

# --- case 4 (TD-025): T1->T2->T3->T4 chain on night-run.md, replaying SPRINT-044's real case --
# no direct edge between non-adjacent pairs -> must PASS, naming the derived transitive order ----
run_case_anywhere "sprint-044-chain" 0 "PASS shared-file-owned-transitive" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/sprint-044-chain/sprint.md\" \"$live_head\""

# --- case 5: T1 and T3 share shared.md with DIFFERING ranks but no Depends-on path between them --
# guards TD-025's fix from ever mistaking rank divergence for ownership -> must still FAIL by name -
run_case_anywhere "shared-file-unowned-diverging-ranks" 1 "FAIL shared-file-unowned" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/shared-file-unowned-diverging-ranks/sprint.md\" \"$live_head\""

# --- case 6 (TD-040): shared.md sits on an INDENTED CONTINUATION of Layers: in both tasks --------
# Pre-fix the parser matched only lines beginning `Layers:`, so a wrapped declaration kept its first
# line and every path on the continuation was invisible -> PREFLIGHT: CLEAR over a real unowned
# overlap. Observed live at the SPRINT-053 and SPRINT-054 promotes; harmless both times only because
# the overlap happened to carry a Depends-on edge anyway (luck, not the check).
run_case_anywhere "wrapped-layers-unowned" 1 "FAIL shared-file-unowned: shared.md" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/wrapped-layers-unowned/sprint.md\" \"$live_head\""

# --- case 7 (TD-043): T1 declares a DIRECTORY token, T2 a file inside that tree ------------------
# Pre-fix the token pattern required a dot extension, so a token ending in "/" was extracted by
# nothing and compared against nothing. The rule "declare a directory only for a tree ONE task owns"
# was stated in a header comment -- a comment, not a check.
run_case_anywhere "directory-token-unowned" 1 "FAIL shared-file-unowned: evals/fixtures/ ~ " -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/directory-token-unowned/sprint.md\" \"$live_head\""

# --- case 8: PARSER PARITY -- one input, both parsers, same declarations seen --------------------
# The snippet re-implements a parser scripts/lib/check-layers-completeness.sh already has correct,
# and drifted from it twice (TD-040, TD-043). G2 ruled against removing the duplication -- dispatch.md
# publishes the snippet as dependency-free and runnable-verbatim, and pointing it at scripts/lib/
# would ship a maintainer-only path inside a consumer-facing reference (L-015). So the duplication is
# guarded instead of removed: one fixture, deliberately awkward in both ways that broke the snippet,
# driven through both tools.
#
# Asserted on OUTPUT CONTENT, never on exit status -- and that distinction is the whole case. Run
# against the pre-fix snippet this same fixture exits 0 and prints "PREFLIGHT: CLEAR" while silently
# reporting NEITHER overlap: the parser saw no shared files at all. Exit code identical, verdict
# empty. That is CLAUDE.md trap (c) in one line -- a status is evidence about the reporter, never
# about the artifact (L-060).
parity="$here/fixtures/dispatch-preflight/parser-parity/sprint.md"
parity_out=$(cd "$repo_root" && sh "$script_tmp" "$parity" "$live_head" 2>&1)
for want in "shared/tree/ ~ shared/tree/nested.md in T1,T2" "common.md in T1,T2"; do
  case "$parity_out" in
    *"$want"*) echo "PASS fixture(parser-parity/preflight): saw '$want'" ;;
    *) echo "FAIL fixture(parser-parity/preflight): '$want' missing -- the snippet stopped reading a declaration the full checker still reads:"
       printf '%s\n' "$parity_out"; fail=1 ;;
  esac
done
run_case_anywhere "parser-parity/completeness" 0 "### T2 Layers completeness" -- \
  sh -c "cd \"$repo_root\" && sh scripts/lib/check-layers-completeness.sh \"$parity\""

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "DISPATCH-PREFLIGHT FIXTURES: all green"; else echo "DISPATCH-PREFLIGHT FIXTURES: at least one FAIL"; fi
exit $fail
