---
sprint: 900
slug: depends-on-omitted-fixture
owner: Maintainer
last_updated: 2026-08-01
status: active
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- constructed must-FAIL input for evals/run-layers-completeness-fixtures.sh
  (TD-020's Depends-on: half). Unlike sprint-041-reconstructed.md, this is NOT a recorded incident --
  no real sprint has shipped this omission yet. It is a minimal, hand-built Plan whose only purpose
  is exercising the second of the two checks scripts/lib/check-layers-completeness.sh performs.
---

# SPRINT-900 — Depends-on Omission (constructed fixture, must-FAIL input)

## Plan

### T1 — Add the base schema `[size: S · risk: low · class: execution · AFK]`
Layers: `fixtures/schema.md`
Depends-on: none

Introduces the base schema other tasks build on.

**Acceptance:** `fixtures/schema.md` documents the base schema.

**DoD:**
- [ ] `fixtures/schema.md` created with the base schema

### T2 — Extend the schema for reporting `[size: S · risk: low · class: execution · AFK]`
Layers: `fixtures/report.md`
Depends-on: none

Builds directly on the schema T1 lands, adding a reporting view over it.

**Acceptance:** `fixtures/report.md` documents the reporting extension on top of what T1 shipped.

**DoD:**
- [ ] `fixtures/report.md` created, extending the schema T1 added
