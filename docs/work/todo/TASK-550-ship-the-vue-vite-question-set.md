---
id: TASK-550
title: "Ship the Vue/Vite question set"
epic: EPIC-023
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-549]
---

# TASK-550 — Ship the Vue/Vite question set

## Why
D12's second frontend profile; content only, on TASK-549's match-and-load mechanism. Not frozen under ADR-053. G2
review-round cap: 2.

## Done when
- [ ] A short curated Vue/Vite question set ships beside the React/Vite one, in the same shape.
- [ ] A real `init` through the installed plugin loads it on a compass or template-vue snapshot (Vue + Vite) and does not on a
  React + Vite snapshot.

## Touches
the profiles folder in the lean-doc-generator references

## Assumes
- **blocked-by:** TASK-549 (the set mechanism).
- Questions stay within the seven profile topics (I-6).
- Exercises on snapshot copies in `D:\Research`, never an A/B repo (I-2).

## Tracker
EPIC-023 Closed-when S1 · research §5 D12 · S1 intake I-2, I-6 (2026-10-30)
