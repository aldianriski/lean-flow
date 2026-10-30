---
id: TASK-555
title: "Run arm A2 on both A/B repos and record it against A1"
epic: EPIC-023
priority: P2
size: M
risk: high
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-554, TASK-545]
---

# TASK-555 — Run arm A2 on both A/B repos and record it against A1

## Why
The epic's S1 Closed-when line ends on "arm A2 measured vs A1"; research §7 stages the arms. Not frozen under ADR-053:
maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2.

## Done when
- [ ] A2 setup: a real `init` on the workdoo and clinic-ab snapshots through the installed plugin at the pinned S1 revision,
  every popup answered verbatim from the frozen answers files, transcripts kept; the produced docs hashed as the frozen A2
  discovery set.
- [ ] A2 trials run as pre-registered (k = 2, 2 repos × 8 tasks) and graded by the S0 pipeline; A2 vs A1 recorded in the A/B
  research log with the primary endpoint, each symptom measure, cost against the 2× cap and the A0 floor.
- [ ] The result is ruled ship-eligible, inconclusive or failed by the pre-registered procedure, recorded in that log.

## Touches
`evals/ab/` (arm definition only) · `docs/research/logs/ab-measurements.md`

## Assumes
- **blocked-by:** TASK-554 (S1 complete) and TASK-545 (A0/A1 baseline, which needs the frozen pre-registration TASK-544 and the
  pipeline TASK-543).
- This is the first time S1 touches an A/B repo (I-2). The answers files cover the seven profile topics before they freeze (I-6).
- Paid runs, maintainer-only.

## Tracker
EPIC-023 Closed-when S1 · research §7 · S1 intake I-2, I-6 (2026-10-30)
