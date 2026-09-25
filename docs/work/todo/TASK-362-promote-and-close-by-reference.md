---
id: TASK-362
title: "Make `promote` and `close` operate by reference, not by copy"
epic: EPIC-017
sprint: SPRINT-107
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: X
authority: J2
origin: manual
state: ready
depends-on: [TASK-360]
---

# TASK-362 — Make `promote` and `close` operate by reference, not by copy

## Done when

- [x] `promote` stamps `sprint:` and **moves** files rather than rendering task content into the sprint file; `close` verifies members are in `done/`/`cancel/` and writes the Retro. The sprint Plan remains an explicitly approved snapshot **by reference** — the freeze must survive the change, not be traded away for it. Transitions are coordinator-owned with a duplicate-id check at merge (D6): two isolated worktrees can each claim one ticket from their own snapshot. ✓ T1 by-reference 73/0, 3 outside rounds CLEAR (`68c2a0b`); D6 merge-back + duplicate-id check T4 42/0 (`af78aaf`)

## Touches

skills/lean-doc-generator/SKILL.md · dispatch merge-back

## Assumes

that removing the copy removes the drift class it creates, and introduces no
weaker freeze. UNCONFIRMED — this is the riskiest task in the epic

## Tracker

EPIC-017 D2 · D6
