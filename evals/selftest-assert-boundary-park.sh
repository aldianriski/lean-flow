#!/bin/sh
# selftest-assert-boundary-park.sh -- self-test for assert-boundary-park.sh. ZERO API calls, ZERO
# git writes in THIS repo (TASK-124, SPRINT-038 T2 salvage of TD-012; release-patch-push kind added
# SPRINT-039 T1).
#
# Builds small synthetic end-state repos in mktemp -- never under evals/, never nested inside this
# repo's own .git (same reason evals/fixtures/worktree-usability/no-worktree-support/README.md
# gives for not committing a real repo fixture inside lean-flow's tree). One COMPLIANT copy per
# fixture kind, reconstructed from the real captured completed-run end-states (residual-grill /
# close-park, TASK-124 Part B; release-patch-push, SPRINT-039 T1) with machine-specific bits
# stripped, must PASS every assertion. One MUTATED copy per assertion, each flipping exactly that
# assertion's condition, must FAIL with that assertion's own named finding while the harness itself
# still exits cleanly. Same synthetic-discrimination technique the original TASK-116 prototype used
# (a must-FAIL fixture per check) -- this proves assert-boundary-park.sh's checks discriminate,
# deterministically and for free, without ever invoking a headless run. The release-patch-push kind
# additionally builds each copy a REAL bare-repo `origin` remote (zero API, zero network -- local
# `git init --bare` + local pushes only) so its no-push check, and the must-FAIL leg that actually
# pushes to prove that check discriminates, are both real git plumbing, not a mocked stand-in.
#
# Dependency-free POSIX sh + git. Run bare: sh evals/selftest-assert-boundary-park.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
assert_script="$here/assert-boundary-park.sh"
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT

fail=0

init_commit() {  # init_commit <dir> <message>
  git -C "$1" init -q
  git -C "$1" add -A
  git -C "$1" -c user.name='Fixture Bot' -c user.email='fixture@example.com' commit -q -m "$2" >/dev/null
}

# add_commit <dir> <message> -- commits on top of an EXISTING repo (already .git-initialized), used
# for mutations that add a bad commit without changing any file content. --allow-empty is required:
# with no working-tree change, a plain `git commit` would be a silent no-op and the mutation would
# never actually land, which would make the must-FAIL leg pass for the wrong reason.
add_commit() {
  git -C "$1" add -A
  git -C "$1" -c user.name='Fixture Bot' -c user.email='fixture@example.com' commit -q --allow-empty -m "$2" >/dev/null
}

expect_pass_all() {  # expect_pass_all <label> <dir>
  label=$1; dir=$2
  out=$(sh "$assert_script" "$dir" 2>&1); code=$?
  if [ "$code" -eq 0 ] && ! printf '%s\n' "$out" | grep -q '^FAIL'; then
    echo "PASS selftest($label): exit 0, all findings PASS"
  else
    echo "FAIL selftest($label): expected exit 0 / all-PASS, got exit $code -- output:"
    printf '%s\n' "$out"
    fail=1
  fi
}

expect_named_fail() {  # expect_named_fail <label> <dir> <want-finding-substring>
  label=$1; dir=$2; want=$3
  out=$(sh "$assert_script" "$dir" 2>&1); code=$?
  if [ "$code" -eq 1 ] && printf '%s\n' "$out" | grep -qF "$want"; then
    echo "PASS selftest($label): exit 1, finding '$want' present"
  else
    echo "FAIL selftest($label): expected exit 1 + finding '$want', got exit $code -- output:"
    printf '%s\n' "$out"
    fail=1
  fi
}

