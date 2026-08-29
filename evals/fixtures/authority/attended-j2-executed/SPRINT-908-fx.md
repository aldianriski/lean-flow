---
sprint: 908
slug: fx
status: active
plan_commit: abc1234
---

# SPRINT-908 — fixture

## Plan

### T1 — a J1 task that ran `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `a.md`
Depends-on: none

**Acceptance:** the J1 sibling stays green while the attended J2 case is separately proven.

**DoD:**
- [x] a thing

### T2 — a human-reserved task executed with a human present `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `b.md`
Depends-on: none

**Acceptance:** a J2 step executed under an attended session -- with no unattended run ever touching
this log -- is honoured without a park record, because the park protocol exists for a headless run
with no ask channel and this run had one (TD-123, night-run.md Part 0).

**DoD:**
- [x] a thing
