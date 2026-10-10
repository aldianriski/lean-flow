---
id: TASK-423
title: "Emit the run-outcome rollup on a user-stopped run, so USER_STOP is a state a run can actually report"
epic: EPIC-015
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
sprint: SPRINT-122
depends-on: []
---

# TASK-423 — Emit the run-outcome rollup on a user-stopped run, so USER_STOP is a state a run can actually report

## Why

SPRINT-121 T1 (TASK-414) checked EPIC-015 CW6 ("every run emits DELIVERED / PARTIAL / FAILED plus DoD, tasks, parks, repair
cycles, verification, warnings and terminal reason") against the emitter code. `reap()` in `scripts/night-run.sh` emits every field
on four of the five terminal states (PLAN_EXHAUSTED · AUTHORITY_BOUNDARY · HARD_FAILURE · BUDGET_STOP). **USER_STOP is produced by
no code path.** The comment in `reap()` hands it to `die_doa()`, but every `die_doa()` call site is a pre-launch error, and
`die_doa()` prints only `DEAD-ON-ARRIVAL: <reason>` with none of CW6's fields. So a human interrupt is reported as `HARD_FAILURE`
("wrapped process exited with status N") while the launcher survives, or produces no rollup at all if the launcher itself is
killed. CW6 stays open on that gap (owner's pre-delegated tick rule, SPRINT-121 G2). A measured defect, so it is admissible under the
interim governance restriction. Consequential Tier G: the launcher decides what an unattended run reports.

## Done when

- [ ] A user interrupt of a run (the launcher receiving INT/TERM, or the wrapped run being stopped by the user) ends with a rollup
      whose terminal state is `USER_STOP` and outcome `PARTIAL`, carrying every CW6 field, written into the run's own Execution Log.
- [ ] A retained must-FAIL fixture shows the pre-change launcher reporting a user stop as `HARD_FAILURE` or emitting no rollup,
      and the post-change launcher emitting `USER_STOP`. A sibling control shows an ordinary non-zero exit still reads
      `HARD_FAILURE`.
- [ ] The comment in `reap()` that assigns USER_STOP to `die_doa()` is corrected to match the code.
- [ ] EPIC-015 CW6 is re-checked against the emitter on all five paths and ticked with file:line evidence.

## Touches

- `scripts/night-run.sh` · `evals/` (night-run reaper fixtures) · `docs/epic/EPIC-015-execution-autonomy.md`

## Assumes

- A user stop can be distinguished from a crash by signal: INT/TERM received by the launcher, or a wrapped exit status 130/143.
  Confirm at G2 by recon of how the harness stops a run.

## Tracker

- SPRINT-121 T1 (TASK-414) finding · EPIC-015 CW6 · TD-152 · TD-153 · `scripts/night-run.sh` `reap()` / `die_doa()`
