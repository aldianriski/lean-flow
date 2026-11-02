---
id: TASK-593
title: "/prime, /flow and the close retro see bug items"
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-591]
---

# TASK-593 — /prime, /flow and the close retro see bug items

## Why
Owner, 2026-11-02: bugs are not linked into the process (`/prime`, the end-to-end loop). A bug item no session start reports and
no conductor routes is unwired (CLAUDE.md § Definition of Done, wiring check).

## Done when
- [ ] `/prime` reports open bug items (count, with the oldest) beside the task count.
- [ ] `/flow` routes a bug through `/triage` and `/diagnose` before the build.
- [ ] The close retro lists the bug items the sprint fixed, with their root cause in one line each.
- [ ] Shown end to end on one bug item from TASK-592: `/prime` counts it, `/flow` routes it, the close lists it.
- [ ] CHANGELOG `[Unreleased]` entry; every SKILL.md touched stays within its cap.

## Touches
`skills/prime/SKILL.md` · `skills/flow/SKILL.md` · `skills/lean-doc-generator/` (close retro) · CHANGELOG.md

## Assumes
- `.claude/CONTEXT.md` changes only if the loop itself changes.

## Tracker
Owner request 2026-11-02 · TASK-591 · TASK-592
