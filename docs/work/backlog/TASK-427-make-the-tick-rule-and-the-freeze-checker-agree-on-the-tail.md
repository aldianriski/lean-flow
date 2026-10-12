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

- [ ] A ticked multi-line box whose ✓ tail sits where the shipped references say passes `check-sprint-by-reference.ts`, and a tail anywhere
      else in the box still FAILs as a freeze edit: one retained case each.
- [ ] `dispatch.md` § Tick and `sprint-by-reference.md` step 4 name the same placement the checker accepts.

## Tracker

- SPRINT-124 Retro (Friction) · `904607ad` · ADR-047 (the freeze) · ADR-053 (admission: measured defect)
