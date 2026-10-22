---
id: TASK-478
title: "live epic index rows carry no member-sprint state"
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

# TASK-478 — live epic index rows carry no member-sprint state

## Why
TD-163 (medium): `docs/epic/INDEX.md`'s `update_trigger` ("An epic is opened, or closed and archived") never fires when a member
sprint is promoted or closes, yet rows have carried member-sprint state ("SPRINT-101 active", "4 of 8 ticked"), which then drifts
by construction. Today the eight local live rows match their epic files and carry no member-sprint state (recon 2026-10-22; the transferred
workdoo rows keep remote state outside this census), so this fixes the rule, not a figure. Owner
ruling: remove the content the trigger cannot cover rather than widen the trigger. Tier P (repo doc only; no shipped skill or
template carries an epic-index row shape).

## Done when
- [ ] The index's own header states that a live epic's row holds its status and a pointer to the epic file, never a member-sprint
      pointer or a tick count, because progress lives in the epic file; an archived row is a record frozen at archive.
- [ ] Every live row (the epics in `docs/epic/`, not `archive/`) is read back and carries no member-sprint pointer or tick count;
      any that does is reworded to status + pointer. The `update_trigger` is unchanged.
- [ ] TD-163 marked resolved in `TECH-DEBT.md`.

## Touches
`docs/epic/INDEX.md` · `TECH-DEBT.md`

## Assumes
- No shipped skill or template defines the epic-index row content (only `EPIC.md.template` exists), so no consumer surface moves.
- Archived rows keep their final counts; they are not "live" and cannot drift after archive.

## Tracker

- TD-163 · intake draft reviewed by Codex 2026-10-22 (APPROVE WITH FIXES, folded in before approve)
