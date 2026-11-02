---
id: TASK-576
title: "Give small coding tasks a light path through the loop"
epic: EPIC-023
sprint: SPRINT-156
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-575]
---

# TASK-576 — Give small coding tasks a light path through the loop

## Why
lean-flow costs about 3.9x A0's execution tokens (S0) and A2 0.93x of that. A2's plan phase alone ($0.58 mean) costs about what A0
spends on the whole task ($0.62). The A/B tasks are small single-slice changes, the size an adopter does most often. Owner
ruling 2026-11-02: bundled with TASK-573 and TASK-575 into one arm, A4a (TASK-574).

## Done when
- [ ] The loop's mode choice for a small, low-risk coding task is named from a kept stream: which mode the session took, which
      steps it ran, and the token cost of each phase.
- [ ] Changed: a small, low-risk coding task takes a light path (G1 kept as a short confirm; a design note only where the task's
      risk or size calls for one), with the human gates still never self-approved. The same tasks re-run headless, one run
      each, cost less than before with every grader still passing; streams kept.
- [ ] Consumer surface: CHANGELOG `[Unreleased]` entry; README if the modes as a user sees them change.

## Touches
`skills/orchestrator/**` (mode dispatch, G2 scaling) · possibly `skills/flow/**` · CHANGELOG.md · README.md

## Assumes
- **open:** the trial protocol (D9) runs a separate G2 phase and signs it by policy. Whether a session that skips a full G2 for a
  small task still fits that protocol, or the protocol needs an amendment for A4a, is settled at G2 of this task.
- The light path keeps the human-gated principle (CLAUDE.md): it shortens a gate, never removes sign-off.
- Runs start after SPRINT-155 closes.

## Amended 2026-11-02
Cancelled at SPRINT-156 G2 (owner ruling). A2's kept streams show the design phase is already lean; the cost above A0 is the
trial protocol's separate design, revise and build sessions, which a lean-flow light path cannot remove, and TASK-575 removes
the revise round. Reason and revisit condition: `.out-of-scope/light-path-small-tasks.md`.

## Tracker
EPIC-023 § Closed when S3 · D11 · S0 report (cost 3.9x A0) · A2 per-phase cost from its log rows
