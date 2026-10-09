---
sprint: 119
slug: fire-ledger-vehicle
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-09
status: closed
gates_signed: G1,G2 @ 85b3ffc
approval_envelope: goal · scope · acceptance · design · verification · j1-delegation · capabilities · repair-policy · budget · stop-conditions @ 85b3ffc
plan_commit: 85b3ffc
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
- [x] Sign G1 + G2 and record `gates_signed:` in this file's frontmatter. ✓ 2026-10-07: `gates_signed: G1,G2 @ 85b3ffc` (`19273b1`)
- [x] Record the `approval_envelope:` covering all ten dimensions, pinned to a sha. ✓ 2026-10-07: pinned `@ 85b3ffc`; `check-approval-envelope.sh` all 10 covered
- [x] Fire the run on the VPS from `~/lf-run` (SPRINT-118 T2, J2). ✓ 2026-10-07 03:09:34Z, owner-delegated; `PLAN_EXHAUSTED` · `DELIVERED`, merged `312ddea`

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
| `docs/work/done/TASK-405-verify-the-fire-time-ledger-on-the-live-run-that-carries-it.md` | T1 | the run transcribed its own `fired ·` line and the authority checker's verdict, then moved the member | Low | by-reference `--close` 4/0 |
| `docs/sprint/logs/SPRINT-119-fire-ledger-vehicle.md` | T1 · reaper | the fired line, the run's rollup, and the reaper's fenced `run-complete` block | Low | `check-night-run-rollup.ts` PASS |

## Retro

**Retrieval check:** no miss inside the envelope. The run kept the bare `sprint(119):` commit form that the pre-run review added to the
trigger text.

**Cost:** $0.83 (harness result event), 23 turns, about 2 min, 0 permission denials. No subagents.

**Worked:** a vehicle made of honest verification work fired under a strict pre-flight (all J0), wrote only inside its envelope (TASK-405 and
this log), and ended at a named terminal state, `PLAN_EXHAUSTED`. The owner-action boxes were ticked at close, using facts recorded in SPRINT-118's log.

**Friction:**
- A first rollup went under a `rollup` header, so the checker could not read it. The run corrected it with an appended `run-complete` entry.
- The model-written unfenced `terminal ·` line satisfied `--close` before the reaper ran (TD-232).
- `behaviour:none` is not a review class, giving 2 `review-depth-unclassified` FAILs. These are kept verbatim under the ADR-021 override
  recorded in SPRINT-118's Retro (TD-233).

**Buckets:** routed with SPRINT-118's (one run, one vehicle). Shipped → `CHANGELOG.md` § SPRINT-119. Debt → TD-232 · TD-233 · TD-234. No
follow-ups. Learnings → none new.
