---
sprint: 122
slug: finish-epic-015
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-10
status: active
update_trigger: sprint execute/close events
---

# SPRINT-122 — Finish EPIC-015

> **Theme:** EPIC-015 has four open conditions, and two of them are run-shaped proofs. This sprint makes a user-stopped run
> report itself, so CW6's last path emits the typed outcome (TASK-423). It then proves bounded unattended repair and Dogfood 2 in
> one real overnight run (TASK-415). TASK-417, which re-arms the freeze widened to governance and closes the epic, follows once
> both land: it is `blocked` on them and is not promotable yet.

## Scope

**In:** USER_STOP rollup emission (`423`) · one overnight vehicle run proving CW5 and Dogfood 2 (`415`).
**Out (deferred):** TASK-417 (blocked on this sprint) · TASK-404's engine cut · TASK-422 / 366 / 367 / 322 / 402.

## Members

- docs/work/todo/TASK-423-emit-the-run-outcome-rollup-on-a-user-stopped-run.md
- docs/work/todo/TASK-415-prove-bounded-unattended-repair-and-dogfood-2-in-one-overnight-run.md

## Plan

### T1 — A user-stopped run emits its rollup as USER_STOP `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `scripts/night-run.sh` · `evals/fixtures/night-run-reaper/` · `evals/run-reap-terminal-fixtures.sh`
  · `docs/epic/EPIC-015-execution-autonomy.md`
Depends-on: none
Cites: `TASK-423` · EPIC-015 CW6 · ADR-050 (Consequential G) · ADR-034 · TD-152 · TD-153

The launcher decides what an unattended run reports, so this is Consequential Tier G: the full bar, seeded breaks and a
worktree-isolated outside review. G2 rules how a user stop is told apart from a crash.

**Acceptance:** a user-stopped run's committed log carries `terminal · USER_STOP` with every CW6 field, and a crash still reads
HARD_FAILURE.

### T2 — Prove bounded unattended repair and Dogfood 2 in one overnight run `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/epic/EPIC-015-execution-autonomy.md`
Depends-on: T1
Cites: `TASK-415` · EPIC-015 CW5 · CW7 · D5 · ADR-022

It runs after T1, so the vehicle run already carries the USER_STOP-capable launcher. The vehicle sprint (its Plan, envelope and
seeded J1/J2 tasks) and the files its J1 task touches are ruled at G2. If recon shows the overnight path cannot review and revise
unattended, the task stops for a scope ruling.

**Acceptance:** CW5 ticked and CW7's Dogfood-2 half recorded, each citing commit and log lines rather than the run's report.

## Owner-action checklist
- [ ] Sign G1 + G2 (`/orchestrator sprint-bulk`) and record `gates_signed:`. Settle T1's stop-vs-crash signal and T2's vehicle
      shape at G2.
- [ ] Sign T2's vehicle `approval_envelope:` (all ten dimensions) before the overnight run fires.

## Decisions (pre-locked)
- **D1** — `docs/epic/EPIC-015-execution-autonomy.md` is shared by T1 and T2. T1 lands first (`Depends-on`).
- **D2** — The interim governance restriction applies. T1 fixes a measured defect (USER_STOP produced by no path, found by
  SPRINT-121 T1). T2 is a proof run, not new machinery.

## Assumptions
- **A1** — The overnight path runs a reviewer and the bounded revise unattended under ADR-022's carve-out. *Confirm: G2 recon. If
  not, T2 stops for a scope ruling.*
- **A2** — The launcher can see a user interrupt (INT/TERM, or a wrapped exit status of 130/143). *Confirm: G2 recon of how the
  harness stops a run.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-122-finish-epic-015.md`, created at promote (ADR-014; SPRINT-121 lesson).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
