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
# SPRINT-074 T3 changed the clean verdict for a tree that still has real uncommitted work: it is now
# a named SKIP rather than a PASS, because that leg checks the all-task union while the committed leg
# attributes per task (TD-037). Four cases below expect `layers observed [WIP, unattributed]` for
# that reason -- they deliberately leave a declared, uncommitted edit in the tree while testing an
# EXCLUSION, so their subject is unchanged and only the verdict token moved. Their strength is
# unchanged too: `run_case_anywhere ... 0` still means no FAIL line was produced, which is what those
# cases were ever asserting. The two remaining `(all changed files declared` expectations are trees
# with nothing uncommitted, which still earn a plain PASS.
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

# --- case 0: bare invocation (no sprint files) -- must-note, exit 0 (TD-056, SPRINT-069 T4) -------
# Previously `for sp in "$@"` over an empty arg list printed nothing and exited 0 -- a silent pass
# indistinguishable from a real clean run. This proves the guard fires: run the checker with zero
# arguments and require the "nothing verified" note, at exit 0 (never non-zero -- the guarded
# siblings note at exit 0, and qa-check.sh always supplies arguments so this leg never touches the
# gate path). No throwaway git repo needed -- the guard returns before any git command runs.
run_case_anywhere "bare-invocation-notes-nothing-verified" 0 \
  "layers observed: no sprint files given -- nothing verified" -- \
  sh "$checker"

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
# SPRINT-042 T3's REAL commit subject (e01d782), not a paraphrase: attribution reads the subject, so
# a fixture using an invented message would test a form this repo never produces (SPRINT-049 T1).
commit_all "$c1" 'feat(qa-check): cross-check declared Layers against DoD-implied files (SPRINT-042 T3)'

# Finding changed with the attribution redesign: the miss is now reported against the task that made
# it rather than against the union, so it names T3. Still a must-FAIL on the same recorded miss, and
# the file is still named (asserted separately below) -- strictly more information, not less.
run_case_anywhere "sprint-042-reconstructed" 1 \
  "changed by a task that never declared it:" -- \
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
commit_all "$c2" 'sprint(900) T1: implement'

run_case_anywhere "matching-declaration" 0 \
  "layers observed (all changed files declared" -- \
  sh -c "cd \"$c2\" && sh \"$checker\" docs/sprint/SPRINT-900-matching.md"

# ================================================================================================
# case 2b: CROSS-TASK DECLARATION (constructed) -- must FAIL. This is TD-035 itself, and the case
# that passed silently before SPRINT-049 T1. T1 edits a file only T2 declared; under the old union
# check the file was declared by *someone*, so the gate reported green while the ownership map the
# worktree dispatch derives from Layers: was wrong in exactly the way SPRINT-041's corrupted merge
# was wrong. The fixture must name the offending task, not merely fail.
# ================================================================================================
c2b="$work/cross-task-declaration"
mkdir -p "$c2b/docs/sprint"
cat > "$c2b/docs/sprint/SPRINT-908-crosstask.md" <<'EOF'
---
sprint: 908
slug: crosstask
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-908 — Cross-Task Declaration (constructed fixture)

## Plan

### T1 — edit only foo.txt
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated

### T2 — edit only bar.txt
Layers: `bar.txt`
Depends-on: none

**DoD:**
- [ ] bar.txt updated
EOF
printf 'a\n' > "$c2b/foo.txt"
printf 'b\n' > "$c2b/bar.txt"
git -C "$c2b" init -q
lock_plan "$c2b" 'docs/sprint/SPRINT-908-crosstask.md'
printf 'a2\n' >> "$c2b/foo.txt"
printf 'b2\n' >> "$c2b/bar.txt"          # <-- bar.txt is T2's, edited by a T1 commit
commit_all "$c2b" 'sprint(908) T1: edit foo and, wrongly, bar'

run_case_anywhere "cross-task-declaration (fails)" 1 \
  "changed by a task that never declared it:" -- \
  sh -c "cd \"$c2b\" && sh \"$checker\" docs/sprint/SPRINT-908-crosstask.md"
run_case_anywhere "cross-task-declaration (names T1 and the file)" 1 \
  "T1:bar.txt" -- \
  sh -c "cd \"$c2b\" && sh \"$checker\" docs/sprint/SPRINT-908-crosstask.md"

