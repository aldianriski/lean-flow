---
sprint: 118
slug: prove-the-run
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-07
status: active
plan_commit: 901e7d6
update_trigger: sprint execute/close events
---

# SPRINT-118 — Prove the Run

> **Theme:** EPIC-015's first closing condition has been parked three times because no sprint produced a real unattended run
> (L-111). This sprint makes the run part of the plan: first a fire-time ledger, so a run that fires and dies is still on record,
> then one real `--mode overnight` run on a seeded all-J0/J1 vehicle, on the VPS. Two opportunistic checks ride on that run.

## Scope

**In:** the launcher's fire-time run ledger (`320`, TD-122 · TD-124) · one real unattended run that proves EPIC-015 Closed-when 1
(`319`) · the reaper on a genuinely partial Plan, if the run produces one (`188`) · the first real handoff through
`check-handoff-state.sh`, from the run's clean halt (`327`).

**Out (deferred):** EPIC-015's other open conditions (repair runs, typed outcomes, the two dogfoods, the re-armed freeze) ·
TASK-404 (engine spawn cost) · workdoo (another session) · any `git push` (owner-reserved).

## Members

- docs/work/todo/TASK-320-give-the-launcher-a-fire-time-run-ledger-closing-td-122-and-td-124-together.md
- docs/work/todo/TASK-319-prove-closed-when-1-with-a-real-unattended-run-against-the-repaired-reaper.md
- docs/work/todo/TASK-188-exercise-the-reaper-on-a-genuinely-partial-plan.md
- docs/work/todo/TASK-327-exercise-check-handoff-state-sh-on-the-first-real-handoff.md

## Plan

### T1 — Give the launcher a fire-time run ledger `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/night-run.sh` · `scripts/lib/check-authority.ts` · `scripts/lib/check-sprint-by-reference.ts` · `evals/run-authority-fixtures.sh` · `evals/authority.test.ts` · `evals/run-by-reference-fixtures.ts`
  · `evals/run-night-run-gate-exception-fixtures.sh` · `evals/run-authority-differential.ts` · `evals/fixtures/`
  · `skills/orchestrator/references/night-run.md` (corrected by scope-change, see Execution Log)
  · `docs/work/in_progress/TASK-320-give-the-launcher-a-fire-time-run-ledger-closing-td-122-and-td-124-together.md`
  · `docs/work/done/TASK-320-give-the-launcher-a-fire-time-run-ledger-closing-td-122-and-td-124-together.md` (its own tick + move)
Depends-on: none
Cites: `TASK-320` · TD-122 · TD-124 · ADR-016 · `check-authority.sh` (the member names it; the frozen oracle, not edited, ADR-050 §3)

Tier G. Whether it is *consequential* G is ruled at G2 (ADR-050), defaulting up (ADR-029). It goes first so this sprint's run is on record
the moment it fires, even if the reaper never sees it (D2 covers the run itself).

**Acceptance:** a run that fires but never reaches the reaper is distinguishable on record from one that never fired, proven by a
retained must-FAIL fixture.

### T2 — Prove EPIC-015 Closed-when 1 with a real unattended run `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `docs/sprint/` (the seeded vehicle Plan and its log; shape ruled at G2) · `docs/work/` (the vehicle's seeded member)
  · `docs/epic/EPIC-015-execution-autonomy.md`
Depends-on: T1
Cites: `TASK-319` · EPIC-015 Closed-when 1 · `skills/orchestrator/references/night-run.md` Part 1a (pre-flight) · SPRINT-090 (the seeded-vehicle method) · SPRINT-101 D2

J2: the owner fires the run and reads its result. The run targets a **seeded** vehicle Plan whose every task is J0/J1 (pre-flight
item 3 is strict), never real work re-declared AFK to make a run fire. It runs on the VPS (D1).

**Acceptance:** one `--mode overnight` run fires against the repaired reaper with `gates_signed:` recorded on its vehicle, and the
terminal-state agreement check passes against that run's committed log.

### T3 — Exercise the reaper on a genuinely partial Plan `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/night-run.sh` (only if the exercise finds a defect)
Depends-on: T2
Cites: `TASK-188` · SPRINT-098 D5

Opportunistic: it rides T2's run. If that run does not stop mid-Plan, this closes `unattempted` (D5), which is a valid outcome.

**Acceptance:** the reaper's handling of a run that stopped mid-Plan is observed on real input, or the task is recorded `unattempted`.

### T4 — Exercise the handoff check on the first real handoff `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-handoff-state.sh` (only if a fix is needed) · `HANDOFF-LEDGER.md` (only if the handoff has no sprint pointer)
Depends-on: T2
Cites: `TASK-327` · `skills/handoff/SKILL.md` (the member names it `handoff/SKILL.md`; the writer under test, not edited) · STANDARD §12(b) · L-007

Opportunistic: the clean-halt `/handoff` of T2's run is the vehicle. Tier G, never run on live input before.

**Acceptance:** a real handoff record is written, `/prime` reports it, and close reconciles it to `spent`, all on live input.

## Owner-action checklist
- [x] Install the Claude CLI for the `ubuntu` user on the VPS, log in (`claude login`), and install lean-flow 2.1.0 there (D1). ✓ 2026-10-07: CLI 2.1.291 + plugin 2.1.0; logged in (claude.ai); smoke run SMOKE-OK
- [x] Fire T2's run and read its result (J2). ✓ 2026-10-07: the owner delegated the fire explicitly ("execute by you, i give you authorization"); fired 03:09:34Z, `ALIVE`, `PLAN_EXHAUSTED` · `DELIVERED`, $0.83

## Decisions (pre-locked)
- **D1** — The run executes on the VPS as `ubuntu`, kept apart from workdoo's service user and quota (owner, promote 2026-10-07).
- **D2** — T2's run is not gated on T3 or T4 being green; either may close `unattempted` (L-111, SPRINT-101 D2).
- **D3** — `scripts/night-run.sh` is shared by T1 and T3. Owner: T1 lands first; T3 edits it only if its exercise finds a defect.

## Assumptions
- **A1** — The VPS can run a headless Claude session with lean-flow 2.1.0 installed for `ubuntu`. *Confirm: the owner action above, then a one-line `claude -p` smoke run.*
- **A2** — The gate is green on the VPS, so `night-run.sh` will fire. *Confirm: last run `QA-CHECK: 307 pass, 0 fail` at `de21d7e`; re-run at pre-flight.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-118-prove-the-run.md`, created lazily at the first entry (ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
