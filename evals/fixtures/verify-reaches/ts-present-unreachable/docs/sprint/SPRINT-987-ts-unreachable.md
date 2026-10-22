---
sprint: 987
slug: ts-unreachable
owner: Maintainer
last_updated: 2026-10-22
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-987 — ts unreachable

<!-- MUST-FAIL (TD-191): the `.ts` checker names the claimed target only in a `//` comment. -->

## Plan

### T1 — something about beta
**DoD:**
- [x] every file under docs/beta/ carries an ownership header — *Verify: `bun evals/fixtures/verify-reaches/scripts/comment-only-beta.ts`*
