---
id: TASK-549
title: "Ship the React/Vite question set and load sets by detected stack"
epic: EPIC-023
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-547]
---

# TASK-549 — Ship the React/Vite question set and load sets by detected stack

## Why
Owner decision D2: hybrid framework knowledge, a few curated shipped question sets plus the deep scan. The first set also
builds how a set is matched and loaded, so TASK-550 and TASK-551 only add content. Not frozen under ADR-053. G2
review-round cap: 2.

## Done when
- [ ] A short curated React/Vite question set ships in the lean-doc-generator skill, asking only about conventions a scan cannot
  settle; `init` loads a set only when detection matches its stack, and otherwise runs scan-only, unchanged.
- [ ] A set question is asked only when the scan left it open; its answer lands in conventions in use with its source.
- [ ] A real `init` through the installed plugin loads the set on a talixa-hris or temidev-project snapshot (React + Vite), and
  does not on the portfolio-sveltekit snapshot.

## Touches
lean-doc-generator init reference · a new profiles folder in the lean-doc-generator references

## Assumes
- **blocked-by:** TASK-547 (the scan and the conventions section exist).
- Questions stay within the seven profile topics (I-6).
- Exercises on snapshot copies in `D:\Research`, never an A/B repo (I-2).

## Tracker
EPIC-023 Closed-when S1 · research §5 D2, D12 · S1 intake I-2, I-6 (2026-10-30)
