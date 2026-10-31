---
id: TASK-545
title: "Run the A0 + A1 baseline, rule each symptom, and close S0"
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
depends-on: [TASK-544]
---

# TASK-545 — Run the A0 + A1 baseline, rule each symptom, and close S0

## Why
The measurement ADR-053 admission for S2, S3 and the STANDARD change rests on; a symptom it does not reproduce admits nothing. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [ ] 2 arms × 16 tasks × k = 3 = 96 scored trials, each on a fresh copy + fresh session + isolated config, pinned to the frozen pre-registration; retries only per its classification.
- [ ] The run-validity rule holds, reached at most through the frozen replacement policy; report per repo and per symptom with intervals, scored cost and total spend; each symptom ruled measured defect or not reproduced by R-b on non-infra-lost trials only, with a log reference later `## Why` lines can cite.
- [ ] Wiring closure: the harness runs only through its own documented command; no skill, `/flow`, dispatch brief or CONTEXT routing calls it; `docs/architecture/overview.md` gains the `evals/ab/` line; CHANGELOG `[Unreleased]` notes the maintainer-only harness; consumer-facing effect checked to be none.
- [ ] EPIC-023 Closed-when 1 ticked (or the epic records why not).

## Touches
`docs/research/logs/` · `docs/epic/EPIC-023-specific-not-short.md` · `docs/architecture/overview.md` · `CHANGELOG.md`

## Assumes
- **blocked-by:** TASK-544 (frozen pre-registration).

## Tracker
EPIC-023 Closed-when 1
