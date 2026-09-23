---
id: TASK-387
title: "Retarget the dod-delta and verify-reaches guards onto member files"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-360, TASK-362]
---

# TASK-387 — Retarget the dod-delta and verify-reaches guards onto member files

## Done when

- [ ] Both guards read DoD boxes and `Verify:` clauses from member task files.
- [ ] Per guard: retained must-FAIL fixture with its named finding, a selection-varying fixture, and a v2 sprint with no inline Plan that must not pass vacuously.
- [ ] Worktree-isolated outside review.

## Touches

scripts/lib/check-dod-delta.ts · scripts/lib/check-verify-reaches.sh · their eval harnesses

## Assumes

none

## Tracker

Codex r1 F1 · r2 R2-3c · split from TASK-363
