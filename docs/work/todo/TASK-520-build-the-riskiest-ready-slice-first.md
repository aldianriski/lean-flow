---
id: TASK-520
title: "Have task-decomposer order ready slices so the one carrying the most uncertainty is built first"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-144
depends-on: [TASK-516]
---

# TASK-520 — Build the riskiest ready slice first

## Why
`/task-decomposer` scores each slice's risk (impact × likelihood) and orders by `depends-on`, but does not choose which
independent slice to build first. The Codex pipeline ranks the first proof by value · uncertainty · dependencies ·
effort, so the slice whose outcome is least certain goes first. Source: `docs/research/codex-run-project-pipeline.md` (9).

## Done when
- [ ] Among slices with no unmet dependency, the decomposer lists first the one that removes the most uncertainty,
      reading the requirements' First-milestone proof goal when present (TASK-516) and saying so when absent.
- [ ] Exercised on one real decomposition.
- [ ] CHANGELOG `[Unreleased]` line.

## Touches
`skills/task-decomposer/SKILL.md` (step 3) · CHANGELOG.md

## Assumes
- Ordering is a proposal in the breakdown; `/triage` and promote still own final priority.

## Tracker
Research `codex-run-project-pipeline`, Findings row (9).
