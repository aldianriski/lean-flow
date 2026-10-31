---
id: TASK-548
title: "Discover the business in init: existing docs first, then only the unknowns"
epic: EPIC-023
sprint: SPRINT-153
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-547]
---

# TASK-548 — Discover the business in init: existing docs first, then only the unknowns

## Why
Symptom 2 (misreads the business). Owner decision D8: read PRD, README and tickets first, then interview only what they leave
open, by frontier round. Not frozen under ADR-053: skill and template work. G2 review-round cap: 2.

## Done when
- [x] `init` reads the repo's existing business evidence before asking, and asks only about the profile's business topics ✓ 6b34f1ca: init step 1b reads README and requirement-like docs first; the business popup asks only open topics in one frontier round, each with not decided yet; review rounds 1-2
  (goal · main flows · invariants · quality attributes · non-goals) that the evidence leaves open, in frontier rounds, each
  option offering "not decided yet".
- [x] Each fact written into a requirements profile section cites its source (a doc line or the owner's answer); "not decided ✓ 6b34f1ca: every requirements fact cites path § heading or the owner (all 14 compass citations resolve); not decided yet kept placeholders and the marker
  yet" leaves the prompt in place, never an invented fact.
- [x] A real `init` through the installed plugin on a snapshot of compass (non-A/B; a 262-line README and a product requirements ✓ owner-run init on a fresh compass copy on the VPS: goal, non-goals, flows, requirements filled from docs unasked; owner confirmed the business sections correct
  doc) fills at least one topic from the docs without asking, and the owner confirms the business sections are correct for that product.

## Touches
lean-doc-generator init reference · the product-requirements template

## Assumes
- **was blocked-by:** TASK-547 (the profile sections exist); TASK-547 is done, triaged ready 2026-10-31.
- Questions stay within the seven profile topics, which the A/B answers file covers (I-6).
- Exercise on a snapshot copy in `D:\Research`, never an A/B repo (I-2).

## Tracker
EPIC-023 Closed-when S1 · research §5 D8 · S1 intake I-2, I-6 (2026-10-30)
