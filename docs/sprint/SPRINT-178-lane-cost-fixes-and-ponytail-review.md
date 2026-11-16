---
sprint: 178
slug: lane-cost-fixes-and-ponytail-review
epic: EPIC-026
owner: Maintainer
last_updated: 2026-11-16
status: active
plan_commit: PENDING
update_trigger: sprint execute/close events
---

# SPRINT-178 — Lane Cost Fixes and the Ponytail Delta Review

> **Theme:** The 2026-11-14/15 four-lane run showed lane cost follows session length: long Opus lanes, bulky output and `/loop` polling. Two coordinator.md fixes (rotate and launch lanes, then keep bulky output and polling out of lanes) ship now. EPIC-026's ponytail delta review runs beside them, since it is a reading that installs nothing and cannot touch EPIC-025's Sprint B.

## Scope

**In:** TASK-666 (lane rotation and coordinator launch) · TASK-667 (bulky outputs, message discipline, no polling) · TASK-669 (ponytail delta review, EPIC-026 slice 1).
**Out (deferred):** TASK-668 (re-measure lane cost; blocked until the next real multi-lane run) · EPIC-026's RTK trial and graphify trial (after Sprint B closes, D1) · EPIC-025 and its Sprint B (workdoo) · the v2.24.0 push (owner action).

## Members

- docs/work/todo/TASK-666-let-the-coordinator-rotate-and-launch-lane-sessions.md
- docs/work/todo/TASK-667-keep-bulky-outputs-out-of-lanes-with-message-discipline-and-no-polling.md
- docs/work/todo/TASK-669-ponytail-delta-review.md

## Plan

### T1 — Let the coordinator rotate and launch lane sessions `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/coordinator.md` · `skills/handoff/SKILL.md` · `skills/flow/SKILL.md` · `.claude/CONTEXT.md` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-666, `skills/orchestrator/references/dispatch.md`, `docs/sprint/archive/SPRINT-176-coordinator-reference-for-lanes.md`
Lane cost tracks session length, and lean-flow names no lane lifetime or ceiling. The first box exercises the `claude --bg` route on a throwaway lane before any text is written. T1 is the single owner of coordinator.md until it commits (D3).

**Acceptance:** coordinator.md, handoff, flow and CONTEXT name the same ceiling and the same rotate route, and the four `--bg` results are recorded.

### T2 — Keep bulky outputs out of lanes, with message discipline and no polling `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/coordinator.md` · `skills/orchestrator/references/dispatch.md` · `CHANGELOG.md`
Depends-on: T1
Cites: TASK-667, TASK-666, `docs/research/router-mode.md`
Serialised after T1 because both edit coordinator.md and CHANGELOG.md (D3). Only bulky-output work goes to a worker; routine edits stay inline. The exercise may share T1's throwaway lane.

**Acceptance:** coordinator.md and dispatch.md state the narrow delegation rule, the message rule and the background-wait rule, with one bulky segment and one wait loop exercised.

### T3 — Ponytail delta review (EPIC-026 slice 1) `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-669, `docs/epic/EPIC-026-token-cost-per-box.md`, `docs/research/graphify-daily-value.md`
A first-hand reading of ponytail mapped against lean-flow's existing surface (L-017), nothing installed. It shares no file with the two lane tasks, so it runs in wave 1.

**Acceptance:** one new `docs/research/` file records the verdict and its first-hand-read basis, and nothing ships inside lean-flow on it.

## Decisions (pre-locked)

- **D1** — Owner ruling 2026-11-16, verbatim "Lane fix + ponytail now (Recommended)": the lane-fix tasks plus ponytail's delta review run now; RTK's measured trial and graphify wait for Sprint B to close. Recorded as EPIC-026 D7 (amends D1's timing for the ponytail slice only).
- **D2** — EPIC-026 is activated by this promote. The sprint carries `epic: EPIC-026` because TASK-669 advances it; TASK-666 and TASK-667 carry no `epic:` and advance none of its conditions. The epic's § Member sprints row says so.
- **D3** — coordinator.md and CHANGELOG.md are edited by T1 then T2, in that order, never in parallel. T3 shares no file with either.
- **D4** — Net-zero rule: T1's edit to `.claude/CONTEXT.md` adds no net line (150 of 150; always-loaded token budget 12683 of 12691). `.claude/CLAUDE.md` is untouched (79 of 80). If a cap check fails mid-build, stop and ask.
- **D5** — Tasks commit as `sprint(178) Tn: …`; coordinator writes (status moves, Log, sprint file, epic and INDEX edits, ticks) commit as bare `sprint(178):`.
- **D6** — Parallel with EPIC-025 Sprint B (workdoo SPRINT-005) on a frozen 2.23.0 worktree (EPIC-025 D9). This sprint does not touch EPIC-025, its Sprint B or any workdoo file.

## Assumptions

- **A1** — `--bg` sessions accept `SendMessage` and support popups once attached. *Confirm: T1's first box, results (a) to (d).*
- **A2** — `claude --help` on the installed CLI still shows the `--bg`, `agents`, `attach`, `logs` and `stop` forms (2.1.325 read 2026-11-16). *Confirm: T1's exercise.*
- **A3** — ponytail's SKILL.md and benchmark are publicly readable. *Confirm: T3's first box.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-178-lane-cost-fixes-and-ponytail-review.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
