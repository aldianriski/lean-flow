---
id: TASK-468
title: "Extract the solution-analysis pack from decision research, and declare it against the contract"
epic: EPIC-007
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-468 — Extract the solution-analysis pack from decision research, and declare it against the contract

## Why

EPIC-007 condition 2 needs 3–5 packs from procedures with real internal use (D1). Solution analysis qualifies through decision
research: 24 of the 53 docs in `docs/research/` follow the RESEARCH template's shape (Recommendation plus Options considered or
Findings), written 2026-08-10 → 2026-10-20. Most of them fed an ADR or a ruling. `/council` (one run) and `/prototype` (none) do
not qualify, and security-review has no lean-flow procedure (D1 census, 2026-10-20). This would be the third pack.

## Done when

- [ ] A solution-analysis pack declares all eight contract fields from the RESEARCH template's procedure (question → options →
  findings → recommendation, feeding a decision record) and names the internal use that qualified it under D1 (template-shaped
  decision-research docs, cited by name and date).
- [ ] The pack names no model: its routing is by ADR-010 role, and a search of the pack for model and vendor names finds none.
- [ ] A fresh reader validates the declaration against `packs/CONTRACT.md`'s checklist, with every field ticked or a recorded
  finding.
- [ ] README § Workflow packs lists the pack.

## Touches

the pack file in `packs/` · README § Workflow packs · CHANGELOG (coordinator, at close)

## Assumes

- The RESEARCH template and its practice stay the maintained source. The pack is extracted from them and does not fork them.
- `/council` and `/prototype` are not cited as D1 evidence (one run and none).
- No no-plugin exercise is required for this pack (owner ruling at intake).

## Tracker

- EPIC-007 conditions 2 and 4 · D1 census 2026-10-20 (intake)
