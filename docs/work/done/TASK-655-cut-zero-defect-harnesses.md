---
id: TASK-655
title: "Cut the zero-defect harnesses H15 H19 H27 H33 H36 H40 H41 H48 H50 H51 H59 H60"
epic: EPIC-025
sprint: SPRINT-173
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

- [x] The 12 harnesses no longer run, and their files and orphan fixture dirs (revise-loop-ceiling, night-run-outcome, promote-check fixtures) are deleted. Scripts that stay (`promote-check.ts`, `tick-box.ts`) stay, and each has no dangling reference. ✓ 12 harnesses out of the registry and deleted with 58 orphan fixture files; tick-box.ts, promote-check.ts and night-run-reaper fixtures kept (ad7833cc); scoped review CLEAR
- [x] The same two-query census as TASK-651 agrees (names diff, registry diff). Every census-kept check still runs with its must-FAIL fixture, H57's mention of H15 is resolved, and the full gate ends with 0 FAIL. ✓ query A: log at 84e938d1 vs 25284d82, only the 12 harness verdicts vanish plus count drift; query B: registry diff is exactly the 12; H57's H15 mention resolved; off-host QA_FULL 236 pass 0 fail
- [x] Negative: re-adding one deleted harness name to the registry makes the gate FAIL it by name. TASK-653's `tick` fixture still fails a wrong-box tick. ✓ throwaway 9db0489d re-adding run-tick-box-fixtures.ts: gate FAIL 'script not found at evals/run-tick-box-fixtures.ts', dropped; record-line wrong-box tick case passes on T5's tree

## Touches

`evals/run-{sprint-family-spec-reduction,sprint-close,revise-loop-ceiling,system-verify,reap-terminal,night-run-gate-exception,night-run-outcome,promote-check,tick-box,workflow-command}-fixtures.*`, `evals/run-doc-caps-differential.ts`, `evals/run-night-run-rollup-differential-parity.ts`, their fixture dirs; `scripts/qa-check.sh`; `evals/README.md`;
`evals/run-sprint-family-fixtures.sh` (mention only). Overlap: qa-check.sh and `evals/README.md` with TASK-651.

## Assumes

- A harness is deleted with its orphan fixtures; a script that stays keeps working.

## Tracker

EPIC-025 condition 2; owner popup, 2026-11-12.
