---
id: TASK-595
title: "Decide docs/research/storm (a copied skill) under the curation bar"
priority: P3
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-595 — Decide docs/research/storm (a copied skill) under the curation bar

## Why
SPRINT-159's adopter folder audit (finding F10, `docs/research/adopter-folder-audit.md`) found a skill-shaped copy, a `SKILL.md`
plus an HTML template, inside lean-flow's own research folder: outside `skills/`, outside ADR-001's curation bar, with no header and
three citations. Owner ruling 2026-11-02: decide it in its own task; nothing moves in SPRINT-159.

## Done when
- [ ] The owner rules, by popup, one of: adopt it into `skills/` through ADR-001's bar (useful, important, actually used), or move
      it out of the repo; its three citing docs are updated either way.
- [ ] The repo's gate is green after the change.

## Touches
`docs/research/storm/` · the docs that cite it

## Assumes
- Its content is a third-party skill copy; adopting it is an addition, not a fix.

## Tracker
SPRINT-159 T1 (adopter folder audit, F10)
