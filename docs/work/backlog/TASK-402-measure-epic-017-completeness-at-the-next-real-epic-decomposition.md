---
id: TASK-402
title: "Measure EPIC-017's completeness probe at the next real epic decomposition"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J2
origin: close-retro
state: blocked
depends-on: []
---

# TASK-402 — Measure EPIC-017's completeness probe at the next real epic decomposition

## Why

SPRINT-114 T5 re-ran TASK-374's method for the "after" measurement. The completeness probe could not be re-run, because it needs a real epic
decomposition of at least 30 tasks under the v2 store, and none happened during the sprint (scope-change 2026-10-03). EPIC-017
Closed-when 7 was therefore ticked as *measured, verdict NOT demonstrated*. The missing number is a **measurement**: it accumulates only
when the event occurs, so this task waits on that event rather than on a ruling (L-094).

## Done when

- [ ] At the next real `/task-decomposer --epic` run, the completeness probe is applied unchanged (`docs/research/logs/epic-017-effectiveness.md`
      § method), and the result is appended to that log with the run's commit.

## Touches

docs/research/logs/epic-017-effectiveness.md

## Assumes

- **blocked-by:** a real epic decomposition (unblock condition: one `/task-decomposer --epic` run writes ≥ 30 task files).

## Tracker

- SPRINT-114 T5 (TASK-386) · EPIC-017 Closed-when 7 · `docs/research/logs/epic-017-effectiveness.md`
