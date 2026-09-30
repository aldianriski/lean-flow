---
id: TASK-383
title: "Retarget the conformance engine onto the store"
epic: EPIC-017
sprint: SPRINT-110
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

# TASK-383 — Retarget the conformance engine onto the store

## Done when

- [x] Conformance rules keyed to TODO.md re-point to the store per TASK-377's contract; the engine ships the layout to consumers. ✓ `cbc6464` (merged `dffbcb1`): `_own_docs` exempts `docs/work/<status>/TASK-*.md` (D2); TODOCAP only while TODO.md exists and points at migrate on a store tree (R2; v1 text unchanged, owner-accepted); BACKLOG gains the §11 store prune; FOURBUCKETS counts an added backlog task; TWOFILES/VERIFYCLAUSE/PLANFROZEN read members via the CLI and check-sprint-by-reference (ADR-049, `bun-required`). SCOPECHANGE stays on § Plan, with the member freeze in PLANFROZEN (owner-accepted split). v1 parity: 354 fixture trees + 109 archived plans byte-identical; real repo 77 → 20 FAILs, every line explained.
- [x] Retained must-FAIL fixture per changed rule; outside review, worktree-isolated. ✓ ~72 retained v2 cases with controls across 3 harnesses (all green); seeded breaks for every new branch (S2c an equivalent mutant, S2d the real break); isolated review CLEAR (~8 probes, 4 census-zero/TD).

## Touches

scripts/lib/conformance-engine.sh · its eval harness + fixtures

## Assumes

none

## Amended 2026-09-29

- **Split at the SPRINT-110 promote (owner, 2026-09-29).** `qa-check.sh` and `night-run.sh` moved to `TASK-392`, one task
  per surface, the way `TASK-363` split into `390`/`391`. This task keeps the conformance engine.
- **`_own_docs` ruling (owner, 2026-09-29): exempt the store.** Task files carry their own schema (ADR-045), and status is the
  folder. So the engine skips `docs/work/*/TASK-*.md` for S1.LAW3/S3.SCHEMA, and does not require an ownership header there.

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
  - Outside the engine: `qa-check.sh` ~654, 819-828, 870 → moved to `TASK-392` (split 2026-09-29).

## Tracker

EPIC-017 scope 6 · moved from TASK-365
