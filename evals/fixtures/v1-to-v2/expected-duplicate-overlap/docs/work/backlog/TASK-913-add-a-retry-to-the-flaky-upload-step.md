---
id: TASK-913
title: "Add a retry to the flaky upload step"
priority: P1
size: S
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

One flaky CI run a week traces to this step.

## Done when

- [ ] The upload step retries twice on a transient failure before giving up.

## Touches

- scripts/upload.ts

## Assumes

none

## Tracker

- TD-901
