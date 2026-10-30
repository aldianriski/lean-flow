---
id: TASK-536
title: "Prepare the A/B answers files and the evidence-access protocol for both repos"
epic: EPIC-023
sprint: SPRINT-151
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
- [x] One answers file per repo: clinic derived from the spec, each answer citing its spec line; workdoo drafted from its real docs plus an owner interview, owner-approved. ✓ f81e0214: clinic answers derived from the spec with line citations in its provenance file; workdoo drafted from its own docs plus the owner interview of 2026-10-30, owner-approved
- [x] Each covers every question 2.19.1 `init`/`migrate` can ask, the business facts the lost-detail tasks will need, and the seven profile topics (stack · conventions in use · invariants · business goal · main flows · quality attributes · non-goals) as facts, with "not decided yet" where the source is silent, never invented. ✓ f81e0214: each provenance coverage table maps every 2.19.1 init/migrate question, the lost-detail facts and the seven profile topics to an answer or not decided yet (clinic 28 questions, workdoo 32)
- [x] Access protocol written: task authors read only the repo and its answers file (for clinic the answers file distils the spec; the spec itself is not given) · the setup operator reads the answers file · trial agents read only their trial copy, which carries the answers file's raw-facts part as `BUSINESS-NOTES.md` in every arm, A0 included. ✓ f81e0214: PROTOCOL in the answers folder; the facts file is the raw-facts part every arm reads as BUSINESS-NOTES.md, operator and provenance files never enter a trial

## Touches
`evals/ab/answers/` (new)

## Assumes

## Tracker
research §7 Controls · intake R-a, A5
