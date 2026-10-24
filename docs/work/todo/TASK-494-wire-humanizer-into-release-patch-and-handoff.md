---
id: TASK-494
title: "Wire /humanizer into release-patch CHANGELOG entries and handoff docs"
sprint: SPRINT-139
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-493]
---

# TASK-494 — Wire /humanizer into release-patch CHANGELOG entries and handoff docs

## Why
CHANGELOG entries and handoff docs are prose that the owner and adopters read; both should go through the TASK-493 contract.

## Done when
- [ ] release-patch passes its prepended CHANGELOG entry (rendered Markdown) through embedded mode before the hard stop; it
      still never pushes.
- [ ] handoff passes the handoff doc's prose through embedded mode before saving.
- [ ] Fires end-to-end: one real release-patch dry run and one real handoff show the pass.
- [ ] Both SKILL.md files stay ≤140; CHANGELOG line; Codex gauntlet review clean.

## Touches
`skills/release-patch/SKILL.md` · `skills/handoff/SKILL.md` · CHANGELOG

## Assumes
none

## Tracker
Owner intake 2026-10-24.
