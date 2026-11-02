---
id: TASK-594
title: "migrate brings repos already on lean-flow onto typed work items and bug items"
sprint: SPRINT-159
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-591]
---

# TASK-594 — migrate brings repos already on lean-flow onto typed work items and bug items

## Why
Owner, 2026-11-02: the change must handle repos that already adopted lean-flow. Their tasks have no `type:`, and some keep bugs in
places the standard did not define (workdoo: `docs/bugs/` with a screenshot). `/lean-doc-generator migrate` is the re-runnable
update sync for them; it must neither break them nor leave their bugs behind.

## Done when
- [ ] On an adopted repo, migrate's update sync reads untyped tasks as `feature` without rewriting them, and reports the new types
      and the evidence folder as a standard delta.
- [ ] It proposes converting an existing bugs folder, `BUG-*.md` files or bug-flavoured tasks into `type: bug` items, moving their
      evidence to `docs/work/evidence/TASK-NNN/`, and mapping existing verification-capture folders onto the items they prove, and
      applies only what the owner approves; nothing is deleted (scope-change 2026-11-02).
- [ ] `init` creates the evidence folder only when a first bug item needs it.
- [ ] Shown on real input: migrate on a scratch copy of the workdoo research copy (`D:\Research\dev156\workdoo`; scope-change
      2026-11-02) proposes its `docs/bugs/` as a bug
      item with the screenshot as evidence, and an approved run leaves every other file unchanged (diff read).
- [ ] CHANGELOG `[Unreleased]` entry; README if a user-visible behaviour changes; the skill stays within its cap.

## Touches
`skills/lean-doc-generator/` (migrate, init references) · CHANGELOG.md · README.md

## Assumes
- Runs on research copies only, never on a live repo in `D:\Project` other than lean-flow.

## Tracker
Owner request 2026-11-02 · TASK-591 · consumer evidence: workdoo `docs/bugs/` · `docs/research/adopter-folder-audit.md` (F1, F2)
