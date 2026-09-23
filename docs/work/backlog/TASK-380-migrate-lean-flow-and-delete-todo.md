---
id: TASK-380
title: "Migrate lean-flow itself and delete TODO.md"
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
depends-on: [TASK-370, TASK-361, TASK-362, TASK-375, TASK-376, TASK-363, TASK-387, TASK-382, TASK-383, TASK-381]
---

# TASK-380 — Migrate lean-flow itself and delete TODO.md

## Done when

- [ ] This repo's remaining Backlog migrated with `migrate`; TODO.md deleted.
- [ ] Zero non-test readers of TODO.md across scripts/, evals/, skills/ — derived mechanically by two selectors — except the allowlist: migrate's reference procedure and a bare existence check in layout detection.
- [ ] The full gate is green afterwards, read from its own verdict line.

## Touches

TODO.md (deleted) · docs/work/

## Assumes

none

## Tracker

EPIC-017 Closed-when 2 · Codex r2 R2-1a
