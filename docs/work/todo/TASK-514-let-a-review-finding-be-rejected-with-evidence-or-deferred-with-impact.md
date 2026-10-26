---
id: TASK-514
title: "Let a review finding be rejected with evidence or deferred with impact, not only fixed or still-open"
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: ready
sprint: SPRINT-143
depends-on: []
---

# TASK-514 — Let a review finding be rejected with evidence or deferred with impact

## Why
The revise loop's outcomes are `fixed | still-open`, so a reviewer's false positive always reaches the owner as
`still-open → owner`, which is a round-trip on repeated Codex review rounds. The Codex pipeline resolves a finding as
fix · reject with evidence · defer with impact and scope reason. Source: `docs/research/codex-run-project-pipeline.md` (2).

## Done when
- [ ] The revise loop accepts `rejected` (cites evidence in the rollup vocabulary: test · check · fixture · owner-ruling)
      and `deferred` (states impact and where it was routed: TASK/TD).
- [ ] Attended: the builder may reject with evidence and the rejection is shown in the report. Unattended: a rejection is
      a judgement and parks; ADR-022's mechanical carve-out is unchanged.
- [ ] A retained must-FAIL fixture: a `rejected` with no evidence fails with its named finding; a sibling with evidence stays green.
- [ ] The existing `revise-loop` and `revise-loop-ceiling` fixtures still pass.
- [ ] CHANGELOG `[Unreleased]` line.

## Touches
`skills/orchestrator/references/review-scoping.md` (§ The revise loop) · `skills/orchestrator/references/night-run.md`
(Part 4 vocabulary, if it lists outcomes) · `evals/fixtures/revise-loop*/` · CHANGELOG.md

## Assumes
- Owner ruling 2026-10-25: builder may reject with evidence when attended; unattended parks.
- Re-tier at G2 if the outcome words turn out to be read by a gate leg (then Other G).

## Tracker
Research `codex-run-project-pipeline`, Findings row (2).
