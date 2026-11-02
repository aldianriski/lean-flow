---
id: TASK-581
title: "Measure S3 bundle 2 (TASK-583, 584, 585) as its own arm"
epic: EPIC-023
sprint: SPRINT-158
priority: P2
size: M
risk: high
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-574, TASK-583, TASK-584, TASK-585]
---

# TASK-581 — Measure S3 bundle 2 (TASK-583, 584, 585) as its own arm

## Why
EPIC-023 D14: fixes iterate on development runs, are bundled, and the bundle gets one full arm, run unattended after the pilot.
Bundle 2 stacks on A4a's plugin when A4a is ship-eligible, otherwise on A2's (owner rules which at G2, from A4a's ruling).

## Done when
- [ ] An owner-signed amendment before any trial of the arm: the comparator (A4a or A2, per its ruling), the plugin pin at the
      commit after bundle 2, the same 32-slot schedule, its own log, validity first, and the development runs disclosed with an
      untouched-task check.
- [ ] All 32 slots measured (TASK-582's workers if signed by then), and the arm passes section 11's validity on its own slots.
- [ ] The ruling (ship-eligible / failed / inconclusive) is owner-signed and recorded in the arm's log and EPIC-023.

## Touches
`evals/ab/` (arm, schedule, hash-prereg, amendment) · `docs/research/logs/` (the arm's log) · EPIC-023

## Assumes

## Tracker
EPIC-023 D8, D14 · SPRINT-156 next-bundle analysis
