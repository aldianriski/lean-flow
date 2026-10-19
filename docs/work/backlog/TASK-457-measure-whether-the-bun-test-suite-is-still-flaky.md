---
id: TASK-457
title: "Measure whether the `bun test` suite is still flaky, then close TD-135 or name the test"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-455]
---

# TASK-457 — Measure whether the `bun test` suite is still flaky, then close TD-135 or name the test

## Why

TD-135 records one disagreement between two `bun test` runs (SPRINT-094) whose failing test was never identified. Since then
its suspect test was deleted (ADR-051) and the suite shrank from 39 files to 11. The row is now an unfalsifiable worry: it
should either become a named defect or close on evidence. Its impact line is also wrong: `qa-check.sh` does not run `bun test`.

## Done when

- [ ] The full `bun test` suite is run 5 times on the VPS gate host and 3 times on the Windows host against one recorded commit, each run's own summary line recorded verbatim, never a wrapper's status or a piped tail.
- [ ] Any disagreement names the failing test and is filed as a fix task; if all runs agree, TD-135 is closed as not reproduced with that evidence.
- [ ] TD-135's impact line is corrected: `bun test` is the second stage of `package.json`'s `test` script, outside `qa-check.sh`.

## Touches

TECH-DEBT.md (TD-135, coordinator) · docs/research/logs/qa-gate-timing.md (if a timing figure is recorded)

## Assumes

- the runs happen after TASK-455, so a green suite is the expected baseline and any red is new information.
- the VPS route is available (owner-run host; reached the same way as the gate runner).

## Tracker

- TD-135 · TD-127 (its hypothesis, now moot) · ADR-051
