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

- [x] Spec §11's text states that only tracked `.md` files count as live citations for pruning, and why. The spec bump is ✓ 52a35620 + d8ea3be1: §11 'Only tracked .md files cite' with the git-history reason; spec 0.18.1 PATCH by §15 (engine scans .md only); scoped review + adversarial re-run clean
      classified on its own stream by §15's pass→fail test (PATCH: no verdict moves).
- [x] TD-262 marked resolved in `TECH-DEBT.md`. ✓ d8ea3be1: TD-262 status: resolved -> TASK-473 (SPRINT-135)

## Touches

`spec/STANDARD.md` §11 · `spec/CHANGELOG.md` · the TASK-438 file in `docs/work/done/` · `TECH-DEBT.md`

## Assumes

- Nothing outside the conformance engine's `.md` scan reads code comments as citations.

## Tracker

- TD-262 · owner ruling 2026-10-21 at intake
