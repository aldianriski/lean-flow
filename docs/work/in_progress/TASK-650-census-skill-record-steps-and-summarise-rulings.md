---
id: TASK-650
title: "Census the skill-required record steps and summarise the rulings for the owner"
epic: EPIC-025
sprint: SPRINT-172
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

- [x] One row per record step that `skills/orchestrator` and `skills/lean-doc-generator` require (the sprint-log event vocabulary included), with the same columns as the check rows. The population is reconciled by identity against the step lists in the SKILL.md files and references, and against the entry types in the archived logs. ✓ 83b54141: 64 record rows in the appendix, reconciled to skill step lists, 48 archived entry types (0 missing, 0 extra) and 12/38/43 non-work commits; review re-derived all three
- [x] A rulings summary lists the proposed cuts, merges, keeps and unknowns, plus the decisions only the owner can make, and states plainly that no cut has been made. ✓ 83b54141: owner packet and decision-doc Recommendation list cuts, merges, keeps, unknowns and owner decisions; 'No cut has been made in this sprint' stated
- [x] Negative: no file under `skills/`, `scripts/` or `evals/` is modified; only the census doc changes. ✓ git diff --stat d25c1aa6..83b54141 -- skills scripts evals spec test is empty; only the two census docs changed

## Touches

`docs/research/process-cost-census.md` (extended). Everything else read-only.

## Assumes

- none

## Tracker

EPIC-025 Closed-when #1 (record steps); D2.
