---
id: TASK-382
title: "Retarget the task-metadata guards onto the store"
epic: EPIC-017
sprint: SPRINT-109
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-359, TASK-361]
---

# TASK-382 — Retarget the task-metadata guards onto the store

## Done when

- [x] check-authority (sh + ts) reads the authority class from task files; check-task-origin reads `origin:` from task files. ✓ 905391a+c27ad57 (merged d2cb16b): check-authority.ts reads member `authority:` (undeclared + new `authority-plan-member-mismatch`); .sh kept as the Plan-path oracle per the owner's scope-change ruling; check-task-origin.sh reads `origin:` from all six docs/work/ folders + legacy TODO.md; real repo: 4/4 members and 28 store + legacy entries examined
- [x] Per guard: a retained must-FAIL fixture with its named finding, plus one fixture varying the selection. A v2 tree with no `### Tn` headings must not pass vacuously. ✓ fixtures member-missing-authority · member-plan-mismatch · member-only-no-plan (v2, no ### Tn, fails not skips) · store-missing · store-invalid · store-other-folders (5 folders) · store-no-todo · store-and-todo, each with a sibling control; 4 seeded breaks, each targeted, restored (git hash-object = rev-parse HEAD:path); authority 26/0 · task-origin all green · by-reference 127/0 both sides
- [x] Worktree-isolated outside review (L-165 · L-168). ✓ isolated sonnet review 2026-09-28: CLEAR — 12 probes, extraction output byte-identical (127/0); three census-zero silent misses filed as TD-188 · TD-189 · TD-190

## Touches

scripts/lib/check-authority.sh · scripts/lib/check-authority.ts · scripts/lib/check-task-origin.sh · scripts/lib/prose-density-baseline.txt · evals/ authority harnesses

## Assumes

none

## Tracker

Codex r1 F1 · L-058 · L-186
