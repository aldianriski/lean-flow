---
id: TASK-624
title: "Review the nine leftover agent worktrees that hold uncommitted work, and keep or remove each"
type: debt
priority: P3
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-624 — Review the nine leftover agent worktrees that hold uncommitted work, and keep or remove each

## Why
SPRINT-167 removed 8 leftover agent worktrees under `.claude/worktrees/` that were merged and clean. Nine more hold uncommitted changes, and two of those also hold commits not on `main`. SPRINT-166 already had to build on the shared tree because of the same leftovers. Each sprint-bulk fan-out checks `git worktree list` first, so the pile costs a ruling every sprint until someone reviews it.

## Done when

- [ ] Each of the nine worktrees has a recorded ruling (keep, salvage to a task, or remove), with its uncommitted files named.
- [ ] Every worktree ruled for removal is gone from `git worktree list`; its branch stays unless the ruling says otherwise.
- [ ] Negative: no uncommitted change is discarded without the owner's ruling naming that worktree.

## Touches

`.claude/worktrees/` (git worktree admin only; no tracked file changes)

## Assumes

- The branches outlive their worktrees, so commits are never at risk; only uncommitted changes are.

## Tracker

SPRINT-167 Retro · SPRINT-166 Retro (friction: 17 leftover worktrees)
