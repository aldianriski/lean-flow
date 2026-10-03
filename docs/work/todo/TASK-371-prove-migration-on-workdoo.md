---
id: TASK-371
title: "Prove the migration on workdoo, on a retained branch"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-380, TASK-364, TASK-378, TASK-379, TASK-384]
---

# TASK-371 — Prove the migration on workdoo, on a retained branch

## Done when

- [ ] In workdoo, an unmerged branch where the release candidate's `migrate` moved the whole queue (389-line TODO.md Backlog + the active SPRINT-008) to docs/work/.
- [ ] Id sets equal both ways and ticked-box counts equal; TECH-DEBT.md stays single-file.
- [ ] `bun run verify` green, read from its own verdict line; workdoo's /prime names v2. Branch retained as the proof.

## Touches

workdoo repo (branch only)

## Assumes

that the release candidate can be run in workdoo from a local plugin path

## Tracker

EPIC-017 D8 · Closed-when 10
