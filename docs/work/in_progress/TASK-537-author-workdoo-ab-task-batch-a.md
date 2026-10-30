---
id: TASK-537
title: "Author workdoo A/B task batch A (4 tasks)"
epic: EPIC-023
sprint: SPRINT-151
priority: P2
size: M
risk: high
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-536]
---

# TASK-537 — Author workdoo A/B task batch A (4 tasks)

## Why
Half of workdoo's frozen 8-task corpus; the task set is what the whole epic is judged on, so it is written by an isolated author before any measurement. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [x] Four tasks exist in `evals/ab/tasks/workdoo/`, covering this batch's categories: convention-bearing feature · business-rule change · bug · under-documented area. ✓ 11b82d09: four tasks in the workdoo batch-a folder
- [x] Each task declares its scope: allowed files/dirs (`Layers:`) and a behaviour Out-of-scope list — the inputs the D9 G2 check reads. ✓ 11b82d09: each task.json declares layers and an outOfScope list
- [x] Each task has a deterministic acceptance test that fails on the untouched repo and passes on a reference solution of ≤ ~150 changed lines; both runs recorded. A task needing more is replaced, not grown. ✓ 11b82d09: coordinator re-ran each in a fresh baseline on Node 24: red before, green after a reference within the size bound (verify.json)
- [x] Each task names and freezes the regression graders that apply (workdoo: typecheck · build · the non-browser `verify:*` scripts covering the area; lint is not configured, recorded not applicable). ✓ 11b82d09: graders frozen per task: typecheck, build, the non-browser verify scripts covering the area; lint recorded not applicable
- [x] Symptom tags set per task (convention · business-rule · lost-detail); at least one lost-detail task, whose acceptance depends on a fact found only in `BUSINESS-NOTES.md`. ✓ 11b82d09: symptom tags set; one lost-detail task, its code-readable part accepted as the workdoo limit by owner ruling (scope-change)
- [x] Authored by an isolated agent whose brief holds only the repo, its answers file and the category list — never `lean-flow-3-foundation.md`, EPIC-023 or other 3.0 material; the brief is retained. ✓ 11b82d09: authored by an isolated sonnet agent in a snapshot outside this repo; the brief is retained as BRIEF.md
- [x] Owner realism review of the batch signed. ✓ 11b82d09: owner realism review signed by popup 2026-10-30

## Touches
`evals/ab/tasks/workdoo/`

## Assumes
- Trials and authoring run on `D:\Research\workdoo` copies, never `D:\Project\workdoo`.

## Tracker
research §7 Tasks
