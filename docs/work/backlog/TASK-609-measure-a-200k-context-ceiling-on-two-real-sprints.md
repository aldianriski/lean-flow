---
id: TASK-609
title: "Measure a 200k context ceiling on the next two real sprints, then decide whether a router trial is worth funding"
type: feature
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: blocked
depends-on: []
---

# TASK-609 — Measure a 200k context ceiling on the next two real sprints, then decide whether a router trial is worth funding

## Why
Owner goal, 2026-11-06: deliver faster and cheaper with quality held. `docs/research/router-mode.md` found long main-thread context is the
measured cost and that a ceiling may save about 25% (modelled) with no new component. Owner approved Step 1 of that plan by popup.

## Done when
- [ ] Two sprints of at least 5 `Done when` boxes each run with `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` set in the launching shell.
- [ ] For each: USD per box from `bun scripts/session-cost.ts`, elapsed time, close-time gate failures, blocking review findings and owner corrections, recorded against the baseline below.
- [ ] Negative: a decision lost to a summary, rework caused by one, or a quality failure unsets the variable at once and records why. No router or agent definition is built under this task.
- [ ] `docs/research/router-mode.md` records the numbers with their limit (directional, not proof) and the Step 2 ruling: continue or stop.

## Touches
`docs/research/router-mode.md`

## Assumes
- **blocked-by:** the next two sprints of at least 5 boxes running under the variable (unblock condition: both closed).
- Baseline, 24 to 31 Oct: about 1.7 USD per box, from 565 USD by cost rows over 335 boxes in SPRINT-133 to 151; 1.2 to 2.7 by session. Some sprints span sessions, and a resumed session's cost row can undercount.
- Where the variable may be set was not confirmed in the docs; the launching shell is assumed. Check at the first sprint that compaction fires near 200k.
- **Step 2 needs an owner ruling first:** how a passing router would be released, by a funded arm or an exception.

## Tracker
`docs/research/router-mode.md` · owner rulings 2026-11-06 · Codex review, CLEAR in round 2
