---
id: TASK-345
title: "Give `workdoo` the pinned-plugin mechanism ADR-041 already rules it has"
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: manual
state: ready
---

# TASK-345 — Give `workdoo` the pinned-plugin mechanism ADR-041 already rules it has

## Why

origin note: filed by hand at the SPRINT-098 promote governance review (severity: high escalation)

## Done when

- [ ] `workdoo` consumes lean-flow at a **recorded version** and the pin is verifiable from that repository — today ADR-041's ruling exists only as prose in `workdoo`'s `CLAUDE.md`, with no `.claude-plugin/`, no plugins block in `.claude/settings.json` and no version reference anywhere. Two named failures at once: the capability is written only in its own file (L-020) and the decision sits where its reader — that repository's install — cannot reach it (L-151).

## Touches

- `workdoo` (another repository — this row is the lean-flow-side tracker, not the edit)

## Assumes

- **that the fix lands in `workdoo`, not here.** lean-flow owns the ADR and the consumer contract; it does not own the consumer's install. Rule at G2 whether this repository owes anything beyond the ruling — a *check* for the pin would be lean-flow's, and `check-skill-freshness` is the shape one level over.

## Tracker

- TD-150 (severity: high, open) · ADR-041 · L-020 · L-151
