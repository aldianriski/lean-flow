---
id: TASK-363
title: "Retarget the layers guards onto member task files"
epic: EPIC-017
priority: P1
size: L
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
depends-on: [TASK-360, TASK-362]
---

# TASK-363 — Retarget the layers guards onto member task files

## Done when

- [ ] check-layers-completeness (sh + ts) and check-layers-observed (sh + ts) read Layers from member task files; per guard a retained must-FAIL fixture with its named finding plus one fixture varying the selection (L-186); worktree-isolated outside review (L-165 · L-168).
- [ ] A v2 sprint with **no inline Plan** makes each retargeted guard examine member files, never pass vacuously — retained must-FAIL fixture per guard (Codex r1 F1).

## Amended 2026-09-23

- **Narrowed 2026-09-23 (Codex r1 · r2).** Scope is the Plan-shape layers guards only: check-layers-completeness (sh + ts) and check-layers-observed (sh + ts), plus their eval harnesses. dod-delta and verify-reaches moved to TASK-387; authority and task-origin to TASK-382; the conformance engine, qa-check wiring and night-run to TASK-383. Deleting TODO.md moved to TASK-380.
- The '15 executables' figure is stale: two selectors on 2026-09-23 found 24 candidate files across scripts/ + evals/ (Codex r1: 38 vs 50 over a wider scope). Re-derive the inventory before starting (L-130 · L-198).
- Superseded done-when (was, under the title "Retarget every checker that parses TODO.md, then delete TODO.md"): All 15 executable files referencing TODO.md read the store instead; `TODO.md` is deleted; **zero non-test references remain** across `scripts/`, `evals/`, `skills/` — derived mechanically, never asked of the author (L-172). **Tier G bar**: per retargeted check, a retained must-FAIL fixture failing with its *named* finding, plus one fixture that varies the **selection** rather than the verdict — a member reached by the other glob arm (L-186). Outside reviewer, worktree- isolated (L-165 · L-168).

## Touches

scripts/lib/check-*.{sh,ts} · evals/ · skills/ · 3 ADRs

## Assumes

that 15 is the true count — **re-derive before starting**; it was measured once,
on 2026-09-21, and a frozen figure is a query result (L-130)

## Tracker

EPIC-017 scope 4 · ADR-019
