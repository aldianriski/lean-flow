#!/bin/sh
# run-layers-observed-fixtures.sh -- must-FAIL/must-PASS fixtures for scripts/lib/check-layers-
# observed.sh, the checker qa-check.sh's leg 15 delegates to (TD-022, L-074, SPRINT-043 T1).
#
# check-layers-completeness.sh (leg 14) derives its second source from DoD/Acceptance prose written
# at promote time -- and SPRINT-042 T3 defeated it the day it shipped: the task created
# scripts/lib/check-layers-completeness.sh, a file its own DoD prose never named because a DoD
# written at promote cannot name a file invented during implementation. Case 1 below reconstructs
# that exact miss -- SPRINT-042 T3's real declared `Layers:` (scripts/qa-check.sh · docs/QA.md ·
# evals/run-layers-completeness-fixtures.sh · TECH-DEBT.md) and the real undeclared file it created.
# That is a recorded miss, not an invented one. The remaining cases have no recorded incident to
# reconstruct, so they are small constructed Plans, labeled as such.
#
# Per the coordinator design decision (SPRINT-043 T1): fixtures are BUILT by this harness, not
# stored as files under evals/fixtures/ -- the checker's whole subject is a real git diff, so its
# fixtures need real git history, built in throwaway repos under mktemp -d + git init, same idiom
# evals/selftest-assert-*.sh already uses. Retention (L-058) is satisfied by these fixtures living
# permanently in this retained harness file.
#
# Dependency-free POSIX sh + git. Run bare: sh evals/run-layers-observed-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-layers-observed.sh"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }

work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT
# On Windows/MSYS, git.exe's own `-C <path>` chdir sometimes fails to resolve the POSIX-style path
# mktemp returns (`/d/tmp/...`) -- "cannot change to '/d/tmp/...': No such file or directory" -- even
# though the shell's own cd/mkdir handle that exact path fine (a git.exe-vs-shell path-resolution
# mismatch, reproduced directly: `git -C /d/tmp/x init` fails, `git -C D:/tmp/x init` succeeds).
# Every case below builds its dir as "$work/<name>" then drives it via `git -C`, so normalizing once
# here to the Windows-style form makes all of them safe. `pwd -W` is unsupported (silently, since we
# discard stderr) on non-MSYS POSIX, where the original path already works with `-C` -- no-op there.
if wwork=$(cd "$work" && pwd -W 2>/dev/null) && [ -n "$wwork" ]; then work=$wwork; fi

fail=0

commit_all() {  # commit_all <dir> <message> -- stage everything, commit with a fixed fixture identity
  git -C "$1" add -A
  git -C "$1" -c user.name='Fixture Bot' -c user.email='fixture@example.com' commit -q -m "$2" >/dev/null
}

# lock_plan <dir> -- mirrors this repo's own two-commit plan-lock sequence (see
# docs/sprint/SPRINT-043-proof-run.md's history: "plan locked" then a separate "record plan_commit
# sha" commit). Commit 1 freezes the Plan; commit 2 patches the sprint file's own `plan_commit:`
# field to point at commit 1 -- so the sprint file's frontmatter never has to know its own sha. The
# second commit only touches the sprint file (docs/sprint/*, itself excluded), so it never becomes
# a false-positive undeclared change. Sets $sha0 to commit 1's sha.
lock_plan() {
  d=$1; sprint_rel=$2
  commit_all "$d" 'plan locked'
  sha0=$(git -C "$d" rev-parse HEAD)
  sed_i="s/PLAN_COMMIT_PLACEHOLDER/$sha0/"
  # sed -i portably (BSD vs GNU) -- write to a temp file then move, avoids the -i suffix argument split
  sed "$sed_i" "$d/$sprint_rel" > "$d/$sprint_rel.tmp" && mv "$d/$sprint_rel.tmp" "$d/$sprint_rel"
  commit_all "$d" 'record plan_commit sha'
}

# ================================================================================================
# case 1: SPRINT-042 T3 reconstructed -- real Layers:, real undeclared file (must FAIL)
# ================================================================================================
c1="$work/sprint-042-reconstructed"
mkdir -p "$c1/docs/sprint" "$c1/scripts"
cat > "$c1/docs/sprint/SPRINT-042-run-to-finish.md" <<'EOF'
---
sprint: 042
slug: run-to-finish
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-042 — Run to Finish (reconstructed fixture)

## Plan

