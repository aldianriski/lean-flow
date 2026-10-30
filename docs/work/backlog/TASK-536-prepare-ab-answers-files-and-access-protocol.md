---
id: TASK-536
title: "Prepare the A/B answers files and the evidence-access protocol for both repos"
epic: EPIC-023
priority: P2
size: S
risk: high
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-535, TASK-556]
---

# TASK-536 — Prepare the A/B answers files and the evidence-access protocol for both repos

## Why
The answers file stands in for the owner's interview at setup and, as `BUSINESS-NOTES.md`, gives every arm the same business evidence (R-a). Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [ ] One answers file per repo: clinic derived from the spec, each answer citing its spec line; workdoo drafted from its real docs plus an owner interview, owner-approved.
- [ ] Each covers every question 2.19.1 `init`/`migrate` can ask, the business facts the lost-detail tasks will need, and the seven profile topics (stack · conventions in use · invariants · business goal · main flows · quality attributes · non-goals) as facts, with "not decided yet" where the source is silent, never invented.
- [ ] Access protocol written: task authors read repo + spec · the setup operator reads the answers file · trial agents read only their trial copy, which carries the answers file as `BUSINESS-NOTES.md` in every arm, A0 included.

## Touches
`evals/ab/answers/` (new)

## Assumes

## Tracker
research §7 Controls · intake R-a, A5
