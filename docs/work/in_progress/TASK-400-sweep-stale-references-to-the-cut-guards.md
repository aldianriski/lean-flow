---
id: TASK-400
title: "Sweep stale references to the cut guards"
priority: P3
size: S
risk: low
autonomy: AFK
class: mechanical-ingest
tier: P
authority: J1
origin: close-retro
state: ready
depends-on: []
sprint: SPRINT-116
---

# TASK-400 — Sweep stale references to the cut guards

## Why

SPRINT-113 T1 (TASK-398) deleted the S10 v1 park/retry asserts and selftests, P4 `run-layers-observed-differential.ts` and P7
`layers-completeness-differential.ts`, along with every reference inside its Layers. Its census found about 12 live references outside them that
now point at deleted files: 8 fixture READMEs under `evals/fixtures/boundary-rows/*/` and `evals/fixtures/judgement-only-retry/` ("evals/assert-X checks
this"), a comment in `evals/fixtures/layers-completeness/synthetic.ts:9`, `evals/run-emitter-column-fixtures.ts:254-256` (a comment and a now-dead
`/assert-` exclusion), and comments in `scripts/lib/check-layers-completeness.ts` and `scripts/lib/check-layers-observed.ts`.
`evals/fixtures/layers-completeness/sprint-041-reconstructed.md` names them as fixture DATA and must not change.

## Done when

- [ ] Every live reference to a cut file is reworded to history ("cut at SPRINT-113, ADR-050") or removed; fixture data and archive text are unchanged; `git grep` of the 10 basenames returns only history.

## Assumes

none

## Tracker

- SPRINT-113 T1 census (Execution Log) · TASK-398 · ADR-050
