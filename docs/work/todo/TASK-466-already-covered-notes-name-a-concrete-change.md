---
id: TASK-466
title: "Make an already-covered note name one concrete change that would fail the test"
epic: EPIC-007
sprint: SPRINT-133
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-466 — Make an already-covered note name one concrete change that would fail the test

## Why

SPRINT-132's no-plugin exercise (run 3) recorded behaviour 3 as *already covered*, with the change "replacing the hours division
with something other than `Math.floor`". That names a class of changes, and some of them (`Math.ceil` for 3600) would still pass
the test. The owner ruled the run met in substance and asked for this follow-up
(`docs/research/logs/workflow-pack-exercises.md`).

## Done when

- [ ] `/tdd` and `packs/software-implementation.md` both say an already-covered note names one concrete edit (a specific expression or value) that would make the test fail, not a class of edits.
- [ ] The two files stay worded alike, and the pack still names no lean-flow skill, path or id outside its header.

## Touches

skills/tdd/SKILL.md · packs/software-implementation.md · CHANGELOG (at close)

## Assumes

- No new exercise run is required; the wording change is reviewed once.

## Tracker

- SPRINT-132 T3 run 3 · EPIC-007 condition 3
