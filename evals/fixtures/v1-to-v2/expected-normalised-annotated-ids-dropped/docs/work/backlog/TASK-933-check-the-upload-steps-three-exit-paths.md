---
id: TASK-933
title: "Check the upload step's three exit paths"
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

# TASK-933 — Check the upload step's three exit paths

## Done when

- [ ] (a) exit 0 on success
- [ ] (b) exit 1 on a transient failure after retries
- [ ] (c) exit 2 on a bad argument

## Touches

- scripts/upload.ts

## Assumes

none

## Tracker

none
