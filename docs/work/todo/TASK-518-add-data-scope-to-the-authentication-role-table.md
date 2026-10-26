---
id: TASK-518
title: "Add data scope to the authentication template's role table and state that hiding UI is not enforcement"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-144
depends-on: []
---

# TASK-518 — Add data scope to the authentication role table

## Why
The role table records Role · Can do · Cannot do, but not which data each role reaches (which site, tenant or
workspace), which is where permission bugs live. The Codex pipeline uses role × capability × scope and notes that hidden
navigation is not enforcement. Source: `docs/research/codex-run-project-pipeline.md` (7).

## Done when
- [ ] `architecture-authentication.md.template`'s role table gains a data-scope column.
- [ ] One line states that permissions are enforced at the application boundary; hiding a control is not enforcement.
- [ ] CHANGELOG `[Unreleased]` line.

## Touches
`skills/lean-doc-generator/templates/architecture-authentication.md.template` · CHANGELOG.md

## Assumes
- none

## Tracker
Research `codex-run-project-pipeline`, Findings row (7).
