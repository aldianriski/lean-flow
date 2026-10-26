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
sprint: SPRINT-143
depends-on: []
---

# TASK-513 — Reconcile a write whose outcome is unknown before retrying it on resume

## Why
A timeout or an interrupted session does not prove a write failed: a subagent can commit in its worktree after
it times out, a remote gate run can finish after ssh drops, a merge-back can stop half-way. Edit-safety (c) covers
this inside one session only; nothing on resume says to read the target back first. Source: the owner's Codex
`run-project-pipeline` (`unknown_outcome` → readback before retry), `docs/research/codex-run-project-pipeline.md` (1).

## Done when
- [x] `/handoff` records any write whose outcome is unknown at the stop (what, where, how to read it back). ✓ review: handoff § What goes in item 5, inherited writes carried forward (25a0a55b, adbc80b6); Codex R2 CLEAR
- [x] The resume path (`/prime` reports it; `/orchestrator` acts on it) reads the target back before any retry, and ✓ review: prime `Handoff:` row + `Next:`; orchestrator Guard + dispatch.md § Uncertain writes (no retry on an inconclusive readback); Codex R2 CLEAR
      states that a timeout is not a failure.
- [x] Exercised once on a real input: a handoff naming an unknown write, resumed, shows the readback before the retry. ✓ test: real qa-check run left running at 10:11; fresh headless session on the 25a0a55b export read the handoff, read the log back, checked the process, ruled "don't re-run it" (log entry)
- [x] CHANGELOG `[Unreleased]` line. ✓ check: CHANGELOG `## [Unreleased]` › SPRINT-143 line (25a0a55b)

## Touches
`skills/handoff/SKILL.md` · `skills/prime/SKILL.md` · `skills/orchestrator/SKILL.md` (resume) · CHANGELOG.md

## Assumes
- Prose only: no new ledger field or log event kind (inventing event kinds is TD-055's trap).

## Tracker
Research `codex-run-project-pipeline`, Findings row (1).
