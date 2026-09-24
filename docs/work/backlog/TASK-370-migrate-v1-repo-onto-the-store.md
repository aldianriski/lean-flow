---
id: TASK-370
title: "Carry an existing v1 repo onto the store with `/lean-doc-generator migrate`"
epic: EPIC-017
sprint: SPRINT-106
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: [TASK-369]
---

# TASK-370 — Carry an existing v1 repo onto the store with `/lean-doc-generator migrate`

## Done when

- [x] `migrate` maps v1 Backlog → one file per task, plan → approve → apply, re-run report-only; id set equal both ways on a copy of this repo's Backlog; `TODO.md` left as a tombstone (deletion is TASK-363) whose stray v1 writes a v2 skill surfaces. ✓ `14d2c9f` — owner ruling: no tombstone; `migrate` removes TODO.md, unresolved conflicts block removal
- [ ] Verified on a copy of this repo: id sets equal both ways AND ticked-box count equal before/after, incl. an active-sprint fixture.
- [ ] An interrupted run (killed mid-way) re-run to completion produces the same tree as an uninterrupted one — retained fixture.

## Amended 2026-09-23

- **Widened 2026-09-23 (hard cut + Codex r1 F10).** One run migrates the **whole** v1 queue: Backlog tasks AND the active sprint's Plan tasks — membership, ticked boxes, authority class and frozen references preserved; a task present in both Backlog and Plan becomes one file. Idempotent, and resumes an interrupted run. TODO.md becomes a tombstone.

## Touches

skills/lean-doc-generator/SKILL.md · skills/lean-doc-generator/references/migration-map.md

## Assumes

that installed 1.66.x skills read a tombstone as an empty Backlog. UNCONFIRMED

## Tracker

EPIC-017 scope 7 · D7 · D8 · SPRINT-106 T4

## Amended 2026-09-24

- **Owner ruling: no tombstone.** `migrate` removes `TODO.md` once every task is moved (non-task prose listed in the plan for the owner to place or drop). A tombstone would classify as mixed and be refused (existence-only detection, ADR-046). A stray 1.x write recreates `TODO.md` → mixed → refused → `migrate` re-run ingests it.

## Amended 2026-09-24 (close)

- **Mirrored at SPRINT-106 close (owner ruling).** Open, honestly: (1) on the real copy the ticked-box count was 17 → 0 — the five SPRINT-106 members conflicted (Plan ticked, files not) and were correctly reported, not overwritten; the equal-count proof holds only on the fixture (1 = 1). Re-proved when this repo migrates itself (TASK-380). (2) No interrupted-run fixture was built — the resume rule is written and the existing-file conflict path is fixtured, but "killed mid-way re-run produces the same tree" is unproven.
