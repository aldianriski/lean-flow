---
id: TASK-570
title: "Handoff writes `path § heading` pointers, and a resume reads each pointed section"
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

# TASK-570 — Handoff writes `path § heading` pointers, and a resume reads each pointed section

## Why
EPIC-023 S2. The handoff points to durable artifacts by path only, so a fresh session must find the right section itself
or miss it. Frozen surface (carry-through): admitted on S0's measured defect for symptom 3, log reference filled in from
TASK-545.

## Done when
- [ ] `/handoff` writes `path § heading` for each durable fact it refers to, with the pointer rule inline.
- [ ] `/prime` resuming from a handoff reads each pointed section and flags a missing or ambiguous one on its Handoff row.
- [ ] Shown on one real handoff and resume through the installed plugin.

## Touches
the handoff skill · the prime skill (its handoff read, within its line cap)

## Assumes
- **blocked-by:** S0 (TASK-545) records symptom 3 as a measured defect; TASK-568 sets the pointer rule.

## Tracker
EPIC-023 Closed-when S2 · research §6 row S2 (handoff)
