---
id: TASK-467
title: "Extract the verification pack from the scoped review and system verify, and declare it against the contract"
epic: EPIC-007
sprint: SPRINT-134
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

# TASK-467 — Extract the verification pack from the scoped review and system verify, and declare it against the contract

## Why

EPIC-007 condition 2 needs 3–5 packs, each extracted from a procedure with real internal use (D1). Verification qualifies. The
orchestrator's scoped review pass is recorded 129 times across 33 sprint logs (e.g. SPRINT-087 · 091 · 120 · 121 · 131 · 132).
The close-time whole-suite verify is recorded 19 times across 9 sprints (D1 census, 2026-10-20). `/diagnose`, the family's
first candidate, has no recorded run. Condition 4 (no pack owns a model identity) is asserted per pack.

## Done when

- [ ] A verification pack declares all eight contract fields from the orchestrator's review procedure (the Spec and Standards
  axes, and the one bounded retry) and the close-time whole-suite verify, and names the internal use that qualified it under D1
  (the logged review and verify runs, cited by sprint).
- [ ] The pack names no model: its routing is by ADR-010 role, and a search of the pack for model and vendor names finds none.
- [ ] A fresh reader validates the declaration against `packs/CONTRACT.md`'s checklist, with every field ticked or a recorded
  finding.
- [ ] README § Workflow packs lists the pack.

## Touches

the pack file in `packs/` · README § Workflow packs · CHANGELOG (coordinator, at close)

## Assumes

- The orchestrator's review procedure stays the maintained source. The pack is extracted from it and does not fork it.
- The G2 builder check is out of scope: it checks a design before building, not an output after it (owner ruling at intake).
- No no-plugin exercise is required for this pack: condition 3 is already met (owner ruling at intake).

## Tracker

- EPIC-007 conditions 2 and 4 · D1 census 2026-10-20 (intake)
