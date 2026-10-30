---
id: TASK-558
title: "Let promote pull a dependent task together with its blockers, ordered in waves"
sprint: SPRINT-151
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-558 — Let promote pull a dependent task together with its blockers, ordered in waves

## Why
Promote takes only `state: ready` tasks, so a dependency chain fills one sprint per link. Twice the owner has had to rule
dependents ready so they could ride with their blockers: TASK-532 beside TASK-531 at SPRINT-148, and TASK-537..541 and 543
beside TASK-536 at SPRINT-151, where the strict rule would have built a sprint of one S task. The owner asked for the ruling to
become the standard (2026-10-30). Repeated failure (two sightings); a promote procedure change in a shipped skill, not new
governance machinery, so not frozen under ADR-053.

## Done when
- [ ] The promote procedure lets a task whose every open blocker is a member of the same sprint, in an earlier wave, join that
  sprint without a state ruling, and says what happens when a blocker fails (its dependents leave by scope-change).
- [ ] The rule sits where promote reads it, chosen by §10's placement test, and is consumer-safe (no maintainer path or id).
- [ ] The next real promote that pulls a dependent uses it without an owner ruling, recorded in its promote entry.

## Touches
the lean-doc-generator sprint-by-reference reference · the lean-doc-generator SKILL.md promote row (139/140 lines: an existing
line only) · `CHANGELOG.md`

## Assumes
- Triage's rule (a dependency in flight keeps a task blocked) stays as it is; the change is in what promote may pull.

## Tracker
SPRINT-148 TASK-532 ruling · SPRINT-151 promote ruling (2026-10-30)
