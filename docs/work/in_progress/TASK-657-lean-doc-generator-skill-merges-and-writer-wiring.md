---
id: TASK-657
title: "Shorten the lean-doc-generator skill: merge R03 R08 R16 R45 R51 and name the scope-change writer"
epic: EPIC-025
sprint: SPRINT-173
priority: P1
size: S
risk: med
autonomy: AFK
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-652, TASK-653]
---

# TASK-657 — Lean-doc-generator skill merges and writer wiring

## Why

EPIC-025 condition 2, owner ruling "Accept all". R45 and R51 are among the four merges that cover 56 of 93 bookkeeping commits. Consumer-facing.

## Done when

- [x] `skills/lean-doc-generator/SKILL.md`, `references/sprint-by-reference.md` and `templates/sprint-log.md.template` carry: R03 surprise folded into progress with its finding kept; R08 close record kept with R39/R45; R16 Files Changed derived from the accepted diff; R45 the Retro, routed buckets and R44 in one commit with the close pin retained; ✓ five merges landed (50eacdc1) after one retry; close_commit keeps naming the close commit, pinned in the archive commit (owner ruling); round-2 review no High
  R51 index regenerated once with the indexed doc's content commit.
- [x] Wiring check, derived: the `scope-change` writer command is named in `sprint-by-reference.md` as "lean-flow's own:". `SKILL.md` stays at most about 140 lines. ✓ sprint-by-reference.md:68 names lean-flow's own: bun scripts/lib/record-line.ts scope-change; SKILL.md 140 lines
- [x] The knowledge-index check (G0733) and its fixtures stay green, and the full gate is green. ✓ off-host QA_FULL at 25284d82: PASS knowledge index current and run-gen-index-locale-fixtures; QA-CHECK 236 pass 0 fail
- [x] Negative: the freeze rule that a `scope-change` entry naming the task is required before a Done-when edit is still stated, and the close pin is still recorded. ✓ the freeze still requires a scope-change entry naming the task before a Done-when edit, and the close pin is recorded (round-2 review)

## Touches

`skills/lean-doc-generator/SKILL.md`; `skills/lean-doc-generator/references/sprint-by-reference.md`; `skills/lean-doc-generator/templates/sprint-log.md.template`. Disjoint from TASK-656.

## Assumes

- Skills keep describing line formats for consumers; the writer is named only as "lean-flow's own:".
- Amendment scope: all of a task's moves ride in its work commits.

## Tracker

EPIC-025 condition 2; R03 R08 R16 R45 R51; owner popup, 2026-11-12.
