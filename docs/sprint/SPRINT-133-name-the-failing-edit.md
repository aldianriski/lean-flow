---
sprint: 133
slug: name-the-failing-edit
epic: EPIC-007
owner: Maintainer
last_updated: 2026-10-20
status: active
plan_commit: [sha — set at promote]
update_trigger: sprint execute/close events
---

# SPRINT-133 — Name the Failing Edit

> **Theme:** a close-Retro follow-up to SPRINT-132. The no-plugin exercise recorded an *already covered* note that named a class
> of edits ("something other than `Math.floor`"), and some edits in that class still pass the test. The note should name one
> concrete edit that fails it, so a reader can check the claim. The rule lives in `/tdd` and in the pack, so both get the change.

## Scope

**In:** the already-covered rule in `skills/tdd/SKILL.md` and `packs/software-implementation.md`, worded alike (`466`).
**Out (deferred):** a new no-plugin exercise run (the task's assumption: the wording is reviewed once) · packs 2–3 and EPIC-007's
gate-condition ruling (next slices) · any mechanical check of note wording (ADR-053).

## Members

- docs/work/todo/TASK-466-already-covered-notes-name-a-concrete-change.md

## Plan

### T1 — Make an already-covered note name one concrete failing edit `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/tdd/SKILL.md` · `packs/software-implementation.md`
  · `docs/work/todo/TASK-466-already-covered-notes-name-a-concrete-change.md`
  · `docs/work/in_progress/TASK-466-already-covered-notes-name-a-concrete-change.md`
Depends-on: none
Cites: `TASK-466` · EPIC-007 condition 3 · ADR-055 · `docs/research/logs/workflow-pack-exercises.md`

A wording change in two files that must stay alike. The pack must still name no lean-flow skill, path or id outside its header.

**Acceptance:** both files require an already-covered note to name one concrete edit (an expression or value) that would fail
the test, in matching words.

## Decisions (pre-locked)

- **D1** — `skills/tdd/SKILL.md` and the pack are edited in one commit, so the two never disagree at any commit.

## Assumptions

- **A1** — no new exercise run is needed; one review of the wording is enough. *Confirm: G2 (owner).*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-133-name-the-failing-edit.md`](logs/SPRINT-133-name-the-failing-edit.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
