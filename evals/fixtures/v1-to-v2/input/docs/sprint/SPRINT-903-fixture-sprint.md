---
sprint: 903
slug: fixture-sprint
epic: none
owner: Maintainer
last_updated: 2026-09-24
status: active
plan_commit: 0000000
gates_signed: G1,G2 @ 0000000
close_commit: [sha — set at close]
update_trigger: fixture -- static, never refreshed
---

# SPRINT-903 — Fixture Sprint (v1-to-v2 harness input, not a real sprint)

## Plan

### T1 — Cap the upload step's total wall time `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/upload.ts`
Depends-on: none
Cites: `TASK-915`

**DoD:**
- [x] the upload step aborts past a fixed wall-clock ceiling — verified against a seeded 90s hang

### T2 — Retry the upload step's auth handshake `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/upload.ts`
Depends-on: none
Cites: `TASK-916`

**DoD:**
- [ ] the upload step retries the auth handshake once before failing
