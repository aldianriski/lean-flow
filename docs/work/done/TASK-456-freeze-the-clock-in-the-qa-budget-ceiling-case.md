---
id: TASK-456
title: "Freeze the clock in the qa-budget ceiling case, and name an empty capture"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-130
---

# TASK-456 — Freeze the clock in the qa-budget ceiling case, and name an empty capture

## Why

Case 12 of the always-on qa-budget harness asserts an exact elapsed figure derived from the wall clock, so a busy host
ticks it from `1263s` to `1264s` and reddens the gate on correct code (TD-167, three sightings). Under memory pressure the
same harness has also reported an empty `got:`, a child that printed nothing, which reads as an assertion failure. A fixture
that reddens at random trains people to re-run until green.

## Done when

- [x] Case 12's elapsed value is deterministic: `date` is shadowed inside the case's subshell so the ceiling block computes exactly 1263 s, and the exact assertion is kept. ✓ acccc165 (T2 3dc85e47 + retry f3a6e64e); date shadowed in case 12's subshell, delta=0 across sleep 2; exact 1263s assertion kept
- [x] The must-FAIL property holds: with the ceiling block seeded to count the run as a FAIL, case 12 reddens; the seed is shown landed (`cmp` against pristine) and the restore proven the same way, while the sibling control stays green. ✓ seeded bad in the real ceiling block (cmp: byte 104699 line 1612) -> case 12 red, case 13 green; restored cmp-identical, hash == HEAD blob
- [x] An empty capture from the case's subshell prints a named harness-environment FAIL, distinct from an output mismatch. ✓ named harness-env FAIL with exit status, no asserted cause; both shapes seeded and fire (out12 empty: exit 0; block exits early: exit 1)
- [x] One full run of the harness on the real gate block recorded, and TD-167 marked resolved with that evidence. ✓ full harness green on integ-130 after the merge; TD-167 resolved in TECH-DEBT.md

## Touches

evals/run-qa-budget-fixtures.sh · TECH-DEBT.md (TD-167, coordinator)

## Assumes

- the fix stays harness-only: `scripts/lib/qa-budget-check.sh` gains no `now` seam, keeping clear of the TD-117 cost path (owner ruling at intake, 2026-10-19).
- the harness is maintainer-only (always-on in this repo's gate, not adopter-run), so the "Other G" bar applies (ADR-050).

## Tracker

- TD-167 · ADR-042 (case 12 exists to keep the ceiling branch uncounted)
