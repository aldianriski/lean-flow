---
id: TASK-571
title: "A sprint Plan's `Cites:` carries a `path § heading` pointer that its tasks share"
epic: EPIC-023
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-568]
---

# TASK-571 — A sprint Plan's `Cites:` carries a `path § heading` pointer that its tasks share

## Why
EPIC-023 S2. A fact a whole task group shares (a sprint-wide ruling, a shared invariant) has no pointer home: `Cites:`
resolves only task ids, and its other tokens are free text. Frozen surface: admitted on S0's measured defect for symptom 3,
log reference filled in from TASK-545.

## Done when
- [ ] Promote may write a `path § heading` pointer in a `Tn`'s `Cites:`, and dispatch resolves it into that task's brief as
  in TASK-568.
- [ ] lean-flow's own Plan checks that parse `Cites:` accept the pointer form; a retained must-FAIL fixture shows a malformed
  pointer failing with its named finding, and one run on a real sprint file passes.

## Touches
the generator's sprint-by-reference reference and SPRINT template · lean-flow's Cites-parsing checks and their fixtures

## Assumes
- **blocked-by:** S0 (TASK-545) records symptom 3 as a measured defect; TASK-568 sets the pointer rule.
- The check change is a maintainer-only leg (Other G under ADR-050): fixture plus one real run.

## Tracker
EPIC-023 Closed-when S2 · research §6 row S2 (Plan)

## Amended 2026-11-01
Not admitted (owner, /triage): S0 recorded symptom 3, lost detail, as not reproduced under R-b (`docs/research/logs/ab-measurements.md` § Report 2026-11-01), so S2 admits nothing. Revisit only per `.out-of-scope/pointer-carry-through.md`.
