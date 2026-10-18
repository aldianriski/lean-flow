---
id: TASK-941
title: "Add a timeout to the sync step"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: manual
state: ready
---

# TASK-941 — Add a timeout to the sync step

## Why

a hung sync blocks the nightly run

## Done when

- [ ] the sync step aborts after 60 seconds

## Touches

- scripts/sync.ts

## Assumes

none

## Tracker

none
