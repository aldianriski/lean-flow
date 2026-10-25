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
sprint: SPRINT-140
---

# TASK-503 — Add a UI floor to the orchestrator's review routing for rendered-UI behaviour changes

## Why
The loop has no UI-specific check: a UI change routes to `/run` + `/verify` with nothing naming states, keyboard, narrow
widths or contrast. Consumers like workdoo ship UI through this loop. anti-slop's Delivery Gate shows the minimum; its
100+ UI patterns stay in anti-slop (curated, not copied).

## Done when
- [x] `review-scoping.md` routing gains a row keyed on **consequence** (a behaviour change to rendered UI), never on file ✓ `90eeecc7`: skip-table row "rendered-UI behaviour change" + § UI floor trigger, a subset of the material class in § Two dimensions, never file type or path
      extension, consistent with § Two dimensions.
- [x] The floor it adds to `/run` + `/verify`: a recorded click-through of every changed control (control → what happened, ✓ `90eeecc7`: § UI floor lists click-through · states · keyboard · narrowest width · WCAG-computed contrast, each recorded; "A PASS with no record is not a PASS"; cannot-run ends UNVERIFIED
      no console errors) · empty, loading and error states present and saying what to do next · keyboard reach with a
      visible focus indicator and Escape closing dialogs · no horizontal overflow at the narrowest supported width ·
      contrast computed with the WCAG formula, never asserted. A PASS without its recorded evidence is not a PASS.
- [x] When a skill named `antislop` is available in the session, the review runs its Delivery Gate and attaches that ✓ `90eeecc7`: deferral to an `antislop` / `anti-slop` skill's Delivery Gate; load failure records the reason and applies the floor; no such skill → floor, nothing errors
      report instead of the floor; without it the floor applies and nothing errors (degrades gracefully).
- [x] Exercised on the consumer path: one UI change in the `D:\Research\workdoo` copy, run through the routing with and ✓ workdoo copy, Copy-email change (restored, sha256 c2b99c9cedd5ca59 = c2b99c9cedd5ca59): (a) no anti-slop → floor, all UNVERIFIED (commands blocked) + real focus regression found; (b2) anti-slop on its long path → Delivery Gate Blocks 1–4 attached; b1 short-path fallback recorded
      without anti-slop present; both reports recorded.
- [x] Governance-impact diff → one scoped reviewer; Codex review → fix → re-review until clean; CHANGELOG line. ✓ scoped sonnet reviewer SCOPED REVIEW: CLEAR (Spec + Standards); Codex R1 NOT CLEAR (2: load fallback, CHANGELOG over-promise) → fixed → R2 VERDICT: CLEAR; CHANGELOG bullet

## Touches
`skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/SKILL.md` (routing line, if the row needs one) ·
`CHANGELOG.md`

## Assumes
- "anti-slop installed" is detected by the skill listing, not by a file path (works for any install route).
- Static or non-runnable deliverables say so and verify by code inspection, per anti-slop R-35.

## Tracker
anti-slop adoption scan 2026-10-25, item 6.
