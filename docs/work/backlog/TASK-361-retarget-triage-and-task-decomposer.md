---
id: TASK-361
title: "Retarget `/triage` and `/task-decomposer` onto the store"
epic: EPIC-017
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: manual
state: ready
depends-on: [TASK-359, TASK-360]
---

# TASK-361 — Retarget `/triage` and `/task-decomposer` onto the store

## Done when

- [ ] Both skills read and write task files instead of TODO.md sections. `authority:`, `assumes:`, `origin:` and readiness survive the move — `blocked`/`needs-info` are **not** folded into lifecycle status, they remain orthogonal fields. Ordering is explicit (`priority:` + a per-status order file); folders cannot sequence, which kerjaan itself concedes. A ≥ 30-task decomposition writes ≥ 30 files and fires no cap check — the epic's headline criterion, exercised on real input.

## Amended 2026-09-23

- Also retargets the decomposer's own references — fog-map and prd-and-slices — which route graduated work into tasks (Codex r1).

## Touches

skills/triage/SKILL.md · skills/task-decomposer/SKILL.md

## Assumes

none

## Tracker

EPIC-017 scope 4
