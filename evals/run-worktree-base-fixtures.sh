#!/bin/sh
# run-worktree-base-fixtures.sh -- must-FAIL fixtures for the worktree-base guard shipped in
# skills/orchestrator/references/dispatch.md § Worktree dispatch protocol (SPRINT-070 T2, TD-054).
#
# What the guard is for: the pre-dispatch preflight's base-ref leg compares the DECLARED base to live
# HEAD, both in the main checkout, and says nothing whatever about the base a spawned worktree
# actually got. TD-054 assumed those were the same thing for six sprints while four worktrees across
# two sprints silently branched from origin/main. This guard closes that gap; these fixtures are what
# stop it degrading into a silent PASS the way the preflight's own last-line bug once did (L-058).
#
# One case per NAMED finding -- an unnamed FAIL tells a morning rollup nothing about which leg
# tripped, and a guard with fewer fixtures than findings has legs nobody has ever seen fire:
#   worktree-base-unresolved · -missing · -unreadable · -stale · -divergent · plus the PASS control.
#
# The PASS control is deliberate and is NOT the whole test (L-058: a negative control proves the
# guard fires on rows it reaches, never that it reached them all) -- it exists so a guard that has
# been broken into always-FAILing is caught too, which the five must-FAIL cases alone cannot show.
#
# Tier: OPT-IN, not always-on. It builds throwaway git repos via mktemp -d + git init, which is the
# exact cost qa-check.sh's declared rule gates behind QA_FULL ("cheap-and-git-free stays always-on;
# git-repo-building stays opt-in", SPRINT-043 T1 / TD-016). Real git history is not optional here:
# `stale` requires a worktree genuinely behind a shared ancestor and `divergent` requires an
# unrelated root, and faking either with hand-passed shas would test the harness, not the guard.
# Every repo built here lives under mktemp -d -- this runner never writes to the repo under test.
#
# Dependency-free POSIX sh. Run bare: sh evals/run-worktree-base-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
dispatch_md="$repo_root/skills/orchestrator/references/dispatch.md"
. "$here/lib/harness-common.sh"

script_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -f "$script_tmp"; chmod -R u+w "$work" 2>/dev/null; rm -rf "$work"' EXIT

# Extract the REAL shipped guard by anchor -- never a hand-copied duplicate, which would drift from
# the doc the coordinator actually reads and pass while the shipped snippet rotted.
extract_between_anchors "$dispatch_md" \
  "<!-- worktree-base-guard:start -->" "<!-- worktree-base-guard:end -->" "$script_tmp"

commit_all() {  # commit_all <dir> <message> -- fixed fixture identity, never the host's git config
  git -C "$1" add -A >/dev/null 2>&1
  git -C "$1" -c user.name='Fixture Bot' -c user.email='fixture@example.com' \
    commit -q -m "$2" >/dev/null 2>&1
}

# --- the shared-history repo: three commits, so "stale" has a real distance to report -------------
main="$work/main"
mkdir -p "$main" || { echo "FAIL harness: mkdir $main failed"; exit 2; }
git -C "$main" init -q >/dev/null 2>&1 || { echo "FAIL harness: git init failed in $main"; exit 2; }
printf 'one\n' > "$main/f.txt";   commit_all "$main" 'c1'
base_sha=$(git -C "$main" rev-parse HEAD 2>/dev/null)
printf 'two\n' >> "$main/f.txt";  commit_all "$main" 'c2'
printf 'three\n' >> "$main/f.txt"; commit_all "$main" 'c3'
head_sha=$(git -C "$main" rev-parse HEAD 2>/dev/null)
[ -n "$base_sha" ] && [ -n "$head_sha" ] && [ "$base_sha" != "$head_sha" ] || {
  echo "FAIL harness: could not build a two-commit gap in $main"; exit 2; }

