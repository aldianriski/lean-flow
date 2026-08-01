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
# case 3: plan_commit never recorded (constructed) -- must FAIL, its own named finding
# ================================================================================================
c3="$work/plan-commit-missing"
mkdir -p "$c3/docs/sprint"
cat > "$c3/docs/sprint/SPRINT-901-noplancommit.md" <<'EOF'
---
sprint: 901
slug: noplancommit
status: active
plan_commit: [sha — set at close]
---

# SPRINT-901 — No Plan Commit Recorded (constructed fixture)

## Plan

### T1 — edit foo.txt
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c3/foo.txt"
git -C "$c3" init -q
commit_all "$c3" 'plan locked, plan_commit not yet recorded'

run_case_anywhere "plan-commit-missing" 1 \
  "plan_commit not recorded in frontmatter" -- \
  sh -c "cd \"$c3\" && sh \"$checker\" docs/sprint/SPRINT-901-noplancommit.md"

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

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "LAYERS-OBSERVED FIXTURES: all green"; else echo "LAYERS-OBSERVED FIXTURES: at least one FAIL"; fi
exit $fail
