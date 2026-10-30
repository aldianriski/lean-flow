---
id: TASK-556
title: "Widen TASK-536's answers-file coverage to the seven profile topics and mark it ready"
epic: EPIC-023
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-556 — Widen TASK-536's answers-file coverage to the seven profile topics and mark it ready

## Why
The S1 intake (SPRINT-149, owner ruling I-6) found that S1 adds discovery questions the answers file does not yet cover. The
file freezes at pre-registration (TASK-544) and serves every arm as `BUSINESS-NOTES.md`, so it must cover S1's topics before it
freezes: patched later, it breaks parity between arms; left uncovered, A2's setup answers "not decided yet" and S1 is
under-measured. TASK-536's only blocker (TASK-535) is done. The decomposer never edits an existing task, so the change goes
through `/triage`.

## Done when
- [ ] TASK-536's DoD names the seven profile topics (stack · conventions in use · invariants · business goal · main flows ·
  quality attributes · non-goals) as facts each answers file covers, with "not decided yet" where the source is silent.
- [ ] TASK-536 is `state: ready`, and the edit is recorded by `/triage` before TASK-536 is promoted.

## Touches
`docs/work/backlog/TASK-536-prepare-ab-answers-files-and-access-protocol.md`

## Assumes
- S1's questions stay within these seven topics (TASK-547..551 Assumes, I-6).

## Tracker
SPRINT-149 close Retro · S1 intake I-6 (2026-10-30)