# ================================================================================================
# case 2c: UNATTRIBUTABLE COMMIT (constructed) -- must FAIL. Rule 6 of attribute(). A commit whose
# subject matches no task form and is not `sprint(NN):` coordinator bookkeeping cannot be assigned an
# owner, and five real task commits in this repo's history are exactly that shape. Defaulting them to
# "coordinator" would pass their files silently, rebuilding TD-035 one layer down -- so the fixture
# proves the checker reports rather than absorbs.
# ================================================================================================
c2c="$work/unattributable-commit"
mkdir -p "$c2c/docs/sprint"
cat > "$c2c/docs/sprint/SPRINT-909-unattributed.md" <<'EOF'
---
sprint: 909
slug: unattributed
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-909 — Unattributable Commit (constructed fixture)

## Plan

### T1 — edit foo.txt
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c2c/foo.txt"
git -C "$c2c" init -q
lock_plan "$c2c" 'docs/sprint/SPRINT-909-unattributed.md'
printf 'a2\n' >> "$c2c/foo.txt"
commit_all "$c2c" 'fix(qa): a real change with no task id anywhere in it'

run_case_anywhere "unattributable-commit" 1 \
  "commit attributable to no task and not coordinator bookkeeping:" -- \
  sh -c "cd \"$c2c\" && sh \"$checker\" docs/sprint/SPRINT-909-unattributed.md"

# ================================================================================================
# case 2d: a `Task:` TRAILER attributes a commit whose subject says nothing (constructed) -- must
# PASS. The forward-looking half of ruling R2: case 2c's commit becomes attributable by adding one
# trailer, with no change to the subject line. Without this, the trailer branch of attribute() would
# ship untested and only the regex fallbacks would actually be exercised.
# ================================================================================================
c2d="$work/task-trailer"
mkdir -p "$c2d/docs/sprint"
sed 's/SPRINT-909 — Unattributable Commit/SPRINT-910 — Task Trailer/; s/^sprint: 909/sprint: 910/; s/^slug: unattributed/slug: trailer/' \
  "$c2c/docs/sprint/SPRINT-909-unattributed.md" > "$c2d/docs/sprint/SPRINT-910-trailer.md"
sed -i.bak "s/^plan_commit: .*/plan_commit: PLAN_COMMIT_PLACEHOLDER/" "$c2d/docs/sprint/SPRINT-910-trailer.md" 2>/dev/null || \
  { sed "s/^plan_commit: .*/plan_commit: PLAN_COMMIT_PLACEHOLDER/" "$c2d/docs/sprint/SPRINT-910-trailer.md" > "$c2d/t" && mv "$c2d/t" "$c2d/docs/sprint/SPRINT-910-trailer.md"; }
rm -f "$c2d/docs/sprint/SPRINT-910-trailer.md.bak"
printf 'a\n' > "$c2d/foo.txt"
git -C "$c2d" init -q
lock_plan "$c2d" 'docs/sprint/SPRINT-910-trailer.md'
printf 'a2\n' >> "$c2d/foo.txt"
commit_all "$c2d" 'fix(qa): a real change with no task id in the subject

Task: T1'

run_case_anywhere "task-trailer-attributes" 0 \
  "layers observed (all changed files declared" -- \
  sh -c "cd \"$c2d\" && sh \"$checker\" docs/sprint/SPRINT-910-trailer.md"

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
printf 'TD-099 resolved\n' >> "$c4/TECH-DEBT.md"                  # tracked, uncommitted, close-time
printf '| 905 | exclusion | 2026-08-01 |\n' > "$c4/docs/sprint/INDEX.md"  # untracked, STRUCTURAL

# T3 (TD-044) split this case in two, because the fixture as written could not tell the two kinds of
# exclusion apart. The Plan above has an OPEN DoD, so the sprint is mid-execution -- and a
# close-bookkeeping file edited during execution is task work, not bookkeeping. That is exactly the
# SPRINT-055 T6 shape: a task whose real work was editing TODO.md, invisible for its whole run.
# STRUCTURAL exclusions (docs/sprint/INDEX.md here) still hold in both phases.
run_case_anywhere "closetime-file-during-execution (now reported)" 1 \
  "changed but undeclared in any task's Layers:: TECH-DEBT.md" -- \
  sh -c "cd \"$c4\" && sh \"$checker\" docs/sprint/SPRINT-905-exclusion.md"

# The other phase: the SAME repo, same edits, with the DoD ticked. Zero open DoD == at close, which
# is when "written at close" is actually true -- so TECH-DEBT.md is excluded again and the run is
# clean. Both halves matter: without this one the change would read as "stop excluding close files",
# which would flag every real close and be reverted within a sprint.
sed -i.bak 's/^- \[ \] foo.txt updated/- [x] foo.txt updated/' "$c4/docs/sprint/SPRINT-905-exclusion.md"
rm -f "$c4/docs/sprint/SPRINT-905-exclusion.md.bak"
run_case_anywhere "closetime-file-at-close (still excluded)" 0 \
  "layers observed [WIP, unattributed]" -- \
  sh -c "cd \"$c4\" && sh \"$checker\" docs/sprint/SPRINT-905-exclusion.md"

