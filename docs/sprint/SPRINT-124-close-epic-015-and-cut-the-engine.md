---
sprint: 124
slug: close-epic-015-and-cut-the-engine
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-11
status: active
plan_commit: 443cc5ac
update_trigger: sprint execute/close events
---

# SPRINT-124 — Close EPIC-015 and Cut the Engine

> **Theme:** SPRINT-122 proved CW5, CW6 and CW7, so EPIC-015 has one open condition left: re-arm the freeze, widened to
> governance work (TASK-417). This sprint first fixes the stale-marker defect its close left behind (TASK-426, TD-247 Option A).
> It then cuts the conformance engine's Windows wall clock against the target TASK-421's profile set (TASK-404, TD-168, the
> ledger's one `high` row), and closes the epic last, so the re-armed freeze lands on a finished execution architecture.

## Scope

**In:** the run-id-stamped USER_STOP marker (`426`) · a ≥50% cut of the engine's Windows wall clock (`404`) · the widened-freeze
ADR and EPIC-015's close (`417`).
**Out (deferred):** TD-247 C6 (the guard accepts an unbacked USER_STOP; it stays open with its census) · bulk disposition of the
aged TD rows · TASK-422 / 366 / 367 / 322 / 402.

## Members

- docs/work/todo/TASK-426-stamp-the-user-stop-marker-with-the-run-id.md
- docs/work/todo/TASK-404-cut-the-shell-conformance-engines-per-file-process-spawning.md
- docs/work/todo/TASK-417-re-arm-the-execution-freeze-widened-to-governance-and-close-epic-015.md

## Plan

### T1 — Stamp the USER_STOP marker with the run's id `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/night-run.sh` · `evals/run-reap-terminal-fixtures.sh` · `evals/fixtures/night-run-reaper/` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-426-stamp-the-user-stop-marker-with-the-run-id.md`
  · `docs/work/in_progress/TASK-426-stamp-the-user-stop-marker-with-the-run-id.md`
Depends-on: none
Cites: `TASK-426` · TD-247 (C3) · TASK-425 (Option A ruled) · ADR-050 (Consequential G) · ADR-016

The launcher decides what an unattended run reports, so this is Consequential Tier G: the full bar, seeded breaks and a
worktree-isolated outside review. Option A was ruled at SPRINT-122 close; Option B was rejected because it changes Part 4.

**Acceptance:** a stale `.stop` marker with a foreign id reads as its log implies, never USER_STOP, and a real TERM still reports
USER_STOP.

### T2 — Cut the Shell engine's per-file process spawning `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` · `docs/research/logs/qa-gate-timing.md`
  · `TECH-DEBT.md`
  · `docs/work/todo/TASK-404-cut-the-shell-conformance-engines-per-file-process-spawning.md`
  · `docs/work/in_progress/TASK-404-cut-the-shell-conformance-engines-per-file-process-spawning.md`
Depends-on: none
Cites: `TASK-404` · TD-168 · TASK-421 (the profile) · `qa-gate-timing.md` Round 23 · ADR-034 · ADR-043 · ADR-050 · ADR-051
  · `conformance.sh` (run to measure, not edited)

`conformance.sh` executes this engine, so the change is Consequential Tier G and the compatibility contract (ADR-034) is the bar:
no verdict, finding id or exit meaning may move. Round 23 names five rules' per-row spawn loops as the cost; G2 picks which to
batch.

**Acceptance:** the engine's run against this repo on the Windows host takes ≤ 216.5 s (from 433.1 s), with the before and after
measured on the same host and tree, and every retained engine fixture is unchanged.

### T3 — Re-arm the execution freeze, widened to governance, and close EPIC-015 `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/adr/` · `docs/DECISIONS.md` · `docs/knowledge-index.md` · `docs/research/adlc-epic-sequencing.md`
  · `docs/epic/EPIC-015-execution-autonomy.md` · `skills/lean-doc-generator/SKILL.md` · `skills/task-decomposer/SKILL.md`
    (the placement targets: promote and intake, per the DoD; G2 may add more, logged and edited here as exact paths)
  · `docs/work/todo/TASK-417-re-arm-the-execution-freeze-widened-to-governance-and-close-epic-015.md`
  · `docs/work/in_progress/TASK-417-re-arm-the-execution-freeze-widened-to-governance-and-close-epic-015.md`
Depends-on: T1, T2
Cites: `TASK-417` · EPIC-015 CW8 · D1 · V3 §56/§58 · Codex review rounds 1–2 (2026-10-10)

The interim restriction of 2026-10-10 becomes an ADR, so only one version of the rule stays live. T3 runs last, after the
sprint's other work, so the freeze lands on the finished execution architecture.

**Acceptance:** the ADR is live, the interim paragraph has been replaced, and EPIC-015 has all eight conditions `[x]`.

## Owner-action checklist
- [ ] Sign G1 + G2 (`/orchestrator sprint-bulk`) and record `gates_signed:`. At G2, settle T2's batching design and T3's
      placement targets and admission-record shape.
- [ ] Rule the ADR text for T3 (Tier P: G1 + a read-through).

## Decisions (pre-locked)
- **D1** — `TECH-DEBT.md` is shared by T1 (TD-247) and T2 (TD-168). Commit in Plan order, T1 first, and stage per hunk.
- **D2** — The interim governance restriction applies until T3 replaces it. T1 is a defect fix (TD-247 C3). T2 meets a measured
  cost (TD-168: Rounds 17–18 and 23). Neither adds new governance machinery.
- **D3** — T3 runs last (`Depends-on: T1, T2`). The ADR it lands governs work admitted after it, not this sprint's own members.

## Assumptions
- **A1** — The 50% target is reachable by batching the five spawn loops Round 23 names, without changing a rule's verdict.
  *Confirm: G2 recon of the engine. If not reachable, T2 stops for a target ruling, never a quieter acceptance.*
- **A2** — The Windows host's before-figure (433.1 s, Round 23) still holds on today's tree. *Confirm: T2 re-measures before
  it changes the engine.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-124-close-epic-015-and-cut-the-engine.md`, created at promote (ADR-014;
> SPRINT-121 lesson).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close (STANDARD §10). -->
