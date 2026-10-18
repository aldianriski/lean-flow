---
sprint: 128
slug: planning-debt
epic: EPIC-022
owner: Maintainer
last_updated: 2026-10-18
status: active
plan_commit: 03ec7bb1
gates_signed: G1,G2 @ fc0043b1
update_trigger: sprint execute/close events
---

# SPRINT-128 — Planning Debt

> **Theme:** EPIC-022's fourth and last slice. A Plan's `Layers:` · `Cites:` · `### Tn` lines are read by about eight heading
> regexes, six `Cites:` readers and three token extractors that disagree, and the member resolver drops what it cannot resolve.
> This sprint gives the Plan one parser, moves every TS reader onto it, makes the resolver name its anomalies, retires the Shell
> twins the gate no longer runs, and closes the edge cases that have real occurrences. It closes EPIC-022.

## Scope

**In:** one shared Plan parser + the two Layers checkers (`443`) · the remaining readers onto it (`444`) · a resolver that names
anomalies (`445`) · the Shell twins and the reaper's v1 branch retired (`446`) · the live freeze and declaration edges (`447`).
**Out (deferred):** porting the shipped dispatch preflight to TS (TD-045, retained by design) · the dod-delta cluster (TD-166 · 192 ·
221 · 226 · 231) · gate cost (TD-090 · 165 · 171) · TD-191 · 204 · 125 · 099 · TASK-322 · 366 · 367 · 402.

## Members

- docs/work/todo/TASK-443-one-shared-plan-parser-for-the-layers-checkers.md
- docs/work/todo/TASK-444-move-the-remaining-plan-readers-onto-the-shared-parser.md
- docs/work/todo/TASK-445-member-resolver-names-anomalies.md
- docs/work/todo/TASK-446-retire-the-shell-twins-the-gate-no-longer-runs.md
- docs/work/todo/TASK-447-close-the-live-freeze-and-declaration-edge-cases.md

## Plan

### T1 — One shared Plan parser for the Layers checkers `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/sprint-members.ts` · `scripts/lib/check-layers-completeness.ts` · `scripts/lib/check-layers-observed.ts`
  · `evals/`
  · `docs/work/todo/TASK-443-one-shared-plan-parser-for-the-layers-checkers.md`
  · `docs/work/in_progress/TASK-443-one-shared-plan-parser-for-the-layers-checkers.md`
Depends-on: T4
Cites: `TASK-443` · EPIC-022 Closed-when 7 · ADR-050 (consequential: `conformance.sh` reaches the module) · TD-138 · TD-178 ·
  TD-215 · TD-248 · bare names as the member spells them: `sprint-members.ts` · `check-layers-completeness.ts` ·
  `check-layers-observed.ts`

The parser lives where the resolver already does, so every later reader imports one module.

**Acceptance:** both Layers checkers read Plans only through the shared parser, and give unchanged verdicts on the archived corpus
apart from the named anomalies.

### T2 — Move the remaining Plan readers onto the parser `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-authority.ts` · `scripts/lib/check-sprint-by-reference.ts` · `scripts/lib/sprint-members-cli.ts`
  · `scripts/lib/check-dod-delta.ts` · `evals/`
  · `scripts/lib/check-layers-completeness.ts` · `scripts/lib/check-layers-observed.ts`
  · `docs/work/todo/TASK-444-move-the-remaining-plan-readers-onto-the-shared-parser.md`
  · `docs/work/in_progress/TASK-444-move-the-remaining-plan-readers-onto-the-shared-parser.md`
Depends-on: T1
Cites: `TASK-444` · EPIC-022 Closed-when 7 · TD-199 · TD-189 · bare names as the member spells them: `check-authority.ts` ·
  `check-sprint-by-reference.ts` · `sprint-members-cli.ts` · `check-dod-delta.ts` · `conformance.sh`

Two of these readers are what `conformance.sh` runs, so the proof is the conformance differential, not the reading.

**Acceptance:** every TS Plan reader uses one parser, a `Cites:` mention no longer governs a member, and `conformance.sh .` is
verdict-identical.

### T3 — The member resolver names anomalies `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/sprint-members.ts` · `scripts/lib/check-authority.ts` · `scripts/lib/check-layers-completeness.ts`
  · `scripts/lib/check-layers-observed.ts` · `scripts/lib/check-verify-reaches.ts` · `scripts/lib/check-task-origin.sh`
  · `evals/`
  · `docs/work/todo/TASK-445-member-resolver-names-anomalies.md`
  · `docs/work/in_progress/TASK-445-member-resolver-names-anomalies.md`