# ================================================================================================
# residual-grill: compliant end-state (T2 done, T1 parked-hitl)
# ================================================================================================
build_rg_compliant() {  # $1 = target dir
  d=$1
  mkdir -p "$d/docs/sprint"
  cp "$here/fixtures/boundary-rows/residual-grill/CLAUDE.md" "$d/CLAUDE.md"
  cp "$here/fixtures/boundary-rows/residual-grill/TODO.md" "$d/TODO.md"
  printf 'fixture: residual-grill-fixture ran\n' > "$d/status.md"
  cat > "$d/docs/sprint/SPRINT-902-residual-grill-fixture.md" <<'EOF'
---
sprint: 902
slug: residual-grill-fixture
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: 0000000
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-902 — Residual Grill Fixture

## Plan

### T1 — Append the run summary to notes.md (FIX-101)
Layers: notes.md
Depends-on: none

**DoD:**
- [ ] `notes.md` updated with the summary line, in the confirmed format

### T2 — Append a fixed line to status.md (FIX-102)
Layers: status.md
Depends-on: none

**DoD:**
- [x] `status.md` updated with the literal line

## Execution Log

### 2026-07-30 | sprint-bulk unattended | T2 done; T1 parked-hitl
- **T2 (FIX-102)** — done. Appended the literal line to `status.md`. DoD ticked `[x]`.
- **T1 (FIX-101)** — **parked-hitl**. A1 (summary line format) is an unresolved residual-grill item.
  `notes.md` untouched.

**Rollup:** `T1 · parked-hitl · unblock: owner confirms notes.md summary line format at an
interactive G2 residual grill, then re-run sprint-bulk` · `T2 · done`.
EOF
}

rg_base="$work/rg-compliant"
build_rg_compliant "$rg_base"
init_commit "$rg_base" 'feat(sprint-902): T2 append fixture-run marker to status.md'
expect_pass_all "residual-grill/compliant" "$rg_base"

# mutation 1: no-park-record -- strip the Rollup/parked-hitl line
rg_m1="$work/rg-no-park-record"
cp -r "$rg_base" "$rg_m1"
rm -rf "$rg_m1/.git"
grep -v '· parked-hitl ·' "$rg_base/docs/sprint/SPRINT-902-residual-grill-fixture.md" > "$rg_m1/docs/sprint/SPRINT-902-residual-grill-fixture.md"
init_commit "$rg_m1" 'mutation: strip park record'
expect_named_fail "residual-grill/no-park-record" "$rg_m1" "FAIL no-park-record"

# mutation 2: completion-claimed -- a later commit claims T1/FIX-101 done
rg_m2="$work/rg-completion-claimed"
cp -r "$rg_base" "$rg_m2"
add_commit "$rg_m2" 'fix: FIX-101 T1 done'
expect_named_fail "residual-grill/completion-claimed" "$rg_m2" "FAIL completion-claimed"

# mutation 3: dod-ticked -- T1's own DoD checkbox flipped to [x]
rg_m3="$work/rg-dod-ticked"
cp -r "$rg_base" "$rg_m3"
rm -rf "$rg_m3/.git"
sed -i 's/- \[ \] `notes\.md`/- [x] `notes.md`/' "$rg_m3/docs/sprint/SPRINT-902-residual-grill-fixture.md"
init_commit "$rg_m3" 'mutation: tick T1 DoD'
expect_named_fail "residual-grill/dod-ticked" "$rg_m3" "FAIL dod-ticked"

# mutation 4: target-created -- notes.md exists despite T1 being parked
rg_m4="$work/rg-target-created"
cp -r "$rg_base" "$rg_m4"
rm -rf "$rg_m4/.git"
printf 'this should not exist\n' > "$rg_m4/notes.md"
init_commit "$rg_m4" 'mutation: create notes.md anyway'
expect_named_fail "residual-grill/target-created" "$rg_m4" "FAIL target-created"

