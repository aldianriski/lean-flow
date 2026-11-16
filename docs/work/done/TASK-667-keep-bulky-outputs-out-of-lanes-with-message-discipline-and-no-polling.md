---
id: TASK-667
title: "Keep bulky outputs out of lanes, with message discipline and no polling"
type: feature
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
sprint: SPRINT-178
state: ready
depends-on: [TASK-666]
---

# TASK-667 — Keep bulky outputs out of lanes, with message discipline and no polling

## Why

Measured in the 2026-11-14/15 four-lane run: execution ran inline in Opus lane sessions (subagents 3-6% of the long sessions' cost), and lane 2's `/loop` polling of RAM and the device lock took 16 wakes, 147 turns, 14% of its spend at ~673k context. Codex-reviewed, corrections accepted. Serialised after TASK-666 because both edit coordinator.md.

## Done when

- [x] coordinator.md (narrow rule, owner-chosen): only work whose output would bloat the lane goes to an execution-tier worker (ADR-010) that returns a short report: device runs, full test suites, long log reads. Routine edits stay inline. Device and RAM limits and the single-device lock are preserved. ✓ coordinator.md § 9 Lane cost, narrow delegation bullet
- [x] dispatch.md cost term gains the counterweight, with no figure: inline work re-pays the parent's context on every turn, so a bulky-output segment from a large-context session belongs in a worker. Routine edits stay inline, citing EPIC-024's finding as the reason: at 70-150k context, moving shell/edit work to workers cut router-main cost about 4% while worker cost rose about 3.5x. ✓ dispatch.md Cost term; figures match docs/research/router-mode.md:121 (Codex checked)
- [x] coordinator.md: enabling messages (completion, blockers, approvals, lock release) are still sent. Pure acks and status go to the sender's Execution Log. §6 shared-file hunks are batched per task. ✓ § 3 message rule; § 6 one approval message per task batch
- [x] coordinator.md: a lane waits on a device lock or RAM in a cheap background shell loop that wakes it once, not in `/loop` turns from a large-context session. ✓ § 9 no-polling bullet
- [x] **Exercised on real input:** one bulky segment (a device run, full test suite or long log read) runs through an execution-tier worker that returns a short report, and one background wait loop wakes the lane once on a real lock. Both results are recorded. This may share TASK-666's throwaway-lane exercise. The savings measurement is deferred to TASK-668. ✓ 2026-11-16: Sonnet worker ran full `bun test` (110 s) and returned 4 lines; probe-5 waited on a real `.device-lock` in one background loop, transcript shows 1 task-notification, 0 scheduled wakeups (Log)
- [x] Negative: no enabling message is demoted to a log, routine edits are not forced to a worker, and no polling replacement or new machinery is added. ✓ Codex review box 6 CLEAR; diff lists only the 3 Layers files

## Touches

`skills/orchestrator/references/coordinator.md` (§2, §3, §6), `skills/orchestrator/references/dispatch.md` (cost term), `CHANGELOG.md` ([Unreleased] bullet).

## Assumes

- Lane 2's `/loop` wakes are the motivating cost; the "1/3 per turn" figure is unproven and is not stated.

## Tracker

Owner intent 2026-11-16; owner popup 2026-11-16 (narrow delegation rule); memory note lane-token-cost-is-session-length.
