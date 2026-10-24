---
id: TASK-487
title: "clean up the accumulated agent worktrees, owner-approved"
sprint: SPRINT-138
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-487 — clean up the accumulated agent worktrees, owner-approved

## Why
TD-246 (low): agent worktrees accumulate (14 at SPRINT-121, 23 on 2026-10-24) and nothing removes them, while a locked one may belong
to a live session. A one-time operation with no recurring step, split out of TASK-483 at the Codex intake review. J2 because it
deletes, and the disposition is the owner's.
Consumer: none shipped. An adopter's worktrees are theirs; this is lean-flow's own tree.

## Done when
- [x] Every agent worktree is listed with its clean / merged / locked state; only clean, merged, unlocked ones are proposed for removal. ✓ 22 registered (= 28 dirs on disk − 6 empty orphans, two routes); 12 clean + unlocked + fully applied (`git cherry` no `+`) proposed; 1 locked and 9 dirty listed with why they stay
- [x] The owner's disposition (removed · declined · none eligible) is recorded with the before/after count, and TD-246 is updated. ✓ removed 12 (owner popup 2026-10-24, per class) + 6 empty orphan dirs; 22 → 10 registered, 28 → 10 dirs; TD-246 updated (`5d2bca69`), stays open

## Touches
`.claude/worktrees/` (git worktree state) · `TECH-DEBT.md`

## Assumes
- none

## Tracker
- TD-246 · owner selection 2026-10-24 (part of candidate B, split at the Codex intake review)
