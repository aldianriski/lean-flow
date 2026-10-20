---
id: TASK-464
title: "Extract the software-implementation pack from /tdd and declare it against the contract"
epic: EPIC-007
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-463]
sprint: SPRINT-132
---

# TASK-464 — Extract the software-implementation pack from /tdd and declare it against the contract

## Why

EPIC-007 D1 admits only packs extracted from procedures with real internal use. `/tdd` is one: it ran as the procedure skill in
10 dispatched builder runs (2026-09-28 → 2026-10-11). `/diagnose`, the first pick, had no recorded run, so D1 disqualified it
(owner ruling 2026-10-20, SPRINT-132 scope-change).

## Done when

- [ ] A software-implementation pack declares all eight contract fields from `/tdd`'s procedure and names the internal use that qualified it under D1.
- [ ] The pack names no model: its routing is by ADR-010 role (`decision` · `execution` · `mechanical-ingest`), and a search of the pack for model names finds none.
- [ ] A fresh reader validates the declaration against TASK-463's checklist, with every field ticked or a recorded finding.
- [ ] README tells a consumer that packs exist and how to take one; CHANGELOG reflects it.

## Touches

the pack file (placement per TASK-463's G2 ruling) · README · CHANGELOG (coordinator, at close)

## Assumes

- `/tdd` stays the maintained procedure; the pack is extracted from it and does not replace or fork it.

## Tracker

- EPIC-007 conditions 1 (first declaration checked) · 2 (1 of 3–5 packs) · 4 (for this pack) · `skills/tdd/SKILL.md`
