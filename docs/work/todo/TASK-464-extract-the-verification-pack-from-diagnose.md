---
id: TASK-464
title: "Extract the verification pack from /diagnose and declare it against the contract"
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

# TASK-464 — Extract the verification pack from /diagnose and declare it against the contract

## Why

EPIC-007 D1 admits only packs extracted from procedures with real internal use. `/diagnose` is one: a self-contained six-phase
loop this repo runs on its own defects. It is the owner's pick for the first pack (2026-10-19).

## Done when

- [ ] A verification pack declares all eight contract fields from `/diagnose`'s procedure and names the internal use that qualified it under D1.
- [ ] The pack names no model: its routing is by ADR-010 role (`decision` · `execution` · `mechanical-ingest`), and a search of the pack for model names finds none.
- [ ] A fresh reader validates the declaration against TASK-463's checklist, with every field ticked or a recorded finding.
- [ ] README tells a consumer that packs exist and how to take one; CHANGELOG reflects it.

## Touches

the pack file (placement per TASK-463's G2 ruling) · README · CHANGELOG (coordinator, at close)

## Assumes

- `/diagnose` stays the maintained procedure; the pack is extracted from it and does not replace or fork it.

## Tracker

- EPIC-007 conditions 1 (first declaration checked) · 2 (1 of 3–5 packs) · 4 (for this pack) · `skills/diagnose/SKILL.md`
