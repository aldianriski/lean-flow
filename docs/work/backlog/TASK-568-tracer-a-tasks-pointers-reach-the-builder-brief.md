---
id: TASK-568
title: "Tracer: a task's `path § heading` pointers reach the builder brief, and a missing one stops the task"
epic: EPIC-023
priority: P2
size: M
risk: high
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-567]
---

# TASK-568 — Tracer: a task's `path § heading` pointers reach the builder brief, and a missing one stops the task

## Why
EPIC-023 S2 (H2 carry-through). The builder brief today carries no doc excerpt and no field for one, so a repo fact recorded
in the profile reaches the builder only if someone copies it. Frozen surface (dispatch brief): admitted on S0's measured
defect for symptom 3, log reference filled in from TASK-545. G2 review-round cap 2.

## Done when
- [ ] `/task-decomposer` writes a `## Sources` list of `path § heading` pointers to the profile sections a task depends on, with
  the pointer rule stated inline (format; match ignores case, surrounding whitespace, leading emoji or decoration and a
  trailing ` [CUSTOMIZE]`, at any heading level; no match or two matches is a failure, never a silent skip).
- [ ] `/orchestrator`'s dispatch quotes each pointed section into the builder brief; a missing or ambiguous pointer writes a
  `POINTER MISSING` line naming it and stops that task before any build.
- [ ] Shown on a real sprint-bulk dispatch through the installed plugin on a profiled snapshot: the transcript shows the
  section in the brief; and one seeded missing heading stops its task with the line.

## Touches
the task-decomposer skill and its task-file reference · the TASK template · the orchestrator dispatch reference

## Assumes
- **blocked-by:** S0 (TASK-545) records symptom 3 as a measured defect.
- The resolver is a procedure the orchestrator follows, with no bundled tool (owner ruling 2026-11-01); the rule is inline in
  each skill that writes or reads a pointer (ADR-006).
- This rule covers TASK-566 (decorated headings); `/triage` may cancel TASK-566 as superseded.

## Tracker
EPIC-023 Closed-when S2 · research §6 row S2 (pointer contract) · owner rulings 2026-11-01 (resolver, contract placement)
