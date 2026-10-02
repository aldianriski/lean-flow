---
id: TASK-347
title: "Give the five archive-dependent harnesses their own case-variant fixture"
priority: P2
size: M
risk: low
autonomy: AFK
class: execution
tier: G
authority: J1
origin: close-retro
state: needs-info
---

# TASK-347 — Give the five archive-dependent harnesses their own case-variant fixture

## Done when

- [ ] `run-approval-envelope-fixtures.sh` · `run-night-run-rollup-fixtures.sh` · `run-review-depth-fixtures.sh` · `run-verify-reaches-fixtures.sh` · `run-system-verify-fixtures.sh` each exercise a case-variant archive path, at the two-level-deeper `…/Archive/logs/…` shape the log checkers actually use. Only `run-layers-completeness-fixtures.sh` has one today, so a revert at any single one of those five sites is invisible to its own suite.

## Touches

- the five `evals/run-*-fixtures.sh` named above

## Assumes

- that per-harness coverage is still wanted GIVEN leg 10b already guards the whole set against a revert in any shape — the cross-site guard was the SPRINT-099 answer to this finding, and this row is the per-harness half it deliberately did not do. **Confirm that before building: if leg 10b is judged sufficient, close this row rather than write five near-duplicate fixtures.**
- **open:** is leg 10b judged sufficient (close this row) or is per-harness coverage still wanted?

## Tracker

- SPRINT-099 T3 outside review, Finding 2 (guard hole, no live bug found)
