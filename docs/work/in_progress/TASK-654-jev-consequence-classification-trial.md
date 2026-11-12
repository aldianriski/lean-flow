---
id: TASK-654
title: "Trial Jev on consequence classification once, capped at 1 USD, and keep or drop it"
epic: EPIC-025
sprint: SPRINT-173
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-654 — Jev consequence-classification trial

## Why

EPIC-025 condition 4 and D3, owner ruling "One small task in Sprint A". Advisory only, beside `check-review-depth`, never a gate leg and never on a consumer path. Folds in TASK-627 (retargeted at `/triage`).

## Done when

- [ ] A dry run (the default, as `scripts/jev-done-when.ts`) prints the cost estimate for the sample: past sprints' consequence lines plus SPRINT-171 T5. A `--run` needs a budget argument (at most 1.00 USD) and reads `jev_key` from the environment only.
- [ ] One `--run` over that sample. Spend and the result (does Jev flag SPRINT-171 T5's owed review; does it ever downgrade a review) are recorded in the task's tick evidence and the sprint Log.
- [ ] Keep or drop, recorded: kept means the script stays with a header "advisory beside check-review-depth, never a gate leg"; dropped means the script is deleted.
- [ ] Negative: with `jev_key` unset or no budget, the script stops with a guard exit (2) before any call, printing "spend: 0 USD". No `.env` file is opened. The gate never invokes it.

## Touches

New `scripts/jev-consequence.ts` (or an extension of `scripts/jev-done-when.ts`, builder's choice); no other file. Disjoint from every other task.

## Assumes

- Key is the env var `jev_key`, supplied to Bun; `.env` is never opened. Cap 1 USD (owner ruling replaces the epic's shared 5 USD).
- Question type and thresholds fixed at G2: Noul per question, 0.7/0.3.

## Tracker

EPIC-025 condition 4; TASK-627; owner popup, 2026-11-12.
