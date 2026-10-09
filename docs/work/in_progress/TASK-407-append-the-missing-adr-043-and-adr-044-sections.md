---
id: TASK-407
title: "Append the missing ADR-043 Negative consequence and ADR-044 Alternatives section"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-120
depends-on: []
---

# TASK-407 — Append the missing ADR-043 Negative consequence and ADR-044 Alternatives section

## Why

`conformance.sh` FAILs ADR-043 on §4's Negative rule (Consequences names no Negative) and ADR-044 on §4's Sections rule (no
Alternatives). Both are Structural. The owner ruled (SPRINT-120 decompose) to append only the missing section, dated, and never touch
§ Decision, so §4's append-only rule holds.

## Done when

- [x] ADR-043's Consequences gains at least one Negative, and ADR-044 gains an Alternatives section. Each is marked as added at SPRINT-120 ✓ `1be24cc9`: Negative and Alternatives appended, each marked added at SPRINT-120
      for conformance and states what was true when the decision was taken, not a new decision.
- [x] `sh conformance.sh .` reports 0 `S4.NEGATIVE` and 0 `S4.SECTIONS` findings, and its `S4.APPEND` findings are unchanged (exactly ✓ full `conformance.sh .` at `d64f13ac`: no `S4.NEGATIVE`/`S4.SECTIONS` FAIL; `S4.APPEND` = ADR-044 + ADR-048 only
      ADR-044 and ADR-048), so neither § Decision was edited.

## Touches

- `docs/adr/ADR-043-the-engine-is-the-gates-cost-centre-and-its-consumer-contract-bounds-the-fix.md`
- `docs/adr/ADR-044-hooks-are-admissible.md`

## Assumes

- The content is a judgment (what the alternatives and the cost really were), so a human reads it before it lands (HITL).

## Tracker

- STANDARD §4 · ADR-043 · ADR-044
