---
id: TASK-517
title: "Record the changed record, its owner and the next owner for each step in the flows template"
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

# TASK-517 — Record the owner and next owner of each step in the flows template

## Why
`flows.md` records trigger, steps and failure branches, but not which record a step changes or who holds it next, which
is where business flows break (handover gaps). The Codex pipeline maps each journey step to its authoritative record,
owner and next owner. Source: `docs/research/codex-run-project-pipeline.md` (6).

## Done when
- [ ] `flows.md.template` § Steps that matter carries, per step: record changed · owner · next owner (WHY/WHERE, no HOW).
- [ ] The template stays within its line cap.
- [ ] CHANGELOG `[Unreleased]` line.

## Touches
`skills/lean-doc-generator/templates/flows.md.template` · CHANGELOG.md

## Assumes
- none

## Tracker
Research `codex-run-project-pipeline`, Findings row (6).
