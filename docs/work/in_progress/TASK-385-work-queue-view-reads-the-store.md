---
id: TASK-385
title: "Point the EPIC-016 Work & Queue view at the store"
epic: EPIC-017
sprint: SPRINT-114
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-365]
---

# TASK-385 — Point the EPIC-016 Work & Queue view at the store

## Done when

- [x] workdoo's Work & Queue view reads task status from the store's folders, with no second copy of status. ✓ workdoo `fa5f39a` (ADR-006 design, owner-ruled): WorkItem `taskId` + migration 0010; `taskLifecycle` read per request from `<repository>/docs/work/<folder>/` (named unknowns, never guessed, never stored); API and Work & Queue show `workItemStatus` beside `taskLifecycle`; an API test on Postgres moves the file between two GETs and the row is byte-identical; Codex 2 rounds (residuals TD-036)
- [x] Approval and run state stay in workdoo's durable store (workdoo ADR-001). ✓ approvals/runs untouched; no lifecycle write path (no-sync tests on the store and the API, must-FAIL cache seed); post-merge DB suites 116 pass / 1 fail (Windows signal sibling of TD-034)

## Touches

workdoo repo (Work & Queue view)

## Assumes

none

## Tracker

EPIC-017 Closed-when 6 · EPIC-016
