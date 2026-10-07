---
sprint: 119
slug: fire-ledger-vehicle
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-07
status: active
plan_commit: PENDING
update_trigger: sprint execute/close events
---

# SPRINT-119 — Fire-Ledger Vehicle

> **Theme:** the seeded vehicle for SPRINT-118 T2, using SPRINT-090's method. It is one all-J0 Plan that a real `--mode overnight` run can
> fire against (pre-flight item 3 is strict: zero declared J2). Its one task is honest verification work, the first live exercise of
> SPRINT-118 T1's fire-time ledger, never real HITL work re-declared AFK to make a run fire (SPRINT-089 D3).

## Scope

**In:** one J0 task the unattended run executes with no confirmation (`405`) · the run's own rollup, `terminal ·` line and calibration row.

**Out (deferred):** any change to the autonomy machinery (a defect found here is a finding, not a licence to edit the guard
mid-run) · the post-run checks on the committed log, which SPRINT-118 T2 runs interactively · any `git push`.

## Members

- docs/work/todo/TASK-405-verify-the-fire-time-ledger-on-the-live-run-that-carries-it.md

## Plan

### T1 — Verify the fire-time ledger on the live run `[size: S · risk: low · class: execution · AFK · J0]`
Layers: (verification — no source change)
Depends-on: none
Cites: `TASK-405` · SPRINT-118 T1 · TD-122 · TD-124

The work is transcription, not analysis, which is what keeps it J0. The run records the line its own launcher wrote and the checker's
own printed output. It draws no conclusion and rules on nothing. The box spans four lines, so the tick's ` ✓ <evidence>` goes on its
first line (TD-229).

**Acceptance:** the run transcribes its own `fired ·` line and the authority checker's verdict into TASK-405's evidence and commits it,
with no confirmation asked at any point.

## Owner-action checklist
- [ ] Sign G1 + G2 and record `gates_signed:` in this file's frontmatter.
- [ ] Record the `approval_envelope:` covering all ten dimensions, pinned to a sha.
- [ ] Fire the run on the VPS from `~/lf-run` (SPRINT-118 T2, J2).

## Decisions (pre-locked)
- **D1** — Runs on the VPS as `ubuntu` in a dedicated clone `~/lf-run`, trusted for exactly that path. Results return to local main
  by git bundle; nothing is pushed to origin (SPRINT-118 G2, owner 2026-10-07).
- **D2** — Budget $10 / 60 min; reaching it ends the run at `BUDGET_STOP` (owner, SPRINT-118 G2).
- **D3** — Allowlist: the tracked `.claude/settings.json` plus three exact-file rules in the clone's gitignored
  `.claude/settings.local.json` for the live TypeScript checkers (`check-authority.ts` · `check-sprint-by-reference.ts` ·
  `check-night-run-rollup.ts`). The tracked file still names the frozen `.sh` oracles. Proven by a probe whose must-deny action is
  `git push`.

## Assumptions
- **A1** — The VPS clone's headless session resolves the same trust key as the one granted. *Confirm: the probe's must-deny row.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-119-fire-ledger-vehicle.md`, created at promote (ADR-014); the launcher
> refuses to fire without it (TD-122).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
