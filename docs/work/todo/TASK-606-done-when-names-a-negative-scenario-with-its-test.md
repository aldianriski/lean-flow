---
id: TASK-606
title: "Make a feature or bug task's Done-when name a negative scenario, with the test that would catch it"
type: feature
sprint: SPRINT-163
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-606 — Make a feature or bug task's Done-when name a negative scenario, with the test that would catch it

## Why
Owner question (SPRINT-161): why a Done-when covers no negative scenario. `/task-decomposer` asks only for an observable
acceptance criterion; the only negative case anywhere is G2's one-line abuse case for `risk: high` auth or input tasks. EPIC-023
D20 kept "requirement and invariant assertions with test anchors" as a candidate; it folds in here as the test anchor (intake
ruling). ADR-053 ruling: skill work, unfrozen; G2's existing Reachability line reads a new criterion, no gate is added.

## Done when
- [ ] `/task-decomposer` validation fails a `feature` or `bug` task whose Done-when names no negative scenario (what must not
      happen, or the failure path and its observable result); a `debt` task needs one only when it changes observable behaviour,
      and docs, config and spike tasks are not asked for one.
- [ ] A bug filed by `/triage` (the bug intake path, also run by `/flow`) is not marked `ready` until its Done-when names what
      must keep working after the fix; shown once on a real bug report.
- [ ] G2 treats each negative scenario as a criterion under Reachability, and its verification names the test that would fail if
      that behaviour broke; a negative scenario with no such test stays a judgment tick and says so.
- [ ] Negative: a docs task decomposed after the change carries no negative-scenario box and is not refused for lacking one.
- [ ] Shown on a consumer repo copy through a pinned clone: a decomposed feature task carries its negative scenario, and that
      task's G2 names the test for it.
- [ ] CONTEXT.md § Task entry shape, README and CHANGELOG `[Unreleased]` reflect the rule.

## Touches
`skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/task-file.md` · `skills/triage/SKILL.md` (or its bug
reference) · `skills/orchestrator/SKILL.md` (G2 Reachability line, inside its current length) · `.claude/CONTEXT.md` ·
`README.md` · `CHANGELOG.md`

## Assumes
- `orchestrator/SKILL.md` is at its cap: the G2 change fits inside the existing Reachability line, or moves to an orchestrator
  reference with a pointer; no net line is added.
- The bug template's repro / expected / actual already describes a failure path; a bug task's negative scenario is what must keep
  working after the fix (the regression the test pins), not a restatement of the repro.
- Consumer proof as TASK-605 (copy under `D:\Research\`, pinned clone, L-284).

## Tracker
TASK-601 (superseded) · intake rulings 2026-11-04 (feature and bug; D20 test anchor; ADR-053 boundary) · EPIC-023 D20 · Codex
intake review CLEAR in 2 rounds (round 1 added the `/triage` box)