### T3 — Cross-check a Plan's declared Layers against what its DoD implies
Layers: `scripts/qa-check.sh` · `docs/QA.md` · `evals/run-layers-completeness-fixtures.sh` · `TECH-DEBT.md`
Depends-on: none

**DoD:**
- [ ] leg cross-checks declared Layers against DoD-implied files
EOF
printf 'echo qa\n' > "$c1/scripts/qa-check.sh"
git -C "$c1" init -q
lock_plan "$c1" 'docs/sprint/SPRINT-042-run-to-finish.md'
# implementation: the real undeclared file T3 actually created, plus a real edit to a declared file
mkdir -p "$c1/scripts/lib"
printf 'echo checker\n' > "$c1/scripts/lib/check-layers-completeness.sh"
printf 'echo qa v2\n' > "$c1/scripts/qa-check.sh"
commit_all "$c1" 'feat(qa-check): T3 leg 14 implementation'

run_case_anywhere "sprint-042-reconstructed" 1 \
  "changed but undeclared in any task's Layers::" -- \
  sh -c "cd \"$c1\" && sh \"$checker\" docs/sprint/SPRINT-042-run-to-finish.md"
run_case_anywhere "sprint-042-reconstructed (names the file)" 1 \
  "scripts/lib/check-layers-completeness.sh" -- \
  sh -c "cd \"$c1\" && sh \"$checker\" docs/sprint/SPRINT-042-run-to-finish.md"

# ================================================================================================
# case 2: declaration matches the real diff (constructed) -- must PASS
# ================================================================================================
c2="$work/matching-declaration"
mkdir -p "$c2/docs/sprint"
cat > "$c2/docs/sprint/SPRINT-900-matching.md" <<'EOF'
---
sprint: 900
slug: matching
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-900 — Matching Declaration (constructed fixture)

## Plan

