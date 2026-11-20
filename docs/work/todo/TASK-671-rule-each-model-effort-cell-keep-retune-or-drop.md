---
id: TASK-671
title: "Rule each model × effort cell keep, retune or drop on the trial sprint's numbers"
type: feature
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-670]
---

# TASK-671 — Rule each model × effort cell keep, retune or drop on the trial sprint's numbers

## Why

TASK-670 ships the matrix as an opt-in trial. Its numbers cannot exist until a real sprint has run the cells, so the verdict is its own task (TASK-402 and TASK-668 precedent), not a box that holds a sprint open.

## Done when

- [ ] **Before the trial starts**, every changed cell has a rule and one baseline figure. The reported-token baselines from the 2026-11-16 session (range midpoint where there is a range, otherwise the single figure):
  - builder-check reader 62k
  - test runner 51.5k
  - repo fetch 83k (n=1)
  - intake worker 86.5k
  - promote worker 151k
  - close worker 114.5k
- [ ] The unit is harness-reported subagent_tokens per dispatch, from the repo-local record. Retries count toward the cell's cost **and** toward the 1.25× cap.
- [ ] Cheaper cells: kept if at least 20% below the baseline **and** no miss is revealed by the check named for it. A missed finding fails the cell; a retry only adds its tokens. Any dispatch over 1.25× baseline reverts that cell to default and is recorded as a drop.
- [ ] Strongest-tier cells: kept if, against the paired run (Codex or the coordinator's own check), they produced at least one real finding the pair missed, with each reviewer's findings logged blind and the coordinator recording which are real.
  - Cost cap: 2× the paired dispatch.
  - Where no same-unit comparator exists (G2 design check, diagnose escalation), the 2× cap is replaced by the trial's strongest-tier dispatch count, at most 6.
  - Past the cap, the remaining strongest-tier cells use defaults and are recorded unmeasured.
- [ ] A cell needs **at least 2 dispatches** to be kept; fewer is inconclusive. Unchanged default, inline and Sonnet-high-build rows are outside the measured set.
- [ ] Each cell is ruled keep, retune or drop with its number. A dropped or never-fired strongest-tier cell goes back to manual-only, with that noted in the ADR-010 addendum. dispatch.md and CONTEXT keep the kept cells only, with the trial label removed.
- [ ] At the verdict the owner decides whether kept cells become the consumer default or stay opt-in.
- [ ] Negative: a different-workload or confounded result is recorded as inconclusive, not as a pass.
- [ ] Negative: a cell with no dispatch during the trial stays on its default and is never marked kept.

## Touches

dispatch.md § Route by classification and § Escalation, CONTEXT § Model tiers, ADR-010 addendum, a verdict note.

## Assumes

- Transcript sums do not reproduce the harness figures (the close worker sums to about 349k raw against 112-117k reported), so the reported figure is the unit. Effort is not in `meta.json`, so the record is the source.
- Tokens are not USD across models. Results are read as direction, not proof (EPIC-024 D4).
- Baselines for the repo fetch, promote and close workers have n=1 to 2, so those cells lean on the 1.25× cap more than on the 20% margin.
- Its "before the trial starts" box is satisfied by TASK-670 (G2 to move or word it); strongest-tier cells carry rules, not baselines.
- Each strongest-tier dispatch records its input size (small inputs give it less to find).
- On a consumer host the intake, promote and close worker briefs name only the execution tier and do not load dispatch.md, so those trial cells reach a coordinator only through its CONTEXT pointer. Record in the trial's per-dispatch record whether each of those cells actually fired (Fable R2, SPRINT-179).

## Tracker

TASK-668 precedent; owner round-1 Q3 and Q4 answers; owner round-2 "Catches what others miss"; trial-budget popup; R1 Fable and Codex reviews; R2 Fable + Codex reviews CLEAR; owner approve 2026-11-16.
