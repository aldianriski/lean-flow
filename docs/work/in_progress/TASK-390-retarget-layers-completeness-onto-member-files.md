---
id: TASK-390
title: "Retarget check-layers-completeness onto member task files"
epic: EPIC-017
sprint: SPRINT-110
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
depends-on: [TASK-360, TASK-362]
---

# TASK-390 — Retarget check-layers-completeness onto member task files

## Why

Split from `TASK-363` (size L) at the SPRINT-109 promote, one task per guard (owner, 2026-09-28).
The Plan-shape layers guards read `Layers:` from an inline Plan, and a v2 sprint's DoD lives in its
member files, so the guard can pass without looking at anything.

## Done when

- [x] check-layers-completeness (sh + ts) reads Layers for each member task file; a retained must-FAIL fixture with its named finding plus one fixture varying the selection (L-186); worktree-isolated outside review (L-165 · L-168). ✓ `9910ec3` (merged `d23d8e2`): member-layers-incomplete + member-layers-undeclared, retained must-FAIL each (member-mixed · member-no-plan) with siblings, selection varied (stamp-only · two-member Tn · dir-covered); `.ts` gates, `.sh` stays the Plan-path oracle (D1); runner `25 tests, 0 fail`; differential on main `16/16 identical`, 12 member lines excluded by name; isolated review CLEAR.
- [x] A v2 sprint with **no inline Plan** makes the guard examine member files, never pass vacuously — retained must-FAIL fixture (Codex r1 F1). ✓ `member-no-plan` (zero `### Tn`) → `member-layers-undeclared` ×2 (retained); seeded break B reddened exactly its 2 tests.

## Touches

scripts/lib/check-layers-completeness.{sh,ts} · its eval harness + fixtures

## Assumes

that the candidate-file inventory `TASK-363` flagged as stale (15 → 24 · 38 · 50, by selector) is
re-derived for this guard before starting (L-130 · L-198)

## Tracker

EPIC-017 scope 4 · ADR-019 · split from TASK-363
