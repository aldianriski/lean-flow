---
id: TASK-394
title: "Retire or retarget every TODO.md reader, and retire S11.TODOCAP"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
depends-on: [TASK-381, TASK-383, TASK-392]
---

# TASK-394 — Retire or retarget every TODO.md reader, and retire S11.TODOCAP

## Why

Split from `TASK-380` at the SPRINT-111 promote (owner, 2026-09-30), because 380 was size L at pull time. Deleting TODO.md
(EPIC-017 Closed-when 2) needs zero executables that still read it. The readers are conditional today: SPRINT-110 scoped
TODOCAP and qa-check legs 3/5/8 to "while TODO.md exists" (R2). So the file can go only once each is retired or retargeted, with
the spec saying so.

## Done when

- [ ] Zero non-test readers of TODO.md across scripts/, evals/, skills/ — derived mechanically by two selectors — except the allowlist: migrate's reference procedure, a bare existence check in layout detection, and v1-refusal text.
- [ ] S11.TODOCAP retired: spec/STANDARD.md §2 TODO.md row, §11 row and §14 counts updated, a spec MINOR with a CHANGELOG entry, and the engine rule removed. qa-check legs 3/5/8 and leg 7's TD-aging half (TD-203) retired or retargeted.
- [ ] Retained must-FAIL fixture for any retargeted reader; worktree-isolated outside review.

## Touches

scripts/ · evals/ · skills/ · spec/STANDARD.md · spec/CHANGELOG.md

## Assumes

- **open:** the census may find a reader whose only honest retarget is TECH-DEBT.md aging (TD-203). If it would redden ~105 rows, that is a disposition for the owner at G2, not a silent re-scope.

## Tracker

EPIC-017 Closed-when 2 · split from TASK-380 · TD-203 · SPRINT-110 R2
