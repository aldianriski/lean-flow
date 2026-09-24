---
sprint: 107
slug: retarget-the-loop
epic: EPIC-017
owner: Maintainer
last_updated: 2026-09-24
status: active
plan_commit: 3e0e710
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-107 — Retarget the Loop

> **Theme:** `EPIC-017`'s second member. SPRINT-106 built the store and the way in; this sprint moves the
> loop onto it — `promote` and `close` work by reference, `/triage` and `/task-decomposer` write task
> files, `/handoff` and `/flow` read the store, and `/orchestrator` runs a sprint from its member files.
> After it, every step of `/prime → promote → sprint-bulk → close` operates on `docs/work/`, and the
> Plan-copy drift (`TD-179`) has no second copy left to drift from.

## Scope

**In:** `promote`/`close` by reference (`TASK-362`, finishing `TASK-360`'s open half) · `/triage` +
`/task-decomposer` onto the store (`TASK-361`) · `/handoff` + `/flow` (`TASK-376`) · `/orchestrator`
incl. dispatch merge-back (`TASK-375`).

**Out (deferred):** the spec amendment (`TASK-377`) · templates + `init` (`TASK-378`) · loop docs
(`TASK-379`) · the gate's checkers (`TASK-363` · `387` · `382` · `383` · `381`) · migrating this repo
(`TASK-380`) · `TASK-370`'s carried items · the token budget (`TASK-364` · `384`) · workdoo and release
(`TASK-365` · `371` · `372` · `373` · `385` · `386`).

## Members

- docs/work/todo/TASK-362-promote-and-close-by-reference.md
- docs/work/todo/TASK-360-membership-frontmatter-derived-progress.md
- docs/work/todo/TASK-361-retarget-triage-and-task-decomposer.md
- docs/work/todo/TASK-376-retarget-handoff-and-flow.md
- docs/work/todo/TASK-375-retarget-orchestrator.md

## Plan

### T1 — Make `promote` and `close` operate by reference `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/` · `skills/lean-doc-generator/templates/SPRINT.md.template` · `evals/fixtures/by-reference/` · `evals/run-by-reference-fixtures.ts` · `TECH-DEBT.md`
Depends-on: none
Cites: `TASK-362` · `TASK-360` · `TD-179` · `EPIC-017` D2 · `ADR-045` · `docs/work/README.md`

The riskiest task in the epic: removing the Plan copy must not weaken the Plan freeze. `promote` stamps
`sprint:` and moves member files; the sprint file lists members and holds only what is sprint-scoped;
`close` verifies members sit in `done/`/`cancel/`. Finishes TASK-360's by-reference half and dissolves
TD-179, since one DoD per task leaves nothing to mirror.

**Acceptance:** a fixture sprint promoted and closed by reference carries each task's DoD in exactly one
place, and a member edited after promote is detectable against the frozen snapshot.

**DoD:**
- [ ] `promote` stamps `sprint:` + `git mv` backlog → todo (own commit, D6); the sprint file lists members by reference, no DoD copy
- [ ] `close` verifies every member is in `done/`/`cancel/`, never counting Plan boxes
- [ ] The freeze survives: what `plan locked` pins, and how a post-promote member edit is detected — written down and fixtured (must-FAIL: an unlogged edit to a member after promote)
- [ ] `skills/lean-doc-generator/SKILL.md` ≤ 140 lines — *Verify: `wc -l`*
- [ ] TD-179 resolved on evidence; TASK-360's open half ticked

### T2 — Retarget `/triage` and `/task-decomposer` onto the store `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/triage/SKILL.md` · `skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/fog-map.md` · `skills/task-decomposer/references/prd-and-slices.md` · `evals/fixtures/store-writers/` · `evals/run-store-writers-fixtures.ts`
Depends-on: T1
Cites: `TASK-361` · `EPIC-017` Closed-when 1

Both skills read and write task files; `authority:`, `assumes:`, `origin:` and readiness survive;
ordering is explicit (`priority:` + a per-status order), since folders cannot sequence.

**Acceptance:** a ≥ 30-task decomposition writes ≥ 30 files and fires no cap check — on real input.

**DoD:**
- [ ] `/triage` grooms task files (state, priority, order); readiness never folded into the folder
- [ ] `/task-decomposer` writes one file per task, both references retargeted
- [ ] ≥ 30-task breakdown → ≥ 30 files, no cap check fires — exercised on real input (Closed-when 1)
- [ ] Retained fixture incl. a selection-varying case

### T3 — Retarget `/handoff` and `/flow` onto the store `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/handoff/SKILL.md` · `skills/flow/SKILL.md` · `skills/lean-doc-generator/references/handoff-reconciliation.md` · `evals/fixtures/store-readers/` · `evals/run-store-readers-fixtures.ts`
Depends-on: T1
Cites: `TASK-376` · `TODO.md` (no longer read)

**Acceptance:** on a v2 fixture, `/handoff` finds the active sprint and `/flow` routes feed/plan/build
from the store, with no `TODO.md` read.

**DoD:**
- [ ] `/handoff` resolves the active sprint from sprint frontmatter + members
- [ ] `/flow`'s assess/feed/plan steps query the store
- [ ] handoff-reconciliation routes a follow-up TASK to a task file
- [ ] Exercised once each on a v2 fixture

### T4 — Retarget `/orchestrator` onto the store `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/dispatch.md` · `skills/orchestrator/references/night-run.md` · `skills/orchestrator/references/review-scoping.md` · `evals/fixtures/orchestrator-store/` · `evals/run-orchestrator-store-fixtures.ts`
Depends-on: T1
Cites: `TASK-375` · `TASK-362` · `EPIC-017` D6

**Acceptance:** a v2 fixture sprint runs through sprint-bulk's reads (members, dispatch, rollup,
review comparand) with no Plan-copy dependency.

**DoD:**
- [ ] sprint-bulk reads members by reference
- [ ] dispatch: return-to-backlog is a `git mv`; merge-back transitions are coordinator-owned with a duplicate-id check (moved from TASK-362, D6)
- [ ] night-run entry routing, rollup and reaper read the store
- [ ] review-scoping's `Cites:` resolves from the task file
- [ ] Exercised once end-to-end on a v2 fixture sprint

## Decisions (pre-locked)

- **D1** — Order T1 → {T2, T3} → T4. Shared files: `skills/lean-doc-generator/references/` T1 then T3.
- **D2** — TASK-362's "dispatch merge-back" half moves to T4 (`dispatch.md` is T4's), keeping T1 at M.
- **D3** — Every new harness is registered in `scripts/qa-check.sh` by the coordinator **when its task is
  accepted**, not at close (L-213); the coordinator also mirrors ticks into member files until T1 lands (TD-179).
- **D4** — This repo stays mixed and runs installed 1.66.x skills; no release (the epic gates `2.0.0`).

## Assumptions

- **A1** — Removing the Plan copy introduces no weaker freeze. **UNCONFIRMED** (TASK-362) — grilled at G2 before T1 starts.
- **A2** — A per-status order file (or `priority:` alone) is enough to sequence a backlog. *Confirm: T2 at G2.*
- **A3** — Governance signed 2026-09-24: L-promotion none · 7 high TD open, TD-128 unowned (re-review noted) · 5 soft cap breaches, 0 hard · epic rollups current · no handoff ledger.

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-107-retarget-the-loop.md`, created lazily (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
