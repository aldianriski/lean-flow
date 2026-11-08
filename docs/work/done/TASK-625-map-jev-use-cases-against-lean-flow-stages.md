---
id: TASK-625
title: "Map TypeSafe's Jev use-case map against each lean-flow stage, and rank what is worth trying"
type: feature
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-168
---

# TASK-625 — Map TypeSafe's Jev use-case map against each lean-flow stage, and rank what is worth trying

## Why
The owner is bringing Jev in step by step. Judged only by the delta over lean-flow's existing surface (L-017), a ranked shortlist says which uses are worth a trial; the doc also settles the API facts the first use builds on.

## Done when

- [x] `docs/research/jev-use-cases.md` exists and maps each Jev use case from the use-case map and the introducing-System-One post to the lean-flow stage it would touch. ✓ judgment tick, coordinator read of docs/research/jev-use-cases.md (977b8f72+1)
- [x] Each mapped use names the lean-flow thing that already covers it and keeps only the remainder as the delta. ✓ judgment tick, coordinator read of docs/research/jev-use-cases.md (977b8f72+1)
- [x] A ranked shortlist orders the remaining uses, placing concept match in `/triage` and `/insights`, a cheap A/B judge, and router and watcher uses, and names the first use (the Done-when judge). ✓ judgment tick, coordinator read of docs/research/jev-use-cases.md (977b8f72+1)
- [x] An "API facts" section records endpoint, auth, model param and the Box request and response shape, each with its source URL. ✓ judgment tick, coordinator read of docs/research/jev-use-cases.md (977b8f72+1)
- [x] Negative: no use is ranked without naming the existing lean-flow surface it was compared with, and no paid Jev call is made. ✓ judgment tick: every shortlist row names its compared surface; worker report and diff show no fetch or key use

## Touches

`docs/research/jev-use-cases.md`

## Assumes

- A1: Jev Box fits both judgments, thresholds 0.7/0.3; a score from 0.3 to 0.7 is "unsure" (confirmed in TASK-625).
- A2: Plain fetch to api.typesafe.ai works with `jev-1.14.0` pinned; the SDK only if the API facts show fetch cannot.
- A3: Task files may be sent to api.typesafe.ai; `.env` and secrets may not (owner ruling).
- A4: Price is 0.042 USD per Mtok input, output free; one run is cents.
- Both URLs (https://docs.typesafe.ai/concepts/use-case-map, https://typesafe.ai/blog/introducing-system-one-models-and-jev) are readable without login; if one is not, the API section records "unconfirmed" and TASK-626 treats it as a G2 blocker.

## Tracker

Owner ruling 2026-11-08 (Jev adoption, use 1 of 4)
