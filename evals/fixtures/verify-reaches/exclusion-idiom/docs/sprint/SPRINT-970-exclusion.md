---
sprint: 970
slug: exclusion
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-970 — Exclusion

<!-- MUST FAIL: verify-does-not-reach-target, on the EXCLUSION-IDIOM shape (TD-087 (a)). The named
     method's only reference to docs/beta/ is a construct that PRUNES the path from its own scan
     (a `case … ) continue` arm and a `grep -v`) -- it never examines it. Before the fix, a plain
     `grep -qF` substring test read this as "confirmed reachable", because the path string is
     present in the text even though the code's whole point is to skip it. -->

## Plan

### T1 — beta work
**DoD:**
- [x] docs/beta/ is covered — *Verify: `sh evals/fixtures/verify-reaches/scripts/excludes-beta.sh`*
