---
id: TASK-559
title: "Let a later independent review line supersede an earlier self-review record in the review-depth check"
sprint: SPRINT-152
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-559 — Let a later independent review line supersede an earlier self-review record in the review-depth check

## Why
A measured defect: at SPRINT-151's close, system verify FAILed review-depth on T8's first `review · T8 · self-review` line,
though two independent Codex rounds followed it and were logged as `scoped-reviewer`. The check examines every self-review
line on its own, and the append-only log cannot drop one, so a review that happened reads as one that did not, and the owner
had to rule it. Defect fix of a maintainer-only gate leg (Other G under ADR-050): unfrozen under ADR-053.

## Done when
- [ ] For each task in a sprint log, the check judges the LATEST `review · Tn` line; an earlier self-review followed by a
  scoped-reviewer (or deeper) line for the same task passes, and a self-review that is the latest line still FAILs as today.
- [ ] Retained must-FAIL fixtures: latest-is-self-review on material → FAIL; self-review then scoped-reviewer → PASS
  (control); two tasks interleaved, where the other task's later line must not clear this one → FAIL.
- [ ] Run on its real artifact: the archived SPRINT-151 log passes, and the archived logs that passed before still pass.

## Touches
`scripts/lib/check-review-depth.sh` · its eval fixtures

## Assumes
- The `consequence · Tn` line keeps its role; only how several `review · Tn` lines for one task combine changes.

## Tracker
SPRINT-151 close Retro · L-268
