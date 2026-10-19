---
id: TASK-453
title: "In `/diagnose`, count a forced red only once the mutation is proven to have landed"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-129
---

# TASK-453 — In `/diagnose`, count a forced red only once the mutation is proven to have landed

## Why

A red produced by mutating code, editing a fixture or reverting the fix proves nothing if the change
never landed. The rule exists only in the maintainer's CLAUDE.md (Consequential G: `cmp` the seed
against pristine; L-187). `/diagnose`, which consumers run, does not carry it.

## Done when

- [ ] `/diagnose` Phase 5 states that a red forced by mutation, a fixture edit or a reverted fix counts only after a diff/`cmp` against a pristine copy shows the change landed, and that a landed change reddening nothing has tested nothing.
- [ ] `/diagnose` SKILL.md stays within ~140 lines.
- [ ] Exercised once on a real forced red (L-007). CHANGELOG reflects the change.

## Touches

skills/diagnose/SKILL.md (Phase 5) · CHANGELOG

## Assumes

- `/tdd` is out of scope: its reds come from code not yet written, not from a mutation (owner ruling at intake, 2026-10-19).

## Tracker

- `docs/research/mattpocock-scan5.md` K1 (upstream `diagnosing-bugs` at `f3fc5632`) · replaces TASK-449
