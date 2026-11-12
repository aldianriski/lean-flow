---
id: TASK-656
title: "Shorten the orchestrator skill: merge R02 R06 R14 R19 R21 R27 R37 R64 and name the record writer at each record step"
epic: EPIC-025
sprint: SPRINT-173
priority: P1
size: M
risk: med
autonomy: AFK
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-652, TASK-653]
---

# TASK-656 — Orchestrator skill merges and writer wiring

## Why

EPIC-025 condition 2, owner ruling "Accept all": 8 record merges with 0 cuts, so every required record keeps its content. R14 follows TASK-652's amendment. Consumer-facing: a consumer feels the shorter procedure.

## Done when

- [ ] `skills/orchestrator/SKILL.md` and `references/dispatch.md`, `review-scoping.md`, `builder-check.md`, `night-run.md` carry the merges: R02 batch progress with the accepted result; R06 blocker via R05; R14 moves ride in the task's own commits; R19 drop the extra revise wrapper only; R21 builder-check reads R23's approved design;
  R27 worktree-base result attached to the dispatch record; R37 rollup reads R15's evidence; R64 progress, count and evidence generated once. Every decision, blocker and named failure is retained. `SKILL.md` is at most about 140 lines.
- [ ] Wiring check, derived: each of the writer's `consequence`, `review`, `builder-check`, `tick` and `move` commands is named by at least one shipped orchestrator step as "lean-flow's own:", and a second query from the writer's command list agrees. No consumer-facing text depends on `scripts/`.
- [ ] A read-through of the diff against the rows loses no required record line, and the full gate is green, including doc-caps and token budget.
- [ ] Negative: a read-through of `review-scoping.md` still requires the `consequence ·` line before any depth is chosen and still FAILs a missing review. No step tells a hand-typed line to default to `low`.

## Touches

`skills/orchestrator/SKILL.md`; `skills/orchestrator/references/{dispatch,review-scoping,builder-check,night-run}.md`. Disjoint from TASK-657.

## Assumes

- Skills keep describing line formats for consumers; the writer is named only as "lean-flow's own:".
- Amendment scope: all of a task's moves ride in its work commits.

## Tracker

EPIC-025 conditions 2 and 3; R02 R06 R14 R19 R21 R27 R37 R64.
