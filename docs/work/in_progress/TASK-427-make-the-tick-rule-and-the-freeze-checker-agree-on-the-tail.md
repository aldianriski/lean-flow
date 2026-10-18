---
id: TASK-427
title: "Make the shipped tick rule and the freeze checker agree on where a multi-line box's ✓ tail goes"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J2
origin: close-retro
state: ready
epic: EPIC-022
sprint: SPRINT-125
depends-on: []
---

# TASK-427 — Make the shipped tick rule and the freeze checker agree on where a multi-line box's ✓ tail goes

## Why

A measured defect (ADR-053's first condition), not new machinery. `skills/orchestrator/references/dispatch.md` § Tick tells the
coordinator to append ` ✓ <evidence>` "after the frozen text", and `sprint-by-reference.md` step 4 says the same. For a `## Done when` box
that wraps onto continuation lines, the frozen text ends on the last continuation line, so that is where SPRINT-124 T1 put TASK-426's
tails. `check-sprint-by-reference.ts` strips a tail only from the box line itself, so it read the ticks as an unlogged edit
(`FREEZE-EDIT TASK-426`) until the tails were moved (`904607ad`). TASK-423 had dodged it with separate ✓ lines. Adopters follow the
shipped wording, so either the wording or the checker is wrong. Which one changes is the owner's call at G2.

## Done when

- [x] A ticked multi-line box whose ✓ tail sits where the shipped references say passes `check-sprint-by-reference.ts`, and a tail anywhere ✓ `2fa73542`: retained `multiline-box-tail-on-first-line` (PASS) + `multiline-box-tail-on-continuation` (FREEZE-EDIT TASK-901); `run-by-reference-fixtures.ts` 149/0; seeded tail-strip break reddened the PASS case, checker hash restored = HEAD
      else in the box still FAILs as a freeze edit: one retained case each.
- [x] `dispatch.md` § Tick and `sprint-by-reference.md` step 4 name the same placement the checker accepts: **the wording ✓ `2fa73542`: dispatch.md rule 5 + sprint-by-reference.md step 4 (stated once, two pointers) say the box's first line; checker unchanged (hash a8315bc9)
      moves** to "on the box's first line" (owner ruling 2026-10-18), the checker is unchanged; TD-229 resolves with it.

## Tracker

- SPRINT-124 Retro (Friction) · `904607ad` · ADR-047 (the freeze) · ADR-053 (admission: measured defect)
