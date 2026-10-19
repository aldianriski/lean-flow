---
id: TASK-450
title: "In `/tdd`, let the project's whole suite define green, and name what each test breaks on"
priority: P3
size: S
risk: low
autonomy: AFK
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-450 — In `/tdd`, let the project's whole suite define green, and name what each test breaks on

## Why

`/tdd` never says to run the project's full suite each cycle and report every failure by name,
including ones the builder did not cause. Today only `/diagnose` (Phase 5) and the Review-time
regression gate in `test-standard.md`, as a suggestion, ask it. Upstream saw 11 of 12 probe runs
execute only their own test file.

## Done when

- [ ] `/tdd`'s per-cycle step says green means the project's whole suite passes, and every failure is named, whether or not this change caused it.
- [ ] A one-line check is added: name the production change that would fail the new test. If only a deliberate decision could fail it, it is a change detector.
- [ ] No duplication of `test-standard.md` § Regression gate: one of the two points to the other. SKILL.md ≤ ~140 lines. Exercised once on a real cycle (L-007).

## Touches

skills/tdd/SKILL.md · skills/tdd/references/test-standard.md · CHANGELOG (consumer-visible)

## Assumes

- none

## Tracker

- `docs/research/brainstorming-adaptation.md` § Re-scan K4 (upstream `test-driven-development/SKILL.md`)
