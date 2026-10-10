---
id: TASK-414
title: "Rule EPIC-015 Closed-when 6 met on SPRINT-119's real-run rollup"
epic: EPIC-015
priority: P1
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
sprint: SPRINT-121
depends-on: []
---

# TASK-414 — Rule EPIC-015 Closed-when 6 met on SPRINT-119's real-run rollup

## Why

SPRINT-119's real overnight run committed a rollup carrying `outcome · DELIVERED` and the evidence fields CW6 names (run DoD ·
tasks attempted/completed · parks · repair-cycles · verification · warnings · terminal reason), each tagged mechanical /
model-reported / derived. CW6 was never ticked. One run proves one run, so the emitter is checked in code before "every run" is
claimed (Codex review, 2026-10-10).

## Done when

- [ ] Each field CW6 names is mapped to a line of the committed SPRINT-119 rollup, cited by file:line; a field with no line is named
      as the reason not to tick.
- [ ] The emitter is verified in code, not inferred from one run: the launcher's rollup writer is shown to emit every CW6 field on
      every reaped terminal path (PLAN_EXHAUSTED · AUTHORITY_BOUNDARY · HARD_FAILURE · BUDGET_STOP · USER_STOP), cited by
      file:line; a path that omits a field blocks the tick.
- [ ] If both hold, CW6 is ticked in EPIC-015 with that citation, and the two limitations are named separately on the tick:
      TD-152 (the retry line is model-written, so `repair-cycles` is model-reported, not counted) and TD-153 (prose placed before
      the reaper's evidence can defeat the guard). Otherwise CW6 stays open and the gap is filed.

## Touches

- `docs/epic/EPIC-015-execution-autonomy.md`

## Assumes

- One real run plus a code check of the emitter is enough evidence for "every run emits"; no second run is required.

## Tracker

- EPIC-015 CW6 · SPRINT-119 Execution Log (run-complete rollup) · TD-152 · TD-153 · owner grill 2026-10-10
