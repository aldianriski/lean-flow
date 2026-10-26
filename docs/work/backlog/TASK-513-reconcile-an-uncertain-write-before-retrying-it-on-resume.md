---
id: TASK-513
title: "Reconcile a write whose outcome is unknown before retrying it on resume"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-513 — Reconcile a write whose outcome is unknown before retrying it on resume

## Why
A timeout or an interrupted session does not prove a write failed: a subagent can commit in its worktree after
it times out, a remote gate run can finish after ssh drops, a merge-back can stop half-way. Edit-safety (c) covers
this inside one session only; nothing on resume says to read the target back first. Source: the owner's Codex
`run-project-pipeline` (`unknown_outcome` → readback before retry), `docs/research/codex-run-project-pipeline.md` (1).

## Done when
- [ ] `/handoff` records any write whose outcome is unknown at the stop (what, where, how to read it back).
- [ ] The resume path (`/prime` reports it; `/orchestrator` acts on it) reads the target back before any retry, and
      states that a timeout is not a failure.
- [ ] Exercised once on a real input: a handoff naming an unknown write, resumed, shows the readback before the retry.
- [ ] CHANGELOG `[Unreleased]` line.

## Touches
`skills/handoff/SKILL.md` · `skills/prime/SKILL.md` · `skills/orchestrator/SKILL.md` (resume) · CHANGELOG.md

## Assumes
- Prose only: no new ledger field or log event kind (inventing event kinds is TD-055's trap).

## Tracker
Research `codex-run-project-pipeline`, Findings row (1).
