---
id: TASK-360
title: "Make sprint and epic membership frontmatter, and sprint progress derived"
epic: EPIC-017
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: [TASK-359]
---

# TASK-360 — Make sprint and epic membership frontmatter, and sprint progress derived

## Done when

- [ ] A task file carries `sprint:` / `epic:`; the sprint file **references** its members instead of containing them; `/prime` derives open-DoD by counting `## Done when` boxes across member files and **matches a hand count**. Nesting membership under status is explicitly rejected — "what is in review across all sprints?" must stay answerable with one glob.

## Touches

SPRINT.md.template · skills/prime/SKILL.md · docs/work/ schema

## Assumes

none

## Tracker

EPIC-017 D1 · D2

## Amended 2026-09-24

- **Mirrored at SPRINT-106 close (owner ruling):** the `sprint:`/`epic:`, derived-count, hand-count and one-glob parts are done (`1584c8d`, harness 13/0). **Open:** "the sprint file references its members instead of containing them" — SPRINT-106 still carries Plan copies; that half is TASK-362's (promote/close by reference).
