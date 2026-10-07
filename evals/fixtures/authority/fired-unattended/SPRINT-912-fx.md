---
sprint: 912
slug: fx
status: active
plan_commit: abc1234
---

# SPRINT-912 — fixture

## Plan

### T1 — a J1 task that ran `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `a.md`
Depends-on: none

**Acceptance:** the J1 sibling stays green.

**DoD:**
- [x] a thing

### T2 — a human-reserved task executed unattended, the run died before the reaper `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `b.md`
Depends-on: none

**Acceptance:** a run that wrote its `fired · ` line at launch and then died before `reap()` ever
appended is still caught -- no `terminal · ` line and no `approval_envelope:` exist, so the fired
line (TD-124's launcher-written fact) is the only surviving evidence the run was unattended.

**DoD:**
- [x] a thing
