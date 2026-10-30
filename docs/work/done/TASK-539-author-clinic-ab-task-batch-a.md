---
id: TASK-539
title: "Author clinic A/B task batch A (4 tasks)"
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
depends-on: [TASK-535, TASK-536]
---

# TASK-539 — Author clinic A/B task batch A (4 tasks)

## Why
Half of the clinic repo's frozen 8-task corpus. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [x] Four tasks exist in `evals/ab/tasks/clinic/`, covering this batch's categories: convention-bearing feature · business-rule change · bug · under-documented area. ✓ 5b3f731f: four tasks in the clinic batch-a folder: day sheet, closed day, confirmation time, series booking
- [x] Each task declares its scope: allowed files/dirs (`Layers:`) and a behaviour Out-of-scope list — the inputs the D9 G2 check reads. ✓ 5b3f731f: each task.json declares layers and an outOfScope list
- [x] Each task has a deterministic acceptance test that fails on the untouched repo and passes on a reference solution of ≤ ~150 changed lines; both runs recorded. A task needing more is replaced, not grown. ✓ 5b3f731f: coordinator re-ran each in a fresh baseline: acceptance red before, green after a reference of 3-64 changed lines (verify.json)
- [x] Each task names and freezes the regression graders that apply (clinic: `go test` · `go vet` · frontend typecheck + lint · build). ✓ 5b3f731f: graders frozen per task: go test, go vet, web typecheck, lint, build, and web test where the web app is touched
- [x] Symptom tags set per task (convention · business-rule · lost-detail); at least one lost-detail task, whose acceptance depends on a fact found only in `BUSINESS-NOTES.md`. ✓ 5b3f731f: symptom tags set; confirmation-time is the lost-detail task, its code-readable part accepted as the clinic limit by owner ruling (scope-change)
- [x] Authored by an isolated agent whose brief holds only the repo, its answers file and the category list — never `lean-flow-3-foundation.md`, EPIC-023 or other 3.0 material; the brief is retained. ✓ 5b3f731f: authored by an isolated sonnet agent in a snapshot outside this repo; the brief is retained as BRIEF.md
- [x] Owner realism review of the batch signed. ✓ 5b3f731f: owner realism review signed by popup 2026-10-30

## Touches
`evals/ab/tasks/clinic/`

## Assumes

## Tracker
research §7 Tasks
