---
id: TASK-405
title: "Verify the fire-time ledger on the live run that carries it"
epic: EPIC-015
priority: P1
size: S
risk: low
autonomy: AFK
class: execution
tier: X
authority: J0
origin: manual
state: ready
depends-on: []
sprint: SPRINT-119
---

# TASK-405 — Verify the fire-time ledger on the live run that carries it

## Why

SPRINT-118 T1 gave `night-run.sh` a fire-time `fired ·` line (TD-122 · TD-124), proven on fixtures only. This is the seeded vehicle
for SPRINT-118 T2 (TASK-319): one honest J0 task an unattended run can execute with no approval, and whose work is T1's first
exercise on live input (L-007). It is verification, not a re-declared HITL task (SPRINT-089 D3).

## Done when

- [ ] Inside the unattended run, this sprint's Execution Log carries exactly one column-1 `fired · <ISO-8601 UTC> · overnight` line,
  written by the launcher before the run's first commit, and `bun scripts/lib/check-authority.ts` on this sprint exits 0 with it present.
  The run transcribes both verbatim (the fired line and the checker's last output line) into this box's evidence and commits it;
  evidence added by hand afterwards proves nothing (L-007 · L-120)

## Touches

- none (verification only); the tick and the Execution Log entry are the run's coordinator bookkeeping

## Assumes

- none

## Tracker

- SPRINT-118 T2 (TASK-319) vehicle, owner-ruled at G2 2026-10-07 · TD-122 · TD-124 · SPRINT-090 (the seeded-vehicle method)
