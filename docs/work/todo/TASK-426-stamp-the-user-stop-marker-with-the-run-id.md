---
id: TASK-426
title: "Stamp the USER_STOP marker with the run's id, so a stale marker is never read as a stop (TD-247, Option A)"
epic: EPIC-015
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-426 — Stamp the USER_STOP marker with the run's id, so a stale marker is never read as a stop (TD-247, Option A)

## Why

TD-247: the wrapper's `<log>.stop` marker carries only a signal name, so a standalone `--reap` over an old log can read a stale marker
as USER_STOP. The owner chose Option A at SPRINT-122 close (TASK-425's park, 2026-10-11): stamp the marker with the run's start epoch,
and have reap() match it. Option B (binding the claim into the rollup and having the guard check it) was rejected because it changes the
frozen Part 4 contract. Consequential Tier G: the launcher decides what an unattended run reports.

## Done when

- [ ] The wrapper's trap writes `<signal> <wr_start>` into `<log>.stop`, and reap() reports USER_STOP only when that id equals its own
      `rp_started`. A marker with a foreign or missing id is ignored and named in the `warnings ·` field.
- [ ] A retained must-FAIL fixture: a stale marker with a foreign id reads HARD_FAILURE (or the state its log implies), never
      USER_STOP. The sibling `wrapper-term-is-user-stop` stays green.
- [ ] TD-247 is updated: C3 resolved; C6 (the guard accepts an unbacked USER_STOP) stays open with its census.

## Touches

- `scripts/night-run.sh` · `evals/run-reap-terminal-fixtures.sh`

## Assumes

- none

## Tracker

- TD-247 · TASK-425 (Option A ruled) · SPRINT-122 T1 (TASK-423)
