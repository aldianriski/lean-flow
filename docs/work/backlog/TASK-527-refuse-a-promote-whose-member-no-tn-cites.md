---
id: TASK-527
title: "Refuse a promote whose member no Plan Tn cites"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-527 — Refuse a promote whose member no Tn cites

## Why
TD-201 (a), defect fix (unfrozen, ADR-053): a member no `Tn` cites drops out of the unit counts, so its open DoD box
is invisible to the run. Catching it before the Plan freezes places the guard in time (L-105). G2 review-round cap: 2.

## Done when
- [ ] `bun scripts/promote-check.ts <sprint-file>` FAILs with a named finding carrying the TASK id when a `## Members` entry is cited by no Plan `Tn`.
- [ ] "Cited" means the leading run of a `Tn`'s `Cites:` (TD-199 ruling); a retained fixture where the member appears only outside that leading run reddens.
- [ ] Retained must-FAIL fixture (one uncited member) reddens with that finding; a sibling control with every member cited stays green.
- [ ] Run on the real artifact: promote-check over the archived sprints adds no new FAIL (census 2026-09-30: 0 uncited).
- [ ] TD-201 row annotated with this narrowing.

## Touches
`scripts/promote-check.ts` (or the shared Plan parser / `check-sprint-by-reference.ts` if it already holds the member→Tn map) · its test · fixtures.

## Assumes
- G2's first step: confirm whether `check-sprint-by-reference.ts` already covers part of this, and reuse it rather than adding a second reader.
- No new `.sh`; executable logic stays TypeScript on Bun.

## Tracker
TECH-DEBT TD-201 · owner choice at /prime overview 2026-10-27 (false-green guard cluster).

## Cancelled
2026-10-28, owner ruling at the SPRINT-146 promote, on the Codex intake review (R1, NOT CLEAR): a promote-time refusal is
new governance machinery under ADR-053, and its only candidate admission (measured defect) was measured in `reap()`, not at
promote; the live census of the shape is 0. TASK-528 fixes the false-green where it lies.
