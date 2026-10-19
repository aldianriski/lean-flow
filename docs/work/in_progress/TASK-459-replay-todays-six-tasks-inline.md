---
id: TASK-459
title: "Replay today's six tasks inline, to test inline execution as the default"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-131
---

# TASK-459 — Replay today's six tasks inline, to test inline execution as the default

## Why

The orchestrator dispatches every Implement step to a fresh builder in a worktree. On 2026-10-19 four small prose tasks cost
about 260k builder tokens plus worktrees and merges, and twelve stale worktrees have accumulated. Codex judged inline execution
a radical candidate: one context for a coherent set of approved edits, with dispatch only where isolation or parallelism pays.
Adopting it on argument would be the same mistake as rejecting it on argument.

## Done when

- [ ] The inline arm replays SPRINT-129's four tasks and SPRINT-130's two built tasks from their `plan_commit` trees in disposable checkouts, with the same design inputs, the same review and verification obligations, and the later findings hidden.
- [x] Total cost (tokens, counting coordinator context, retries and reviews), material defects and elapsed time to accepted completion are recorded for the inline arm and set against the logged dispatch arm. ✓ reference-rejudge.md § Experiment results: tokens (raw + context-adjusted, coordinator context counted), defects at review, wall clock for both arms; dispatch arm from the 2026-10-19 transcript
- [x] The verdict applies the thresholds fixed before the run — at least 30% lower total cost, no additional material defect, and no more than 10% more elapsed time — and is written into `docs/research/reference-rejudge.md`; a change to the dispatch default is filed as a separate task only if it passes. ✓ thresholds frozen at 8fd58050, adjustment pre-registered efa851d4; cost 1.01x and 2.00x > 0.70 -> fail; no dispatch-default task filed; written into reference-rejudge.md

## Touches

docs/research/reference-rejudge.md · scratch checkouts outside the repository (not committed)

## Assumes

- the dispatch arm is not re-run: today's logged runs on the same frozen inputs are its baseline (owner ruling at intake, 2026-10-19); the bias this introduces is named in the verdict.

## Tracker

- `docs/research/reference-rejudge.md` (I3) · superpowers `executing-plans/SKILL.md`
