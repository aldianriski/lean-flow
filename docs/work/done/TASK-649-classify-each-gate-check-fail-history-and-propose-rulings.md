---
id: TASK-649
title: "Classify each gate check's FAIL history and propose keep merge or cut"
epic: EPIC-025
sprint: SPRINT-172
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

- [x] Each row gets its FAIL count from the archived sprint logs and how many of those were real defects, each real defect citing its log entry. A history that cannot be read is `unknown`. ✓ appendix § FAIL history: 103 rows, 1,800 dated log entries searched (124 logs + 46 embedded), each real defect cites its entry (188 headings verified); unreadable history = unknown; 13fc4285
- [x] Each row gets a proposed keep, merge or cut per EPIC-025 D2. SPRINT-171's consequence-line FAILs are classed as real defects: T1 and T3 had no recorded completed review, and T5 was never reviewed, and its review then found a dropped screen-out rule. ✓ every row ruled per D2 (25/19/17/21/8/6/7 + 0 merge); SPRINT-171 consequence-line FAILs real under G0636 (T1/T3 no recorded review, T5 unreviewed, dropped screen-out rule); 13fc4285
- [x] Negative: no row proposed for a cut has a real defect or an `unknown` history, and no consumer guard is proposed for a cut. ✓ negative predicate over the written table returns [] (cut AND real>0 / unknown / consumer yes / fixture of a kept check); coordinator recount agrees, 0 violations; 13fc4285

## Touches

`docs/research/process-cost-census.md` (extended). Everything else read-only.

## Assumes

- Real-vs-format classification is a judgment per FAIL, stated with its evidence so the owner can overrule it.

## Tracker

EPIC-025 Closed-when #1 (FAILs, real defects, ruling); D2.
