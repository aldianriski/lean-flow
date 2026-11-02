---
id: TASK-555
title: "Run arm A2 on both A/B repos and record it against A1"
epic: EPIC-023
sprint: SPRINT-154
priority: P2
size: M
risk: high
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-554, TASK-545]
---

# TASK-555 — Run arm A2 on both A/B repos and record it against A1

## Why
The epic's S1 Closed-when line ends on "arm A2 measured vs A1"; research §7 stages the arms. Not frozen under ADR-053:
maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2.

## Done when
- [x] A2 setup: a real `migrate` on the frozen A1 snapshots of workdoo and clinic-ab through the installed plugin at the pinned S1 revision,
  every popup answered verbatim from the frozen answers files, transcripts kept; the produced docs hashed as the frozen A2
  discovery set. ✓ clinic-a2 (`b56ea960`) and workdoo-a2 (`0c9c20d4`) migrated from the S1 pin by the setup operator, popups answered
  from the frozen answers files and four owner ruling classes, operator logs and transcripts kept; frozen by manifest, hashed in
  Amendment 6 (`e6b621bd`)
- [x] A2 trials run as pre-registered (k = 2, 2 repos × 8 tasks) and graded by the S0 pipeline; A2 vs A1 recorded in the A/B
  research log with the primary endpoint, each symptom measure, cost against the 2× cap and the A0 floor. ✓ 32/32 slots, 0
  infra-lost, VALID on its own slots; `docs/research/logs/ab-measurements-a2.md` § Report 2026-11-02 (A2 78.1% vs A1 81.2%,
  A0 89.6%; cost 0.93x A1)
- [x] The result is ruled ship-eligible, inconclusive or failed by the pre-registered procedure, recorded in that log. ✓ **failed**
  (below the A0 floor; no gain and no symptom regression vs A1), owner-signed 2026-11-02, in the A2 log's report

## Touches
`evals/ab/` (arm definition only) · `docs/research/logs/ab-measurements.md`

## Assumes
- This is the first time S1 touches an A/B repo (I-2). The answers files cover the seven profile topics before they freeze (I-6).
- Paid runs, maintainer-only.

## Tracker
EPIC-023 Closed-when S1 · research §7 · S1 intake I-2, I-6 (2026-10-30)
