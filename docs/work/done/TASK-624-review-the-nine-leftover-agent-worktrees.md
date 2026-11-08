---
id: TASK-624
title: "Review the nine leftover agent worktrees that hold uncommitted work, and keep or remove each"
type: debt
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
sprint: SPRINT-168
---

# TASK-624 — Review the nine leftover agent worktrees that hold uncommitted work, and keep or remove each

## Why
SPRINT-167 removed 8 leftover agent worktrees under `.claude/worktrees/` that were merged and clean. Nine more hold uncommitted changes, and two of those also hold commits not on `main`. SPRINT-166 already had to build on the shared tree because of the same leftovers. Each sprint-bulk fan-out checks `git worktree list` first, so the pile costs a ruling every sprint until someone reviews it.

Debt row: TD-246, agent worktrees accumulate.

## Done when

- [x] Each of the nine worktrees has a recorded ruling (keep, salvage to a task, or remove), with its uncommitted files named. ✓ § Results, one row per item, owner answers verbatim
- [x] Every worktree ruled for removal is gone from `git worktree list`; its branch stays unless the ruling says otherwise. ✓ `git worktree list` has 0 `.claude/worktrees/` entries; branches kept (48)
- [x] Negative: no uncommitted change is discarded without the owner's ruling naming that worktree. ✓ judgment tick: each removal cites its group ruling naming the worktree; backups saved first

## Touches

`.claude/worktrees/` (git worktree admin only; no tracked file changes)

## Assumes

- The branches outlive their worktrees, so commits are never at risk; only uncommitted changes are.

## Tracker

SPRINT-167 Retro · SPRINT-166 Retro (friction: 17 leftover worktrees)

## Results

Owner rulings by popup, 2026-11-08 (SPRINT-168 T3). Every item was ruled **remove**. Before removal, each worktree's `git diff` and its untracked files were saved to the session scratchpad. Removal used `git worktree remove --force`, and every branch was kept. Group answers, verbatim: "Remove all three (Recommended)" · "Remove all five (Recommended)" · "Remove both (Recommended)" · "Remove both (Recommended)".

| Item | Uncommitted files | Ruling |
|---|---|---|
| agent-aea05134596b4e08b | M `scripts/lib/sprint-members.ts`, identical to main, empty diff | remove (group 1) |
| agent-af5c49f0d510079ca | M `evals/run-by-reference-fixtures.ts`, M `scripts/lib/check-sprint-by-reference.ts`, line endings only, empty diff; commit 40c1d831 stays on its branch | remove (group 1) |
| agent-ae7411f8e8e641b52 | unregistered, empty folder | remove (group 1) |
| agent-a8ac449743f641512 | M `scripts/lib/check-sprint-by-reference.ts`; commit 1bef2312 stays on its branch | remove (group 2) |
| agent-a8cc1ff3a46d23db6 | M `skills/orchestrator/SKILL.md`, `references/dispatch.md`, `references/night-run.md`, `references/review-scoping.md`; ?? `evals/.tmp-leg2g-body.sh`, `evals/.tmp-leg2g-wrapper.sh`, `evals/fixtures/orchestrator-store/`, `evals/run-orchestrator-store-fixtures.ts` | remove (group 2) |
| agent-a8d190cd105b2e508 | ?? `docs/research/logs/qa-check-layers-observed-wiring.diff.md`, `evals/fixtures/layers-observed/`, `evals/run-layers-observed-differential.ts`, `scripts/lib/check-layers-observed.ts` | remove (group 2) |
| agent-ac32043e9fcac98af | M `evals/run-sprint-family-fixtures.sh`, `scripts/lib/conformance-engine.sh`, `scripts/qa-check.sh`, `spec/CHANGELOG.md`, `spec/STANDARD.md`; commit 88c45036 stays on its branch | remove (group 2) |
| agent-ace6ce2ebd10e64de | ?? `evals/fixtures/layers-completeness/space-in-backtick-token.md`, `scratch-derive-space-tokens.ts` | remove (group 2) |
| agent-ad350637ac0d32aeb | ?? `packs/verification.md` | remove (group 3) |
| agent-afe31e7e1ea59eedd | ?? `packs/solution-analysis.md` | remove (group 3) |
| `qa-t4.out`, `red.txt` | old gate output | remove (group 4) |

Check: `git worktree list` now shows no `.claude/worktrees/` entry, the folder is empty, and `git branch --list 'worktree-agent-*'` still lists the branches (48), including the three that hold commits not on main.
