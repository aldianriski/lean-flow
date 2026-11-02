---
id: TASK-563
title: "Remove lean-flow-internal ids from the shipped templates and init's reference"
sprint: SPRINT-155
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-563 — Remove lean-flow-internal ids from the shipped templates and init's reference

## Why
Consumer-side defect found during SPRINT-153's exercises: `references/init.md` still names lean-flow's own ids (ADR-012,
TD-017, TemiDev), and eleven templates carry id-shaped strings (`ADR-NNN`, `TD-NNN`, `TASK-NNN`, `SPRINT-NNN`, `L-NNN`), some
of them format examples and some possibly lean-flow's own rows. An adopter's generated docs can inherit an id that means
nothing in their repo (L-015, consumer-side rule). T1 removed ADR-012 only where it touched the profile sections.

## Done when
- [x] A census of `skills/lean-doc-generator/templates/` and `skills/lean-doc-generator/references/init.md` separates format examples from ✓ `5588f20d`: the census grep over both now prints only the format examples (ADR-000/001, L-000/001/007, TD-000/001, SPRINT-000); Claude review 1 Low, fixed
  lean-flow-internal ids or names; each internal one is removed or replaced by a plain statement of the rule.
- [x] A real `init` through the installed plugin on a fresh snapshot writes no lean-flow-internal id into the adopter repo. ✓ 2026-11-02: headless operated init, plugin pinned at `5a53c65d`, on two fresh clinic copies (20 and 21 files added, nothing overwritten): no ADR, L, TD, SPRINT, TASK or EPIC number and no lean-flow path in any added file (2.19.1 had leaked one ADR id into seven docs)

## Touches
`skills/lean-doc-generator/templates/*.template` · `skills/lean-doc-generator/references/init.md`

## Tracker
SPRINT-153 close Retro (found in T1 and T3 exercises)
