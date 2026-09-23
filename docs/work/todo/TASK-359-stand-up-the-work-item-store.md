---
id: TASK-359
title: "Stand up the work-item store and its schema, with one real task migrated"
epic: EPIC-017
sprint: SPRINT-106
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: [TASK-374]
---

# TASK-359 — Stand up the work-item store and its schema, with one real task migrated

## Done when

- [ ] `docs/work/{backlog,todo,in_progress,review,done,cancel}/` exists with a schema doc; **status is the folder, title is the filename, membership is frontmatter** (D1). Filenames are `TASK-NNN-kebab-slug.md` — no spaces, no reserved characters, no case-only renames (Windows + concurrent `.claude/worktrees/`). One existing backlog task is migrated end-to-end and round-trips through a transition. Retained fixture covering a move.

## Touches

docs/work/ · a schema doc · one migrated task file

## Assumes

that lifecycle status is Git-authoritative — ruled by the owner 2026-09-21 (D4),
and recorded in BOTH repos, not just this one

## Tracker

EPIC-017 D1 · D5 · D6 · kerjaan (model only, not its shell scripts)
