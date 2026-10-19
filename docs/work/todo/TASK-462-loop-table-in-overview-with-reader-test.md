---
id: TASK-462
title: "Add a loop table to the architecture overview, kept only if a reader test shows it helps"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-131
---

# TASK-462 — Add a loop table to the architecture overview, kept only if a reader test shows it helps

## Why

lean-flow's loops each have an exit — a task's Done-when, a sprint close, an epic's Closed-when, an overnight run's five terminal
states — but they are documented across three files with no single map. loopcraft frames each loop by its exit; Codex judged a
table worth adopting, but only if it measurably helps a reader. No recorded failure has come from its absence.

## Done when

- [ ] One table in `docs/architecture/overview.md` lists each loop with its purpose, its exit or stopping condition, the authoritative record and its parent loop, linking to the defining text rather than copying it, and distinguishes *stopped* from *completed*; an equal number of lines is trimmed elsewhere in the file so it stays within its 150-line cap.
- [ ] A reader test is recorded: fresh readers answer 8 cases drawn from real task files, sprint logs, an epic and night-run fixtures (including a budget stop with work left, a task done before its sprint closes, and a closed sprint whose epic is unfinished), once with the table and once without.
- [ ] The table is kept only if every authoritative record is identified correctly and median lookup is at least 25% faster without more classification errors; otherwise it is removed, and the result is written into `docs/research/reference-rejudge.md` either way.

## Touches

docs/architecture/overview.md · docs/research/reference-rejudge.md

## Assumes

- the table lives in the architecture overview, trimmed to fit, not in README or CONTEXT.md (owner ruling at intake, 2026-10-19).

## Tracker

- `docs/research/reference-rejudge.md` (I2) · `docs/research/loopcraft-adaptation.md`
