---
id: TASK-383
title: "Retarget the conformance engine, qa-check and night-run onto the store"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-377, TASK-363, TASK-387, TASK-382]
---

# TASK-383 — Retarget the conformance engine, qa-check and night-run onto the store

## Done when

- [ ] Conformance rules keyed to TODO.md re-point to the store per TASK-377's contract; the engine ships the layout to consumers.
- [ ] qa-check.sh and night-run.sh read the store.
- [ ] Retained must-FAIL fixture per changed rule; outside review, worktree-isolated.

## Touches

scripts/lib/conformance-engine.sh · scripts/qa-check.sh · scripts/night-run.sh

## Assumes

none

## Tracker

EPIC-017 scope 6 · moved from TASK-365
