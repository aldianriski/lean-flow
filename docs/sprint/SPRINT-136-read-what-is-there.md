---
sprint: 136
slug: read-what-is-there
owner: Maintainer
last_updated: 2026-10-22
status: active
plan_commit: eb7974d6
gates_signed: G1,G2 @ 861b428e
update_trigger: sprint execute/close events
---

# SPRINT-136 — Read What Is There

> **Theme:** the second fixes-only TD burn-down. Three checkers skip or misread input they are given: epic boxes written `[X]`
> or indented, a Cap cell whose first number is not the cap, a `Verify:` clause naming a TypeScript checker. A fixture harness
> also defines one helper twice. Defect fixes only, which ADR-053 leaves unfrozen. Ships as a PATCH.

## Scope

**In:** epic checkbox forms and the empty member list at archive (`474`, TD-130 + TD-148 item 1) · the Cap cell read from its
start (`475`, TD-062) · TypeScript checkers in `Verify:` clauses (`476`, TD-191) · one name per helper (`477`, TD-172).
**Out (deferred):** TD-163 and TD-165 (burn-down #3) · the frozen-machinery rows (TD-153 · 152 · 212 as a leg · 166 · 164 ·
052) · owner-ruling rows (TD-155 · 134 · 061) · TASK-367's measurements (TD-117 · 090) · TD-201 (consequential night-run) ·
TD-081 (the pinned tally) · the conformance engine's own §2 parser (not named by TD-062).

## Members

- docs/work/todo/TASK-474-epic-checks-read-every-checkbox-form-and-an-empty-member-list-earns-nothing-at-archive.md
- docs/work/todo/TASK-475-doc-caps-reads-the-cap-only-from-the-start-of-the-cell.md
- docs/work/todo/TASK-476-verify-reaches-recognises-a-typescript-checker.md
- docs/work/todo/TASK-477-one-name-per-helper-in-the-sprint-family-harness.md

## Plan

### T1 — Read every epic checkbox form; an empty member list earns nothing at archive `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-epic-archive.ts` · `evals/epic-archive.test.ts` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-474-epic-checks-read-every-checkbox-form-and-an-empty-member-list-earns-nothing-at-archive.md`
  · `docs/work/in_progress/TASK-474-epic-checks-read-every-checkbox-form-and-an-empty-member-list-earns-nothing-at-archive.md`
  · `docs/work/done/TASK-474-epic-checks-read-every-checkbox-form-and-an-empty-member-list-earns-nothing-at-archive.md`
Depends-on: none
Cites: `TASK-474` · TD-130 · TD-148 · `scripts/lib/check-epic-archive.sh` · `evals/epic-archive-differential.test.ts` ·
  `scripts/qa-check.sh`

Other G: the checker's only caller is maintainer QA. Regression cases go in the TypeScript suite, so the frozen Shell/TS
differential population does not grow.

**Acceptance:** `[X]` and indented boxes count everywhere the checker reads them, and an empty member list is named at archive.

### T2 — Read the cap from the start of the Cap cell `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-doc-caps.ts` · `evals/doc-caps.test.ts` · `evals/fixtures/doc-caps/` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-475-doc-caps-reads-the-cap-only-from-the-start-of-the-cell.md`
  · `docs/work/in_progress/TASK-475-doc-caps-reads-the-cap-only-from-the-start-of-the-cell.md`
  · `docs/work/done/TASK-475-doc-caps-reads-the-cap-only-from-the-start-of-the-cell.md`
Depends-on: none
Cites: `TASK-475` · TD-062 · `spec/STANDARD.md` · `scripts/lib/check-doc-caps.sh` · `evals/run-doc-caps-differential.ts`

Other G. The real §2 tables must yield exactly today's rows.

**Acceptance:** a Cap cell whose digits do not lead is a named finding, and every real cap reads as it does today.

### T3 — Recognise a TypeScript checker in a Verify clause `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-verify-reaches.ts` · `evals/run-verify-reaches-fixtures.sh` · `evals/fixtures/verify-reaches/` ·
  `TECH-DEBT.md`
  · `docs/work/todo/TASK-476-verify-reaches-recognises-a-typescript-checker.md`
  · `docs/work/in_progress/TASK-476-verify-reaches-recognises-a-typescript-checker.md`
  · `docs/work/done/TASK-476-verify-reaches-recognises-a-typescript-checker.md`
Depends-on: none
Cites: `TASK-476` · TD-191 · `scripts/qa-check.sh`

Other G. The real-artifact run replays the motivating clause, since archived files are skipped by design.

**Acceptance:** a `Verify:` clause naming a `.ts` checker is mechanical, with absent, present and unreachable controls.

### T4 — One name per helper in the sprint-family harness `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `evals/run-sprint-family-fixtures.sh` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-477-one-name-per-helper-in-the-sprint-family-harness.md`
  · `docs/work/in_progress/TASK-477-one-name-per-helper-in-the-sprint-family-harness.md`
  · `docs/work/done/TASK-477-one-name-per-helper-in-the-sprint-family-harness.md`
Depends-on: none
Cites: `TASK-477` · TD-172

Tier X: a behaviour-preserving rename.

**Acceptance:** each helper name has one definition, and the harness's output is unchanged.

## Decisions (pre-locked)

- **D1** — The four tasks touch disjoint checker files, so they can run in parallel. `TECH-DEBT.md` is shared by all four: the
  coordinator writes each resolution, staged per hunk. `CHANGELOG.md` is the coordinator's, at close. Status moves the Layers
  do not declare, and log or sprint-file edits, commit as bare `sprint(136):` (CONTEXT § Sprint model, L-238).

## Assumptions

- **A1** — A TypeScript-only fix keeps the frozen Shell/TS differential tests green for T1 and T2, because no existing
  differential fixture uses the newly read forms. *Confirm: G2, by running each differential once.*
- **A2** — The conformance engine's own §2 parser is out of scope: TD-062 names only the doc-caps reader. *Confirm: G2.*
- **A3** — `bun <path>` and a bare `.ts` path are the only TypeScript forms a `Verify:` clause uses. *Confirm: G2 census.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-136-read-what-is-there.md`](logs/SPRINT-136-read-what-is-there.md) (STANDARD §9 ·
> ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
