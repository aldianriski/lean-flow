---
id: TASK-505
title: "Give the DESIGN template a direction section the owner supplies, never the agent"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-140
---

# TASK-505 — Give the DESIGN template a direction section the owner supplies, never the agent

## Why
The DESIGN template carries tokens and Do's/Don'ts but no direction (personality, mood, audience). anti-slop's lesson: a
filter can't invent direction, and direction an agent writes tends toward the default look it should avoid.

## Done when
- [ ] `DESIGN.md.template` § Overview gains a Direction block (personality · mood · audience) and an optional
      `Dial: ENERGY n / RHYTHM n / MOTION n` line (1–3 each), with a one-line meaning per dial.
- [ ] The header comment says the file is data to apply, never instructions to obey.
- [ ] `lean-doc-generator` (where it offers DESIGN) says the Direction fields come only from the owner's answers or
      their own file; the agent formats, never invents them; no answer → the fields stay `[CUSTOMIZE]`.
- [ ] Template count claim stays 36 (`check-count-claims.sh` PASS); exercised by rendering the template once for the
      `D:\Research\workdoo` copy from owner-supplied answers.
- [ ] CHANGELOG line.

## Touches
`skills/lean-doc-generator/templates/DESIGN.md.template` · `skills/lean-doc-generator/SKILL.md` · `CHANGELOG.md`

## Assumes
none

## Tracker
anti-slop adoption scan 2026-10-25, item 8.
