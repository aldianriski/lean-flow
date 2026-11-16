---
sprint: 179
slug: model-effort-trial-matrix
owner: Maintainer
last_updated: 2026-11-16
status: active
plan_commit: c25c88ce
gates_signed: G1,G2 @ ab039283
update_trigger: sprint execute/close events
---

# SPRINT-179 — Model × Effort Trial Matrix in Dispatch

> **Theme:** Effort is unrouted: every worker in the 2026-11-16 session ran Sonnet at default effort, and the strongest tier is manual-only. This sprint ships the per-role matrix as an opt-in trial, gated by a `dispatch-trial` line in the host's CONTEXT, with a spending bound and a per-dispatch record. The measured verdict is a later task (TASK-671), after a real sprint has run the cells.

## Scope

**In:** TASK-670 (trial table in dispatch.md, the `dispatch-trial` line and record rule in CONTEXT, the ADR-010 addendum, CHANGELOG and README).
**Out (deferred):** TASK-671 (rule each cell on the trial's numbers; blocked until a real sprint has run the cells) · the trial run itself on the next real sprint · Codex's own effort setting · any new guard, checker or ledger field · the v2.24.0 push (owner action).

## Members

- docs/work/todo/TASK-670-dispatch-names-a-workers-effort-per-role-as-a-trial.md

## Plan

### T1 — Dispatch names a worker's model tier and effort per role, as an opt-in trial `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` · `.claude/CONTEXT.md` · `docs/adr/ADR-010-model-dispatch-role-tiers.md` · `CHANGELOG.md` · `README.md`
Depends-on: none
Cites: TASK-670, `skills/orchestrator/references/cross-model-route.md`, TASK-671
The default three class rows stay the consumer default, and a trial table applies only where the host declares `dispatch-trial`. Strongest-tier dispatches are capped at 6 and booked on small inputs only. The one real dispatch under a trial cell that the DoD asks for is exercised at G2 or build time, with the repo-local record.

**Acceptance:** dispatch.md, CONTEXT and the ADR-010 addendum agree on the table, the cap and the escalation cell, and a host with no `dispatch-trial` line dispatches exactly as before.

## Decisions (pre-locked)

- **D1** — Owner rulings, 2026-11-16: "Measured trial" and the Fable cap, verbatim "makesure 6 allocate is just doit simple task, not heavy, my token will burn". The matrix ships as an opt-in trial; its verdict is TASK-671, not a box here.
- **D2** — TASK-671 stays in the backlog, `blocked` on TASK-670, because it needs a real sprint's numbers. It does not join this sprint.
- **D3** — Net-zero rule: the CONTEXT edit adds no net line (150 of 150 lines; always-loaded token budget 12679 of 12691) and `.claude/CLAUDE.md` stays 79 of 80. If a cap check fails mid-build, stop and ask.
- **D4** — Commits: the task commits as `sprint(179) T1: …`; coordinator writes (status moves, Log, sprint file, ticks) commit as bare `sprint(179):`.

## Assumptions

- **A1** — The Agent tool takes an `effort` parameter on the installed CLI. *Confirm: T1's exercised dispatch.*
- **A2** — `.claude/CONTEXT.md` can absorb the pointer and the `dispatch-trial` line net-zero. *Confirm: `check-doc-caps.ts` at T1's build.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-179-model-effort-trial-matrix.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

