---
id: TASK-650
title: "Census the skill-required record steps and summarise the rulings for the owner"
epic: EPIC-025
priority: P1
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-649]
---

# TASK-650 — Census the skill-required record steps and summarise the rulings for the owner

## Why

Record steps required by the shipped skills drive most non-work commits (43 of 59 in SPRINT-171, ADR-053 §4), and EPIC-025 D2 needs a row per step before any cut. This task adds no machinery.

## Done when

- [ ] One row per record step that `skills/orchestrator` and `skills/lean-doc-generator` require (the sprint-log event vocabulary included), with the same columns as the check rows. The population is reconciled by identity against the step lists in the SKILL.md files and references, and against the entry types in the archived logs.
- [ ] A rulings summary lists the proposed cuts, merges, keeps and unknowns, plus the decisions only the owner can make, and states plainly that no cut has been made.
- [ ] Negative: no file under `skills/`, `scripts/` or `evals/` is modified; only the census doc changes.

## Touches

`docs/research/process-cost-census.md` (extended). Everything else read-only.

## Assumes

- none

## Tracker

EPIC-025 Closed-when #1 (record steps); D2.