# ================================================================================================
# case 4b: in-repo agent worktree paths change but stay unflagged (constructed) -- must PASS.
# Reconstructs TD-030 (SPRINT-046 T2): worktree dispatch creates .claude/worktrees/agent-<id>/...
# INSIDE the repo at fan-out time, after the Plan's Layers: already froze -- the exact "undeclarable
# by construction" shape the exclusion covers. Exercises both observed-change paths at once: a
# tracked-but-uncommitted edit AND a brand-new untracked file, both under the worktree path.
# ================================================================================================
c4b="$work/agent-worktree-exclusion-safe"
mkdir -p "$c4b/docs/sprint" "$c4b/.claude/worktrees/agent-001"
cat > "$c4b/docs/sprint/SPRINT-906-worktree.md" <<'EOF'
---
sprint: 906
slug: worktree
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-906 — Agent Worktree Exclusion Safety (constructed fixture)

## Plan

### T1 — edit foo.txt only
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c4b/foo.txt"
printf 'seed\n' > "$c4b/.claude/worktrees/agent-001/seed.txt"
git -C "$c4b" init -q
lock_plan "$c4b" 'docs/sprint/SPRINT-906-worktree.md'
printf 'a2\n' >> "$c4b/foo.txt"                                    # tracked, uncommitted, declared
printf 'wip\n' >> "$c4b/.claude/worktrees/agent-001/seed.txt"      # tracked, uncommitted, excluded
printf 'new\n' > "$c4b/.claude/worktrees/agent-001/task-notes.md"  # untracked, excluded

run_case_anywhere "agent-worktree-exclusion-safe" 0 \
  "layers observed [WIP, unattributed]" -- \
  sh -c "cd \"$c4b\" && sh \"$checker\" docs/sprint/SPRINT-906-worktree.md"

# ================================================================================================
# case 4c: a genuinely undeclared file OUTSIDE the worktree path still FAILs by name, even with an
# excluded worktree path present alongside it (L-058 negative test, SPRINT-046 T2). This is the only
# way T2's exclusion could go wrong -- an over-broad `.claude/worktrees/agent-*` pattern that also
# swallowed real undeclared work -- so this asserts both that the real file IS named in the finding
# AND that the excluded worktree path is NOT named in it.
# ================================================================================================
c4c="$work/agent-worktree-does-not-swallow-real-miss"
mkdir -p "$c4c/docs/sprint" "$c4c/.claude/worktrees/agent-002" "$c4c/scripts/lib"
cat > "$c4c/docs/sprint/SPRINT-907-worktree-miss.md" <<'EOF'
---
sprint: 907
slug: worktree-miss
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-907 — Agent Worktree Does Not Swallow A Real Miss (constructed fixture)

## Plan

### T1 — edit foo.txt only
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c4c/foo.txt"
git -C "$c4c" init -q
lock_plan "$c4c" 'docs/sprint/SPRINT-907-worktree-miss.md'
printf 'a2\n' >> "$c4c/foo.txt"                                          # tracked, uncommitted, declared
printf 'wip\n' > "$c4c/.claude/worktrees/agent-002/seed.txt"             # untracked, excluded
printf 'oops\n' > "$c4c/scripts/lib/undeclared-real-file.sh"             # untracked, NOT excluded, real miss

run_case_anywhere "agent-worktree-does-not-swallow-real-miss (fails)" 1 \
  "changed but undeclared in any task's Layers::" -- \
  sh -c "cd \"$c4c\" && sh \"$checker\" docs/sprint/SPRINT-907-worktree-miss.md"
run_case_anywhere "agent-worktree-does-not-swallow-real-miss (names the real file)" 1 \
  "scripts/lib/undeclared-real-file.sh" -- \
  sh -c "cd \"$c4c\" && sh \"$checker\" docs/sprint/SPRINT-907-worktree-miss.md"

out4c=$(cd "$c4c" && sh "$checker" docs/sprint/SPRINT-907-worktree-miss.md 2>&1)
case "$out4c" in
  *".claude/worktrees/agent-002"*)
    echo "FAIL fixture(agent-worktree-does-not-swallow-real-miss (worktree path excluded from finding)): worktree path appeared in output -- got:"
    printf '%s\n' "$out4c"
    fail=1
    ;;
  *)
    echo "PASS fixture(agent-worktree-does-not-swallow-real-miss (worktree path excluded from finding)): worktree path correctly absent from finding"
    ;;
esac

