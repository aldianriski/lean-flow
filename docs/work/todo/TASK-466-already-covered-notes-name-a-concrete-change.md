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
gates_signed: G1,G2 @ 50ff175e
depends-on: []
---

# TASK-466 — Make an already-covered note name one concrete change that would fail the test

## Why

SPRINT-132's no-plugin exercise (run 3) recorded behaviour 3 as *already covered*, with the change "replacing the hours division
with something other than `Math.floor`". That names a class of changes, and some of them (`Math.ceil` for 3600) would still pass
the test. The owner ruled the run met in substance and asked for this follow-up
(`docs/research/logs/workflow-pack-exercises.md`).

## Approved design

One shared phrase at three sites, in one commit (D1): `/tdd` step 3, the pack's step 3 and its output contract. An already-covered
note must "name one concrete edit, checked against the test's inputs, that would fail it (a specific expression or value, not a class
of edits)". Parentheses, not a dash, to match the pack's prose. The per-cycle "name the production change" check line, a version bump
and a new exercise run are out of scope. The "checked against the test's inputs" clause is an owner ruling at G2: a concrete edit can
still pass (`Math.round` gives 1 for 3600, as `Math.ceil` did).

## Done when

- [ ] `/tdd` and `packs/software-implementation.md` both say an already-covered note names one concrete edit (a specific expression or value) that would make the test fail, not a class of edits.
- [ ] The two files stay worded alike, and the pack still names no lean-flow skill, path or id outside its header.

## Touches

skills/tdd/SKILL.md · packs/software-implementation.md · CHANGELOG (at close)

## Assumes

- No new exercise run is required; the wording change is reviewed once.

## Tracker

- SPRINT-132 T3 run 3 · EPIC-007 condition 3
