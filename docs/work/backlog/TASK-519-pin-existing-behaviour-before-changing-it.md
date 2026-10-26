---
id: TASK-519
title: "Route a change to working behaviour through a G2 step that pins that behaviour first"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-519 — Pin existing behaviour before changing it

## Why
`/orchestrator`'s implement routing covers new behaviour, bugs and hard-to-change code, but not changing behaviour that
already works, so nothing says to capture what it does today before editing it. The Codex pipeline's Improve mode
inspects the existing artifact first and compares before and after. Source:
`docs/research/codex-run-project-pipeline.md` (8).

## Done when
- [ ] The implement routing has a row for "change existing behaviour", whose first G2 micro-task pins that behaviour
      (characterization test, or a before/after record where no test harness exists).
- [ ] The pin is re-run after the change; a difference not named in the task's Done-when is reported, not absorbed.
- [ ] Exercised once on a real change to existing behaviour.
- [ ] SKILL.md stays within ~140 lines; CHANGELOG `[Unreleased]` line.

## Touches
`skills/orchestrator/SKILL.md` (implement routing, G2) · `.claude/CONTEXT.md` (§ Implement routing, if it lists routes) · CHANGELOG.md

## Assumes
- Owner ruling 2026-10-25: lives in `/orchestrator` routing + G2, not `/tdd` (the owner's loop does not use `/tdd`).

## Tracker
Research `codex-run-project-pipeline`, Findings row (8).
