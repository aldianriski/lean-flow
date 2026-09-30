---
id: TASK-380
title: "Migrate lean-flow itself and delete TODO.md"
epic: EPIC-017
sprint: SPRINT-111
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-370, TASK-361, TASK-362, TASK-375, TASK-376, TASK-390, TASK-391, TASK-387, TASK-382, TASK-383, TASK-392, TASK-381, TASK-394, TASK-395]
---

# TASK-380 — Migrate lean-flow itself and delete TODO.md

## Done when

- [ ] This repo's remaining Backlog migrated with `migrate`; TODO.md deleted.
- [ ] The full gate is green afterwards, read from its own verdict line.

## Touches

TODO.md (deleted) · docs/work/

## Assumes

none

## Amended 2026-09-30 (SPRINT-111 promote)

- **Split (owner, 2026-09-30):** size L at pull time (15 legacy tasks to migrate, 22 + 17 files mentioning TODO.md, and a spec
  retirement). The zero-readers box moved to `TASK-394`, which runs first. This task keeps the migration, the deletion, and a green gate.

## Amended 2026-09-30

- **TD-203 (owner ruling, SPRINT-110 T4):** qa-check leg 7's TD-aging half greps TODO.md, which holds 0 TD rows. Deleting TODO.md means
  this task retires that half, or retargets it at `TECH-DEBT.md` with an aging rule the gate can check. The retarget would redden about
  105 rows, so it needs a disposition.

## Tracker

EPIC-017 Closed-when 2 · Codex r2 R2-1a
