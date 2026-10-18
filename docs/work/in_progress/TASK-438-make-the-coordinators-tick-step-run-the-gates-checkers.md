---
id: TASK-438
sprint: SPRINT-127
title: "Make the coordinator's tick step run the checkers the gate runs, so a tick tail can never redden the gate"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-438 — Make the coordinator's tick step run the checkers the gate runs, so a tick tail can never redden the gate

## Why

L-224 ("re-check a frozen artifact with the checker the gate actually runs, after every write") is promoted into
`dispatch.md` rule 5 and has still recurred six times (count 6 — SPRINT-113 ×2, SPRINT-125 ×3, SPRINT-126): each time the coordinator
ticked a box with an evidence tail, re-checked with the freeze checker only, and the layers-completeness leg reddened later.
A written rule the writer keeps skipping is a measured repeated failure (ADR-053 admits machinery on it); the fix is mechanical.

## Done when

- [ ] One tick step (this repo's own tooling — a TypeScript script run by Bun, no new `.sh`) ticks a named box with its evidence
      and then runs the freeze check and the layers-completeness check over the sprint, printing their verdict lines; a FAIL
      leaves the box ticked but names the finding and exits non-zero.
- [ ] A retained must-FAIL case: a tick whose evidence names an undeclared path exits non-zero with `member-layers-incomplete`;
      a sibling tick with path-free evidence passes.
- [ ] `dispatch.md` rule 5 names the property (run the gate's own checkers after every tick), with lean-flow's script marked as
      its own reference implementation — no adopter-facing step depends on it (L-015).

## Touches

- scripts/ (new TS tick helper) · evals/ · skills/orchestrator/references/dispatch.md

## Assumes

- Tier G, not consequential: maintainer tooling no adopter-run step names as its only mechanism (ADR-050) — must-FAIL fixture +
  one real run on the next sprint's ticks.

## Tracker

- SPRINT-126 Retro · L-224 (count 6) · ADR-053 (repeated failure)
