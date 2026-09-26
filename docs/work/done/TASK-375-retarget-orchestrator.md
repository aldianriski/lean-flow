---
id: TASK-375
title: "Retarget /orchestrator onto the store"
epic: EPIC-017
sprint: SPRINT-107
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-360, TASK-362]
---

# TASK-375 — Retarget /orchestrator onto the store

## Done when

- [x] sprint-bulk reads a sprint's members by reference, never from an inline Plan copy. ✓ orchestrator-store-fixtures 42/0 (`af78aaf`)
- [x] dispatch: returning a broken worktree's task to backlog is a file move; Layers wrapping reads the task file. ✓ orchestrator-store-fixtures 42/0 (`af78aaf`)
- [x] night-run: entry routing (rows 2/3), the rollup and the reaper read the store. ✓ night-run.md contract, 42/0 (`af78aaf`); executable reaper → TASK-383
- [x] review-scoping: the Spec-axis `Cites:` comparand resolves from the task file, not the Plan block. ✓ orchestrator-store-fixtures 42/0 (`af78aaf`)
- [x] Exercised once on a v2 fixture sprint end-to-end; on a v1 tree the skill refuses and points to migrate (TASK-369's contract). ✓ e2e + v1-refusal cases, 42/0 (`af78aaf`)

## Touches

skills/orchestrator/SKILL.md · skills/orchestrator/references/dispatch.md · skills/orchestrator/references/night-run.md · skills/orchestrator/references/review-scoping.md

## Assumes

none

## Tracker

EPIC-017 scope 4 · Codex r1 F2
