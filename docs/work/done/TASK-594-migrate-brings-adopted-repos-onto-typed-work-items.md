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
- [x] On an adopted repo, migrate's update sync reads untyped tasks as `feature` without rewriting them, and reports the new types ✓ 2026-11-02: migration-map § Typed work items (`4cae521e`); the plan run on the workdoo scratch copy left all 87 untyped tasks unwritten and reported the type, evidence and business-facts deltas
      and the evidence folder as a standard delta.
- [x] It proposes converting an existing bugs folder, `BUG-*.md` files or bug-flavoured tasks into `type: bug` items, moving their ✓ 2026-11-02: the plan proposed 2 bug items and 5 evidence moves, kept cited and uncited folders in place; the apply ran only the 7 approved items and deleted nothing; secrets checked before any copy (`541f4302`, review fix)
      evidence to `docs/work/evidence/TASK-NNN/`, and mapping existing verification-capture folders onto the items they prove, and
      applies only what the owner approves; nothing is deleted (scope-change 2026-11-02).
- [x] `init` creates the evidence folder only when a first bug item needs it. ✓ 2026-11-02: init.md docs/work row: evidence/TASK-NNN/ only when a first bug or task needs it (`4cae521e`)
- [x] Shown on real input: migrate on a scratch copy of the workdoo research copy (`D:\Research\dev156\workdoo`; scope-change ✓ 2026-11-02: headless plan ($1.80) then apply ($1.44) on a scratch copy; hash diff: 63 files moved (61 byte-identical, 2 READMEs with rebased links), 9 changed, all approved link or type edits; a changelog link edit led to the history-links rule; owner ruling on the bugs folder (scope-change)
      2026-11-02) classifies its `docs/bugs/` (a bug item, or kept with its reason when it is not a defect) and proposes real defect
      tasks as bug items (scope-change 2026-11-02), and an approved run leaves every other file unchanged (diff read).
- [x] CHANGELOG `[Unreleased]` entry; README if a user-visible behaviour changes; the skill stays within its cap. ✓ 2026-11-02: CHANGELOG [Unreleased] Changed line; README migrate paragraph; lean-doc-generator SKILL.md unchanged at 139 lines

## Touches
`skills/lean-doc-generator/` (migrate, init references) · CHANGELOG.md · README.md

## Assumes
- Runs on research copies only, never on a live repo in `D:\Project` other than lean-flow.

## Tracker
Owner request 2026-11-02 · TASK-591 · consumer evidence: workdoo `docs/bugs/` · `docs/research/adopter-folder-audit.md` (F1, F2)
