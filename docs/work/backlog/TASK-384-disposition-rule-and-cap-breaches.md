---
id: TASK-384
title: "Enforce a disposition per promoted rule and close the soft cap breaches"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-364, TASK-377]
---

# TASK-384 — Enforce a disposition per promoted rule and close the soft cap breaches

## Done when

- [ ] Promotion requires a stated disposition: replace · merge · move to an on-demand reference · automate into a check · retain with justification.
- [ ] At least one rule is demoted out of .claude/CLAUDE.md through that route, destination recorded (Closed-when 4).
- [ ] Every soft OVER-CAP row is closed by a recorded disposition, not a diet — the gate reports zero (Closed-when 3).

## Touches

spec/STANDARD.md · skills/lean-doc-generator/SKILL.md (promote governance) · .claude/CLAUDE.md

## Assumes

none

## Tracker

EPIC-017 D3 · Closed-when 3 · 4 · TD-174
