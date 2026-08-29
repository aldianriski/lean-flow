---
sprint: 909
slug: fx
status: active
plan_commit: abc1234
approval_envelope: goal · scope · acceptance · design · verification · j1-delegation · capabilities · repair-policy · budget · stop-conditions @ 1b14d61
---

# SPRINT-909 — fixture

## Plan

### T1 — a J1 task that ran `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `a.md`
Depends-on: none

**Acceptance:** the J1 sibling stays green.

**DoD:**
- [x] a thing

### T2 — a human-reserved task executed unattended behind a reap-gate defect `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `b.md`
Depends-on: none

**Acceptance:** a run that recorded its `approval_envelope:` before firing, then hit a reap-gate
defect that stopped it ever writing `terminal · `, is still caught -- the envelope backstop
(TD-124) does not depend on the same mechanism the reap-gate defect breaks.

**DoD:**
- [x] a thing
