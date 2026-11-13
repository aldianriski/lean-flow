---
id: TASK-627
title: "Trial Jev concept match in /triage and /insights to find duplicate or related items"
type: feature
priority: P3
size: M
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: blocked
depends-on: [TASK-626]
---

# TASK-627 — Trial Jev concept match in /triage and /insights to find duplicate or related items

## Why
Second use in the chain, judged by its delta over the keyword and title checks `/triage` and `/insights` already do.

## Done when

- [ ] A design note states what concept match adds over the existing duplicate checks in the two skills, with one real example each.
- [ ] One maintainer trial on real backlog items and real learnings is recorded in Results, with spend.
- [ ] Negative: no shipped skill file changes, and no call runs, before the owner approves the design.

## Assumes

- A1: Jev Box fits both judgments, thresholds 0.7/0.3; a score from 0.3 to 0.7 is "unsure" (confirmed in TASK-625).
- A2: Plain fetch to api.typesafe.ai works with `jev-1.14.0` pinned; the SDK only if the API facts show fetch cannot.
- A3: Task files may be sent to api.typesafe.ai; `.env` and secrets may not (owner ruling).
- A4: Price is 0.042 USD per Mtok input, output free; one run is cents.
- **blocked-by:** TASK-626 is done, its fixture fails with the named findings, and the owner has read its real-file run.

## Tracker

Owner ruling 2026-11-08 (Jev adoption, use 2 of 4)

## Amended 2026-11-13

Cancelled at /triage (owner approved). EPIC-025 D3 ended this use; reason and revisit-if are in `.out-of-scope/jev-judgments-in-the-loop.md`.
