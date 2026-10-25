---
id: TASK-511
title: "The embedded humanizer pass keeps every fact, shown 0 of 6 on a retained sample"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-511 — The embedded humanizer pass keeps every fact, shown 0 of 6 on a retained sample

## Why
TD-274: on one fixed sample, 3 of 6 embedded runs added or dropped a fact, which breaks SKILL.md step 6 on every writing
job lean-flow composes. The two standalone runs kept every fact, so the loss sits in the embedded child pass.

## Done when
- [ ] `embedded.md`'s child brief has the child list the text's facts before it rewrites and check its final against that
      list, still returning only the final text; the inline fallback carries the same step.
- [ ] A ~120-word sample with seeded tells, its list of about 10 facts, and a NOTES.md on how to run and judge it are
      retained under `evals/fixtures/humanizer/`.
- [ ] Baseline: the pre-fix brief on that sample over 3 headless runs, with the loss rate recorded (it shows whether the
      sample can tell a fix from no fix).
- [ ] After the fix: 6 separate headless embedded runs on the same sample, each judged from its own transcript; 0 of 6 add
      or drop a listed fact.
- [ ] TD-274 is resolved with the before and after rates, and the CHANGELOG `[Unreleased]` block has a line.

## Touches
`skills/humanizer/references/embedded.md` · `evals/fixtures/humanizer/` · `TECH-DEBT.md` · `CHANGELOG.md`

## Assumes
- Headless runs go in the trusted `D:\Research\workdoo` copy, passed as long paths (L-249), each judged from its own
  transcript's tool calls and final result (L-248).
- The retained sample is an input for a manual run protocol, not a gate leg: nothing is wired into qa-check (ADR-053
  does not apply; a defect fix is unfrozen anyway).
- If the 0-of-6 bar is not met after 2 review rounds, the owner rules; TD-274 then stays open with the measured rate.
- Out of scope: standalone mode, a caller-side check, any qa-check leg.

## Tracker
TD-274 (SPRINT-140 T3 exercise) · L-252 (judge a model-driven pass over several runs) · owner intake rulings 2026-10-25:
child self-check, bar 0 of 6, one retained sample.
