---
sprint: 966
slug: prose
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-966 — Prose

<!-- MUST FAIL: verify-does-not-reach-target, and it must fail for the RIGHT reason.

     The named method's comment mentions the claimed path; its code never touches it. A checker that
     matched the whole file would call this reachable and go green. This is the only case that holds
     the comment-stripping line in place. -->

## Plan

### T1 — gamma work
**DoD:**
- [x] docs/gamma/ is covered — *Verify: `sh evals/fixtures/verify-reaches/scripts/prose-only.sh`*
