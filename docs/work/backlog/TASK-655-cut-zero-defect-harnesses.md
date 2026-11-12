---
id: TASK-655
title: "Cut the zero-defect harnesses H15 H19 H27 H33 H36 H40 H41 H48 H50 H51 H59 H60"
epic: EPIC-025
priority: P1
size: M
risk: low
autonomy: AFK
class: mechanical-ingest
tier: G
authority: J0
origin: decomposer
state: ready
depends-on: [TASK-651, TASK-653]
---

# TASK-655 — Cut the harness-only zero-defect rows

## Why

EPIC-025 condition 2, owner ruling "Accept all"; each row had 0 real defects (D2). Unfrozen deletion. Depends on TASK-651 (qa-check.sh registry line) and TASK-653 (the writer's tick fixture replaces H50). H18 stays (owner ruling).

## Done when

- [ ] The 12 harnesses no longer run, and their files and orphan fixture dirs (revise-loop-ceiling, night-run-outcome, promote-check fixtures) are deleted. Scripts that stay (`promote-check.ts`, `tick-box.ts`) stay, and each has no dangling reference.
- [ ] The same two-query census as TASK-651 agrees (names diff, registry diff). Every census-kept check still runs with its must-FAIL fixture, H57's mention of H15 is resolved, and the full gate ends with 0 FAIL.
- [ ] Negative: re-adding one deleted harness name to the registry makes the gate FAIL it by name. TASK-653's `tick` fixture still fails a wrong-box tick.

## Touches

`evals/run-{sprint-family-spec-reduction,sprint-close,revise-loop-ceiling,system-verify,reap-terminal,night-run-gate-exception,night-run-outcome,promote-check,tick-box,workflow-command}-fixtures.*`, `evals/run-doc-caps-differential.ts`, `evals/run-night-run-rollup-differential-parity.ts`, their fixture dirs; `scripts/qa-check.sh`; `evals/README.md`;
`evals/run-sprint-family-fixtures.sh` (mention only). Overlap: qa-check.sh and `evals/README.md` with TASK-651.

## Assumes

- A harness is deleted with its orphan fixtures; a script that stays keeps working.

## Tracker

EPIC-025 condition 2; owner popup, 2026-11-12.
