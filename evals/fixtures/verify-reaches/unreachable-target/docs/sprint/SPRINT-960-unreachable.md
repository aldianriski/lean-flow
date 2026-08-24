---
sprint: 960
slug: unreachable
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-960 — Unreachable

<!-- MUST FAIL: verify-does-not-reach-target.

     L-136's fourth sighting, reduced to two directories. The criterion claims docs/beta/; the named
     method examines docs/alpha/ and nothing else. It runs, it is green, and it says nothing whatever
     about the thing the criterion is about. Nobody reading the ticked box afterwards can tell the
     difference between this and a criterion that was actually satisfied -- which is the property that
     makes it worth a gate rather than a caution. -->

## Plan

### T1 — something about beta
**DoD:**
- [x] every file under docs/beta/ carries an ownership header — *Verify: `sh evals/fixtures/verify-reaches/scripts/reaches-alpha.sh`*
