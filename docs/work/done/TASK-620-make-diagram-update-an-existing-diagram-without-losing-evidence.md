---
id: TASK-620
title: "Make /diagram update an existing diagram without losing unrelated nodes, edges or evidence"
type: feature
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-166
depends-on: [TASK-618]
---

# TASK-620 — Make /diagram update an existing diagram without losing unrelated nodes, edges or evidence

## Why
A diagram redrawn from scratch drops evidence and drifts from the one it replaces; an update must touch only what the changed source affects.

## Approved design
`/diagram update` re-reads the sources behind an existing diagram and changes only the ids whose evidence changed. Unrelated nodes, edges, labels and rows are left as they are. A source that disappeared turns its row `unknown` with the date. One short step in `skills/diagram/SKILL.md`; if the 80-line cap is hit, the detail goes in `references/evidence-record.md`.

## Done when
- [x] Given a diagram from TASK-618 and a changed source, `/diagram update` changes only the affected ids; unrelated nodes, edges, labels and evidence rows are byte-identical, checked by a diff before and after a real edit. ✓ fixture edit dropped E1 to configured; diff showed only E1's diagram line and row changed
- [x] A source that disappeared turns its row `unknown` with the date, not deleted silently. ✓ deleted mail.ts: N4 row kept as unknown, source none found (was src/mail.ts:1), revision 2026-11-08
- [x] Negative: re-running `/diagram update` with no source change produces an empty diff. ✓ second update with no source change: diff empty, cmp identical

## Touches
`skills/diagram/SKILL.md` or `skills/diagram/references/evidence-record.md`.

## Assumes
- none

## Tracker
Follows TASK-618; owner answer to keep the update path as a third task.
