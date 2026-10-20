---
id: TASK-465
title: "Exercise the first pack end-to-end with no lean-flow plugin present"
epic: EPIC-007
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-464]
sprint: SPRINT-132
---

# TASK-465 — Exercise the first pack end-to-end with no lean-flow plugin present

## Why

EPIC-007's third exit condition is the consumer path (L-016): a pack is only reusable without the plugin once something without
the plugin has used it. The owner ruled (2026-10-19) that "reusable without the plugin" means readable alone by any agent.

## Done when

- [x] A fresh agent with no lean-flow skills loaded, in a scratch repository that never installed lean-flow, is given only the pack file and a small feature to build, and reaches the pack's declared output contract. ✓ run 3 (after the owner-ruled already-covered rule): a fresh claude -p, 3 built-in plugins + skills [], given only the pack text, reached the output contract — owner ruling: met in substance (behaviour 3's note imprecise; follow-up filed)
- [x] No lean-flow file is copied into the scratch repository; this is asserted the way EPIC-004's foreign-repo harness asserts it, and the check's output is recorded. ✓ printf-built 3-file repo, count asserted before the run; content hashes vs lean-flow before/after: 0 identical (control: a seeded copy is caught as 1 match)
- [x] The run is recorded (inputs, the agent's output against the output contract, and any field the agent could not follow) where EPIC-007's log or research record keeps it. ✓ docs/research/logs/workflow-pack-exercises.md: runs 1-3, the inputs, output contract item by item, the eight-field walk

## Touches

a scratch repository outside this one (not committed) · the record of the run

## Assumes

- The exercise is a recorded run, not a retained guard: no new checker or `qa-check.sh` leg (ADR-053).

## Tracker

- EPIC-007 condition 3 · `evals/run-foreign-repo-fixtures.sh` (the assertion pattern) · L-016
