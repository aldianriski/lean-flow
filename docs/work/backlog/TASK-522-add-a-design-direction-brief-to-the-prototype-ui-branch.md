---
id: TASK-522
title: "Add a design-direction brief to the /prototype UI branch, defer to installed design skills, offer DESIGN.md"
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

# TASK-522 — Add a design-direction brief to the /prototype UI branch

## Why
The UI branch generates structurally different variants but sets no direction first and records none after, so the
winner's palette, type and density live only in code. The Codex pipeline fixes a compact direction brief, keeps
operational screens apart from promotional ones, and routes to specialist design skills. The owner's environment
already has `frontend-design` and `anti-slop`, so lean-flow defers to them rather than adding a design skill.
Source: `docs/research/codex-run-project-pipeline.md` (11).

## Done when
- [ ] Before variants: a short direction brief (subject idea · palette roles · type roles · density · operational vs promotional).
- [ ] When the session's skill listing holds `frontend-design` or `anti-slop`, the branch defers to it (same shape as
      review's `antislop` deferral); without one, the brief and the existing anti-patterns are the floor and nothing errors.
- [ ] Capture: the winner's direction is offered into `DESIGN.md` (never auto-created; fields only from the owner).
- [ ] Exercised once on a real UI question; CHANGELOG `[Unreleased]` line.

## Touches
`skills/prototype/references/ui.md` · `skills/prototype/SKILL.md` (capture line) · CHANGELOG.md

## Assumes
- No new skill and no agent (ADR-001: would duplicate installed design skills).
- Shares `skills/prototype/SKILL.md` with TASK-521: G2 names one owner and the commit order.

## Tracker
Research `codex-run-project-pipeline`, Findings row (11).
