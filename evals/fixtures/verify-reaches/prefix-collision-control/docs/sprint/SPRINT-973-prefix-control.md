---
sprint: 973
slug: prefix-control
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-973 — Prefix Control

<!-- CONTROL: must stay PASS. Sibling of SPRINT-972-prefix: identical criterion shape, claiming the
     same target src/db, against a method that genuinely touches src/db/ (not merely src/dbtools/).
     Differs from the must-FAIL case in exactly one path component. -->

## Plan

### T1 — db work, for real
**DoD:**
- [x] src/db is covered — *Verify: `sh evals/fixtures/verify-reaches/scripts/touches-db.sh`*
