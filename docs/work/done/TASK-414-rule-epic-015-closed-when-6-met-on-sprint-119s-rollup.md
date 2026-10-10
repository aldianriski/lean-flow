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

- [x] Each field CW6 names is mapped to a line of the committed SPRINT-119 rollup, cited by file:line; a field with no line is named ✓ SPRINT-119 archived log: run·DoD :103 · outcome :104 · terminal+reason :105 · tasks :106 · parks :107 · repair-cycles :108 · verification :109 · warnings :110 — all 8 fields present
      as the reason not to tick.
- [x] The emitter is verified in code, not inferred from one run: the launcher's rollup writer is shown to emit every CW6 field on ✓ `scripts/night-run.sh` reap() :340-359 derives 4 states, prints all 8 fields :414-421; USER_STOP is produced by NO path (comment :312 assigns it to die_doa(), whose call sites :485-516 are all pre-launch and print only DEAD-ON-ARRIVAL :461) — the USER_STOP path omits every field, so the tick is blocked
      every reaped terminal path (PLAN_EXHAUSTED · AUTHORITY_BOUNDARY · HARD_FAILURE · BUDGET_STOP · USER_STOP), cited by
      file:line; a path that omits a field blocks the tick.
- [x] If both hold, CW6 is ticked in EPIC-015 with that citation, and the two limitations are named separately on the tick: ✓ "otherwise" branch: CW6 stays OPEN (owner pre-delegated rule, SPRINT-121 G2); gap filed as TASK-423 (backlog, epic EPIC-015)
      TD-152 (the retry line is model-written, so `repair-cycles` is model-reported, not counted) and TD-153 (prose placed before
      the reaper's evidence can defeat the guard). Otherwise CW6 stays open and the gap is filed.

## Touches

- `docs/epic/EPIC-015-execution-autonomy.md`

## Assumes

- One real run plus a code check of the emitter is enough evidence for "every run emits"; no second run is required.

## Tracker

- EPIC-015 CW6 · SPRINT-119 Execution Log (run-complete rollup) · TD-152 · TD-153 · owner grill 2026-10-10