# ================================================================================================
# ================================================================================================
# case 4d: release-bookkeeping files at the MINOR bump (constructed) -- must PASS at close.
# Added SPRINT-061 close, which is where the gap was found: a correct v1.35.0 bump touched four
# manifests plus README's footer, and the exclusion list still named only the two .claude-plugin/
# ones it was written with. check-manifest-lockstep.sh had been taught all four; this list had not
# (L-020, shipping != wiring). The two halves below are the guard against fixing that too widely.
# ================================================================================================
c4d="$work/release-bookkeeping-exclusion"
mkdir -p "$c4d/docs/sprint" "$c4d/.claude-plugin" "$c4d/.codex-plugin" "$c4d/.kimi-plugin"
cat > "$c4d/docs/sprint/SPRINT-907-release.md" <<'EOF'
---
sprint: 907
slug: release
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-907 — Release Bookkeeping Exclusion (constructed fixture)

## Plan

### T1 — edit foo.txt only
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c4d/foo.txt"
printf '{ "version": "1.0.0" }\n' > "$c4d/.claude-plugin/plugin.json"
printf '{ "version": "1.0.0" }\n' > "$c4d/.codex-plugin/plugin.json"
printf '{ "version": "1.0.0" }\n' > "$c4d/.kimi-plugin/plugin.json"
printf '# Readme\n\n<sub>status: current - v1.0.0</sub>\n' > "$c4d/README.md"
git -C "$c4d" init -q
lock_plan "$c4d" 'docs/sprint/SPRINT-907-release.md'
printf 'a2\n' >> "$c4d/foo.txt"                                        # declared
printf '{ "version": "1.1.0" }\n' > "$c4d/.codex-plugin/plugin.json"   # STRUCTURAL exclusion
printf '{ "version": "1.1.0" }\n' > "$c4d/.kimi-plugin/plugin.json"    # STRUCTURAL exclusion
printf '# Readme\n\n<sub>status: current - v1.1.0</sub>\n' > "$c4d/README.md"  # CLOSE-TIME only

# Phase 1 -- DoD still open, so the sprint is mid-execution. The two sibling manifests are excluded
# in both phases (a manifest bump is never task work), but the front door is NOT: a README edited
# during execution is somebody's task work, and the whole point of scoping its exclusion to close is
# that this stays reported. If a future widening moves it to the general list, this case goes green
# and that is the signal.
run_case_anywhere "release-manifests-excluded-but-front-door-reported" 1 \
  "changed but undeclared in any task's Layers:: README.md" -- \
  sh -c "cd \"$c4d\" && sh \"$checker\" docs/sprint/SPRINT-907-release.md"

# Phase 2 -- same repo, same edits, DoD ticked. Zero open DoD == at close, which is the only moment
# "footer bumped with the manifests" is true, so the run is clean. Without this half the change
# would read as "never exclude the front door", which fails every real close.
sed -i.bak 's/^- \[ \] foo.txt updated/- [x] foo.txt updated/' "$c4d/docs/sprint/SPRINT-907-release.md"
rm -f "$c4d/docs/sprint/SPRINT-907-release.md.bak"
run_case_anywhere "release-bookkeeping-at-close (all excluded)" 0 \
  "layers observed [WIP, unattributed]" -- \
  sh -c "cd \"$c4d\" && sh \"$checker\" docs/sprint/SPRINT-907-release.md"

# ================================================================================================
# case 4e: the CHANGELOG ROTATION artifact at the MINOR bump (constructed) -- must PASS at close.
# Added SPRINT-068 close: the same shape as 4d, one file over. §11 rotates the older CHANGELOG
# blocks verbatim into docs/changelog/CHANGELOG-<version>.md when a new MINOR lands, and the
# exclusion list named CHANGELOG.md but never its rotation sibling. SPRINT-067's close created
# CHANGELOG-1.39.0.md and tripped this leg unnoticed; SPRINT-068's caught it (L-020 again: the
# rotation convention shipped, its exclusion row did not). Two halves, same width guard as 4d.
# ================================================================================================
c4e="$work/changelog-rotation-exclusion"
mkdir -p "$c4e/docs/sprint" "$c4e/docs/changelog"
cat > "$c4e/docs/sprint/SPRINT-908-rotation.md" <<'EOF'
---
sprint: 908
slug: rotation
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-908 — Changelog Rotation Exclusion (constructed fixture)

## Plan

