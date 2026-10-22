---
sprint: 988
slug: ts-unreachable-jsdoc
owner: Maintainer
last_updated: 2026-10-22
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-988 — ts unreachable jsdoc

<!-- MUST-FAIL (TD-191): the `.ts` checker names the claimed target only on a JSDoc ` * ` line. -->

## Plan

### T1 — something about beta
**DoD:**
- [x] every file under docs/beta/ carries an ownership header — *Verify: `bun evals/fixtures/verify-reaches/scripts/jsdoc-only-beta.ts`*
