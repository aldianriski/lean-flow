---
sprint: 121
slug: cover-what-is-open
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-10
status: active
plan_commit: 4d82a8f
gates_signed: G1,G2 @ fe339ee
update_trigger: sprint execute/close events
---

# SPRINT-121 — Cover What Is Open

> **Theme:** A full scan on 2026-10-10 found open work that nothing pointed at: four EPIC-015 conditions with no tasks, four
> workdoo epics filed in the wrong repository, 62 single-count learnings that never reach promotion, and a Windows engine cost with
> no profile. This sprint gives each of them a home, and it is run continuously as **EPIC-015's Dogfood 1**. Ranking and scope
> are from two Codex review rounds and the owner's rulings (2026-10-10).

## Scope

**In:** the CW6 ruling (`414`) · the ADR-044/048 rulings (`413`) · the engine profile (`421`) · the learnings cleanup (`419`) · the
active-epic coverage standard (`420`) · the workdoo epic move (`418`) · Dogfood 1 recorded on this sprint (`416`).
**Out (deferred):** the TASK-404 optimization (waits for `421`'s target) · TASK-415's overnight run and TASK-417's freeze ADR (the
next EPIC-015 steps) · bulk TD disposition · parking EPIC-007/011/012 · TASK-366/367/322/402.

## Members

- docs/work/todo/TASK-414-rule-epic-015-closed-when-6-met-on-sprint-119s-rollup.md
- docs/work/todo/TASK-413-rule-the-adr-044-and-adr-048-decision-edits-for-the-gated-level.md
- docs/work/todo/TASK-421-profile-the-shell-conformance-engines-spawn-sites-on-windows.md
- docs/work/todo/TASK-419-clean-up-the-learnings-ledger.md
- docs/work/todo/TASK-420-an-active-epics-open-conditions-must-each-map-to-a-task.md
- docs/work/todo/TASK-418-move-the-workdoo-epics-to-the-workdoo-store.md
- docs/work/todo/TASK-416-record-the-next-real-sprint-as-dogfood-1.md

## Plan

### T1 — Rule EPIC-015 CW6 on the SPRINT-119 rollup `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/epic/EPIC-015-execution-autonomy.md`
  · `docs/work/todo/TASK-414-rule-epic-015-closed-when-6-met-on-sprint-119s-rollup.md` · `docs/work/in_progress/TASK-414-rule-epic-015-closed-when-6-met-on-sprint-119s-rollup.md` · `docs/work/done/TASK-414-rule-epic-015-closed-when-6-met-on-sprint-119s-rollup.md`
Depends-on: none
Cites: `TASK-414` · EPIC-015 CW6 · `scripts/night-run.sh` (read, not touched) · TD-152 · TD-153

A ruling on evidence that already exists: map every field, then check the emitter's code on every terminal path.

**Acceptance:** CW6 is ticked with file:line evidence for each field and each path, or it stays open with the gap filed.

### T2 — Rule the ADR-044 and ADR-048 Decision edits `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/adr/` · `docs/DECISIONS.md`
  · `docs/work/todo/TASK-413-rule-the-adr-044-and-adr-048-decision-edits-for-the-gated-level.md` · `docs/work/in_progress/TASK-413-rule-the-adr-044-and-adr-048-decision-edits-for-the-gated-level.md` · `docs/work/done/TASK-413-rule-the-adr-044-and-adr-048-decision-edits-for-the-gated-level.md`
Depends-on: none
Cites: `TASK-413` · STANDARD §4 · `S4.APPEND` · `conformance.sh`

The owner rules one path per ADR after reading both diffs against `f1efa36b` and `3e725ef4`.

**Acceptance:** `sh conformance.sh .` reports 0 `S4.APPEND` findings.

### T3 — Profile the engine's spawn sites on Windows `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/logs/qa-gate-timing.md` · `docs/work/backlog/TASK-404-cut-the-shell-conformance-engines-per-file-process-spawning.md`
Depends-on: none
Cites: `TASK-421` · TD-168 · `TASK-404`

A measurement only, with no engine code changed. It is the data TASK-404's target is set from.

**Acceptance:** a new timing Round names the hottest spawn sites, and their figures reconcile to the whole-run wall clock.

### T4 — Clean up the learnings ledger `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/LEARNINGS.md` · `scripts/qa-check.sh` · `evals/fixtures/learnings-metadata/` · `evals/run-learnings-metadata-fixtures.ts`
  · `docs/knowledge-index.md`
  · `docs/work/todo/TASK-419-clean-up-the-learnings-ledger.md` · `docs/work/in_progress/TASK-419-clean-up-the-learnings-ledger.md`
