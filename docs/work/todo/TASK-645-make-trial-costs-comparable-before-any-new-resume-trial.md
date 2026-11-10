---
id: TASK-645
title: "Make worker and coordinator costs comparable across arms before any new resume trial"
type: feature
epic: EPIC-024
sprint: SPRINT-171
priority: P3
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-645 — Make worker and coordinator costs comparable across arms before any new resume trial

## Why
Row 5 priced each round from tokens inside S15's dispatch-to-report window. Arm B's coordinator starts cold and arm A's does not, and a token-window total cannot show complete incremental cost. Codex's new item: reconcile worker and coordinator charges independently of the latency window, report cold-coordinator setup separately, and allocate it the same way in both arms. Row 5 is a no-go on the test-name gate either way, so no verdict moves; the gap matters for the next resume trial. TD-305 (cross-process resume unreliable) and TD-306 (estimated worker cost) bear on it.

## Done when

- [ ] A costing note states how worker, coordinator and cold-start charges are separated and allocated in each arm, and how the result reconciles with `total_cost_usd` and `session-cost.ts` for the same run.
- [ ] Run on real input: the method is applied to row 5's three pairs and reproduces the recorded round totals (A 0.069, 0.058, 0.055; B 0.091, 0.091, 0.081 USD) within the stated rounding, or names the difference.
- [ ] Negative: the method does not change the recorded row 5 verdict, and does not count a cost that falls outside an arm's own window into the other arm.

## Touches
`docs/research/` (a costing note) or `scripts/session-cost.ts` if the method needs a flag; the TASK-633 `## Results` section is read, not edited.

## Assumes
- A1: the per-message usage for the three pairs is still readable from the recorded transcripts or the operator's scratch; if it is gone, say so and mark the reconciliation as not reproducible.

## Tracker
SPRINT-170 close Retro · TD-305 · TD-306 · Codex recap review, new item 5
