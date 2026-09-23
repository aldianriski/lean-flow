---
id: TASK-378
title: "Ship the store in templates and greenfield init"
epic: EPIC-017
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-377]
---

# TASK-378 — Ship the store in templates and greenfield init

## Done when

- [ ] A TASK.md.template matches the TASK-359 schema.
- [ ] TODO.md.template is removed, or kept only as the migrate tombstone.
- [ ] `init` scaffolds docs/work/ for a fresh repo instead of TODO.md — exercised once on an empty directory.
- [ ] Other templates route follow-ups to task files; no lean-flow-specific path leaks in (L-015).

## Touches

skills/lean-doc-generator/templates/ (new TASK.md.template · TODO.md.template · TECH-DEBT · CHANGELOG · BUG · QA-TESTCASE · AGENTS) · skills/lean-doc-generator/references/init.md

## Assumes

none

## Tracker

EPIC-017 scope 6 · L-015
