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

- [x] A user interrupt of a run (a TERM received by the launcher's wrapper, the process it prints as `pid=`) ends with a
      rollup whose terminal state is `USER_STOP` and outcome `PARTIAL`, carrying every CW6 field, written into the run's own
      Execution Log. *(Narrowed at G2: a bare child exit of 130/143 is not a user stop, because the watchdog's stall-kill exits 143.
      Narrowed at build, owner-ruled: INT and HUP are ignored on entry under nohup and an async start, so only TERM is a stop.)*
      ✓ `wrapper-term-is-user-stop` asserts `terminal · USER_STOP`, the PARTIAL outcome and every field line;
      `fire-site-wrapper-catches-term` TERMs the real launcher's printed pid (`9f70412e`). Coordinator run: all green.
- [x] A retained must-FAIL fixture shows the pre-change launcher reporting a user stop as `HARD_FAILURE` or emitting no rollup,
      and the post-change launcher emitting `USER_STOP`. Sibling controls show an ordinary non-zero exit and a direct TERM to the
      child (the watchdog's way of stopping) still read `HARD_FAILURE`.
      ✓ Against the old trap-free wrapper, `wrapper-term-is-user-stop` emits no rollup while `wrapped-exit3-is-hard-failure` and
      `term-to-child-is-hard-failure` stay green. Seeds S1-S7, each restored by hash, all redden their own case (Execution Log rounds 1-2).
- [x] The comment in `reap()` that assigns USER_STOP to `die_doa()` is corrected to match the code.
      ✓ `scripts/night-run.sh:312-316` now names the wrapper marker and the owner's rank ruling (`eae1c1b0`).
- [x] EPIC-015 CW6 is re-checked against the emitter on all five paths and ticked with file:line evidence.
      ✓ CW6 ticked in `docs/epic/EPIC-015-execution-autonomy.md` with `night-run.sh` :344-368 (terminals) and :424-430 (fields).

## Touches

- `scripts/night-run.sh` · `evals/` (night-run reaper fixtures) · `docs/epic/EPIC-015-execution-autonomy.md`

## Assumes

- A user stop can be distinguished from a crash by signal: INT/TERM received by the launcher, or a wrapped exit status 130/143.
  Confirm at G2 by recon of how the harness stops a run. *G2 (2026-10-10): half-refuted. Only a signal caught by the wrapper
  counts; an exit status of 143 is also the watchdog's (night-run.md Part 3). Owner ruling in the SPRINT-122 Execution Log.*

## Tracker

- SPRINT-121 T1 (TASK-414) finding · EPIC-015 CW6 · TD-152 · TD-153 · `scripts/night-run.sh` `reap()` / `die_doa()`
