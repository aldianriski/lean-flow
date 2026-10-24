---
id: TASK-492
title: "Add an on-request EN↔ID translate mode to /humanizer"
sprint: SPRINT-139
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
- [x] Translate mode triggers only on an explicit request (EN→ID or ID→EN); the default mode never translates. ✓ Translate mode fires only on a request naming a target language; default and file modes never translate (50d5f623)
- [x] EN→ID output follows the TASK-491 term policy and italics rule; ID→EN output is checked against the English catalog. ✓ EN->ID: term table + first-use italics (coinage scan 0 hits, seeded control 4/4); ID->EN checked against the EN catalog
- [x] Code blocks, inline code, paths, YAML and link targets are unchanged. ✓ SKILL.md keeps code blocks, inline code, paths, YAML, link targets, proper names unchanged; exercise 1 inline code intact
- [x] Exercised: one real lean-flow doc paragraph EN→ID and one Indonesian text → EN; before/after in the sprint log. ✓ README 229-232 EN->ID (6 facts) and an ID note -> EN (7 facts, corrected); both in full in the log
- [x] CHANGELOG line; Codex gauntlet review clean. ✓ CHANGELOG [Unreleased] bullet (50d5f623); Codex CLEAR at round 2

## Touches
`skills/humanizer/SKILL.md` (detail in `references/translate.md` only if the cap needs it) · CHANGELOG

## Assumes
none

## Tracker
Owner intake 2026-10-24 ("clean, and translate if asked").
