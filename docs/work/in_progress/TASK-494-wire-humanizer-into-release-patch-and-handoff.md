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
- [x] release-patch passes its prepended CHANGELOG entry (rendered Markdown) through embedded mode before the hard stop; it ✓ step 4 + changelog-only path run the pass before the hard stop; version/heading/bump lines and structure protected (ce5f2946)
      still never pushes.
- [x] handoff passes the handoff doc's prose through embedded mode before saving. ✓ handoff passes its prose before saving; voice sample = 'What goes in' outline (ce5f2946)
- [x] Fires end-to-end: one real release-patch dry run and one real handoff show the pass. ✓ real handoff WRITTEN with the pass (Temp/handoff-sprint139-t6.md); real release-patch dry run shows the pass; no git push in transcript
- [x] Both SKILL.md files stay ≤140; CHANGELOG line; Codex gauntlet review clean. ✓ release-patch 100/140, handoff 102/140; CHANGELOG [Unreleased] bullet; Codex CLEAR at round 1

## Touches
`skills/release-patch/SKILL.md` · `skills/handoff/SKILL.md` · CHANGELOG

## Assumes
none

## Tracker
Owner intake 2026-10-24.
