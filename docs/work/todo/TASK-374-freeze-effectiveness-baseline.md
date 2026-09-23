---
id: TASK-374
title: "Freeze the \"before\" baseline for EPIC-017's effectiveness measure"
epic: EPIC-017
sprint: SPRINT-106
priority: P1
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-374 — Freeze the "before" baseline for EPIC-017's effectiveness measure

## Why

The 'after' half (TASK-386) is only comparable if the 'before' half is taken before SPRINT-106 T1 and TASK-364 change the layout. Once they land, the baseline can never be taken.

## Done when

- [ ] A dated baseline at a named commit, taken before TASK-359 and TASK-364 land: decomposition completeness (tasks written vs asked, one real breakdown), retrieval success (a fixed probe set, hit/miss), recurring-failure rate (L-NNN count bumps per sprint, last 10 sprints).
- [ ] The method is written down so TASK-386 reproduces it exactly. Lines and checkboxes are explicitly NOT measures.

## Touches

docs/research/epic-017-effectiveness.md (new)

## Assumes

that retrieval success can be probed mechanically. UNCONFIRMED

## Tracker

EPIC-017 Closed-when 7 · SPRINT-106 T0
