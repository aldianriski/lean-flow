---
id: TASK-586
title: "Set the release arm's worker count from a 3- and 4-worker capacity check"
epic: EPIC-023
sprint: SPRINT-160
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: X
authority: J2
origin: manual
state: ready
depends-on: [TASK-581]
---

# TASK-586 — Set the release arm's worker count from a 3- and 4-worker capacity check

## Why
EPIC-023 D16 (owner, 2026-11-02): a full arm runs only before a release, and the owner asked for test-runner-style workers so
the check is faster without blocking. Two workers took an arm to about 75 minutes (A4b); on this PC RAM, not CPU, is the limit
(13.7 GB, 3.2 GB free at two workers), so a higher count has to be measured, not assumed.

## Done when
- [x] A capacity check at N = 3 and at N = 4 (A4a's arms and pin, a scratch log, slots of tasks A4a passed in both trials) reports ✓ 14 slots, 2026-11-03 01:27-01:57 UTC, 19.39 USD; per-N report in the SPRINT-160 log, read by the owner (popup)
      per N: timeouts, infra attempts, low-memory kills, the lowest free RAM seen, and each slot's outcome against A4a's serial
      trials; the owner reads it.
- [x] The highest N with no timeout, no infra attempt, no low-memory kill and unchanged outcomes is adopted for the next release ✓ owner ruling 2026-11-03: no N above 2 is clean (N = 3: 1 infra attempt; N = 4: 1 infra attempt, 2 changed outcomes), so no amendment and Amendment 8's N = 2 stands; TD-289
      arm by an owner-signed amendment before that arm runs; earlier arms stay as measured.

## Touches
`evals/ab/PREREGISTRATION.md` (amendment) · a scratch schedule and log (not committed)

## Assumes
- Runs after arm A4b exits (TASK-581), so the check does not compete with a measured arm.

## Tracker
EPIC-023 D16 · SPRINT-158 T1 (TASK-582, `--workers`)
