---
id: TASK-454
title: "In `/tdd`, require the whole suite green before a slice is done, and name what each test breaks on"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-129
---

# TASK-454 — In `/tdd`, require the whole suite green before a slice is done, and name what each test breaks on

## Why

`/tdd` never says to run the project's full suite and report every failure by name, including ones the
builder did not cause. Today only `/diagnose` (Phase 5) asks it, and so does the Review-time regression
gate in `test-standard.md`, as a suggestion. Upstream saw 11 of 12 probe runs execute only their own
test file.

## Done when

- [ ] `/tdd` states that the focused test drives each red/green cycle, and that a slice is done or committed only when the project's whole suite **passes**. Every failure is named, whether this change caused it or not; a failure the change did not cause is reported to the owner, never counted as green.
- [ ] The per-cycle checklist gains: name the production change that would fail this test; if only a deliberate decision could fail it, it is a change detector.
- [ ] No duplicated rule: `/tdd` and `test-standard.md` § Regression gate point to one another rather than restating it. `/tdd` SKILL.md stays within ~140 lines.
- [ ] Exercised once on a real cycle (L-007). CHANGELOG reflects the change.

## Touches

skills/tdd/SKILL.md (cycle + per-cycle checklist) · skills/tdd/references/test-standard.md · CHANGELOG

## Assumes

- the whole suite runs once per slice, not every cycle, so large suites stay usable (owner ruling at intake, 2026-10-19).

## Tracker

- `docs/research/brainstorming-adaptation.md` § Re-scan K4 (upstream `test-driven-development/SKILL.md`) · replaces TASK-450
