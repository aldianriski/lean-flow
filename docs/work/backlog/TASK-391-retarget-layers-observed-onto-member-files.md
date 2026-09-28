---
id: TASK-391
title: "Retarget check-layers-observed onto member task files"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
depends-on: [TASK-360, TASK-362]
---

# TASK-391 — Retarget check-layers-observed onto member task files

## Why

Split from `TASK-363` (size L) at the SPRINT-109 promote, one task per guard (owner, 2026-09-28).
Leg 15 attributes each commit to a task and checks its files against that task's `Layers:`. On a v2
sprint the `Layers:` it needs sits beside member files that the guard does not yet read.

## Done when

- [ ] check-layers-observed (sh + ts) reads Layers for each member task file; a retained must-FAIL fixture with its named finding plus one fixture varying the selection (L-186); worktree-isolated outside review (L-165 · L-168).
- [ ] A v2 sprint with **no inline Plan** makes the guard examine member files, never pass vacuously — retained must-FAIL fixture (Codex r1 F1).

## Touches

scripts/lib/check-layers-observed.{sh,ts} · its eval harness + fixtures

## Assumes

that the candidate-file inventory `TASK-363` flagged as stale (15 → 24 · 38 · 50, by selector) is
re-derived for this guard before starting (L-130 · L-198)

## Tracker

EPIC-017 scope 4 · ADR-019 · split from TASK-363
