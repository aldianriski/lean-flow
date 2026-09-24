---
id: TASK-369
title: "Make every queue skill detect a v1 tree and refuse it by name"
epic: EPIC-017
sprint: SPRINT-106
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: X
authority: J2
origin: manual
state: ready
depends-on: [TASK-359, TASK-360]
---

# TASK-369 — Make every queue skill detect a v1 tree and refuse it by name

## Done when

- [x] The 7 queue-touching skills (derived by two selectors) each detect v1 or v2 and name it in their output; on v1 or mixed they refuse by name and point to `/lean-doc-generator migrate`, writing nothing. ✓ `ae9673b`
- [x] Detection tests TODO.md for existence only, never reads its content. ✓ existence-only (empty-TODO fixture)
- [x] Retained v1 · v2 · mixed fixtures; each of the 7 skills refuses the v1 and mixed cases by name. ✓ `evals/run-layout-fixtures.ts` 33/0
- [x] ADR-046 records the hard cut (v2-only 2.0.0) and is indexed in docs/DECISIONS.md. ✓ ADR-046 indexed

## Amended 2026-09-23

- **Rescoped 2026-09-23 by owner ruling (hard cut — D7 dual-layout dropped).** A 2.x queue skill that finds a v1 tree **refuses by name and points to `/lean-doc-generator migrate`**; it never works with v1 and never writes into it. Mixed is refused too, except `migrate` resuming its own interrupted run. `migrate` is the only 2.x path that accepts a v1 tree. ADR-046 records the hard cut, not dual support.
- Detection may test for TODO.md's **existence** only; reading its content is migrate's job alone — the allowlist TASK-380's zero-reader check admits (Codex r2 R2-1a).
- Superseded done-when (was, under the title "Make every queue-touching skill detect and name its layout (v1 · v2 · mixed)"): The 7 queue-touching skills (derived by two selectors) each detect v1 / v2 / mixed, name it in their output, and work or refuse by name; mixed reads both, writes where the id already lives, refuses a duplicate id. Retained v1 · v2 · mixed fixtures.

## Touches

skills/{prime,triage,task-decomposer,lean-doc-generator,orchestrator,handoff,flow}/SKILL.md · ADR-046

## Assumes

none

## Tracker

EPIC-017 D7 · SPRINT-106 T3
