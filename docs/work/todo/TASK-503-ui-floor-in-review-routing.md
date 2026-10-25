---
id: TASK-503
title: "Add a UI floor to the orchestrator's review routing for rendered-UI behaviour changes"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-503 — Add a UI floor to the orchestrator's review routing for rendered-UI behaviour changes

## Why
The loop has no UI-specific check: a UI change routes to `/run` + `/verify` with nothing naming states, keyboard, narrow
widths or contrast. Consumers like workdoo ship UI through this loop. anti-slop's Delivery Gate shows the minimum; its
100+ UI patterns stay in anti-slop (curated, not copied).

## Done when
- [ ] `review-scoping.md` routing gains a row keyed on **consequence** (a behaviour change to rendered UI), never on file
      extension, consistent with § Two dimensions.
- [ ] The floor it adds to `/run` + `/verify`: a recorded click-through of every changed control (control → what happened,
      no console errors) · empty, loading and error states present and saying what to do next · keyboard reach with a
      visible focus indicator and Escape closing dialogs · no horizontal overflow at the narrowest supported width ·
      contrast computed with the WCAG formula, never asserted. A PASS without its recorded evidence is not a PASS.
- [ ] When a skill named `antislop` is available in the session, the review runs its Delivery Gate and attaches that
      report instead of the floor; without it the floor applies and nothing errors (degrades gracefully).
- [ ] Exercised on the consumer path: one UI change in the `D:\Research\workdoo` copy, run through the routing with and
      without anti-slop present; both reports recorded.
- [ ] Governance-impact diff → one scoped reviewer; Codex review → fix → re-review until clean; CHANGELOG line.

## Touches
`skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/SKILL.md` (routing line, if the row needs one) ·
`CHANGELOG.md`

## Assumes
- "anti-slop installed" is detected by the skill listing, not by a file path (works for any install route).
- Static or non-runnable deliverables say so and verify by code inspection, per anti-slop R-35.

## Tracker
anti-slop adoption scan 2026-10-25, item 6.
