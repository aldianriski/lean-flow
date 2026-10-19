---
id: TASK-452
title: "Make the reviewer list what it declined to judge, and treat spec silence as no licence"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-129
---

# TASK-452 — Make the reviewer list what it declined to judge, and treat spec silence as no licence

## Why

Whatever a reviewer sets aside today leaves no trace, so a reader cannot tell "checked and fine" from
"not looked at". Upstream also saw every implementer ship the same crash on an input the spec only
implied, because silence was read as permission.

## Done when

- [x] The reviewer's report carries a **declined to judge** list next to the Standards and Spec axes: each item set aside, with a one-line reason. An empty list is stated, not omitted. ✓ ab096d79 (T2 69e07ceb + wiring fix 77a5ad3c); exercised: the T2 Codex review returned a Declined-to-judge list beside both axes
- [x] The Spec axis states that behaviour the spec does not mention is not thereby allowed, and that an implied input it does not handle is a Spec finding. ✓ ab096d79; Codex Spec CLEAR; adversarial-floor F1 (rules absent from the injected prompt) fixed in 77a5ad3c, re-review CLEAR
- [x] Exercised once on a real review (L-007). README/CHANGELOG reflect the change. ✓ exercised: T2's own review returned the Declined-to-judge list; CHANGELOG v2.10.0 (5c462404); README skill table unaffected, footer bumped

## Touches

skills/orchestrator/references/review-scoping.md (reviewer report shape · Spec axis) · CHANGELOG

## Assumes

- the two axes stay separate and are never merged or re-ranked; the new list sits beside them, not inside either.

## Tracker

- `docs/research/brainstorming-adaptation.md` § Re-scan K3 (upstream `requesting-code-review/code-reviewer.md`) · replaces TASK-448 (part)
