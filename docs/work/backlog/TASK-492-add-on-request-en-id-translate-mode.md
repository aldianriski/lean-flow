---
id: TASK-492
title: "Add an on-request EN↔ID translate mode to /humanizer"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-491]
---

# TASK-492 — Add an on-request EN↔ID translate mode to /humanizer

## Why
The owner sometimes needs a text in English and sometimes in Indonesian. Translation must apply the same cleanup and the
TASK-491 term policy, or it reintroduces galat-class terms.

## Done when
- [ ] Translate mode triggers only on an explicit request (EN→ID or ID→EN); the default mode never translates.
- [ ] EN→ID output follows the TASK-491 term policy and italics rule; ID→EN output is checked against the English catalog.
- [ ] Code blocks, inline code, paths, YAML and link targets are unchanged.
- [ ] Exercised: one real lean-flow doc paragraph EN→ID and one Indonesian text → EN; before/after in the sprint log.
- [ ] CHANGELOG line; Codex gauntlet review clean.

## Touches
`skills/humanizer/SKILL.md` (detail in `references/translate.md` only if the cap needs it) · CHANGELOG

## Assumes
none

## Tracker
Owner intake 2026-10-24 ("clean, and translate if asked").
