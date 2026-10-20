---
id: TASK-463
title: "Write the eight-field workflow-pack contract, domain-neutral, with a reader checklist"
epic: EPIC-007
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-132
---

# TASK-463 — Write the eight-field workflow-pack contract, domain-neutral, with a reader checklist

## Why

EPIC-007's first exit condition needs a pack contract that a declaration can be checked against. The owner ruled (2026-10-19)
that "checkable" means a reader can check it field by field, so this is consumer-facing template work, which ADR-053 does not
freeze. No checker is built. The contract must not quietly become software-shaped (EPIC-007 D5).

## Done when

- [ ] A pack contract states the eight fields (`purpose` · `inputs` · `procedure` · `capabilities` · `output contract` · `verification` · `escalation` · `risk policy`), each with what it must say and a checklist line a reader can tick against a declaration.
- [ ] The contract's required set names no software-specific concept (`repo` · `commit` · `branch` · `tests` · `PR`), and no field may name a model; routing is by ADR-010 role.
- [ ] Domain-neutral by construction: a non-software pack skeleton (declaration only, no procedure) is validated against the checklist by a fresh reader, and every required field is satisfiable. A field that is not satisfiable is a recorded finding naming it.
- [ ] Where packs and the contract live, and whether the contract is Layer A (the Standard) or Layer E, is ruled at G2 and recorded as an ADR if it adds a §2 row or a new tree.

## Touches

the contract file (placement ruled at G2) · possibly `docs/adr/` + `docs/DECISIONS.md` (placement ADR) · `docs/strategy/adlc/` references read, not edited

## Assumes

- Placement and the Layer A/E question are **G2 rulings** (EPIC-007 § Open questions says "settle at the first member sprint's G2"); `/council` if the two pull evenly. This is a known design decision for G2, not an open scope question.
- The skeleton is a declaration only (EPIC-007 D5: this epic does not invent a non-software workflow).

## Tracker

- EPIC-007 conditions 1 (the contract part) and 6 · `docs/strategy/adlc/03-ADLC-ROADMAP.md` § Phase E · ADR-053 § 3