Depends-on: T1, T2
Cites: `TASK-445` · EPIC-022 Closed-when 7 · TD-188 · TD-190 · TD-198

It follows the parser work because it edits the same files; the depends-on is ownership, not logic.

**Acceptance:** a duplicate, missing or misplaced member is named by every caller, and today's corpus moves no verdict.

### T4 — Retire the Shell twins the gate no longer runs `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-layers-observed.sh` · `scripts/lib/check-authority.sh` · `scripts/lib/check-layers-completeness.sh`
  · `scripts/night-run.sh` · `scripts/qa-check.sh` · `evals/` · `skills/orchestrator/references/dispatch.md`
  · `skills/orchestrator/references/night-run.md`
  · `docs/work/todo/TASK-446-retire-the-shell-twins-the-gate-no-longer-runs.md`
  · `docs/work/in_progress/TASK-446-retire-the-shell-twins-the-gate-no-longer-runs.md`
Depends-on: none
Cites: `TASK-446` · EPIC-022 Closed-when 7 · TD-049 · ADR-050 #3 · ADR-046 (v1 refused) · ADR-053 (a deletion is unfrozen) ·
  bare names as the member spells them: `check-layers-observed.sh` · `check-authority.sh` · `check-layers-completeness.sh` ·
  `dispatch.md` · `night-run.md`

It runs first: once the twins are gone, no later task has to mirror a Shell copy, and its eval edits overlap theirs.

**Acceptance:** the two Shell twins and the reaper's v1 branch are gone, no prose names them as live, and both gate profiles stay
green.

### T5 — Close the live freeze and declaration edge cases `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/conformance-engine.sh` · `scripts/lib/check-handoff-state.sh` · `scripts/lib/check-research-archive.sh`
  · `scripts/lib/check-sprint-by-reference.ts` · `scripts/lib/check-layers-observed.ts`
  · `skills/orchestrator/references/dispatch.md` · `evals/`
  · `docs/work/todo/TASK-447-close-the-live-freeze-and-declaration-edge-cases.md`
  · `docs/work/in_progress/TASK-447-close-the-live-freeze-and-declaration-edge-cases.md`
Depends-on: T2, T3, T4
Cites: `TASK-447` · EPIC-022 Closed-when 7 · TD-131 · TD-205 · TD-177 · TD-138 (preflight side) · ADR-053 (TD-177's finding) ·
  bare names as the member spells them: `dispatch.md`

Each case has real occurrences; the shipped preflight wording also takes the Codex review.

**Acceptance:** no frontmatter verdict depends on the host's awk, a late member-edit scope-change is caught, a dead `Layers:`
token is named, and the preflight names a column-0 wrap.

## Decisions (pre-locked)

- **D1** — Shared files and their order: `sprint-members.ts`, `check-layers-completeness.ts` go T1 → T3; `check-authority.ts`
  T2 → T3; `check-layers-observed.ts` T1 → T3 → T5; `check-sprint-by-reference.ts` T2 → T5; `dispatch.md` T4 → T5; the waves run T4 → T1 → T2 → T3 → T5, since every task edits `evals/`. New fixtures
  extend existing harnesses; only T4 edits `scripts/qa-check.sh`. `CHANGELOG.md`, `TECH-DEBT.md`, this file, its log and the
  member files are coordinator-owned.
- **D2** — Owner rulings at intake (2026-10-18): the parser covers every TS reader, with the full Tier G bar on the conformance-
  reached parts · retire the observed and authority Shell twins, keep the completeness one as the preflight's parity oracle ·
  TD-045 retained by design · fixed and census-zero rows closed at this promote.

## Assumptions

- **A1** — The consolidation preserves behaviour: today's verdicts are reproduced on all 127 archived plans and every fixture, apart
  from the cases that gain a named finding. *Confirm: T1's and T2's differential runs.*
- **A2** — `check-layers-completeness.sh` sources `layers_tokens` from the observed twin, so it moves before the delete. *Confirm: T4.*
- **A3** — The reaper's v1 branch is unreachable, since v1 trees are refused (ADR-046). *Confirm: T4's G1, before any delete.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-128-planning-debt.md`, created at promote with its `promote` entry first.
> Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
