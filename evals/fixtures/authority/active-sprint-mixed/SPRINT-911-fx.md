---
sprint: 911
slug: fx
status: active
plan_commit: abc1234
---

# SPRINT-911 — fixture

## Plan

### T1 — a J1 task that ran `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `a.md`
Depends-on: none

**Acceptance:** the J1 sibling stays green beside three differently-shaped J2 tasks in the same file.

**DoD:**
- [x] a thing

### T2 — a human-reserved task correctly held `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `b.md`
Depends-on: none

**Acceptance:** a J2 task that parked and was never executed is honoured.

**DoD:**
- [ ] a thing

### T3 — a human-reserved task parked then worked anyway `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `c.md`
Depends-on: none

**Acceptance:** a park record with no owner-ruling, beside an execution record, is a bypass.

**DoD:**
- [x] a thing

### T4 — a human-reserved task executed attended `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `d.md`
Depends-on: none

**Acceptance:** executed with a human present, no park record, and no unattended-run signal anywhere
in this log -- honoured, not refused (TD-123).

**DoD:**
- [x] a thing
