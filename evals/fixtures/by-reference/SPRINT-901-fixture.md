---
sprint: 901
slug: fixture
owner: Maintainer
last_updated: 2026-09-24
status: active
plan_commit: PLAN_COMMIT
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-901 — By-reference fixture

> **Theme:** a two-member sprint promoted by reference; each case mutates it after promote.

## Scope

**In:** TASK-901 · TASK-902
**Out (deferred):** none

## Members

- docs/work/todo/TASK-901-alpha.md
- docs/work/todo/TASK-902-beta.md

## Plan

### T1 — Deliver alpha `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `src/alpha.ts`
Depends-on: none
Cites: `TASK-901`

**Acceptance:** alpha works.

### T2 — Deliver beta `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `src/beta.ts`
Depends-on: T1
Cites: `TASK-902`

**Acceptance:** beta works.

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-901-fixture.md`.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
