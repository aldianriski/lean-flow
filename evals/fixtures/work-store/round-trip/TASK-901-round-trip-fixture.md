---
id: TASK-901
title: "Round-trip fixture task (synthetic, reserved 900-block)"
epic: EPIC-900
sprint: SPRINT-901
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-901 — Round-trip fixture task (synthetic, reserved 900-block)

## Why

Synthetic fixture for `evals/run-work-store-fixtures.ts` (SPRINT-106 T1). Not a real task; the
900-block id is the reserved fixture range this repo already uses elsewhere (e.g. `SPRINT-901`,
`SPRINT-902`, `TASK-903`).

## Done when

- [ ] Survives a `backlog/` -> `todo/` -> `backlog/` `git mv` round trip byte-identical.

## Touches

nothing (fixture only)

## Assumes

none

## Tracker

SPRINT-106 T1 (EPIC-017 D1 · D6)
