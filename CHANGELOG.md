---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.40.0 — Verification Authority (2026-08-15)

MINOR — SPRINT-066, **2 of 2 units**. Two ADR-grade rulings that decide *who may say no* — the
boundary the second gauntlet audit's remainder funnels through, settled before anything is built on
it (TASK-208/209 unblock with this release).

**What changed for you**

- **ADR-021 — mechanical evidence gates the silent path, never the owner.** Where a task's
  `done-when` names a mechanical check, that check's FAIL now blocks the *silent* DoD tick: the
  coordinator surfaces it and gets a **recorded owner ruling** (the override is always available —
  the owner is never gated). The consumer's CI is never run as a blocker on lean-flow's own
  authority. G2 gains one checklist line: each `done-when` notes its verification method where a
  mechanical check exists. Wired: `orchestrator/SKILL.md` § G2 · `review-scoping.md` § QA suggestion
  (the evidence boundary) · CONTEXT.md § Gates.
- **ADR-022 — unattended retry: the mechanical-trigger carve-out.** The revise loop may fire inside
  an unattended run only when **three prior human decisions** exist: the trigger is a
  `done-when`-named check FAIL (the ADR-021 class — a critic's *judgment* finding always parks), the
  ceiling is the owner-ruled one-retry-per-pass, and the repo's **declared policy** enables it
  (absence of the policy = never — absence ≠ consent). One rollup line per firing. Wired:
  `night-run.md` Part 0 boundary rows + Part 4 retry line · `review-scoping.md` § The revise loop ·
  SKILL.md § Review · CONTEXT.md.
- **The revise loop's first production firing was on its own extension.** T2's scoped review caught
  the superseded "unattended never retries" line surviving in two consumer touchpoints (the L-020
  shape); one bounded retry fixed both axes' findings; the delta re-review confirmed with no second
  firing.

**Maintainer-facing**

- Filed: **L-122** (brief the Spec axis with the decision as logged — it turns the wiring check into
  a mechanical matcher) · a sighting note on **TD-052** (two more procedural gates, each naming its
  control at authoring time — the third-gate trigger did not fire). TASK-207/203 shipped;
  TASK-208/209 → `ready`. The plugin-reinstall owner action carries a second sprint — installed
  cache 1.38.0 vs repo 1.40.0.

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

_Older releases (**v1.38.0** and earlier) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
