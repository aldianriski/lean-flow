---
id: TASK-542
title: "Implement the unattended A/B trial protocol with the D9 G2 exception (fixture repo only)"
epic: EPIC-023
priority: P2
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-533]
---

# TASK-542 — Implement the unattended A/B trial protocol with the D9 G2 exception (fixture repo only)

## Why
A1+ trials run the lean-flow loop unattended; G2's subject is produced inside the trial, so D9's eval-only exception must be implemented and proven before any real trial. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [ ] G1 pre-signed from the frozen task file; G2 signed under D9 by the mechanical check (files touched ⊆ `Layers:`) and an isolated policy check of the design against the task's Out-of-scope list; every use logged as a deviation that never applies to product runs.
- [ ] Must-FAILs: a design touching a file outside `Layers:` → not signed · a design inside `Layers:` doing an Out-of-scope behaviour → not signed · an in-scope control → signed; refused trials scored not-passed.
- [ ] Popup branch: a trial raising any other popup → parked, the park recorded, the trial scored not-passed (must-FAIL + control).
- [ ] Exercised on the fixture repo only.

## Touches
`evals/ab/`

## Assumes
- **blocked-by:** TASK-533 (harness).

## Tracker
EPIC-023 D4 · research D9
