---
id: TASK-371
title: "Prove the migration on workdoo, on a retained branch"
epic: EPIC-017
sprint: SPRINT-114
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

- [ ] In workdoo, an unmerged branch where the release candidate's `migrate` moved the whole queue at the branch base (TODO.md Backlog + whichever sprint is active there) to docs/work/; its line count, sprint id and task-id set are recorded at execution.
- [ ] Id sets equal both ways and ticked-box counts equal; TECH-DEBT.md stays single-file.
- [ ] `bun run verify` green, read from its own verdict line; workdoo's /prime names v2. Branch retained as the proof.

## Touches

workdoo repo (branch only)

## Assumes

that the release candidate can be run in workdoo from a local plugin path

## Tracker

EPIC-017 D8 · Closed-when 10

## Amended 2026-10-03

- **Owner ruling at SPRINT-114 promote (pre-freeze).** The first Done-when named a 389-line TODO.md and an active SPRINT-008; by
  promote, workdoo's TODO.md was 288 lines, SPRINT-008 had closed, and a SPRINT-009 promote was in progress, uncommitted. The criterion
  now names the queue at the branch base and records its counts at execution, rather than freezing figures that drift.
- **Branch base (SPRINT-114 D2):** branch only once workdoo's SPRINT-009 promote is committed, never over uncommitted work.
