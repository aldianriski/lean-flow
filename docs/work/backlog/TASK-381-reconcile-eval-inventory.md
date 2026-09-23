---
id: TASK-381
title: "Reconcile the eval inventory against the guard tasks"
epic: EPIC-017
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-363, TASK-387, TASK-382, TASK-383]
---

# TASK-381 — Reconcile the eval inventory against the guard tasks

## Done when

- [ ] A two-selector inventory (literal TODO.md + Plan/Backlog concepts) of evals/ exists, and every file in it is owned by TASK-363 / 387 / 382 / 383 or retargeted here.
- [ ] Each retargeted harness has a v2 fixture that varies the selection, not only the verdict.

## Touches

evals/ (assert-park-revisit · park selftests · night-run-rollup · foreign-repo · s2-placement · sprint-family harnesses)

## Assumes

none

## Tracker

Codex r1 F3 · L-186 · L-198
