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

- [x] `skills/orchestrator/SKILL.md` and `references/dispatch.md`, `review-scoping.md`, `builder-check.md`, `night-run.md` carry the merges: R02 batch progress with the accepted result; R06 blocker via R05; R14 moves ride in the task's own commits; R19 drop the extra revise wrapper only; R21 builder-check reads R23's approved design; ✓ eight merges landed (1dea19a9), every decision, blocker and named failure kept per scoped review CLEAR; SKILL.md 140 lines, no new line over 400 after one retry
  R27 worktree-base result attached to the dispatch record; R37 rollup reads R15's evidence; R64 progress, count and evidence generated once. Every decision, blocker and named failure is retained. `SKILL.md` is at most about 140 lines.
- [x] Wiring check, derived: each of the writer's `consequence`, `review`, `builder-check`, `tick` and `move` commands is named by at least one shipped orchestrator step as "lean-flow's own:", and a second query from the writer's command list agrees. No consumer-facing text depends on `scripts/`. ✓ grep: one 'lean-flow's own:' hit each for record-line.ts consequence, review, builder-check, tick, move under skills/orchestrator; the tool's command list minus scope-change agrees
- [x] A read-through of the diff against the rows loses no required record line, and the full gate is green, including doc-caps and token budget. ✓ scoped review swept every scripts/ parser of a changed record, none broken; off-host QA_FULL at 25284d82: 236 pass 0 fail, caps and token budget PASS
- [x] Negative: a read-through of `review-scoping.md` still requires the `consequence ·` line before any depth is chosen and still FAILs a missing review. No step tells a hand-typed line to default to `low`. ✓ review-scoping.md still requires the consequence line before depth and FAILs a missing review; grep for a low default over skills/orchestrator is empty

## Touches

`skills/orchestrator/SKILL.md`; `skills/orchestrator/references/{dispatch,review-scoping,builder-check,night-run}.md`. Disjoint from TASK-657.

## Assumes

- Skills keep describing line formats for consumers; the writer is named only as "lean-flow's own:".
- Amendment scope: all of a task's moves ride in its work commits.

## Tracker

EPIC-025 conditions 2 and 3; R02 R06 R14 R19 R21 R27 R37 R64.
