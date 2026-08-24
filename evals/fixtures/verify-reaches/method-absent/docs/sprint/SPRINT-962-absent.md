---
sprint: 962
slug: absent
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-962 — Absent

<!-- MUST FAIL: verify-method-absent.

     The EXISTS half. A criterion naming a method that is not in the repository at all -- a mis-typed
     path, or a script planned and never written. Kept as its own case because EXISTS and REACHES fail
     for different reasons and a checker collapsing them would report the wrong finding, which is the
     L-058 complaint about unnamed failures one level down. -->

## Plan

### T1 — something
**DoD:**
- [x] the docs/alpha/ tree is checked — *Verify: `sh scripts/lib/check-nothing-like-this-exists.sh`*
