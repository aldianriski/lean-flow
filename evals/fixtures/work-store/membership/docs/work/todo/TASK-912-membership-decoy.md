---
id: TASK-912
title: "Membership fixture decoy (synthetic, reserved 900-block)"
epic: EPIC-900
sprint: SPRINT-901
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-912 — Membership fixture decoy (synthetic, reserved 900-block)

## Why

Synthetic fixture for `evals/run-work-store-fixtures.ts` (SPRINT-106 T2, retargeted SPRINT-111 T5).
Not a real task. Its frontmatter is stamped `sprint: SPRINT-901`, but `SPRINT-901`'s `## Members` does
**not** list it, and under prime's by-id rule membership is the `## Members` list, not the stamp. Its
four open `## Done when` boxes must never count toward `SPRINT-901` (L-186: the fixture varies the
SELECTION, not the verdict -- the old `sprint:`-field rule would count them and read 7).

## Done when

- [ ] open item G
- [ ] open item H
- [ ] open item I
- [ ] open item J

## Touches

nothing (fixture only)

## Assumes

none

## Tracker

SPRINT-106 T2 (EPIC-017 D1 · D2)
