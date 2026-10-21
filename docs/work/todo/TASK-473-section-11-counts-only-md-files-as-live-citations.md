---
id: TASK-473
title: "§11 counts only .md files as live citations"
sprint: SPRINT-135
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
---

# TASK-473 — §11 counts only .md files as live citations

## Why

TD-262 (low): §11's prune rule counts a "live citation" only in `.md` files, but nothing said so, and at the SPRINT-133 promote
TASK-438 was retained because code comments cite it. The rule and that ruling disagree, so every promote finds the file due again.
**Owner ruling 2026-10-21:** only `.md` files count; a code comment cites by id, and the id stays resolvable in git history. This
matches what the engine already scans, so no checker verdict moves.

## Done when

- [ ] Spec §11's text states that only tracked `.md` files count as live citations for pruning, and why. The spec bump is
      classified on its own stream by §15's pass→fail test (PATCH: no verdict moves).
- [ ] TD-262 marked resolved in `TECH-DEBT.md`.

## Touches

`spec/STANDARD.md` §11 · `spec/CHANGELOG.md` · the TASK-438 file in `docs/work/done/` · `TECH-DEBT.md`

## Assumes

- Nothing outside the conformance engine's `.md` scan reads code comments as citations.

## Tracker

- TD-262 · owner ruling 2026-10-21 at intake
