---
id: TASK-564
title: "Stop the README template's Quick start repeating the setup guide, and fix the integrations OpenAPI pointer"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-564 — Stop the README template's Quick start repeating the setup guide, and fix the integrations OpenAPI pointer

## Why
Two template defects seen in SPRINT-153's init exercises. The README template's Quick start restates the steps the setup
guide owns, so an adopter gets two copies that drift (a second SSOT). The integrations template points to an OpenAPI file
that init never writes, so the pointer is dead on every repo without one.

## Done when
- [ ] The README template's Quick start points to the setup guide instead of restating it.
- [ ] The integrations template names the OpenAPI file only when the repo has one (or drops the pointer).
- [ ] A real `init` through the installed plugin on a fresh snapshot writes neither the duplicate nor a dead pointer.

## Touches
`skills/lean-doc-generator/templates/README.md.template` · the integrations template

## Tracker
SPRINT-153 close Retro (T1 box 3, T2 run)
