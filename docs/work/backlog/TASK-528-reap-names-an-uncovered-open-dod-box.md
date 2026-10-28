---
id: TASK-528
title: "Make reap() name an open DoD box no counted unit covers instead of ending a clean PLAN_EXHAUSTED"
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-528 — Reap names an uncovered open DoD box

## Why
TD-201 (b), defect fix (unfrozen, ADR-053): `reap()` builds its unattempted list from counted units only, so a run can
end `PLAN_EXHAUSTED` while its own DoD line shows open boxes (reproduced at SPRINT-110 T4: `units 0 0` beside
`dod 1 1`). The fix sits where the false-green is reported; a promote-time guard was cancelled (TASK-527, ADR-053).
G2 review-round cap: 2.

## Done when
- [ ] A run log whose Plan has an open member DoD box that no counted unit covers never ends `terminal · PLAN_EXHAUSTED`; `reap()` writes a named per-task line for it.
- [ ] That line maps to one of Part 0b's five existing terminal states (no sixth state); the mapping is the G2 decision below.
- [ ] Retained must-FAIL fixture in the reap-terminal harness reddens on the uncovered box; a sibling control with every box covered still ends `PLAN_EXHAUSTED`.
- [ ] `check-night-run-rollup` accepts a correct log carrying the new line (no rollup FAIL), in both its `.ts` and `.sh` forms (the differential-parity pair stays green).
- [ ] Run on the real artifact: the patched `reap()` over every archived real night-run log leaves each recorded terminal state unchanged (census: 0 uncovered boxes).
- [ ] TD-201 resolved → TASK-528.

## Touches
`scripts/night-run.sh` `reap()` · `scripts/lib/check-night-run-rollup.ts` · `evals/run-reap-terminal-fixtures.sh` · `skills/orchestrator/references/night-run.md` Part 0b/4 if a line shape is added.

## Assumes
- **G2 decides:** which terminal state an uncovered open box maps to (`unattempted` → `BUDGET_STOP` reads wrong for a Plan defect; `HARD_FAILURE` is the likely fit).
- Existing `.sh` edited in place; no new `.sh`.

## Tracker
TECH-DEBT TD-201 · owner choice at /prime overview 2026-10-27 (false-green guard cluster).