Depends-on: none
Cites: `TASK-419` · LEARNINGS § disposition (TASK-384) · L-198

Close the metadata lint gap with a must-FAIL fixture first, then repair the entries. The family merges follow G2's sign-off on
membership.

**Acceptance:** the gate FAILs on a missing body `count:`, and every ≥2 family is folded through `disposition: merge`.

### T5 — Active-epic coverage standard `[size: M · risk: med · class: decision · HITL · J1]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `skills/lean-doc-generator/` · `skills/triage/` · `skills/prime/`
  · `.claude/CONTEXT.md` · `README.md` · `CHANGELOG.md` · `evals/fixtures/epic-coverage/`
  · `docs/work/todo/TASK-420-an-active-epics-open-conditions-must-each-map-to-a-task.md` · `docs/work/in_progress/TASK-420-an-active-epics-open-conditions-must-each-map-to-a-task.md`
Depends-on: none
Cites: `TASK-420` · L-151 · L-015 · L-020 · ADR-006

A shipped skill change, so it gets the Codex review loop. G2 rules how a task names the condition it serves.

**Acceptance:** run on this repo, the procedure reports EPIC-015 fully covered; a seeded copy missing one task reports exactly that
condition.

### T6 — Move the workdoo-built epics to workdoo `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `docs/epic/` · `docs/adr/` · `docs/research/adlc-epic-sequencing.md` · `scripts/lib/prose-density-baseline.txt`
  · `docs/adr/ADR-041-platform-repo-service-boundary.md` · `docs/adr/ADR-045-the-work-item-store.md` · `docs/DECISIONS.md`
  · `docs/work/todo/TASK-418-move-the-workdoo-epics-to-the-workdoo-store.md` · `docs/work/in_progress/TASK-418-move-the-workdoo-epics-to-the-workdoo-store.md`
Depends-on: T1 (shares `docs/epic/`) · T2 (shares `docs/adr/` and `docs/DECISIONS.md`, D2)
Cites: `TASK-418` · ADR-041 · EPIC-016 · EPIC-018 · EPIC-019 · EPIC-020 · workdoo `.claude/CLAUDE.md` · workdoo `AGENTS.md` (other repo)

Same ids in workdoo's `docs/epic/`, with relation pointers here. workdoo's attribution rule is checked before its commit, because
its SPRINT-012 is active.

**Acceptance:** the four files live only in workdoo, and both repositories' gates are green.

### T7 — Record this sprint as Dogfood 1 `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/epic/EPIC-015-execution-autonomy.md` · `docs/sprint/logs/SPRINT-121-cover-what-is-open.md`
Depends-on: T1 · T2 · T3 · T4 · T5 · T6
Cites: `TASK-416` · EPIC-015 CW7

The other six run in attended `sprint-bulk` with no confirmation between authorized tasks. This task reads the log that run left.

**Acceptance:** EPIC-015 CW7's Dogfood-1 half is recorded as proven, citing this sprint's log.

## Owner-action checklist
- [x] Sign G1 + G2 (`/orchestrator sprint-bulk`) and record `gates_signed:`. ✓ 2026-10-10, see the g2 entry. At G2, settle every J2 ruling up front (T1 evidence, T2
      paths, T4 family membership, T5 condition-naming, T6 move shape), then re-declare each settled task J1 so the run is continuous
      (Dogfood 1).

## Decisions (pre-locked)
- **D1** — `docs/epic/EPIC-015-execution-autonomy.md` is shared by T1 and T7, and `docs/epic/` by T6. Order: T1 → T6 → T7, one
  owner at a time.
- **D2** — `docs/DECISIONS.md` and `docs/adr/` are shared by T2 and T6, on disjoint ADR files. T2 lands first, and every commit is
  staged per hunk.
- **D3** — The interim governance restriction (`adlc-epic-sequencing.md`, 2026-10-10) applies. T4's lint and T5's rule are admitted
  as fixes for measured defects (3 entries slipped the lint; EPIC-015 sat uncovered). Neither adds a conformance-engine rule.

## Assumptions
- **A1** — Every J2 ruling can be taken at G2, before execution. *Confirm: G2. A ruling that needs execution output (T3's target,
  for one) is out of this sprint by construction: TASK-404 keeps it.*
- **A2** — workdoo's commit gate accepts a docs-only `docs/epic/` commit mid-sprint. *Confirm: T6 recon, before any workdoo commit.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-121-cover-what-is-open.md`, created lazily at the first entry (ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
