---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

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

## v1.38.0 — Where It Fires (2026-08-14)

MINOR — SPRINT-064, **3 of 3 units**, the third member sprint of **EPIC-002 Make Room** (only its T1 is
epic-tracked). Three governance mechanisms that existed and did not reach. In all three the rule was
already written, already correct, and gated on something that could not reach the failure.

**What changed for you**

- **Worktree-dispatched agents no longer write the Execution Log.** `dispatch.md` previously said an
  agent "never touches a file the overlap map marks shared". That map is derived from each task's
  `Layers:`, and **sprint infrastructure is declared by no task** — so it could never be marked, and the
  clause could never fire for it. `coordinator-owned` is now defined as a **class** with its members
  named: the sprint **Plan file** (DoD ticks · § Files Changed) and its **Execution Log** sibling. A
  dispatched agent **returns its Log entry inside its report**; the coordinator appends at merge-back.
  Wired at both decision points — `orchestrator/SKILL.md` step 2 (where the overlap map is built) and
  `dispatch.md` § Worktree dispatch protocol (where the brief is written).
  *Symptom this fixes:* SPRINT-063 dispatched one agent and ended with **two copies of one Execution
  Log**, merged by hand — from a brief that correctly banned editing § Plan and ticking DoD and said
  nothing about the Log.

**Maintainer-facing**

- **A promoted rule became an action.** The "match by shape, not substring" guard (L-108) had been
  correctly placed in `CONTEXT.md` § Gates and *loaded in context* for all eleven of its sightings,
  reaching none. Sorting them by the flow that was running showed **8 of 11 were ad-hoc verification
  queries inside a governance pass** — where § Gates is already loaded, so the file was never the
  defect. Every instance ever caught was caught by **a second number that disagreed**, never by recalling
  the rule. It is now `.claude/CLAUDE.md` § Behavioral Guidelines, phrased as a required cross-check.
- **One §11 collapse pass applied to `docs/LEARNINGS.md` — applied count 0.** 96 entries (64 active, 31
  promoted, 1 superseded); all 31 promoted already carry their pointer. With SPRINT-063's
  `docs/research/` pass, **both §11 legs are now applied**, each returning zero with the evidence rule
  honoured.
- `L-108` → count 6 · `L-113` → count 2 (promotable at the next promote).

**Known gaps, named rather than closed:** `complete` is a reserved run-level event in the Execution Log
and the template does not say so — writing it to mean "this task finished" silently arms the Part 4
rollup assertions (`TD-055`). The new cross-check rule is procedural text and skill prose has no fixture
harness, so it ships with a walkthrough rather than a retained test (`TD-052`, whole category).

_Older releases (**v1.37.0** and earlier) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