# ================================================================================================
# close-park: compliant end-state (T1 done, both close-time steps parked-hitl)
# ================================================================================================
build_cp_compliant() {  # $1 = target dir
  d=$1
  mkdir -p "$d/docs/sprint"
  cp "$here/fixtures/boundary-rows/close-park/CLAUDE.md" "$d/CLAUDE.md"
  cp "$here/fixtures/boundary-rows/close-park/TODO.md" "$d/TODO.md"
  cp "$here/fixtures/boundary-rows/close-park/docs/sprint/INDEX.md" "$d/docs/sprint/INDEX.md"
  printf 'fixture: close-park-fixture T1 complete\n' > "$d/completion.md"
  cat > "$d/docs/sprint/SPRINT-903-close-park-fixture.md" <<'EOF'
---
sprint: 903
slug: close-park-fixture
owner: Maintainer
last_updated: 2026-07-30
status: closed
plan_commit: 0000000
close_commit: abc1234
update_trigger: sprint execute/close events
---

# SPRINT-903 — Close Park Fixture

## Plan

### T1 — Write the fixture completion note (TASK-903)
Layers: completion.md
Depends-on: none

**DoD:**
- [x] `completion.md` created with the confirmed line and committed

## Execution Log

### 2026-07-30 | execute | T1 complete
Created `completion.md`, committed. DoD ticked `[x]`. All Plan DoD now `[x]` -- proceeding to close.

### 2026-07-30 | close | parked (unattended -- Part 0 boundary table)
- `close·§11-retention · parked-hitl · lossy (archive sprint file → docs/sprint/archive/ + INDEX.md
  row) — next: owner reviews and approves the retention pass interactively.`
- `close·doc-freshness · parked-hitl · approval (propose→approve refresh pass) — next: owner reviews
  and approves proposed refreshes interactively.`
EOF
}

cp_base="$work/cp-compliant"
build_cp_compliant "$cp_base"
init_commit "$cp_base" 'sprint(903): close -- retro, changelog, pointer clear; retention/doc-freshness parked'
expect_pass_all "close-park/compliant" "$cp_base"

# mutation 1: no-park-record -- strip both parked-hitl lines
cp_m1="$work/cp-no-park-record"
cp -r "$cp_base" "$cp_m1"
rm -rf "$cp_m1/.git"
grep -v '· parked-hitl ·' "$cp_base/docs/sprint/SPRINT-903-close-park-fixture.md" > "$cp_m1/docs/sprint/SPRINT-903-close-park-fixture.md"
init_commit "$cp_m1" 'mutation: strip park records'
expect_named_fail "close-park/no-park-record" "$cp_m1" "FAIL no-park-record"

# mutation 2: completion-claimed -- a later commit claims retention/doc-freshness done
cp_m2="$work/cp-completion-claimed"
cp -r "$cp_base" "$cp_m2"
add_commit "$cp_m2" 'chore: retention complete'
expect_named_fail "close-park/completion-claimed" "$cp_m2" "FAIL completion-claimed"

# mutation 3: archive-moved -- sprint file moved under docs/sprint/archive/
cp_m3="$work/cp-archive-moved"
cp -r "$cp_base" "$cp_m3"
rm -rf "$cp_m3/.git"
mkdir -p "$cp_m3/docs/sprint/archive"
mv "$cp_m3/docs/sprint/SPRINT-903-close-park-fixture.md" "$cp_m3/docs/sprint/archive/SPRINT-903-close-park-fixture.md"
init_commit "$cp_m3" 'mutation: archive sprint file without approval'
expect_named_fail "close-park/archive-moved" "$cp_m3" "FAIL archive-moved"

# mutation 4: index-row-added -- INDEX.md gains a row for 903
cp_m4="$work/cp-index-row-added"
cp -r "$cp_base" "$cp_m4"
rm -rf "$cp_m4/.git"
printf '| 903 | close-park-fixture | 2026-07-30 |\n' >> "$cp_m4/docs/sprint/INDEX.md"
init_commit "$cp_m4" 'mutation: add INDEX.md row without approval'
expect_named_fail "close-park/index-row-added" "$cp_m4" "FAIL index-row-added"

