---
id: TASK-567
title: "Audit where lost details drop: S0's transcripts on the lost-detail tasks, then the five carriers"
epic: EPIC-023
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-545]
---

# TASK-567 — Audit where lost details drop: S0's transcripts on the lost-detail tasks, then the five carriers

## Why
EPIC-023 S2 (Carry-through). Admitted under ADR-053 only on S0's measured defect for symptom 3 (lost detail); the log
reference is filled in here when TASK-545 records it. The audit comes first because its blocking sites decide what
TASK-568 to TASK-571 must fix.

## Done when
- [ ] An audit doc in `docs/research/` names, for each A1 trial of the four lost-detail tasks (two per A/B repo), the hop
  where the required fact was lost (intake to task, task to Plan, Plan to builder brief, builder to review, session to
  handoff), quoting the transcript evidence.
- [ ] A desk pass over the five carriers (task file, sprint Plan, builder brief, review brief, handoff) adds any further loss
  site, each with its location.
- [ ] Each site is classed blocking or deferrable; every deferrable one is a TD row, and every blocking one names the S2 task
  that fixes it.

## Touches
`docs/research/` (new audit doc) · `TECH-DEBT.md` · read-only: S0 trial transcripts, the five carriers

## Assumes
- **blocked-by:** S0 (TASK-545) records symptom 3, lost detail, as a measured defect. If it reports not reproduced, S2 admits
  nothing and this task moves to `cancel/` with that reason.
- The A1 trial transcripts of the lost-detail tasks are retained by the harness.

## Tracker
EPIC-023 Closed-when S2 · research §6 row S2 (lost-detail audit) · owner ruling 2026-11-01 (trace S0 + desk audit)
