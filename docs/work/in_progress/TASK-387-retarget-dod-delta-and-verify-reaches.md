---
id: TASK-387
title: "Retarget the dod-delta and verify-reaches guards onto member files"
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
depends-on: [TASK-360, TASK-362]
---

# TASK-387 — Retarget the dod-delta and verify-reaches guards onto member files

## Done when

- [x] Both guards read DoD boxes and `Verify:` clauses from member task files. ✓ ab99dd0 (merged 5576ea0): check-dod-delta.ts `checkDodDeltaWithMembers` (member `## Done when` ticks, Cites-keyed); check-verify-reaches.ts (new, .sh deleted) reads the Plan ∪ member Done-when via `resolveMembers`; real SPRINT-109: dod-delta attributes TASK-377/382 ticks to T1/T3, verify-reaches reports 4 members, 0 Verify clauses
- [x] Per guard: retained must-FAIL fixture with its named finding, a selection-varying fixture, and a v2 sprint with no inline Plan that must not pass vacuously. ✓ dod-delta 84/0 (member must-FAIL + sibling, 6-folder selection sweep, v2 no-Plan non-vacuous, e2e git history); verify-reaches 22/22 (member must-FAIL + sibling, stamp-arm-in-review/ selection, v2-no-clauses NOTE, resolution-empty FAIL); 16 legacy cases byte-identical to the .sh; 3 seeded breaks targeted + restored (git hash-object = rev-parse HEAD:path)
- [x] Worktree-isolated outside review. ✓ isolated sonnet review 2026-09-28: CLEAR — ~11 probes, port fidelity 0 mismatches over 17 legacy cases, both qa-check legs proven to redden; census-zero gaps filed TD-191 · TD-192 · TD-193 (+ TD-188 second consumer)

## Touches

scripts/lib/check-dod-delta.ts · scripts/lib/check-verify-reaches.sh · their eval harnesses

## Assumes

none

## Tracker

Codex r1 F1 · r2 R2-3c · split from TASK-363
