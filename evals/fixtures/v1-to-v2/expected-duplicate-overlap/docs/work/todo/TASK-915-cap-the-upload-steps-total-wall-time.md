---
id: TASK-915
title: "Cap the upload step's total wall time"
sprint: SPRINT-903
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: manual
state: ready
depends-on: [TASK-913]
---

# TASK-915 — Cap the upload step's total wall time

## Why

An unbounded retry once hung a whole run.

## Done when

- [x] the upload step aborts past a fixed wall-clock ceiling — verified against a seeded 90s hang

## Touches

- scripts/upload.ts

## Assumes

none

## Tracker

- TD-902
