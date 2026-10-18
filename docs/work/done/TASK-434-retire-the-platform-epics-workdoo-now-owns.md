---
id: TASK-434
title: "Retire the platform epics workdoo now owns and close the stale debt rows"
epic: EPIC-022
sprint: SPRINT-125
priority: P1
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-434 — Retire the platform epics workdoo now owns and close the stale debt rows

## Done when

- [x] EPIC-006 · 008 · 009 · 011 · 012 read `status: closed` — superseded → workdoo (owner ruling 2026-10-18, ✓ `4e4c06c0`..`034cd442`: five epics `status: closed`, superseded banner, boxes left unticked; `check-epic-archive.ts .` PASS ×5 on the merged tree
      ADR-052), closed in place like EPIC-010 · 013 (§11 cannot archive them), INDEX rows updated; EPIC-005 · 007 untouched.
- [x] TD-100 · TD-161 · TD-176 resolved with the evidence each is already fixed (re-verified at G1); ✓ `48c3119f`: each re-verified still fixed by T1 (engine :1839/:3170 · check-dod-delta :562-566 · 46 INDEX rows = 46 archives); TD-243 → moved to workdoo
      TD-243 resolved → moved to workdoo.
- [x] `docs/research/adlc-epic-sequencing.md` and the INDEX preamble no longer present the retired ✓ 158 → 102 lines (F1/F3/F4/F5/F6 kept, all cited), retired epics shown superseded, `.cap-dispositions` retain line deleted; `check-doc-caps` PASS (102 ≤ 130)
      epics as lean-flow's roadmap, and that file's `retain` cap disposition ("revisit when EPIC-015 closes",
      now due) is re-ruled.

## Touches

- docs/epic/ · docs/epic/archive/ · docs/epic/INDEX.md · docs/research/adlc-epic-sequencing.md · TECH-DEBT.md

## Assumes

- EPIC-010 · 013 (closed, merged into EPIC-016) archive in the same pass if §11 allows.

## Tracker

- EPIC-022 Closed-when 3 · D1
