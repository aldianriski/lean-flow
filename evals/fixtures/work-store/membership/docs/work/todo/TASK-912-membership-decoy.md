---
id: TASK-912
title: "Membership fixture decoy (synthetic, reserved 900-block)"
epic: EPIC-900
sprint: SPRINT-902
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

# TASK-912 — Membership fixture decoy (synthetic, reserved 900-block)

## Why

Synthetic fixture for `evals/run-work-store-fixtures.ts` (SPRINT-106 T2). Not a real task. A
member of `SPRINT-902` — a **different** sprint from TASK-910/TASK-911 — carrying four open
`## Done when` boxes. Proves the `sprint:` filter is exact: this file's open boxes must never be
counted toward `SPRINT-901`'s open-DoD figure, even though it sits in the same `docs/work/`
tree and the same `todo/` status folder as TASK-910 (L-186: the fixture varies the SELECTION,
not the verdict).

## Done when

- [ ] open item G
- [ ] open item H
- [ ] open item I
- [ ] open item J

## Touches

nothing (fixture only)

## Assumes

none

## Tracker

SPRINT-106 T2 (EPIC-017 D1 · D2)
