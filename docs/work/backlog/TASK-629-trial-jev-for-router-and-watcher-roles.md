---
id: TASK-629
title: "Trial Jev for the router and watcher roles once their EPIC-024 rows exist"
type: feature
epic: EPIC-024
priority: P3
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: []
---

# TASK-629 — Trial Jev for the router and watcher roles once their EPIC-024 rows exist

## Why
The router (row 4) and watcher (row 7) have no Jev use until a trial of each exists. Not chained to TASK-628: these uses need only those rows, not the A/B judge.

## Done when

- [ ] A design note says what Jev would judge in the router and in the watcher, as a typed call, with a hang or routing case from the row 4 and row 7 trials.
- [ ] Negative: no Jev call drives an agent or a write; Jev only supplies a judgment.

## Assumes

- A1 and A3 as in TASK-625.
- **blocked-by:** EPIC-024 rows 4 and 7 each have a recorded verdict.

## Tracker

Owner ruling 2026-11-08 (Jev adoption, use 4 of 4) · EPIC-024 rows 4 and 7
