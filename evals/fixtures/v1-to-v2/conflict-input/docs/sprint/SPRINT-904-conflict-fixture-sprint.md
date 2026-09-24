---
sprint: 904
slug: conflict-fixture-sprint
epic: none
owner: Maintainer
last_updated: 2026-09-24
status: active
plan_commit: 0000000
gates_signed: G1,G2 @ 0000000
close_commit: [sha — set at close]
update_trigger: fixture -- static, never refreshed
---

# SPRINT-904 — Conflict Fixture Sprint (v1-to-v2 harness input, not a real sprint)

## Plan

### T1 — Verify the upload step's checksum before finishing `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/upload.ts`
Depends-on: none
Cites: `TASK-917`

**DoD:**
- [x] the upload step verifies a checksum before reporting success
