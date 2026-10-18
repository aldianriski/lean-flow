---
id: TASK-442
sprint: SPRINT-127
title: "Exercise the plan support on workdoo for real: its roadmap from the template, one task through G1/G2 to done without git"
epic: EPIC-022
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-439]
---

# TASK-442 — Exercise the plan support on workdoo for real

## Why

Every proof so far ran on a scratch copy. EPIC-022's last condition is the consumer itself (L-007): workdoo, with no git, using
the roadmap template and the task-level gate record as an adopter would.

## Done when

- [x] workdoo's `docs/product/company-workspace-roadmap.md` delivery sequence is carried into `docs/product/roadmap.md` from the ✓ 16 rows, cells 1–4 identical by pipe-cut diff, 2 done · 1 active · 13 planned; source sha256 unchanged; owner approved by popup
      template, every row keeping its content and gaining a Status and a Covered-by cell, with workdoo's owner approving the write.
- [x] One real workdoo task goes G1/G2 → done with `gates_signed: G1,G2 @ <YYYY-MM-DD>` written on approval, without git. ✓ workdoo TASK-046, G1 then G2 by popup → `G1,G2 @ 2026-10-18` + Approved design; plain moves backlog → in_progress → done
- [x] `/prime` and `/triage` run in workdoo report its roadmap coverage correctly; whatever does not fit is recorded as a ✓ judgment: the current procedures read workdoo as 0 uncovered (P2 active, next slice P2d); a seeded P3 reads uncovered; findings F1–F2 in the log
      finding (TD or a follow-up), never smoothed over.

## Touches

- D:\Research\workdoo — docs/product/ · docs/work/ (outside this repo; written only with the owner's explicit go-ahead at G1)

## Assumes

- A5: writing into workdoo needs the owner's explicit go-ahead in this task's own G1, separate from this approval.
- EPIC-022 Closed-when 8 is reworded at promote to match (owner ruling 2026-10-18: one-off task + optional sprint).

## Tracker

- EPIC-022 Closed-when 8 · L-007
