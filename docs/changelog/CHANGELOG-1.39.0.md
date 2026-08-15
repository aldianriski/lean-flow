---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.39.0

> Rotated out of the root `CHANGELOG.md` when **v1.41.0** landed (§11: keep current + previous minor
> inline). Older releases → [`CHANGELOG-1.38.0.md`](CHANGELOG-1.38.0.md).

## v1.39.0 — The Critic Loop (2026-08-15)

MINOR — SPRINT-065, **3 of 3 units**, the fourth and final member sprint of **EPIC-002 Make Room**
(only its T2 is epic-tracked; T1 and T3 are EPIC-004-shaped, from `docs/research/gauntlet-loop-delta.md`).
The first build from the gauntlet-loop scan: what the critic measures against, and its worst finding
feeding back to the builder. **EPIC-002 closes and archives with this sprint** — every member sprint
closed, all four Closed-when conditions `[x]`.

**What changed for you**

- **The review pass now feeds a bounded builder retry.** `review-scoping.md` § The revise loop: a
  scoped reviewer's single worst finding **per axis** is handed back to the builder for **one retry
  per review pass, total**, re-reviewed, and the outcome logged as a `progress` entry. **Attended
  modes only** (`quick` · `mvp` · `sprint-bulk` with a human present) — unattended never retries; that
  charter fork is TASK-203, deliberately left open. Hooked from `orchestrator/SKILL.md` § Review.
  Closes the L-020 gap where the worst-finding-per-axis was computed and nothing consumed it.
  Exercised on its own diff (both axes' violations fixed, re-review cleared) and on a planted
  must-FAIL fixture per axis (`evals/fixtures/revise-loop/`, retained — TD-012).
- **The Spec axis measures against what predates the task.** It previously compared work to the task's
  own `done-when` — written by the same pipeline that built the work. It now takes the first rung that
  exists on a **comparand ladder**: the template the artifact renders against · a retained must-FAIL
  fixture · a `check-*.sh` named finding · the task's `Cites:` line. `done-when` is the fallback, not
  the default — and a fallback must announce itself in the report.
- **`Cites:` is now a defined field.** In real use across 17 of 65 sprints while defined nowhere,
  parsed and then deliberately discarded by the dispatch preflight — `SPRINT.md.template` documents it
  as optional-but-load-bearing, with the preflight's exclusion stated inline so a `Layers:` path is
  not parked there.

**Maintainer-facing**

- **EPIC-002 Make Room closed and archived** — the first epic through §11's archival leg. Condition 1
  (headroom) re-worded from a flat percentage to **sprints of growth** (ADR-017's prior ruling
  applied, not an escape invented at close): `CLAUDE.md` 63/80 ≈ 20 sprints · `CONTEXT.md` 132/150 ≈
  21 sprints at the measured 0.83 lines/sprint, with `CONTEXT.md` untrimmed — T1 deliberately spent
  **0** of its lines.
- Filed: **TD-056** (a bare `check-layers-observed.sh` exits 0 having checked nothing — the silent-skip
  family) · **L-121** (a DoD box that performs a later phase's work is untickable by construction).
  TASK-203 (unattended retry ruling) unblocked → `ready`.
