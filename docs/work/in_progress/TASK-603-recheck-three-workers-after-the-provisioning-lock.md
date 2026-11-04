---
id: TASK-603
title: "Re-check three workers for release arms now that clinic provisioning is serialised"
type: debt
epic: EPIC-023
sprint: SPRINT-162
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: [TASK-600]
---

# TASK-603 — Re-check three workers for release arms now that clinic provisioning is serialised

## Why
Split from TASK-600 by SPRINT-161's scope-change: the lock (selftest S78) landed, and the capacity check needs an idle PC. TD-289
kept release arms at two workers (about 75 minutes for 32 slots); EPIC-023 D19 adopts three only after a clean re-check.

## Done when
- [x] A capacity check at N = 3 on A4a's arms and pin (TASK-586's tasks, scratch log) has no provisioning failure and every ✓ 6 slots, 0 provisioning failures, free RAM sampled (min 362 MB); 2 judge UNKNOWNs ruled noise by the owner (popup, 2026-11-04)
      outcome as in A4a's serial trials, or the owner rules the differences noise; free RAM is sampled and reported.
- [x] When clean, TD-289 records N = 3 for the next release arm's amendment to adopt and stays open until it does; when not, ✓ TD-289 carry-forward line
      TD-289 records why.

## Touches
`TECH-DEBT.md` · the next release arm's amendment

## Assumes
- RAM headroom at N = 3 holds (lowest free RAM at N = 3 was 375 MB, during the pilot).

## Tracker
TD-289 · TASK-600 · TASK-586 · EPIC-023 D19