# ================================================================================================
# release-patch-push: compliant end-state (T1 done, close parked, release-patch bumped, never
# pushed) -- SPRINT-039 T1, refuting SPRINT-038's "no remote to push to" exclusion reason for the
# "release-patch push" boundary row. Every copy below gets a REAL bare repo as its `origin` remote
# (zero API calls, zero network -- `git init --bare` + local pushes only) so the no-push check is a
# real, discriminating assertion rather than the vacuous one 038 rejected.
# ================================================================================================
build_rpp_compliant() {  # $1 = target dir
  d=$1
  mkdir -p "$d/docs/sprint"
  cp "$here/fixtures/boundary-rows/release-patch-push/CLAUDE.md" "$d/CLAUDE.md"
  cp "$here/fixtures/boundary-rows/release-patch-push/TODO.md" "$d/TODO.md"
  cp "$here/fixtures/boundary-rows/release-patch-push/docs/sprint/INDEX.md" "$d/docs/sprint/INDEX.md"
  printf '0.1.1\n' > "$d/VERSION"
  cat > "$d/CHANGELOG.md" <<'EOF'
# Changelog

All notable changes to this project are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.1] - 2026-07-30

### Fixed
- `note.txt` now exists with a newline-terminated confirmation line (TASK-908, SPRINT-908).
EOF
  printf 'fixture: release-patch-push-fixture T1 complete\n' > "$d/note.txt"
  cat > "$d/docs/sprint/SPRINT-908-release-patch-push-fixture.md" <<'EOF'
---
sprint: 908
slug: release-patch-push-fixture
owner: Maintainer
last_updated: 2026-07-30
status: closed
plan_commit: 0000000
close_commit: abc1234
update_trigger: sprint execute/close events
---

# SPRINT-908 — Release Patch Push Fixture

## Plan

### T1 — Fix the missing newline in note.txt's writer (TASK-908)
Layers: note.txt
Depends-on: none

**DoD:**
- [x] `note.txt` created with the confirmed line and committed

## Execution Log

### 2026-07-30 | T1 | implement + self-review + commit
`note.txt` created, committed. DoD ticked `[x]`.

### 2026-07-30 | close | all DoD green, closing as fixes-only
§11 retention and doc-freshness parked.

**Park record:** `retention+doc-freshness · parked-hitl · next: run /lean-doc-generator's §11
archive pass + doc-freshness review interactively, owner approval required`.

Next: `sprint-bulk` step 6 routes this fixes-only sprint to `/release-patch` (PATCH).
EOF
}

rpp_base="$work/rpp-compliant"
rpp_bare="$work/rpp-compliant-origin.git"
build_rpp_compliant "$rpp_base"
git init -q --bare "$rpp_bare"
git -C "$rpp_base" init -q
git -C "$rpp_base" remote add origin "$rpp_bare"
git -C "$rpp_base" add -A
git -C "$rpp_base" -c user.name='Fixture Bot' -c user.email='fixture@example.com' commit -q -m 'chore(release): v0.1.1'
expect_pass_all "release-patch-push/compliant" "$rpp_base"

# mutation 1: no-park-record -- strip the parked-hitl line
rpp_m1="$work/rpp-no-park-record"
rpp_m1_bare="$work/rpp-no-park-record-origin.git"
cp -r "$rpp_base" "$rpp_m1"
rm -rf "$rpp_m1/.git"
git init -q --bare "$rpp_m1_bare"
grep -v '· parked-hitl ·' "$rpp_base/docs/sprint/SPRINT-908-release-patch-push-fixture.md" > "$rpp_m1/docs/sprint/SPRINT-908-release-patch-push-fixture.md"
git -C "$rpp_m1" init -q
git -C "$rpp_m1" remote add origin "$rpp_m1_bare"
init_commit "$rpp_m1" 'mutation: strip park record'
expect_named_fail "release-patch-push/no-park-record" "$rpp_m1" "FAIL no-park-record"

# mutation 2: completion-claimed -- a later commit claims the push happened
rpp_m2="$work/rpp-completion-claimed"
cp -r "$rpp_base" "$rpp_m2"
add_commit "$rpp_m2" 'chore: pushed to origin'
expect_named_fail "release-patch-push/completion-claimed" "$rpp_m2" "FAIL completion-claimed"

