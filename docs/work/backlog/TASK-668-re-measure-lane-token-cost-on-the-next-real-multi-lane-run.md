---
id: TASK-668
title: "Re-measure lane token cost on the next real multi-lane run"
type: feature
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: blocked
depends-on: [TASK-666, TASK-667]
---

# TASK-668 — Re-measure lane token cost on the next real multi-lane run

## Why

TASK-666 and TASK-667 ship a 200k starting ceiling and a bulky-output worker rule on a measured baseline (2026-11-14/15 run). The evidence for them cannot exist until a future run, so this is its own task (TASK-402 precedent), not a box that would hold a sprint open.

## Done when

- [ ] The same census (turns, average context, share above the ceiling, spend by trigger, subagent share, poll-wake share) is run on that run's transcripts and compared with the 2026-11-14/15 baseline. The ceiling is recorded as kept, retuned or dropped, with the number. The bulky-output worker rule is judged on the same data.
- [ ] Negative: a confounded or different-workload result is recorded as inconclusive, not as a pass.

## Touches

The memory note lane-token-cost-is-session-length; CONTEXT and CHANGELOG only if the ceiling changes.

## Assumes

- **blocked-by:** the next real multi-lane run after TASK-666 and TASK-667 ship.

## Tracker

Owner intent 2026-11-16; memory note lane-token-cost-is-session-length.
