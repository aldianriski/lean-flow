---
id: TASK-535
title: "Add the clinic A/B repo's remaining business rules and complete its business spec"
epic: EPIC-023
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-534]
---

# TASK-535 — Add the clinic A/B repo's remaining business rules and complete its business spec

## Why
Completes the clinic domain so the business-rule and lost-detail measures have enough to show on. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [ ] Cancellation window · daily appointment cap per doctor · patient record required before booking — each enforced UI → API → DB with tests; at least 5 invariants in total with TASK-534.
- [ ] The external spec is complete: goal · core flows · invariants · quality attributes · non-goals · business facts not visible in code (each marked).
- [ ] Owner realism review of domain, rules and conventions signed.

## Touches
`D:\Research\clinic-ab\` · `D:\Research\clinic-ab-spec\`

## Assumes
- **blocked-by:** TASK-534 (the booking slice).
- **note from SPRINT-147 close:** the booking page converts browser-local time to UTC while working hours are stored and read as UTC, so on a UTC+7 host a 10:00 local booking is refused `OUTSIDE_WORKING_HOURS`. Which time zone the clinic's hours live in is a business fact the spec must record (not visible in code); the owner rules it in the realism review.

## Tracker
EPIC-023 D3 · research D7
