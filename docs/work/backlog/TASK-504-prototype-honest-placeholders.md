---
id: TASK-504
title: "Make /prototype UI variants use honest placeholders and reject generic AI layouts as variants"
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
---

# TASK-504 — Make /prototype UI variants use honest placeholders and reject generic AI layouts as variants

## Why
`/prototype`'s UI branch asks for "radically different" variants but never says what counts as slop, so a variant can
fill itself with invented numbers and people, or be the default dashboard shell everyone generates.

## Done when
- [ ] `references/ui.md` § Anti-patterns says: no invented statistics, deltas, people, testimonials or activity feeds;
      a value with no real source is shown as `[REAL DATA]` or left empty, and filler fields use placeholders that say
      what goes there (`Your Name`), never plausible fakes (`John Doe`).
- [ ] It names the generic layouts that do not count as a distinct variant: the sidebar + stat-card row + chart + table
      dashboard shell, and the hero + feature-card grid landing page.
- [ ] Exercised once: a three-variant prototype in the `D:\Research\workdoo` copy carries no invented values.
- [ ] SKILL.md ≤ ~140 lines; CHANGELOG line.

## Touches
`skills/prototype/references/ui.md` · `CHANGELOG.md`

## Assumes
none

## Tracker
anti-slop adoption scan 2026-10-25, item 7.
