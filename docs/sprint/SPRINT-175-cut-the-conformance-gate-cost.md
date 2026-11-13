---
sprint: 175
slug: cut-the-conformance-gate-cost
owner: Maintainer
last_updated: 2026-11-13
status: active
plan_commit: 621e9f10
update_trigger: sprint execute/close events
---

# SPRINT-175 — Cut the Conformance Harness's Share of the Gate

> **Theme:** Workflow code only, nothing for workdoo (owner ruling, 2026-11-13). The conformance harness's single-family cases run the engine on the full 100-rule spec: 38 calls and 164.8 s of a gate that sits on its 520 s budget (timing log, Round 25).
> They move to reduced specs derived at run time, with no assertion lost and the engine untouched.

## Scope

**In:** the reduced-spec change to the conformance harness, its proof and its measurement (TASK-661)
**Out (deferred):** any workdoo work · TASK-367, blocked on TASK-661 until the gate is re-measured · any change to the engine or the spec reader (ADR-043) · EPIC-025's open release condition, an owner action (push v2.23.0)

## Members

- docs/work/todo/TASK-661-run-single-family-conformance-cases-on-a-reduced-spec.md

## Plan

### T1 — Run the single-family conformance cases on a reduced spec `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `evals/run-conformance-engine-fixtures.sh` · `evals/fixtures/` · `docs/research/logs/qa-gate-timing.md` · `TECH-DEBT.md`
Depends-on: none
Cites: TASK-661, TD-171, ADR-043, ADR-050, ADR-053, `spec/STANDARD.md` · `scripts/lib/conformance-engine.sh` · `scripts/lib/read-spec-rules.sh` · `conformance.sh` (read, and proven byte-identical, never edited)
The harness already derives reduced specs for other cases, so the change reuses that mechanism. The engine and the spec reader stay byte-identical. One step owns all eight Done-when boxes.

**Acceptance:** the single-family cases run on specs derived from `spec/STANDARD.md` at run time, every PASS name is kept, and the measured gate fits its budget or the figures are recorded for the owner.

## Owner-action checklist

- [ ] No owner action at promote. Pushing v2.23.0 stays owner-reserved and outside this sprint.

## Decisions (pre-locked)

- **D1** — Tier G consequential (ADR-050): the harness guards an engine file `conformance.sh` executes. Built by Codex in a worktree, with a worktree-isolated outside review; G2 review cap two rounds (ADR-053).
- **D2** — One task, so no shared-file ownership to map.
- **D3** — No epic and no stream. The task cuts gate runtime on a harness EPIC-025 already protects; it does not advance that epic's bookkeeping outcome.

## Assumptions

- **A1** — The Windows host has at least 3 GB free and is quiet for the measuring runs. *Confirm: at each run.*
- **A2** — The off-host `QA_FULL=1` gate is reachable. The network dropped several times on 2026-11-13; a dropped read-back is resolved by reading the result files on the runner. *Confirm: at system-verify.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-175-cut-the-conformance-gate-cost.md`](logs/SPRINT-175-cut-the-conformance-gate-cost.md). Append there, never here (STANDARD §9).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
