---
id: TASK-428
title: "Stop shipped skills naming repo-only script paths as an adopter's mechanism"
epic: EPIC-022
priority: P1
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-428 — Stop shipped skills naming repo-only script paths as an adopter's mechanism

## Why

An installed consumer has no `scripts/`, so a step whose mechanism is `scripts/…` resolves nowhere for
them (L-015). Census 2026-10-18: 19 occurrences in 5 files — `orchestrator/references/night-run.md` (12) ·
`dispatch.md` (3) · `review-scoping.md` (2) · `orchestrator/SKILL.md` (1) · `lean-doc-generator/SKILL.md` (1,
already marked "lean-flow itself").

## Done when

- [ ] Every `scripts/…` occurrence under `skills/` is ruled per reference — reworded to name the property
      (not the path), marked "where the host repo has one", or marked as this repo's own tooling — and
      a re-census lists each survivor with its ruling (TD-137 · TD-214).
- [ ] Read on the consumer path: each touched step still completes for a repo with no `scripts/`.
- [ ] CHANGELOG notes the consumer-facing change; touched SKILL.md files stay ≤ ~140 lines.

## Touches

- skills/orchestrator/SKILL.md · skills/orchestrator/references/night-run.md · skills/orchestrator/references/dispatch.md ·
  skills/orchestrator/references/review-scoping.md · skills/lean-doc-generator/SKILL.md · CHANGELOG.md · TECH-DEBT.md

## Assumes

- some references describe lean-flow's own launcher on purpose — those are marked, not deleted (TD-137).

## Tracker

- EPIC-022 Closed-when 1 · TD-137 · TD-214
