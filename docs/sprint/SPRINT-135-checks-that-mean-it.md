---
sprint: 135
slug: checks-that-mean-it
owner: Maintainer
last_updated: 2026-10-21
status: active
gates_signed: G1,G2 @ 0fd8c5fd
plan_commit: 2016abf7
update_trigger: sprint execute/close events
---

# SPRINT-135 — Checks That Mean It

> **Theme:** a fixes-only sprint. Three existing checkers stop passing what they exist to catch, and one §11 rule says what it
> already means. It comes before new work because EPIC-005 is parked under ADR-053's freeze, and defect fixes are what the
> freeze leaves open. Ships as a PATCH.

## Scope

**In:** the close check keys on the reaper's tag (`470`, TD-232 + the rest of TD-233) · the review-depth check fails an
out-of-vocabulary class (`471`, TD-244) · the scope-change check stops reading a prose fragment as a path (`472`, TD-263) ·
§11 states that only `.md` files are live citations (`473`, TD-262).
**Out (deferred):** the other open TD rows (32 medium in all, not three) · EPIC-005 (parked) · TASK-366, 367, 402 · any new
checker, leg or ledger field (ADR-053).

## Members

- docs/work/todo/TASK-470-the-close-check-counts-only-a-reaper-tagged-terminal-line.md
- docs/work/todo/TASK-471-the-review-depth-check-fails-an-out-of-vocabulary-consequence-line.md
- docs/work/todo/TASK-472-the-scope-change-check-stops-reading-a-prose-fragment-as-an-undeclared-path.md
- docs/work/todo/TASK-473-section-11-counts-only-md-files-as-live-citations.md

## Plan

### T1 — Key the close check on the reaper's tag `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-sprint-by-reference.ts` · `evals/run-by-reference-fixtures.ts` · `evals/fixtures/by-reference/`
  · `skills/orchestrator/references/night-run.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-470-the-close-check-counts-only-a-reaper-tagged-terminal-line.md`
  · `docs/work/in_progress/TASK-470-the-close-check-counts-only-a-reaper-tagged-terminal-line.md`
  · `docs/work/done/TASK-470-the-close-check-counts-only-a-reaper-tagged-terminal-line.md`
Depends-on: none
Cites: `TASK-470` · TD-232 · TD-233 · TD-122 · ADR-050 · `scripts/night-run.sh` · `scripts/lib/check-night-run-rollup.ts`

Consequential G: the orchestrator skill names this check as the host's close gate. The negative case is SPRINT-119's log before
the reaper ran; the full archived log is the passing control.

**Acceptance:** `--close` refuses a terminal line the reaper did not write, and Part 4 names the header the rollup checker reads.

### T2 — Fail an out-of-vocabulary consequence line `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-review-depth.sh` · `evals/run-review-depth-fixtures.sh` · `evals/fixtures/review-depth/` ·
  `TECH-DEBT.md`
  · `docs/work/todo/TASK-471-the-review-depth-check-fails-an-out-of-vocabulary-consequence-line.md`
  · `docs/work/in_progress/TASK-471-the-review-depth-check-fails-an-out-of-vocabulary-consequence-line.md`
  · `docs/work/done/TASK-471-the-review-depth-check-fails-an-out-of-vocabulary-consequence-line.md`
Depends-on: none
Cites: `TASK-471` · TD-244 · TD-092 · `skills/orchestrator/references/review-scoping.md`

Other G. The real-artifact run is SPRINT-121's log replayed outside `archive/`, because no live log exists to run on.

**Acceptance:** a misspelled class fails by name, even on a task that already has a review record.

### T3 — Stop reading a prose fragment as an undeclared path `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-sprint-by-reference.ts` · `evals/run-by-reference-fixtures.ts` · `evals/fixtures/by-reference/` ·
  `TECH-DEBT.md`
  · `docs/work/todo/TASK-472-the-scope-change-check-stops-reading-a-prose-fragment-as-an-undeclared-path.md`
  · `docs/work/in_progress/TASK-472-the-scope-change-check-stops-reading-a-prose-fragment-as-an-undeclared-path.md`
  · `docs/work/done/TASK-472-the-scope-change-check-stops-reading-a-prose-fragment-as-an-undeclared-path.md`
Depends-on: T1 (same checker, D1)
Cites: `TASK-472` · TD-263 · L-234

Other G (`--scope-change` is maintainer-only). The exception is narrow: a fragment that resolves to no path, corroborated by a
full path in the same entry.

**Acceptance:** SPRINT-133's heading shape passes without the Cites workaround, and a real directory is never widened.

### T4 — State §11's live-citation scope `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/done/TASK-438-make-the-coordinators-tick-step-run-the-gates-checkers.md`
  · `docs/work/todo/TASK-473-section-11-counts-only-md-files-as-live-citations.md`
  · `docs/work/in_progress/TASK-473-section-11-counts-only-md-files-as-live-citations.md`
  · `docs/work/done/TASK-473-section-11-counts-only-md-files-as-live-citations.md`
Depends-on: none
Cites: `TASK-473` · TD-262 · owner ruling 2026-10-21 · STANDARD §11 · §15

Tier P. The ruling matches what the engine already scans, so no checker verdict moves (a spec PATCH by §15's test).

**Acceptance:** §11 says only tracked `.md` files count, TASK-438 is pruned, and TD-262 is resolved.

## Decisions (pre-locked)

- **D1** — `scripts/lib/check-sprint-by-reference.ts` and its fixture runner are shared by T1 and T3: T1 commits first, T3 after.
  `TECH-DEBT.md` is shared by all four, each resolving its own rows; stage it per hunk and read `git diff --cached`. `CHANGELOG.md`
  is the coordinator's, at close. Status moves the Layers do not declare, and log or sprint-file edits, commit as bare
  `sprint(135):` (CONTEXT § Sprint model, L-238).

## Assumptions

- **A1** — `reap()` is the only writer of the `[derived]` tag. *Confirm: G2.*
- **A2** — TASK-438 is pruned at T4's move to `done/`, once TASK-473's own mention of it is history. *Confirm: G2.*
- **A3** — no shipped skill or template restates §11's citation scope in a way the T4 wording would contradict. *Confirm: G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-135-checks-that-mean-it.md`](logs/SPRINT-135-checks-that-mean-it.md) (STANDARD §9 ·
> ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
