---
id: TASK-538
title: "Author workdoo A/B task batch B (4 tasks)"
epic: EPIC-023
priority: P2
size: M
risk: high
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-536]
---

# TASK-538 — Author workdoo A/B task batch B (4 tasks)

## Why
The other half of workdoo's frozen 8-task corpus. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [ ] Four tasks exist in `evals/ab/tasks/workdoo/`, covering this batch's categories: convention-bearing feature · business-rule change · refactor · cross-layer change.
- [ ] Each task declares its scope: allowed files/dirs (`Layers:`) and a behaviour Out-of-scope list — the inputs the D9 G2 check reads.
- [ ] Each task has a deterministic acceptance test that fails on the untouched repo and passes on a reference solution of ≤ ~150 changed lines; both runs recorded. A task needing more is replaced, not grown.
- [ ] Each task names and freezes the regression graders that apply (workdoo: typecheck · build · the non-browser `verify:*` scripts covering the area; lint is not configured, recorded not applicable).
- [ ] Symptom tags set per task (convention · business-rule · lost-detail); at least one lost-detail task, whose acceptance depends on a fact found only in `BUSINESS-NOTES.md`.
- [ ] Authored by an isolated agent whose brief holds only the repo, its answers file and the category list — never `lean-flow-3-foundation.md`, EPIC-023 or other 3.0 material; the brief is retained.
- [ ] Owner realism review of the batch signed.

## Touches
`evals/ab/tasks/workdoo/`

## Assumes
- **blocked-by:** TASK-536 (answers file).

## Tracker
research §7 Tasks
