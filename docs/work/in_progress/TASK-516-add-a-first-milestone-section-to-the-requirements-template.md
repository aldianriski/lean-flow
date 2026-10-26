---
id: TASK-516
title: "Add a First-milestone section to the requirements template and have init fill it from the owner"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-143
depends-on: []
---

# TASK-516 — Add a First-milestone section to the requirements template

## Why
A fresh repo's `requirements.md` has Problem · Users · Scope · requirements · NFR · Open questions, but not what the
first slice must prove or when to stop, so a prototype grows a backend nobody asked for. The Codex pipeline fixes three
things first: the proof goal, the stopping condition, and the integration boundary (none · simulated · live, with
allowed side effects named). Source: `docs/research/codex-run-project-pipeline.md` (5).

## Done when
- [x] `product-requirements.md.template` has a **First milestone** section: proof goal (the uncertainty it removes) · ✓ review: template § First milestone (00f3245b); Codex R2 CLEAR
      stopping condition · integration boundary + allowed side effects.
- [x] `/lean-doc-generator init` asks for it in its popup and leaves `[CUSTOMIZE]` when unanswered (never invents it). ✓ review: init.md step 3, same popup round, "not decided yet" keeps `[CUSTOMIZE]`, headless writes nothing (00f3245b); Codex R2 CLEAR
- [x] Exercised on a real greenfield input (consumer path, e.g. a scratch repo): the section is filled from the answers. ✓ test: D:\Research\init-scratch (owner ruling R3), the owner's three popup answers written into docs/product/requirements.md § First milestone (log entry)
- [x] CHANGELOG `[Unreleased]` line. ✓ check: CHANGELOG `## [Unreleased]` › SPRINT-143 third line (00f3245b)

## Touches
`skills/lean-doc-generator/templates/product-requirements.md.template` · `skills/lean-doc-generator/references/init.md` · CHANGELOG.md

## Assumes
- TASK-520 consumes the proof goal; this task only produces it.

## Tracker
Research `codex-run-project-pipeline`, Findings row (5).
