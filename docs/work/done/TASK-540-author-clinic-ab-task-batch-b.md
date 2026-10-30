---
id: TASK-540
title: "Author clinic A/B task batch B (4 tasks)"
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

# TASK-540 — Author clinic A/B task batch B (4 tasks)

## Why
The other half of the clinic repo's frozen 8-task corpus. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [x] Four tasks exist in `evals/ab/tasks/clinic/`, covering this batch's categories: convention-bearing feature · business-rule change · refactor · cross-layer change. ✓ ca5769c5: four tasks in the clinic batch-b folder: patient cancel-all, booking lead time, one offset helper, appointment lookup
- [x] Each task declares its scope: allowed files/dirs (`Layers:`) and a behaviour Out-of-scope list — the inputs the D9 G2 check reads. ✓ ca5769c5: each task.json declares layers and an outOfScope list
- [x] Each task has a deterministic acceptance test that fails on the untouched repo and passes on a reference solution of ≤ ~150 changed lines; both runs recorded. A task needing more is replaced, not grown. ✓ ca5769c5: coordinator re-ran each in a fresh baseline: red before, green after a reference of 19-64 changed lines (verify.json)
- [x] Each task names and freezes the regression graders that apply (clinic: `go test` · `go vet` · frontend typecheck + lint · build). ✓ ca5769c5: graders frozen per task: go test, go vet, web typecheck, lint, build, and web test where the web app is touched
- [x] Symptom tags set per task (convention · business-rule · lost-detail); at least one lost-detail task, whose acceptance depends on a fact found only in `BUSINESS-NOTES.md`. ✓ ca5769c5: symptom tags set; patient-cancel-all is the lost-detail task, its code-readable part accepted as the clinic limit by owner ruling (scope-change)
- [x] Authored by an isolated agent whose brief holds only the repo, its answers file and the category list — never `lean-flow-3-foundation.md`, EPIC-023 or other 3.0 material; the brief is retained. ✓ ca5769c5: authored by an isolated sonnet agent in a snapshot outside this repo; the brief is retained as BRIEF.md
- [x] Owner realism review of the batch signed. ✓ ca5769c5: owner realism review signed by popup 2026-10-30, including the replacement lookup task

## Touches
`evals/ab/tasks/clinic/`

## Assumes

## Tracker
research §7 Tasks
