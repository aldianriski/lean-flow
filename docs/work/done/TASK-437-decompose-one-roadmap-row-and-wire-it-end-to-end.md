---
id: TASK-437
title: "Let /task-decomposer --roadmap <row> decompose one row, and wire the roadmap through the loop"
epic: EPIC-022
sprint: SPRINT-126
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

- [x] `/task-decomposer --roadmap <row-id>` resolves the row in `docs/product/roadmap.md`, reads its outcome, dependencies and ✓ `f9510f57`: input row + resolution paragraph (exact token, legacy fallback, no-such-row path, Covered-by text for the owner, never edits the roadmap); 130 lines; Codex D4 CLEAR
      acceptance evidence as settled context, decomposes only that row, and says what to put in its `Covered by` cell — it never
      edits the roadmap itself (creates vs consumes); `skills/task-decomposer/SKILL.md` stays ≤ ~140 lines.
- [x] The roadmap is named everywhere the loop is described: `/flow`'s stage that feeds work, `.claude/CONTEXT.md` § Sprint model, ✓ `f9510f57`: /flow Feed · CONTEXT § Sprint model (150, at cap) · README artifact row; after merge `fb2076f7` every mention has a reader (prime/triage carry it); CHANGELOG at close; Codex D5 CLEAR
      README, and CHANGELOG — a wiring check (every new name has a reader) finds no unwired mention.
- [x] Exercised on the TASK-435 scratch copy of workdoo's roadmap: `--roadmap P2` yields tasks scoped to that row only, and ✓ `--roadmap P2` resolved the active row and drafted 3 row-scoped tasks (scratch only); `--roadmap P2b` took the no-such-row path; nothing written into workdoo
      `--roadmap P2b` (not a row) takes the no-such-row path.

## Touches

- skills/task-decomposer/SKILL.md · skills/flow/SKILL.md · .claude/CONTEXT.md · README.md

## Assumes

- the `Covered by` cell is edited by the owner or by promote, never by the decomposer.

## Tracker

- EPIC-022 Closed-when 4 · L-020 (shipping ≠ wiring)
