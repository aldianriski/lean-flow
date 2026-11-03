---
id: TASK-600
title: "Serialise clinic database provisioning in A/B trials, then re-check three workers"
type: debt
epic: EPIC-023
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
- [ ] Clinic provisioning is serialised across concurrent trials (one clinic `pg_ctl start` at a time); a selftest fails on
      two overlapping provisions without it and passes with it.
- [ ] A capacity check at N = 3 on A4a's arms and pin (TASK-586's tasks, scratch log) has no provisioning failure and every
      outcome as in A4a's serial trials, or the owner rules the differences noise; free RAM is sampled and reported.
- [ ] When clean, the next release arm's amendment adopts N = 3; TD-289 is resolved.

## Touches
`evals/ab/lib/` (trial provisioning) · `evals/ab/selftest.ts` · `TECH-DEBT.md`

## Assumes
- RAM headroom at N = 3 is enough (lowest free RAM at N = 3 was 375 MB, during the pilot; check again after the fix).

## Tracker
TD-289 · TASK-586 · EPIC-023 D19