### T1 — edit foo.txt only
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated
EOF
printf 'a\n' > "$c4e/foo.txt"
printf '# Changelog\n\n## v1.0.0\n' > "$c4e/CHANGELOG.md"
git -C "$c4e" init -q
lock_plan "$c4e" 'docs/sprint/SPRINT-908-rotation.md'
printf 'a2\n' >> "$c4e/foo.txt"                                         # declared
printf '## v1.0.0\n' > "$c4e/docs/changelog/CHANGELOG-1.0.0.md"         # CLOSE-TIME (the new row)
# CHANGELOG.md itself is left untouched after the lock on purpose: its own exclusion row already has
# a case, and editing it here would put two paths in the finding and make this leg's assertion pass
# on the wrong one. The rotation artifact is the only variable.

# Phase 1 -- DoD still open, so the sprint is mid-execution and the rotation artifact is NOT release
# bookkeeping: a rotated file edited during execution is somebody's task work and must stay reported.
# If a future widening moves this row to the general list, this half goes green and that is the signal.
run_case_anywhere "changelog-rotation-reported-during-execution" 1 \
  "changed but undeclared in any task's Layers:: docs/changelog/CHANGELOG-1.0.0.md" -- \
  sh -c "cd \"$c4e\" && sh \"$checker\" docs/sprint/SPRINT-908-rotation.md"

# Phase 2 -- same repo, same edits, DoD ticked. Zero open DoD == at close, the only moment "rotated
# with the CHANGELOG" is true, so the run is clean. Without this half the close this row was written
# for still fails.
sed -i.bak 's/^- \[ \] foo.txt updated/- [x] foo.txt updated/' "$c4e/docs/sprint/SPRINT-908-rotation.md"
rm -f "$c4e/docs/sprint/SPRINT-908-rotation.md.bak"
run_case_anywhere "changelog-rotation-at-close (excluded)" 0 \
  "layers observed [WIP, unattributed]" -- \
  sh -c "cd \"$c4e\" && sh \"$checker\" docs/sprint/SPRINT-908-rotation.md"

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

# ================================================================================================
# case 7: ONE TREE, BOTH PATHS -- the divergence TD-037 describes, now named (SPRINT-074 T3).
# bar.txt is T2's. It is edited, and the edit will be committed under T1 -- a cross-task change.
#
#   leg A, UNCOMMITTED: attribution needs a commit, so this leg can only ask the weaker question
#     "did SOME task declare it?" -- and T2 did. Before T3 this returned a bare PASS.
#   leg B, COMMITTED:   the same tree, same edit, now attributable -- and it FAILs T1:bar.txt.
#
# That is one tree giving two verdicts. The cure is not to make them agree (they cannot: one has
# a commit to read and one does not) but to stop leg A claiming a clean bill it never checked.
# Both legs are asserted here, in order, on the SAME repository -- a cure asserted on the
# committed path alone has not been exercised on the path the defect lives on.
# ================================================================================================
c7="$work/both-paths"
mkdir -p "$c7/docs/sprint"
cat > "$c7/docs/sprint/SPRINT-915-bothpaths.md" <<'EOF'
---
sprint: 915
slug: bothpaths
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-915 — One Tree, Both Paths (constructed fixture)

## Plan

### T1 — edit only foo.txt
Layers: `foo.txt`
Depends-on: none

**DoD:**
- [ ] foo.txt updated

### T2 — edit only bar.txt
Layers: `bar.txt`
Depends-on: none

**DoD:**
- [ ] bar.txt updated
EOF
printf 'a
' > "$c7/foo.txt"
printf 'b
' > "$c7/bar.txt"
git -C "$c7" init -q
lock_plan "$c7" 'docs/sprint/SPRINT-915-bothpaths.md'

# --- leg A: the edit exists but is NOT committed -------------------------------------------
printf 'b2
' >> "$c7/bar.txt"
run_case_anywhere "both-paths leg A (uncommitted: named SKIP, never a bare PASS)" 0 \
  "layers observed [WIP, unattributed]" -- \
  sh -c "cd \"$c7\" && sh \"$checker\" docs/sprint/SPRINT-915-bothpaths.md"
run_case_anywhere "both-paths leg A (says the committed run is stricter)" 0 \
  "may FAIL where this leg does not" -- \
  sh -c "cd \"$c7\" && sh \"$checker\" docs/sprint/SPRINT-915-bothpaths.md"
# The regression this case exists to catch: leg A emitting PASS for this sprint again.
lega=$(cd "$c7" && sh "$checker" docs/sprint/SPRINT-915-bothpaths.md 2>&1)
if printf '%s
' "$lega" | grep -qE '^PASS'; then
  echo "FAIL fixture(both-paths leg A: no bare PASS): the WIP leg claimed a clean bill it did not check"; fail=1
else
  echo "PASS fixture(both-paths leg A: no bare PASS): the uncommitted leg emits no PASS line"
fi

