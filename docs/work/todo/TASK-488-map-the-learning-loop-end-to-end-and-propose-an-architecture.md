---
id: TASK-488
title: "map the learning loop end to end and propose an architecture where each iteration measurably improves the workflow"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-488 — map the learning loop end to end and propose an architecture where each iteration measurably improves the workflow

## Why
Owner request 2026-10-24: "every iteration the workflow more better", integrated with the existing learning pattern end to end,
with a proper architecture, reviewed twice by Codex, from the consumer's point of view too. Evidence: promoted rules keep recurring
(L-108 ×18, L-224 ×9, L-218 ×3; "loaded and reached none"), and about 8 consecutive sprints changed only maintainer checkers.
Research builds nothing; each recommendation names its ADR-053 admission, or that it has none yet.
Consumer: maps the same loop as it runs in an adopter repo (workdoo), and the route by which an adopter's learning reaches lean-flow.

## Done when
- [ ] `docs/research/<slug>.md` (RESEARCH template) maps the loop end to end: capture (`/insights`, close Retro) → `L-NNN` and its
      count → promote checkpoint → §10 placement → durable rule → the flow that should fire it → a recurrence sighting → the route by
      which that sighting updates the existing learning. Each hop names where the record lives, who reads it to act, and where the sync
      breaks. It is a delta over epic-017-effectiveness · loop-hygiene-* · loop-mechanics-audit · night-run-cost, not a restatement.
- [ ] Every promoted `L-NNN` is inventoried, and a declared cohort and named cases are traced in detail. Each traced learning gets its
      promotion decision, placement owner, firing trigger, required action, outcome evidence, and the update route for a later
      sighting, distinguishing a rule that is available, reached, acted on and effective. Recurrence is reported relative to
      observable opportunities and exposure time; a missing sighting is not read as proof that the placement worked.
- [ ] One documented extraction each for: checker catches vs their TD rows and fix commits; ceremony and review cost per sprint from
      at least 8 completed pre-change Retros (the baseline); consumer-visible change and release per sprint. Findings that drive a
      recommendation get an independent cross-check. Missing data is reported as a finding, never estimated.
- [ ] Consumer side: the same loop traced read-only in workdoo (its LEARNINGS, Retros and gate verdicts), and the upstream path from
      an adopter's learning to a lean-flow change, or its absence, stated as a finding.
- [ ] A target-architecture section (WHY/WHERE, no HOW) shows how a learning moves from sighting to a change that measurably stops it,
      including how an ineffective rule is revised or retired through existing mechanisms. Then ranked next-intake candidates, each
      with the evidenced problem, smallest intervention, owner, scope, dependencies, ADR-053 admission (or unmet), an observable
      success criterion, expected benefit and operating cost.
- [ ] Two Codex review rounds (review → fix → re-review), the second leaving no unresolved blocking finding. The knowledge index is
      regenerated. Any hard-to-reverse, surprising recommendation is proposed to the owner as an ADR, not written here.

## Touches
`docs/research/<slug>.md` · `docs/knowledge-index.md`

## Assumes
- workdoo is read, never written.
- Observations after TASK-482–486 land are kept separate from the pre-change baseline.

## Tracker
- Owner request 2026-10-24 (item R); intake draft reviewed by Codex 2026-10-24 (APPROVE WITH FIXES, folded in)
