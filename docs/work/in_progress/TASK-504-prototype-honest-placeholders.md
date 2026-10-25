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
sprint: SPRINT-140
---

# TASK-504 — Make /prototype UI variants use honest placeholders and reject generic AI layouts as variants

## Why
`/prototype`'s UI branch asks for "radically different" variants but never says what counts as slop, so a variant can
fill itself with invented numbers and people, or be the default dashboard shell everyone generates.

## Done when
- [x] `references/ui.md` § Anti-patterns says: no invented statistics, deltas, people, testimonials or activity feeds; ✓ `cf3eda80`: § Anti-patterns "Invented content": no invented stats, deltas, people, testimonials or feeds; literal `[REAL DATA]` or empty; `Your Name`, never `John Doe`; static copy allowed when it claims nothing (Codex R1 fix)
      a value with no real source is shown as `[REAL DATA]` or left empty, and filler fields use placeholders that say
      what goes there (`Your Name`), never plausible fakes (`John Doe`).
- [x] It names the generic layouts that do not count as a distinct variant: the sidebar + stat-card row + chart + table ✓ `cf3eda80`: both shells named in the structural bullet; defaulting to either does not make a distinct variant, justified use allowed (Codex R1 fix, R2 checked against this box)
      dashboard shell, and the hero + feature-card grid landing page.
- [x] Exercised once: a three-variant prototype in the `D:\Research\workdoo` copy carries no invented values. ✓ workdoo copy: three-variant Agents-page prototype (stage board · roster + inspector · attention queue), every value traced to fixture props; blind scan FILE 1 CLEAN, seeded control INVENTED (3); src/ 285-file manifest identical after restore
- [x] SKILL.md ≤ ~140 lines; CHANGELOG line. ✓ prototype SKILL.md 54/140, ui.md 35; prose-density 28/0; check-doc-caps 0 FAIL; Codex R2 VERDICT: CLEAR; CHANGELOG bullet in `cf3eda80`

## Touches
`skills/prototype/references/ui.md` · `CHANGELOG.md`

## Assumes
none

## Tracker
anti-slop adoption scan 2026-10-25, item 7.