# --- leg B: SAME tree, same edit, now committed under T1 ------------------------------------
commit_all "$c7" 'sprint(915) T1: edit foo and, wrongly, bar'
run_case_anywhere "both-paths leg B (committed: the same edit now FAILs)" 1 \
  "T1:bar.txt" -- \
  sh -c "cd \"$c7\" && sh \"$checker\" docs/sprint/SPRINT-915-bothpaths.md"


# ================================================================================================
# case 9: GOVERNANCE COMMITS (TASK-298). A PAIR. Leg A proves a commit belonging to no sprint task --
# backlog grooming, epic authoring -- no longer reports as `attributable to no task`. Leg B is the
# retained must-FAIL holding the ALL-OR-NOTHING property: one code file anywhere in the commit keeps
# the WHOLE commit attributed, so a src/ edit cannot ride along behind bookkeeping. If leg B ever
# goes green, is_governance_commit() has become ANY-of instead of ALL-of and real code is hiding.
#
# Motivating case is real: commit 39eedb8 on main (epic authoring + backlog decomposition, belonging
# to no sprint) red SPRINT-087 with exactly this finding while SPRINT-087 was mid-flight.
#
# NOTE the `printf '%s\n'` form below. Writing `printf '- [ ] ...'` makes printf read the leading `-`
# as an option flag; it errors, the file is never modified, and BOTH legs then pass for the wrong
# reason -- leg A never touching the multi-file branch, leg B collapsing to a code-only commit that
# passes via UNATTRIBUTED. That vacuum is not hypothetical: it is what the first version of this
# fixture did, and it survived a seeded mutation without reddening.
# ================================================================================================
c9="$work/governance-commits"
mkdir -p "$c9/docs/sprint" "$c9/docs/epic" "$c9/src"
cat > "$c9/docs/sprint/SPRINT-930-governance.md" <<'EOF'
---
sprint: 930
slug: governance
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-930 — Governance (constructed fixture)

## Plan

### T1 — edit the declared source file
Layers: `src/declared.txt`
Depends-on: none

**DoD:**
- [ ] src/declared.txt updated
EOF
printf '%s\n' 'x' > "$c9/src/declared.txt"
printf '%s\n' 'y' > "$c9/src/sneaky.txt"
printf '%s\n' '# todo' > "$c9/TODO.md"
printf '%s\n' '# epic' > "$c9/docs/epic/EPIC-001-thing.md"
git -C "$c9" init -q
lock_plan "$c9" 'docs/sprint/SPRINT-930-governance.md'

