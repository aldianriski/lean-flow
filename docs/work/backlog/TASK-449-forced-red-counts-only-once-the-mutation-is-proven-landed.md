---
id: TASK-449
title: "Make a forced red count only once the mutation is proven to have landed"
priority: P3
size: S
risk: low
autonomy: AFK
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-449 — Make a forced red count only once the mutation is proven to have landed

## Why

A red produced by mutating code or a fixture, or by reverting the fix, proves nothing if the mutation
never landed. The rule exists only on the maintainer surface (CLAUDE.md Consequential G: `cmp` the seed
vs pristine; L-187, the one seeded-break guard that ever caught anything). `/diagnose` and `/tdd`, which
consumers run, do not carry it.

## Done when

- [ ] `/diagnose` Phase 5 states that a forced red (mutation, fixture edit or reverted fix) counts only after a diff/`cmp` against a pristine copy shows the change landed.
- [ ] The §10 placement test decides whether `/tdd`'s RED step carries it too, and the decision is recorded in the commit.
- [ ] SKILL.md line caps hold (≤ ~140). Exercised once on a real forced red (L-007).

## Touches

skills/diagnose/SKILL.md · possibly skills/tdd/SKILL.md · CHANGELOG (consumer-visible)

## Assumes

- none

## Tracker

- `docs/research/mattpocock-scan5.md` K1 (upstream `diagnosing-bugs` at `f3fc5632`)
