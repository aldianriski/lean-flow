---
id: TASK-433
title: "Make migrate withhold an incomplete task file on every run, not only some"
epic: EPIC-022
sprint: SPRINT-125
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: X
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-433 — Make migrate withhold an incomplete task file on every run, not only some

## Why

`migration-map.md` says a task missing a required field is withheld, never defaulted; SPRINT-114 T3 saw one
run honour it and another write 10 files without `tier:` (TD-217). Prose a model executes holds or not by run.

## Done when

- [ ] `migrate` checks its own written task files for every required store field after writing, and a
      failing file is withheld and named — by a step that works in an adopter repo with no `scripts/`.
- [ ] Exercised on a real v1 fixture tree: a task lacking `tier:` is withheld, a complete one is written.

## Touches

- skills/lean-doc-generator/references/migration-map.md · evals/ · CHANGELOG.md · TECH-DEBT.md

## Assumes

- the check's mechanism (an explicit post-write checklist vs a shipped script, given TD-204's bun
  dependency) is ruled at G2.

## Tracker

- EPIC-022 Closed-when 2 · TD-217
