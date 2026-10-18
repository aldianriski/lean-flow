---
sprint: 919
slug: fx
status: active
plan_commit: abc1234
---

# SPRINT-919 — fixture

## Members

- docs/work/todo/TASK-919-alpha.md
- docs/work/todo/TASK-920-beta.md
- docs/work/todo/TASK-921-gamma.md

## Plan

### T1 — Cites TASK-921 first, TASK-919 only in a later mention `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `a.md`
Cites: TASK-921 · split from TASK-919

**Acceptance:** TASK-919 (J2) is mentioned after the leading run, so it does not govern T1 (J1): no mismatch.

### T2 — The same shape, but TASK-920 LEADS the line `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `b.md`
Cites: TASK-920 · split from TASK-921

**Acceptance:** TASK-920 (J2) leads the line, so it governs T2 (J1): a Plan/member mismatch.

### T3a — A letter-suffixed task with no class `[size: S · risk: low · class: execution · AFK]`
Layers: `c.md`
Cites: ADR-001

**Acceptance:** a suffixed heading is a task block like any other; the undeclared class is named.
