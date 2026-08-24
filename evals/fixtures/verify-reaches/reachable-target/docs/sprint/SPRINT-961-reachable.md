---
sprint: 961
slug: reachable
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-961 — Reachable

<!-- CONTROL: must stay PASS, and must report a NON-ZERO denominator.

     The positive path, and the reason it is a fixture rather than a live check: this repository's own
     sprint file confirms 0 targets, so its green is vacuous and could not tell a working checker from
     a broken one (L-156 -- the SPRINT-080 shape, where lookalike fixtures did the work the repo could
     not). Here the criterion claims docs/alpha/ and the named method examines docs/alpha/. Differs
     from the unreachable case in one token. -->

## Plan

### T1 — something about alpha
**DoD:**
- [x] every file under docs/alpha/ carries an ownership header — *Verify: `sh evals/fixtures/verify-reaches/scripts/reaches-alpha.sh`*
