---
sprint: 964
slug: mixed
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-964 — Mixed

<!-- MUST FAIL: verify-does-not-reach-target, on T2 only.

     One Plan, two criteria, one violation. A file-wide grep for the method and a file-wide grep for
     the target would call this file consistent, because both strings are present somewhere -- and the
     reverse arrangement would let the good clause vouch for the bad one. This fixture is what holds
     the checker to reading one clause at a time. Sibling of review-depth's multi-task-mixed, and the
     same bug in a different family. -->

## Plan

### T1 — alpha work
**DoD:**
- [x] docs/alpha/ is covered — *Verify: `sh evals/fixtures/verify-reaches/scripts/reaches-alpha.sh`*

### T2 — beta work
**DoD:**
- [x] docs/beta/ is covered — *Verify: `sh evals/fixtures/verify-reaches/scripts/reaches-alpha.sh`*
