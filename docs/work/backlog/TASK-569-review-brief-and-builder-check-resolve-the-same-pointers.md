---
id: TASK-569
title: "The review brief and the builder check receive the same pointed sections"
epic: EPIC-023
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-568]
---

# TASK-569 — The review brief and the builder check receive the same pointed sections

## Why
EPIC-023 S2. The builder-to-review hop is where a carried ruling drifted and only a reviewer briefed with the quoted ruling
caught it (L-122). Frozen surface (review routing brief): admitted on S0's measured defect for symptom 3, log reference
filled in from TASK-545.

## Done when
- [ ] The review brief and the builder-check reader receive each of the task's pointed sections quoted, resolved by the same
  rule as TASK-568, with a miss stated in the brief.
- [ ] The reviewer judges the diff against the pointed sections; one real review on a snapshot shows a pointed rule in the
  brief and a finding or a pass that cites it.

## Touches
the orchestrator's review-scoping and builder-check references

## Assumes
- **blocked-by:** S0 (TASK-545) records symptom 3 as a measured defect; TASK-568 sets the pointer rule.

## Tracker
EPIC-023 Closed-when S2 · research §6 row S2 (review brief)

## Amended 2026-11-01
Not admitted (owner, /triage): S0 recorded symptom 3, lost detail, as not reproduced under R-b (`docs/research/logs/ab-measurements.md` § Report 2026-11-01), so S2 admits nothing. Revisit only per `.out-of-scope/pointer-carry-through.md`.