# A worktree pinned at c1 -- the shape TD-054 observed live, two commits behind its coordinator.
git -C "$main" worktree add --detach -q "$work/wt-stale" "$base_sha" >/dev/null 2>&1 || {
  echo "FAIL harness: could not create the stale worktree"; exit 2; }
# A worktree at HEAD -- the shape the cure is supposed to produce.
git -C "$main" worktree add --detach -q "$work/wt-ok" "$head_sha" >/dev/null 2>&1 || {
  echo "FAIL harness: could not create the current worktree"; exit 2; }
# An unrelated repo -- shares no root, so it is divergent rather than merely behind.
alien="$work/alien"
mkdir -p "$alien" && git -C "$alien" init -q >/dev/null 2>&1
printf 'alien\n' > "$alien/g.txt"; commit_all "$alien" 'unrelated root'
# A plain directory that is not a repo at all.
mkdir -p "$work/notrepo"

# The guard resolves its coordinator ref with a BARE `git rev-parse`, so it reads the caller's cwd --
# every case therefore runs from inside $main, exactly as a coordinator would run it from its own
# checkout. Verified rather than assumed: a case that silently ran from the wrong cwd would compare
# this repo's history to a fixture worktree and fail for a reason that has nothing to do with the guard.
g() { # g <worktree-path> <coordinator-ref>
  sh -c "cd \"$main\" && sh \"$script_tmp\" \"$1\" \"$2\""
}

fail=0

# --- case 1: coordinator ref does not resolve ----------------------------------------------------
# Ordering matters and is asserted here: the guard resolves the COORDINATOR side first, so a broken
# invocation reports itself as a broken invocation. Were the worktree read first, this same call
# would report a stale/divergent base -- naming the wrong culprit and sending the reader to the wrong
# fix, which is precisely what L-091 forbids a guard from doing.
run_case_firstline "coord-ref-unresolvable" 2 "FAIL worktree-base-unresolved" -- \
  g "$work/wt-ok" "zzz-no-such-ref"

# --- case 2: the worktree path does not exist ----------------------------------------------------
run_case_firstline "worktree-path-missing" 2 "FAIL worktree-base-missing" -- \
  g "$work/nonexistent" "$head_sha"

# --- case 3: the path exists but is not a git checkout -------------------------------------------
# Distinct from case 2 on purpose: "the directory is not there" and "the directory is there but has
# no HEAD" have different causes (a bad path vs a hook that made a directory and no checkout), and a
# guard that collapsed them would send half its readers to the wrong place.
run_case_firstline "worktree-not-a-checkout" 2 "FAIL worktree-base-unreadable" -- \
  g "$work/notrepo" "$head_sha"

# --- case 4: THE TD-054 DEFECT -- a worktree genuinely behind the coordinator ---------------------
# The case the guard exists for. Asserting the named finding alone would pass on a guard that
# reported every base as stale, so the distance is asserted too: 2 commits, derived from the fixture
# rather than hardcoded to a sha.
run_case_firstline "stale-base-two-behind" 1 "FAIL worktree-base-stale" -- \
  g "$work/wt-stale" "$head_sha"
run_case_firstline "stale-base-names-the-distance" 1 "2 commit(s) behind" -- \
  g "$work/wt-stale" "$head_sha"

# --- case 5: an unrelated base, which is not "behind" anything -----------------------------------
# Guards the distance arm from the runaway it would otherwise hit: `git rev-list --count A..B` across
# unrelated roots reports a number that reads like a commit distance and means nothing. Reported as
# divergent + do-not-merge instead.
run_case_firstline "divergent-unrelated-root" 1 "FAIL worktree-base-divergent" -- \
  g "$alien" "$head_sha"

# --- case 6: positive control -- a worktree at the coordinator's HEAD passes ----------------------
run_case_firstline "current-base-passes" 0 "PASS worktree-base" -- \
  g "$work/wt-ok" "$head_sha"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "WORKTREE-BASE FIXTURES: all green"
else
  echo "WORKTREE-BASE FIXTURES: FAILURES ABOVE"
fi
exit "$fail"
