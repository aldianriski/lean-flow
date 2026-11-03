---
id: TASK-600
title: "Serialise clinic database provisioning in A/B trials, then re-check three workers"
type: debt
epic: EPIC-023
sprint: SPRINT-161
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-600 — Serialise clinic database provisioning in A/B trials, then re-check three workers

## Why
TD-289: two clinic trials that provision at the same moment can fail `pg_ctl start`, so release arms stay at two workers
(about 75 minutes for 32 slots). Owner ruling 2026-11-03 (SPRINT-161, after a Codex process review; EPIC-023 D19): a release
arm earns three workers only once this is fixed and a capacity check shows N = 3 changes no outcome against serial runs.

## Done when
- [x] Clinic provisioning is serialised across concurrent trials (one clinic `pg_ctl start` at a time); a selftest fails on ✓ cherry-picked from `40b2a264`; S78 fails with the lock disabled, passes with it; selftest 83/83 on main
      two overlapping provisions without it and passes with it.
- Boxes 2 and 3 (the N = 3 capacity check, adopting N = 3) moved to TASK-603 by SPRINT-161's scope-change.

## Touches
`evals/ab/lib/` (trial provisioning) · `evals/ab/selftest.ts` · `TECH-DEBT.md`

## Assumes
- RAM headroom at N = 3 is enough (lowest free RAM at N = 3 was 375 MB, during the pilot; check again after the fix).

## Tracker
TD-289 · TASK-586 · EPIC-023 D19
