---
sprint: 110
slug: retarget-the-gate
epic: EPIC-017
owner: Maintainer
last_updated: 2026-09-29
status: active
plan_commit: 4ddc80d
update_trigger: sprint execute/close events
---

# SPRINT-110 — Retarget the Gate

> **Theme:** `EPIC-017`'s fourth member, and the next leg of the path to `2.0.0`
> (`390 ∥ 391 → 383 · 392 → 381 → 380 → 371 → 372 → 373`). SPRINT-109 moved four guards onto member files.
> This sprint moves the rest of the gate: the two layers guards first, then the conformance engine,
> `qa-check.sh` and `night-run.sh`, which still read the v1 layout and so check nothing on a by-reference
> sprint. After it, `381` is unblocked, and then `380` (delete `TODO.md`).

## Scope

**In:** check-layers-completeness reads member files (`TASK-390`) · check-layers-observed reads member files
(`TASK-391`) · the conformance engine's `TODO.md` rules re-pointed at the store, with task files exempt from the
ownership header (`TASK-383`) · `qa-check.sh`'s TODO legs and `night-run.sh`'s `reap()` read the store (`TASK-392`).

**Out (deferred):** `TASK-381` (eval inventory, after this sprint) · `TASK-380` (delete `TODO.md`) · `TASK-384`
(dispositions for the four soft OVER-CAP files and the TD-174 forcing function) · `TASK-378` · `TASK-379` · `TASK-370` ·
`TD-188` (the shared member lookup drops an ambiguous id; T1/T2 import it read-only) · `TD-194` (worktrees cannot run
`typecheck`: D5 works around it, and does not fix it) · any release (D3).

## Members

- docs/work/todo/TASK-390-retarget-layers-completeness-onto-member-files.md
- docs/work/todo/TASK-391-retarget-layers-observed-onto-member-files.md
- docs/work/todo/TASK-383-retarget-conformance-and-gate-wiring.md
- docs/work/todo/TASK-392-retarget-qa-check-and-night-run.md

## Plan

### T1 — Retarget check-layers-completeness onto member task files `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/check-layers-completeness.ts` · `evals/run-layers-completeness-fixtures.sh` ·
  `evals/layers-completeness.test.ts` · `evals/layers-completeness-differential.ts` · `evals/fixtures/layers-completeness/`
Depends-on: none
Cites: `TASK-390` · EPIC-017 scope 4 · Codex r1 F1 · L-058 · L-166 · L-186 · `scripts/lib/sprint-members.ts` (imported, read-only)

Tier G. The guard compares what a task's DoD and Acceptance prose implies against its `Layers:`. On a
by-reference sprint that prose lives in the member's `## Done when`, so the guard reads a Plan with no DoD
and passes without examining anything.

**Acceptance:** on a v2 sprint, the guard reads each member's `## Done when` against the Layers that govern it, and
reddens on a planted undeclared file with its named finding. It also reddens on a sprint with no inline Plan
instead of passing vacuously. An isolated outside review is CLEAR.

### T2 — Retarget check-layers-observed onto member task files `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/check-layers-observed.ts` · `evals/run-layers-observed-fixtures.sh` ·
  `evals/run-layers-observed-differential.ts` · `evals/fixtures/layers-observed/` · `evals/layers-observed.test.ts` (new)
Depends-on: none
Cites: `TASK-391` · EPIC-017 scope 4 · Codex r1 F1 · ADR-039 · L-166 · L-186 · `scripts/lib/sprint-members.ts` (imported, read-only)

Tier G. Leg 15 attributes each commit to a task and checks the files it touched against that task's `Layers:`.
On a v2 sprint, a task is a member file, and a sprint with no inline Plan gives the guard nothing to attribute to.

**Acceptance:** on a v2 sprint, a commit attributed to a member that touches a file outside its Layers reddens
with its named finding. A sprint with no inline Plan reddens instead of passing vacuously. An isolated outside
review is CLEAR.

### T3 — Retarget the conformance engine onto the store `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` ·
  `evals/run-sprint-family-fixtures.sh` · `evals/run-ownership-header-fixtures.sh`
