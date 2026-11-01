---
id: TASK-572
title: "Traced run on both A/B repos, arm A3 measured vs A2 and A1, and the pointer rule documented for adopters"
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
depends-on: [TASK-567, TASK-568, TASK-569, TASK-570, TASK-571, TASK-555]
---

# TASK-572 — Traced run on both A/B repos, arm A3 measured vs A2 and A1, and the pointer rule documented for adopters

## Why
EPIC-023 S2's Closed-when: carry-through is shown read, not merely pointed at, and measured as its own arm (A3 = A2 + S2).
Frozen surface: admitted on S0's measured defect for symptom 3, log reference filled in from TASK-545.

## Done when
- [ ] A traced run on each A/B repo shows every required fact of each lost-detail task read by the builder through a
  resolved pointer (transcript evidence), and every blocking site from TASK-567 is fixed.
- [ ] Arm A3 is built in the A/B harness and measured against A2 and A1 on the pre-registered task set, and the result is
  recorded in the research log with its verdict against the minimum gain.
- [ ] README, CHANGELOG and `.claude/CONTEXT.md` describe the pointer rule for adopters.

## Touches
`evals/ab/` (arm A3) · `docs/research/logs/` · README · CHANGELOG · `.claude/CONTEXT.md`

## Assumes
- **blocked-by:** S0 (TASK-545) records symptom 3 as a measured defect; arm A2 (TASK-555) is measured first (owner ruling
  2026-11-01: A2 runs right after S0).
- A3 runs on the same task set and harness version as A0 to A2.

## Tracker
EPIC-023 Closed-when S2 · research §6 row S2 · research §7 (arms)
