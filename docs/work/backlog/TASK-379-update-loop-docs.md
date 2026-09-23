---
id: TASK-379
title: "Update the durable docs that describe the loop"
epic: EPIC-017
priority: P1
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-375, TASK-376, TASK-377]
---

# TASK-379 — Update the durable docs that describe the loop

## Done when

- [ ] CONTEXT.md, CLAUDE.md and the architecture overview describe the v2 loop and directory map.
- [ ] README carries the hard-cut upgrade guide: install 2.x → restart the session → `/lean-doc-generator migrate` → resume.
- [ ] QA-001 and QA-002 test cases updated to v2 behaviour; council / refactor-advisor wording no longer says 'TODO tracker'.

## Touches

.claude/CONTEXT.md · .claude/CLAUDE.md · README.md · docs/architecture/overview.md · docs/QA.md · docs/qa/QA-001-prime-entry-detection.md · docs/qa/QA-002-intake-to-plan-pipeline.md · skills/council/SKILL.md · skills/refactor-advisor/SKILL.md

## Assumes

none

## Tracker

EPIC-017 · Codex r2 R2-2b
