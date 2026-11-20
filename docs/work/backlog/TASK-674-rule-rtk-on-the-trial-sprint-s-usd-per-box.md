---
id: TASK-674
title: "Rule RTK on the trial sprint's USD per box, then record all three verdicts"
type: feature
epic: EPIC-026
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-673]
---

# TASK-674 — Rule RTK on the trial sprint's USD per box, then record all three verdicts

## Why

The RTK trial is measured over its own sprint, so the verdict is the sprint's last member (owner popup 2026-11-20). It closes EPIC-026's RTK and verdict-record Closed-when lines.

## Done when

- [ ] Before promote, the coordinator records the RTK setup in the trial sprint's log: project-scoped install (GitHub release binary or cargo), no `rtk init -g`, no global hook, BUSL-1.1 licence text read for maintainer-only use, and the bypass rule tested on REAL `git diff --cached` and gate-verdict output, both uncompressed.
- [ ] `bun scripts/session-cost.ts` USD per box for the trial sprint, measured from promote up to the commit before this task's own work (so this task is not counted in the figure it rules), compared with named recent sprints and their figures.
- [ ] That figure shown both with and without the TASK-673 dispatches, since that workload differs from recent sprints.
- [ ] RTK verdict (keep, drop or inconclusive) recorded in `docs/research/` with its measure basis (direction, not proof), stating that the bypass rule held throughout.
- [ ] The EPIC-026 row in `docs/epic/INDEX.md` names the RTK, graphify (TASK-673) and ponytail (Drop, TASK-669) verdicts.
- [ ] Each verdict says maintainer-environment only; nothing ships without a separate owner ruling.
- [ ] Negative: if the bypass rule failed even once, or the workload is confounded, RTK is recorded as inconclusive, not keep.

## Touches

A verdict note in `docs/research/`, the EPIC-026 row in `docs/epic/INDEX.md`, and EPIC-026's Closed-when ticks (done at close by the generator).

## Assumes

- The recent-sprint baseline comes from session-cost.ts with a stated window.
- A sprint of different size or shape than the baseline makes the result direction only; the RTK README's own caveat (90% less output is not 90% less cost) is the prior.
- The RTK install is a coordinator step before promote, since a task inside a sprint cannot precede that sprint's promote.

## Tracker

EPIC-026 D2, D5; owner popups 2026-11-20 Q1 and "In sprint, last member"; owner approve 2026-11-20.
