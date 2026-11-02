---
id: TASK-593
title: "/prime, /flow and the close retro see bug items"
sprint: SPRINT-159
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
- [x] `/prime` reports open bug items (count, with the oldest) beside the task count. ✓ 2026-11-02: `acadea17`; a headless run of the pinned changed skill printed `bugs: 1 open (oldest TASK-596, ...)`
- [x] `/flow` routes a bug through `/triage` and `/diagnose` before the build. ✓ 2026-11-02: `acadea17`; Feed sends a reported bug to /triage, Build sends a bug item through /diagnose; a headless run routed TASK-596 (already diagnosed) to close
- [x] The close retro lists the bug items the sprint fixed, with their root cause in one line each. ✓ 2026-11-02: SPRINT-159's Retro § Bugs fixed this sprint lists TASK-596 with its one-line root cause
- [x] Shown end to end on one bug item from TASK-592: `/prime` counts it, `/flow` routes it, the close lists it. ✓ 2026-11-02: TASK-596: /prime counted it, /flow routed it to close, and SPRINT-159's close lists it
- [x] CHANGELOG `[Unreleased]` entry; every SKILL.md touched stays within its cap. ✓ 2026-11-02: CHANGELOG [Unreleased] Changed line; prime 140, flow 64, lean-doc-generator 139 lines; no new dense line

## Touches
`skills/prime/SKILL.md` · `skills/flow/SKILL.md` · `skills/lean-doc-generator/` (close retro) · CHANGELOG.md

## Assumes
- `.claude/CONTEXT.md` changes only if the loop itself changes.

## Tracker
Owner request 2026-11-02 · TASK-591 · TASK-592
