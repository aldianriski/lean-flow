---
id: TASK-648
title: "Inventory every gate check at a pinned revision with its fixture and consumer-guard flag"
epic: EPIC-025
priority: P1
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-647]
---

# TASK-648 — Inventory every gate check at a pinned revision with its fixture and consumer-guard flag

## Why

EPIC-025 D2 cuts by evidence, so every check needs a row first. Measured cost: `scripts/qa-check.sh` is 1,676 lines (ADR-053 §4). This task adds no machinery.

## Done when

- [ ] The census records the pinned revision (ec4ee660, or a later HEAD reached only by docs-only commits, with the reason) and has one row per checker or harness: each `scripts/qa-check.sh` leg, each harness in leg 12, and each leg without a `qb_checkpoint` (e.g. leg 15). Each row lists the check names it prints, its must-FAIL fixture (path or `none`) and a consumer-guard flag.
- [ ] Population reconciled by identity: the check names printed by a real gate run at the pin, and the names enumerated from source, each map to exactly one row, with zero missing and zero extra.
- [ ] Negative: manifest lockstep and the conformance engine are flagged consumer guards, and no printed check name is left unmapped or mapped to two rows.

## Touches

`docs/research/process-cost-census.md` (extended). Everything else read-only.

## Assumes

- The real gate run may be off-host (QA_FULL) when local is slow; no checker is added; any helper is scratch Bun TypeScript whose command is recorded in the doc.

## Tracker

EPIC-025 Closed-when #1 (population by identity).