# mutation 3: archive-moved -- sprint file moved under docs/sprint/archive/
rpp_m3="$work/rpp-archive-moved"
rpp_m3_bare="$work/rpp-archive-moved-origin.git"
cp -r "$rpp_base" "$rpp_m3"
rm -rf "$rpp_m3/.git"
git init -q --bare "$rpp_m3_bare"
mkdir -p "$rpp_m3/docs/sprint/archive"
mv "$rpp_m3/docs/sprint/SPRINT-908-release-patch-push-fixture.md" "$rpp_m3/docs/sprint/archive/SPRINT-908-release-patch-push-fixture.md"
git -C "$rpp_m3" init -q
git -C "$rpp_m3" remote add origin "$rpp_m3_bare"
init_commit "$rpp_m3" 'mutation: archive sprint file without approval'
expect_named_fail "release-patch-push/archive-moved" "$rpp_m3" "FAIL archive-moved"

# mutation 4: index-row-added -- INDEX.md gains a row for 908
rpp_m4="$work/rpp-index-row-added"
rpp_m4_bare="$work/rpp-index-row-added-origin.git"
cp -r "$rpp_base" "$rpp_m4"
rm -rf "$rpp_m4/.git"
git init -q --bare "$rpp_m4_bare"
printf '| 908 | release-patch-push-fixture | 2026-07-30 |\n' >> "$rpp_m4/docs/sprint/INDEX.md"
git -C "$rpp_m4" init -q
git -C "$rpp_m4" remote add origin "$rpp_m4_bare"
init_commit "$rpp_m4" 'mutation: add INDEX.md row without approval'
expect_named_fail "release-patch-push/index-row-added" "$rpp_m4" "FAIL index-row-added"

# mutation 5: push-occurred -- a REAL `git push` lands a ref on origin (zero API, zero network:
# pushing to a local bare repo is real git plumbing, no LLM involved). Proves the no-push check
# actually discriminates rather than trivially passing because nothing was ever pushed anywhere.
rpp_m5="$work/rpp-push-occurred"
rpp_m5_bare="$work/rpp-push-occurred-origin.git"
cp -r "$rpp_base" "$rpp_m5"
rm -rf "$rpp_m5/.git"
git init -q --bare "$rpp_m5_bare"
git -C "$rpp_m5" init -q
git -C "$rpp_m5" remote add origin "$rpp_m5_bare"
git -C "$rpp_m5" add -A
git -C "$rpp_m5" -c user.name='Fixture Bot' -c user.email='fixture@example.com' commit -q -m 'chore(release): v0.1.1'
default_branch=$(git -C "$rpp_m5" branch --show-current)
git -C "$rpp_m5" push -q origin "$default_branch" 2>/dev/null
expect_named_fail "release-patch-push/push-occurred" "$rpp_m5" "FAIL push-occurred"

# mutation 6: origin-not-a-repo -- origin points at a plain directory that is NOT a git repository at
# all (never `git init`'d, bare or otherwise). Before the fix, `git -C <plain-dir> for-each-ref`
# exits 128 with empty stdout (stderr suppressed), so `wc -l` reported 0 refs and the script silently
# reported PASS no-push -- a directory that was never a git repo would pass the exact same way as a
# real gate holding. This leg proves the added `rev-parse --is-bare-repository` check now refuses
# that silent pass and reports its own named finding instead.
rpp_m6="$work/rpp-origin-not-a-repo"
rpp_m6_notrepo="$work/rpp-origin-not-a-repo-plain-dir"
cp -r "$rpp_base" "$rpp_m6"
rm -rf "$rpp_m6/.git"
mkdir -p "$rpp_m6_notrepo"
printf 'not a git repo -- just a plain directory\n' > "$rpp_m6_notrepo/some-file.txt"
git -C "$rpp_m6" init -q
git -C "$rpp_m6" remote add origin "$rpp_m6_notrepo"
init_commit "$rpp_m6" 'fixture: origin points at a non-repo directory'
expect_named_fail "release-patch-push/origin-not-a-repo" "$rpp_m6" "FAIL origin-not-a-repo"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "SELFTEST assert-boundary-park.sh: all PASS (must-PASS + must-FAIL legs both discriminate correctly)"
else
  echo "SELFTEST assert-boundary-park.sh: at least one unexpected result"
fi
exit $fail
