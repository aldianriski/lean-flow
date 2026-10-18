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

- [ ] EPIC-006 · 008 · 009 · 011 · 012 read `status: closed` — superseded → workdoo (owner ruling 2026-10-18,
      ADR-052), archived with their INDEX rows kept and re-based; EPIC-005 · 007 untouched.
- [ ] TD-100 · TD-161 · TD-176 resolved with the evidence each is already fixed (re-verified at G1);
      TD-243 resolved → moved to workdoo.
- [ ] `docs/research/adlc-epic-sequencing.md` and the INDEX preamble no longer present the retired
      epics as lean-flow's roadmap, and that file's `retain` cap disposition ("revisit when EPIC-015 closes",
      now due) is re-ruled.

## Touches

- docs/epic/ · docs/epic/archive/ · docs/epic/INDEX.md · docs/research/adlc-epic-sequencing.md · TECH-DEBT.md

## Assumes

- EPIC-010 · 013 (closed, merged into EPIC-016) archive in the same pass if §11 allows.

## Tracker

- EPIC-022 Closed-when 3 · D1