### T1 — edit two declared files
Layers: `foo.txt` · `bar.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt and bar.txt updated
EOF
printf 'a\n' > "$c2/foo.txt"
printf 'b\n' > "$c2/bar.txt"
git -C "$c2" init -q
lock_plan "$c2" 'docs/sprint/SPRINT-900-matching.md'
printf 'a2\n' >> "$c2/foo.txt"
printf 'b2\n' >> "$c2/bar.txt"
commit_all "$c2" 'implement T1'

run_case_anywhere "matching-declaration" 0 \
  "layers observed (all changed files declared" -- \
  sh -c "cd \"$c2\" && sh \"$checker\" docs/sprint/SPRINT-900-matching.md"

# ================================================================================================
# case 3: plan_commit still holds the promote-time placeholder (constructed) -- must SKIP, named,
# never a bare `skip` and never a FAIL (TD-026, SPRINT-045 T2). The two-commit sprint convention
# (see lock_plan() above) always has a real window where "plan locked" has landed but the follow-up
# "record plan_commit sha" commit hasn't -- the frontmatter still literally reads the bracketed
# placeholder below. That is a known-good, expected transient, not a defect, so it must not report
# as a FAIL (the old behaviour, which cried wolf on a state that always exists). Distinguished from
# genuinely-absent (case 3b below) because the placeholder is a non-empty string containing `[`,
# while a field that was never filled in resolves to true emptiness -- see check-layers-observed.sh
# comment above its plan_commit case statement for the mechanism.
# ================================================================================================
c3="$work/plan-commit-placeholder"
mkdir -p "$c3/docs/sprint"
cat > "$c3/docs/sprint/SPRINT-901-placeholder.md" <<'EOF'
---
sprint: 901
slug: placeholder
status: active
plan_commit: [sha — set at promote]
---

# SPRINT-901 — Plan Commit Still Placeholder (constructed fixture)

## Plan

### T1 — edit foo.txt
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c3/foo.txt"
git -C "$c3" init -q
commit_all "$c3" 'plan locked, plan_commit not yet recorded (placeholder window)'

run_case_anywhere "plan-commit-placeholder" 0 \
  "plan_commit still holds the promote-time placeholder" -- \
  sh -c "cd \"$c3\" && sh \"$checker\" docs/sprint/SPRINT-901-placeholder.md"

# ================================================================================================
# case 3b: plan_commit field genuinely absent -- never carried a value at all (constructed) -- must
# still FAIL, its own named finding (TD-026's must-not-weaken leg, D4). Distinct from case 3: here
# the frontmatter key is present but empty (fmv() returns true emptiness, no bracket, nothing to
# mistake for a known placeholder), reproducing "a task promoted without ever wiring plan_commit in"
# rather than the always-expected two-commit window.
# ================================================================================================
c3b="$work/plan-commit-genuinely-absent"
mkdir -p "$c3b/docs/sprint"
cat > "$c3b/docs/sprint/SPRINT-904-absent.md" <<'EOF'
---
sprint: 904
slug: absent
status: active
plan_commit:
---

# SPRINT-904 — Plan Commit Genuinely Absent (constructed fixture)

## Plan

### T1 — edit foo.txt
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c3b/foo.txt"
git -C "$c3b" init -q
commit_all "$c3b" 'plan locked, plan_commit field never wired in'

run_case_anywhere "plan-commit-genuinely-absent" 1 \
  "plan_commit not recorded in frontmatter" -- \
  sh -c "cd \"$c3b\" && sh \"$checker\" docs/sprint/SPRINT-904-absent.md"

# ================================================================================================
# case 4: coordinator close-bookkeeping files change but stay unflagged (constructed) -- must PASS.
# Exercises BOTH observed-change paths at once: foo.txt is a tracked-but-uncommitted edit, and
# docs/sprint/INDEX.md is a brand-new UNTRACKED file (git ls-files --others), the exact shape of "a
# file created during implementation and never declared" when the gate runs mid-flight.
# ================================================================================================
c4="$work/coordinator-exclusion-safe"
mkdir -p "$c4/docs/sprint"
cat > "$c4/docs/sprint/SPRINT-905-exclusion.md" <<'EOF'
---
sprint: 905
slug: exclusion
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-905 — Coordinator Exclusion Safety (constructed fixture)

## Plan

### T1 — edit foo.txt only
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c4/foo.txt"
printf '# TD\n' > "$c4/TECH-DEBT.md"
git -C "$c4" init -q
lock_plan "$c4" 'docs/sprint/SPRINT-905-exclusion.md'
printf 'a2\n' >> "$c4/foo.txt"                                    # tracked, uncommitted, declared
printf 'TD-099 resolved\n' >> "$c4/TECH-DEBT.md"                  # tracked, uncommitted, excluded
printf '| 905 | exclusion | 2026-08-01 |\n' > "$c4/docs/sprint/INDEX.md"  # untracked, excluded

run_case_anywhere "coordinator-exclusion-safe" 0 \
  "layers observed (all changed files declared" -- \
  sh -c "cd \"$c4\" && sh \"$checker\" docs/sprint/SPRINT-905-exclusion.md"

# ================================================================================================
# case 5: sprint file path does not exist on disk (constructed) -- must FAIL, its own named finding.
# This is the checker's very first guard (`[ -f "$sp" ]`), before any git command runs, so the
# throwaway repo below never even needs a commit -- it exists only so the fixture follows the same
# "runs inside a git work tree" shape as every other case in this harness.
# ================================================================================================
c5="$work/file-not-found"
mkdir -p "$c5"
git -C "$c5" init -q

run_case_anywhere "file-not-found" 1 \
  "layers observed: file not found: docs/sprint/SPRINT-902-missing.md" -- \
  sh -c "cd \"$c5\" && sh \"$checker\" docs/sprint/SPRINT-902-missing.md"

# ================================================================================================
# case 6: plan_commit is recorded but does not resolve to a commit (constructed) -- must FAIL, its
# own named finding. Distinct from case 3 (empty/placeholder plan_commit): here the field holds a
# non-empty, non-placeholder string that still fails `git rev-parse --verify` because no such commit
# (or ref) was ever created in this throwaway repo.
# ================================================================================================
c6="$work/plan-commit-unresolvable"
mkdir -p "$c6/docs/sprint"
cat > "$c6/docs/sprint/SPRINT-903-badsha.md" <<'EOF'
---
sprint: 903
slug: badsha
status: active
plan_commit: totally-bogus-not-a-sha
---

# SPRINT-903 — Plan Commit Does Not Resolve (constructed fixture)

## Plan

### T1 — edit foo.txt
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c6/foo.txt"
git -C "$c6" init -q
commit_all "$c6" 'sprint file references a plan_commit that was never actually committed'

run_case_anywhere "plan-commit-unresolvable" 1 \
  "plan_commit 'totally-bogus-not-a-sha' does not resolve to a commit" -- \
  sh -c "cd \"$c6\" && sh \"$checker\" docs/sprint/SPRINT-903-badsha.md"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "LAYERS-OBSERVED FIXTURES: all green"; else echo "LAYERS-OBSERVED FIXTURES: at least one FAIL"; fi
exit $fail
