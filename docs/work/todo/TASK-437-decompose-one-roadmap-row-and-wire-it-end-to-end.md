---
id: TASK-437
title: "Let /task-decomposer --roadmap <row> decompose one row, and wire the roadmap through the loop"
epic: EPIC-022
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-435]
---

# TASK-437 — Let /task-decomposer --roadmap <row> decompose one row, and wire the roadmap through the loop

## Why

Shipping a template is not wiring it (L-020): a roadmap row has to be something the decomposer can slice and the conductor
and the SSOT docs name, or adopters keep passing it as an unstructured `--prd` file the way workdoo would today.

## Done when

- [ ] `/task-decomposer --roadmap <row-id>` resolves the row in `docs/product/roadmap.md`, reads its outcome, dependencies and
      acceptance evidence as settled context, decomposes only that row, and says what to put in its `Covered by` cell — it never
      edits the roadmap itself (creates vs consumes); `skills/task-decomposer/SKILL.md` stays ≤ ~140 lines.
- [ ] The roadmap is named everywhere the loop is described: `/flow`'s stage that feeds work, `.claude/CONTEXT.md` § Sprint model,
      README, and CHANGELOG — a wiring check (every new name has a reader) finds no unwired mention.
- [ ] Exercised on the TASK-435 scratch copy of workdoo's roadmap: `--roadmap P2b` yields tasks scoped to that row only.

## Touches

- skills/task-decomposer/SKILL.md · skills/flow/SKILL.md · .claude/CONTEXT.md · README.md

## Assumes

- the `Covered by` cell is edited by the owner or by promote, never by the decomposer.

## Tracker

- EPIC-022 Closed-when 4 · L-020 (shipping ≠ wiring)