Depends-on: T1 · T2 (TASK-383's `depends-on`) · T4 (owns `scripts/lib/sprint-members-cli.ts`, G2 ruling R3)
Cites: `TASK-383` · its hand-off list (SPRINT-109 T1, `3c85e84`) · `spec/STANDARD.md` 0.12.0 §2 · §9 · §10 · §11 · ADR-045 · ADR-047 · D2 · `TODO.md` (named, not touched)

Tier G. The engine is what ships the standard to consumers, and seven of its rules still read `TODO.md` or a
Plan-copied DoD. On a v2 tree, each either FAILs on a file that no longer exists or checks nothing. Its
`_own_docs` sweep adds about 28 header FAILs on task files, which D2 rules exempt.

**Acceptance:** every rule on the hand-off list reads the store (or is retired with its replacement named), each
has a retained must-FAIL fixture, task files are exempt from S1.LAW3/S3.SCHEMA, and an isolated outside review
is CLEAR.

### T4 — Retarget qa-check and night-run onto the store `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/qa-check.sh` · `scripts/night-run.sh` · `evals/run-night-run-rollup-fixtures.sh` ·
  `evals/night-run-rollup.test.ts` · `evals/fixtures/night-run-rollup/` · `scripts/lib/sprint-members-cli.ts` (new) ·
  `evals/run-reap-terminal-fixtures.sh` · `evals/run-night-run-outcome-fixtures.sh` · `evals/fixtures/night-run-outcome/` ·
  `evals/run-revise-loop-ceiling-fixtures.sh` · `evals/fixtures/night-run-reaper/` · `skills/orchestrator/references/night-run.md`
Depends-on: T1 · T2 (TASK-392's `depends-on`)
Cites: `TASK-392` · night-run.md Part 4 (in Layers: its :516 is stale) · ADR-047 · L-020 · `TODO.md` (named, not touched)

Tier G. The gate's TODO-hygiene and Active Sprint legs read `TODO.md`, and `reap()` counts boxes in the sprint
file. So on a by-reference sprint the gate checks nothing and a night run reports `0 of 0`. The prose contract
(night-run.md Part 4) already counts member `## Done when` boxes, and the script follows it.

**Acceptance:** on a v2 tree, the gate's store legs and `reap()` count member files and redden on a planted
violation with a named finding, `reap()` matches a hand count on a real sprint, and an isolated outside review
is CLEAR.

## Decisions (pre-locked)
- **D1** — **`.ts` gates, carried from SPRINT-109's TASK-382 ruling** (owner, 2026-09-29). A Done-when's "(sh + ts)" is
  met by the checker `qa-check.sh` runs. Each `.sh` stays a Plan-path oracle for its differential, and the differential
  names the member exclusion. No new `.sh`, and no new shell logic (owner rule, 2026-09-09).
- **D2** — **The store is exempt from the ownership header** (owner, 2026-09-29, recorded in TASK-383). Task files carry
  their own schema (ADR-045) and status is the folder, so a `last_updated` there would be a second status source.
- **D3** — No release at close. The repo stays mixed and runs the installed 1.66.x skills. `CHANGELOG.md [Unreleased]`
  holds the 2.0 candidate (carried from SPRINT-109 D2).
- **D4** — `TASK-383` was split at this promote into `383` (engine) and `392` (qa-check, night-run), one per surface
  (owner, 2026-09-29). `380` and `381` now depend on both.
- **D5** — **After each merge, the coordinator runs the fast cross-cutting legs on `main`**: `typecheck` · corpus
  metadata · `gen-index --check` · layers-completeness over the sprint file. Not only the task's harness. This is L-218
  applied, because SPRINT-109 carried four such FAILs to its close.
- **D6** — `scripts/lib/sprint-members.ts` is shared, read-only. T1–T4 import it and none edits it. `TD-188` stays out of
  scope, and a guard that needs it fixed raises a scope-change.

## Assumptions
- **A1** — On a v2 sprint, the governing Layers for a member come from the Plan block whose `Cites:` names it. When a
  sprint has no inline Plan, they come from the member's `## Touches`. *Confirm: T1/T2 recon, before building (SPRINT-109's
  A3 was false because a premise of shape went unchecked).*
- **A2** — `TASK-363`'s stale candidate-file inventory (15 → 24 · 38 · 50, by selector) is re-derived per guard.
  *Confirm: T1/T2 recon, two selection routes (L-198).*
- **A3** — T3 changes where rules read, not what they mean, so `spec/STANDARD.md` §14 needs no edit. *Confirm: T3 recon. If
  a rule is retired (`S11.TODOCAP`), §14's row changes, and that is a scope-change adding the spec to T3's Layers.*
- **A4** — T4's `qa-check.sh` edits are confined to the store legs. T1/T2 need no change to how the gate invokes them.
  *Confirm: T1/T2 recon. If either needs `qa-check.sh`, T4 owns the file and theirs lands as its own hunk (L-042).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-110-retarget-the-gate.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
