---
id: TASK-392
title: "Retarget qa-check and night-run onto the store"
epic: EPIC-017
sprint: SPRINT-110
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
depends-on: [TASK-377, TASK-390, TASK-391, TASK-387, TASK-382]
---

# TASK-392 — Retarget qa-check and night-run onto the store

## Why

Split from `TASK-383` at the SPRINT-110 promote (owner, 2026-09-29), one task per surface. The gate's
TODO-hygiene and Active Sprint legs and night-run's `reap()` still read the v1 layout, so on a
by-reference sprint they check nothing and `reap()` reports `0 of 0`.

## Done when

- [ ] qa-check.sh and night-run.sh read the store.
- [ ] Retained must-FAIL fixture per changed leg; outside review, worktree-isolated.

## Touches

scripts/qa-check.sh · scripts/night-run.sh · their eval harnesses + fixtures

## Assumes

none

## Amended 2026-09-29

- **Carried from `TASK-383`'s hand-off (SPRINT-109 T1, `3c85e84`):** `qa-check.sh` ~654, 819-828, 870 (TODO hygiene,
  Active Sprint). Re-derive the line numbers before starting; they predate SPRINT-109's edits.

## Amended 2026-09-26 (carried from TASK-383)

- Carried from SPRINT-107 T4: `scripts/night-run.sh` `reap()` still counts `- [x]`/`- [ ]` in the sprint FILE and `### Tn` blocks there. The prose contract (`skills/orchestrator/references/night-run.md` Part 4) now counts `## Done when` boxes across member files (Members ∪ `sprint:` stamps), and a unit is delivered when every member its `Cites:` names has no open box. On a by-reference sprint the script reports `0 of 0`. The contract leads, so retarget the script to it.

## Tracker

EPIC-017 scope 6 · split from TASK-383
