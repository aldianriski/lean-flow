---
id: TASK-649
title: "Classify each gate check's FAIL history and propose keep merge or cut"
epic: EPIC-025
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-648]
---

# TASK-649 — Classify each gate check's FAIL history and propose keep merge or cut

## Why

EPIC-025 D2: a check with no real defect in its history is cut, one with a real defect stays, an unreadable history is `unknown`. Measured cost basis ADR-053 §4; this task adds no machinery and cuts nothing.

## Done when

- [ ] Each row gets its FAIL count from the archived sprint logs and how many of those were real defects, each real defect citing its log entry. A history that cannot be read is `unknown`.
- [ ] Each row gets a proposed keep, merge or cut per EPIC-025 D2. SPRINT-171's consequence-line FAILs are classed as real defects: T1 and T3 had no recorded completed review, and T5 was never reviewed, and its review then found a dropped screen-out rule.
- [ ] Negative: no row proposed for a cut has a real defect or an `unknown` history, and no consumer guard is proposed for a cut.

## Touches

`docs/research/process-cost-census.md` (extended). Everything else read-only.

## Assumes

- Real-vs-format classification is a judgment per FAIL, stated with its evidence so the owner can overrule it.

## Tracker

EPIC-025 Closed-when #1 (FAILs, real defects, ruling); D2.
