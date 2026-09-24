---
id: TASK-361
title: "Retarget `/triage` and `/task-decomposer` onto the store"
epic: EPIC-017
sprint: SPRINT-107
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

- [x] Both skills read and write task files instead of TODO.md sections. `authority:`, `assumes:`, `origin:` and readiness survive the move — `blocked`/`needs-info` are **not** folded into lifecycle status, they remain orthogonal fields. Ordering is explicit (`priority:` + a per-status order file); folders cannot sequence, which kerjaan itself concedes. A ≥ 30-task decomposition writes ≥ 30 files and fires no cap check — the epic's headline criterion, exercised on real input. ✓ store-writers-fixtures 29/0 (`3b49aef`)

## Amended 2026-09-23

- Also retargets the decomposer's own references — fog-map and prd-and-slices — which route graduated work into tasks (Codex r1).

## Amended 2026-09-24

- **Ordering (owner ruling A2, SPRINT-107 G2):** "`priority:` + a per-status order file" is superseded by `priority:` → topological order over `depends-on:` → task id, **no order file**. Logged as a `scope-change` naming TASK-361.

## Touches

skills/triage/SKILL.md · skills/task-decomposer/SKILL.md

## Assumes

none

## Tracker

EPIC-017 scope 4
