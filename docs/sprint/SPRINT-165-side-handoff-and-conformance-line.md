---
sprint: 165
slug: side-handoff-and-conformance-line
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-07
status: active
gates_signed: G1,G2 @ 0a106887
plan_commit: 6b12630a
update_trigger: sprint execute/close events
---

# SPRINT-165 — A Home for Side-Session Handoffs, and the Conformance Line

> **Theme:** the host sprint for EPIC-024 row 1. Two small debt fixes give the worker contract and dispatch standard real build work:
> a side session's handoff gets a stub `/prime` can see (TD-298), and the gate names its conformance findings beside its tally (TD-081).

## Scope

**In:** a stub home for a handoff unrelated to the active sprint, reported by `/prime` (TASK-614); a separate gate line naming the conformance engine's informational finding count (TASK-615).
**Out (deferred):** TASK-613 and row 1's verdict, which stay with the launching session (a non-sprint commit here would fail the close check); a release; any edit to the trial branch; changing the verdict line, `scripts/qa-verdict.ts` or `scripts/gate-remote.ts`.

## Members

- docs/work/todo/TASK-614-give-a-side-session-handoff-a-home-prime-can-see.md
- docs/work/todo/TASK-615-name-the-conformance-verdict-beside-the-gate-tally.md

## Plan

### T1 — Give a side-session handoff a home that /prime can see `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `skills/handoff/SKILL.md` · `skills/prime/SKILL.md` · `scripts/lib/check-handoff-state.sh` · `evals/run-handoff-state-fixtures.sh` · `CHANGELOG.md` · `TECH-DEBT.md`
Depends-on: none
Cites: TASK-614 · TD-298 · TASK-613 · owner ruling 2026-11-07
The owner had to name a handoff's path by hand on 2026-11-06. Where the stub lives is deliberately unruled at G2, so the builder returns `blocked` with one question and a recommendation; that is row 1's return-path check.

**Acceptance:** a handoff unrelated to the active sprint is reported by `/prime` with no path named by the owner, and a sprint's own `live` entry still fails its close.

### T2 — Name the conformance verdict beside the gate's tally `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` · `evals/` · `TECH-DEBT.md`
Depends-on: T1
Cites: TASK-615 · TD-081 · `scripts/qa-verdict.ts` · `scripts/gate-remote.ts`
The line `QA-CHECK: 173 pass, 0 fail` can sit below seven conformance FAIL rows that a reader of the last line never sees. The count goes on its own line because `VERDICT_RE` is anchored at both ends. T2 follows T1 only for the shared `TECH-DEBT.md` and `evals/`; there is no logic dependency.

**Acceptance:** the gate prints the informational finding count directly before an unchanged verdict line, and a retained must-FAIL fixture reddens when that line is removed or miscounts.

## Owner-action checklist
- [ ] Rule TD-298's stub home when T1's builder returns `blocked` (T1).

## Decisions (pre-locked)
- **D1** — Shared files: `TECH-DEBT.md` and `evals/` are edited in T1, T2 order; `Depends-on: T1` makes that the ownership order. No parallel wave.
- **D2** — Owner ruling, 2026-11-07, this sprint only: Claude is the builder, in place of the Codex default, so the trial measures the worker contract (TASK-613).
- **D3** — ADR-053: both are `TD` work on existing surfaces. T2's line reports a count and adds no check to the tally; its must-FAIL fixture is the Other G bar (ADR-050).
- **D4** — Sprint work and commits go to `main`, while skills load from the trial worktree. The trial branch is not edited here.

## Assumptions
- **A1** — `check-handoff-state.sh` reads a root `HANDOFF-LEDGER.md` only on the no-sprint path. *Confirm: T1's builder, against the script.*
- **A2** — `conformance.sh` prints its own report and needs no change. *Confirm: T2's builder.*
- **A3** — The new line matches neither `VERDICT_RE` nor `TRUNCATED_RE`. *Confirm: T2's tests, `scripts/qa-verdict.ts`.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-165-side-handoff-and-conformance-line.md`](logs/SPRINT-165-side-handoff-and-conformance-line.md). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