# --- leg A: a MULTI-FILE commit touching ONLY governance artifacts -- must PASS. Multi-file on
# purpose: a single-file commit would pass even under an ANY-of implementation, proving nothing.
printf '%s\n' '- [ ] TASK-500 groomed' >> "$c9/TODO.md"
printf '%s\n' 'outcome' >> "$c9/docs/epic/EPIC-001-thing.md"
commit_all "$c9" 'plan(epics): author an epic and groom the backlog'
gov_a_files=$(git -C "$c9" diff-tree --no-commit-id --name-only -r HEAD | tr '\n' ' ')
case "$gov_a_files" in
  *TODO.md*docs/epic/*|*docs/epic/*TODO.md*) echo "PASS fixture(governance leg A precondition): commit really carries both files ($gov_a_files)" ;;
  *) echo "FAIL fixture(governance leg A precondition): expected TODO.md AND docs/epic/* in the commit, got '$gov_a_files' -- the fixture is vacuous"; fail=1 ;;
esac
run_case_anywhere "governance leg A (governance-only commit is not undeclared)" 0 \
  "layers observed" -- \
  sh -c "cd \"$c9\" && sh \"$checker\" docs/sprint/SPRINT-930-governance.md"

# --- leg B (RETAINED MUST-FAIL): same shape, but one code file rides along -- must still FAIL and
# must NAME the code file. TODO.md sorts BEFORE src/ in git's tree order, so an ANY-of implementation
# returns governance on the first file and hides the code -- which is exactly what this reddens.
printf '%s\n' '- [ ] TASK-501 groomed' >> "$c9/TODO.md"
printf '%s\n' 'z2' >> "$c9/src/sneaky.txt"
commit_all "$c9" 'plan(backlog): groom -- with a code file riding along'
gov_b_files=$(git -C "$c9" diff-tree --no-commit-id --name-only -r HEAD | tr '\n' ' ')
case "$gov_b_files" in
  *TODO.md*src/sneaky.txt*) echo "PASS fixture(governance leg B precondition): commit really mixes bookkeeping and code ($gov_b_files)" ;;
  *) echo "FAIL fixture(governance leg B precondition): expected TODO.md THEN src/sneaky.txt, got '$gov_b_files' -- the fixture is vacuous"; fail=1 ;;
esac
run_case_anywhere "governance leg B (code riding along still FAILs)" 1 \
  "src/sneaky.txt" -- \
  sh -c "cd \"$c9\" && sh \"$checker\" docs/sprint/SPRINT-930-governance.md"


# ================================================================================================
# case 10: STREAM SCOPING BY OWNERSHIP (TASK-299). Five legs. Leg A is the feature; legs B, C and D
# are REGRESSION cases reconstructing the three repros an independent review used to refute the
# earlier PATH-based design, so that design cannot be rebuilt silently. Leg E pins the closed-sprint
# boundary. Each leg gets its OWN repo: a FAIL committed in one leg would otherwise contaminate the
# next leg's verdict.
# ================================================================================================
mk_two_sprint() {   # <dir> <sibling's declared token>
  _d=$1; _sib=$2
  mkdir -p "$_d/docs/sprint" "$_d/scripts"
  cat > "$_d/docs/sprint/SPRINT-920-stream-one.md" <<EOF
---
sprint: 920
slug: stream-one
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-920 — Stream One (constructed fixture)

## Plan

### T1 — edit stream one's own file
Layers: \`alpha.txt\`
Depends-on: none

**DoD:**
- [ ] alpha.txt updated
EOF
  cat > "$_d/docs/sprint/SPRINT-921-stream-two.md" <<EOF
---
sprint: 921
slug: stream-two
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-921 — Stream Two (constructed fixture)

## Plan

### T1 — edit stream two's own file
Layers: \`$_sib\`
Depends-on: none

**DoD:**
- [ ] the declared token is edited
EOF
  printf '%s\n' 'a' > "$_d/alpha.txt"
  printf '%s\n' 'b' > "$_d/beta.txt"
  printf '%s\n' 'g' > "$_d/gamma.txt"
  printf '%s\n' 'echo hi' > "$_d/scripts/sneaky.sh"
  git -C "$_d" init -q
  commit_all "$_d" 'plan locked'
  _sha=$(git -C "$_d" rev-parse HEAD)
  for _f in docs/sprint/SPRINT-920-stream-one.md docs/sprint/SPRINT-921-stream-two.md; do
    sed "s/PLAN_COMMIT_PLACEHOLDER/$_sha/" "$_d/$_f" > "$_d/$_f.tmp" && mv "$_d/$_f.tmp" "$_d/$_f"
  done
  commit_all "$_d" 'record plan_commit sha'
}
both="docs/sprint/SPRINT-920-stream-one.md docs/sprint/SPRINT-921-stream-two.md"

# --- leg A (THE FEATURE): the SIBLING's own commit, checked against stream one -- must PASS.
c10a="$work/own-sibling-commit"; mk_two_sprint "$c10a" 'beta.txt'
printf '%s\n' 'b2' >> "$c10a/beta.txt"
commit_all "$c10a" 'sprint(921) T1: stream two edits its own declared file'
run_case_anywhere "ownership leg A (sibling's OWN commit is not this sprint's work)" 0 \
  "layers observed" -- \
  sh -c "cd \"$c10a\" && sh \"$checker\" $both"

# --- leg B (REGRESSION, reviewer repro 1): THIS sprint's own task touches a SIBLING-DECLARED path.
# The path-based design skipped it and returned PASS. Ownership must still FAIL and name the task.
c10b="$work/own-self-commit-sibling-path"; mk_two_sprint "$c10b" 'beta.txt'
printf '%s\n' 'b2' >> "$c10b/beta.txt"
commit_all "$c10b" 'sprint(920) T1: stream ONE wrongly edits the sibling-declared file'
run_case_anywhere "ownership leg B (own task on sibling-declared path still FAILs)" 1 \
  "T1:beta.txt" -- \
  sh -c "cd \"$c10b\" && sh \"$checker\" $both"

# --- leg C (REGRESSION, reviewer repro 2): sibling declares a DIRECTORY token. The path-based design
# let that swallow every undeclared file beneath it. Ownership never reads a path, so it must FAIL.
c10c="$work/own-directory-token"; mk_two_sprint "$c10c" 'scripts/'
printf '%s\n' 'echo changed' >> "$c10c/scripts/sneaky.sh"
commit_all "$c10c" 'sprint(920) T1: stream ONE edits under the sibling-declared directory'
run_case_anywhere "ownership leg C (sibling directory token swallows nothing)" 1 \
  "T1:scripts/sneaky.sh" -- \
  sh -c "cd \"$c10c\" && sh \"$checker\" $both"

# --- leg D (REGRESSION, reviewer repro 3): UNCOMMITTED edit to a sibling-declared file. The WIP leg
# gets no sibling scoping at all -- uncommitted work carries no attribution, so reporting is correct.
c10d="$work/own-wip-sibling-path"; mk_two_sprint "$c10d" 'beta.txt'
printf '%s\n' 'b2' >> "$c10d/beta.txt"
run_case_anywhere "ownership leg D (uncommitted sibling-path edit is still reported)" 1 \
  "beta.txt" -- \
  sh -c "cd \"$c10d\" && sh \"$checker\" $both"

# --- leg E (BOUNDARY): a commit naming a CLOSED/unknown sprint number is NOT a sibling, so it stays
# attributed. Without this, "skip anything with a sprint number" would pass and prove nothing.
c10e="$work/own-closed-sprint"; mk_two_sprint "$c10e" 'beta.txt'
printf '%s\n' 'g2' >> "$c10e/gamma.txt"
commit_all "$c10e" 'sprint(899) T1: a sprint that is not active here'
run_case_anywhere "ownership leg E (unknown sprint number is not a sibling)" 1 \
  "gamma.txt" -- \
  sh -c "cd \"$c10e\" && sh \"$checker\" $both"


# ================================================================================================
# case 9b: the GENERATED index rides along with governance (TASK-299 follow-on). docs/knowledge-
# index.md is regenerated whenever any metadata-carrying doc changes, so it accompanies essentially
# every real governance commit. Omitting it from the governance set made the classifier miss the very
# commits it exists to catch -- 7fb32ca (docs/LEARNINGS.md + docs/knowledge-index.md) was reported as
# `attributable to no task` on a live run of the real repo. Leg B keeps all-or-nothing honest.
# ================================================================================================
c9b="$work/governance-with-index"
mkdir -p "$c9b/docs/sprint" "$c9b/src"
cat > "$c9b/docs/sprint/SPRINT-931-index.md" <<'EOF'
---
sprint: 931
slug: index
status: active
plan_commit: PLAN_COMMIT_PLACEHOLDER
---

# SPRINT-931 — Index (constructed fixture)

## Plan

### T1 — edit the declared source file
Layers: `src/declared.txt`
Depends-on: none

**DoD:**
- [ ] src/declared.txt updated
EOF
mkdir -p "$c9b/docs"
printf '%s\n' 'x' > "$c9b/src/declared.txt"
printf '%s\n' 'y' > "$c9b/src/rider.txt"
printf '%s\n' '# learnings' > "$c9b/docs/LEARNINGS.md"
printf '%s\n' '# index' > "$c9b/docs/knowledge-index.md"
git -C "$c9b" init -q
lock_plan "$c9b" 'docs/sprint/SPRINT-931-index.md'

# --- leg A: LEARNINGS + the regenerated index -- must PASS (this is the real-world shape)
printf '%s\n' '- L-999 something' >> "$c9b/docs/LEARNINGS.md"
printf '%s\n' '- regenerated' >> "$c9b/docs/knowledge-index.md"
commit_all "$c9b" 'docs(learnings): file L-999 and regenerate the index'
idx_files=$(git -C "$c9b" diff-tree --no-commit-id --name-only -r HEAD | tr '\n' ' ')
case "$idx_files" in
  *LEARNINGS.md*knowledge-index.md*|*knowledge-index.md*LEARNINGS.md*) echo "PASS fixture(governance-with-index precondition): commit carries both ($idx_files)" ;;
  *) echo "FAIL fixture(governance-with-index precondition): expected LEARNINGS.md AND knowledge-index.md, got '$idx_files' -- vacuous"; fail=1 ;;
esac
run_case_anywhere "governance-with-index leg A (LEARNINGS + generated index is governance)" 0 \
  "layers observed" -- \
  sh -c "cd \"$c9b\" && sh \"$checker\" docs/sprint/SPRINT-931-index.md"

# --- leg B: same shape plus a code file -- all-or-nothing must still FAIL and name the code file
printf '%s\n' '- L-998 another' >> "$c9b/docs/LEARNINGS.md"
printf '%s\n' '- regenerated again' >> "$c9b/docs/knowledge-index.md"
printf '%s\n' 'z' >> "$c9b/src/rider.txt"
commit_all "$c9b" 'docs(learnings): file L-998 -- with a code file riding along'
run_case_anywhere "governance-with-index leg B (code riding along still FAILs)" 1 \
  "src/rider.txt" -- \
  sh -c "cd \"$c9b\" && sh \"$checker\" docs/sprint/SPRINT-931-index.md"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "LAYERS-OBSERVED FIXTURES: all green"; else echo "LAYERS-OBSERVED FIXTURES: at least one FAIL"; fi
exit $fail
