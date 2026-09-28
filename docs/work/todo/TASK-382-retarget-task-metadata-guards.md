---
id: TASK-382
title: "Retarget the task-metadata guards onto the store"
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
depends-on: [TASK-359, TASK-361]
---

# TASK-382 — Retarget the task-metadata guards onto the store

## Done when

- [ ] check-authority (sh + ts) reads the authority class from task files; check-task-origin reads `origin:` from task files.
- [ ] Per guard: a retained must-FAIL fixture with its named finding, plus one fixture varying the selection. A v2 tree with no `### Tn` headings must not pass vacuously.
- [ ] Worktree-isolated outside review (L-165 · L-168).

## Touches

scripts/lib/check-authority.sh · scripts/lib/check-authority.ts · scripts/lib/check-task-origin.sh · scripts/lib/prose-density-baseline.txt · evals/ authority harnesses

## Assumes

none

## Tracker

Codex r1 F1 · L-058 · L-186
