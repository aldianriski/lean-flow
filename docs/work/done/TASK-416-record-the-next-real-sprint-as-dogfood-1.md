---
id: TASK-416
title: "Record the next real sprint as Dogfood 1 (continuous attended sprint-bulk)"
epic: EPIC-015
priority: P1
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-121
depends-on: []
---

# TASK-416 — Record the next real sprint as Dogfood 1 (continuous attended sprint-bulk)

## Why

CW7's Dogfood 1 needs a real multi-task sprint run continuously with no per-task confirmation. Owner ruling 2026-10-10: the next
real sprint is that vehicle, so it costs no separate run. This task rides that sprint as a member.

## Done when

- [x] The next promoted sprint with ≥3 members runs in attended `sprint-bulk` with every J2 ruling its members need settled before ✓ SPRINT-121 (7 members) ran attended sprint-bulk after G2 settled the J2 rulings and re-declared J1; no confirmation between authorized tasks; terminal PLAN_EXHAUSTED (run-complete entry, Execution Log)
      the continuous sequence starts, and no confirmation asked between already-authorized (J0/J1) tasks; it ends at a named
      terminal state.
- [x] Its Execution Log shows each task transition with no confirm or pause entry between authorized tasks, and any pause that did ✓ the SPRINT-121 Execution Log carries every Tn transition; the four pauses are named with their causes in the T7 entry (one recorded late, and said so)
      occur is named with its cause.
- [x] EPIC-015 CW7's Dogfood-1 half is recorded as proven, citing that log. ✓ EPIC-015 § Member sprints, SPRINT-121 row: "Dogfood 1 PROVEN", citing the Log's T7 entry; CW7 stays `[ ]` until Dogfood 2 (TASK-415)

## Touches

- that sprint's Execution Log · `docs/epic/EPIC-015-execution-autonomy.md`

## Assumes

- The vehicle is bounded: overflow work is deferred rather than added to the sprint to make it longer.

## Tracker

- EPIC-015 CW7 · owner grill 2026-10-10
