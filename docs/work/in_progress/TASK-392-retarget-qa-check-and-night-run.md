---
id: TASK-392
title: "Retarget qa-check and night-run onto the store"
epic: EPIC-017
sprint: SPRINT-110
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
depends-on: [TASK-377, TASK-390, TASK-391, TASK-387, TASK-382]
---

# TASK-392 — Retarget qa-check and night-run onto the store

## Why

Split from `TASK-383` at the SPRINT-110 promote (owner, 2026-09-29), one task per surface. The gate's
TODO-hygiene and Active Sprint legs and night-run's `reap()` still read the v1 layout, so on a
by-reference sprint they check nothing and `reap()` reports `0 of 0`.

## Done when

- [x] qa-check.sh and night-run.sh read the store. ✓ `b896800` · `dccdca1` (merged `745bb86`): legs 2g/7 read members and sprint files through the new `scripts/lib/sprint-members-cli.ts`; legs 3/5/8 apply only while TODO.md exists (R2); `reap()` counts member `## Done when` boxes. Live SPRINT-110: `dod 4 4`, `units 4 2`, equal to a hand count. Leg 7's TD-row half is vacuous and predates the store (TODO.md holds 0 TD rows): owner ruling, filed as TD-203, and TASK-380 owns it.
- [x] Retained must-FAIL fixture per changed leg; outside review, worktree-isolated. ✓ must-FAIL per leg + reap case, each with a sibling (`evals/run-qa-store-legs-fixtures.ts` `36 pass, 0 fail` · reap/rollup/outcome/revise-loop all green · rollup test 46/0); 19 seeded breaks; isolated review CLEAR (~11 probes, 3 census-zero TD).

## Touches

scripts/qa-check.sh · scripts/night-run.sh · their eval harnesses + fixtures

## Assumes

none

## Amended 2026-09-29

- **Carried from `TASK-383`'s hand-off (SPRINT-109 T1, `3c85e84`):** `qa-check.sh` ~654, 819-828, 870 (TODO hygiene,
  Active Sprint). Re-derive the line numbers before starting; they predate SPRINT-109's edits.

## Amended 2026-09-26 (carried from TASK-383)

- Carried from SPRINT-107 T4: `scripts/night-run.sh` `reap()` still counts `- [x]`/`- [ ]` in the sprint FILE and `### Tn` blocks there. The prose contract (`skills/orchestrator/references/night-run.md` Part 4) now counts `## Done when` boxes across member files (Members ∪ `sprint:` stamps), and a unit is delivered when every member its `Cites:` names has no open box. On a by-reference sprint the script reports `0 of 0`. The contract leads, so retarget the script to it.

## Tracker

EPIC-017 scope 6 · split from TASK-383
