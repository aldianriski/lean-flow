---
id: TASK-383
title: "Retarget the conformance engine, qa-check and night-run onto the store"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-377, TASK-390, TASK-391, TASK-387, TASK-382]
---

# TASK-383 — Retarget the conformance engine, qa-check and night-run onto the store

## Done when

- [ ] Conformance rules keyed to TODO.md re-point to the store per TASK-377's contract; the engine ships the layout to consumers.
- [ ] qa-check.sh and night-run.sh read the store.
- [ ] Retained must-FAIL fixture per changed rule; outside review, worktree-isolated.

## Touches

scripts/lib/conformance-engine.sh · scripts/qa-check.sh · scripts/night-run.sh

## Assumes

none

## Amended 2026-09-28

- **Hand-off from TASK-377 (SPRINT-109 T1, `3c85e84`).** STANDARD 0.12.0 describes the store. These engine rules still read the
  v1 layout and are this task's to retarget (all in `scripts/lib/conformance-engine.sh`):
  - `assert_S11_TODOCAP` (~2475): reads TODO.md's line count via `_s2_cap_for "TODO.md"`. Retire it, or detect a v1 tree → migrate. Its message ("prunes it with the user") is stale.
  - `assert_S11_BACKLOG` (~2546): reads TODO.md § Backlog breadcrumbs. Retarget to §11's done/·cancel/ prune (closed ≥3 sprints, not live-named, never the highest id).
  - `assert_S10_FOURBUCKETS` (~2233, list at ~2250): counts a TODO.md touch as the follow-ups bucket. It must count an added `docs/work/backlog/TASK-*.md`.
  - `_s2_cap_for` (~1993): keys on the File cell containing "TODO.md". Keep §2's retired row until S11.TODOCAP is retired (`index()` matches the first row).
  - `assert_S9_PLANFROZEN` (~2081) / `assert_S9_SCOPECHANGE` (~2126): compare § Plan only, so they miss a member `## Done when` edit. Retarget to the ADR-047 freeze.
  - `assert_S9_VERIFYCLAUSE` (~2174): greps `- [x]` in the sprint file, so it always reports nothing to verify on a by-reference sprint.
  - `_own_docs` (~1154-1159): lists TODO.md, and `find docs` sweeps task files → about 28 S1.LAW3/S3.SCHEMA FAILs. This needs a ruling: exempt the store, or require the header.
  - Outside the engine: `qa-check.sh` ~654, 819-828, 870 (TODO hygiene, Active Sprint).

## Amended 2026-09-26

- Carried from SPRINT-107 T4: `scripts/night-run.sh` `reap()` still counts `- [x]`/`- [ ]` in the sprint FILE and `### Tn` blocks there. The prose contract (`skills/orchestrator/references/night-run.md` Part 4) now counts `## Done when` boxes across member files (Members ∪ `sprint:` stamps), and a unit is delivered when every member its `Cites:` names has no open box. On a by-reference sprint the script reports `0 of 0`. The contract leads, so retarget the script to it.

## Tracker

EPIC-017 scope 6 · moved from TASK-365
