---
id: TASK-913
title: "Add a retry to the flaky upload step"
priority: P1
size: M
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: manual
state: ready
---

# TASK-913 — Add a retry to the flaky upload step

## Why

one flaky CI run a week traces to this step

## Done when

- [ ] the upload step retries twice on a transient failure before giving up

## Touches

- scripts/upload.ts

## Assumes

none

## Tracker

- TD-901
