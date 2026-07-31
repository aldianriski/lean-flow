---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file**
> - **Session start** — `/prime`; read this before touching code.
> - **`/triage`** grooms the Backlog (re-rank, state, route rejects to `.out-of-scope/`).
> - **`/lean-doc-generator promote`** forms a sprint from `ready` Backlog tasks → `docs/sprint/`.
> - **`/orchestrator sprint-bulk`** builds it; **`/lean-doc-generator close`** runs the Retro → §10 routing.
> - Tech Debt lives in root **`TECH-DEBT.md`**: `TD-NNN`, never deleted; aged at promote (≥3 sprints → re-review; `high` → auto P1).

---

## Active Sprint

_(none active)_ — SPRINT-041 closed 2026-08-01. Promote the next sprint from `state: ready` Backlog tasks.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-131 — Extend the night-run allowlist recipe to cover the run's terminal steps  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  the pre-flight allowlist recipe enumerates the commands an unattended run needs to
                  *finish*, not only the ones its tasks need to work — the coordinator's merge-back
                  path (integration-worktree creation, the no-ff merge, worktree removal/prune) and
                  the git writes the always-on gate's own eval harnesses perform on throwaway repos;
                  a stated method for deriving the set (not a copyable literal list, which goes stale
                  and leaks this repo's commands into a generic skill) plus the reasoning that the
                  shared landing path is where a denial costs the whole run
      touches:    the unattended-run reference's pre-flight section · the dispatch reference's
                  merge-back section, if the two still disagree about which commands merge-back needs
      depends-on: none
      assumes:    the fix is a specification gap in shipped guidance, not a permission-model change —
                  building the actual allowlist stays an owner action at each pre-flight, and no
                  default is loosened
      tracker:    SPRINT-041 Retro · L-072
      state:      ready

- [ ] TASK-132 — Cross-check a sprint Plan's declared Layers against what its DoD implies  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  the always-on gate reports, for each task block in an active sprint's Plan, any file
                  named in that task's DoD/Acceptance prose but absent from its `Layers:` declaration —
                  and any dependency the prose implies but `Depends-on:` omits. Negative-tested per
                  check, each failing with its own named finding, using SPRINT-041's Plan reconstructed
                  as the must-FAIL fixture: a real recorded miss whose DoDs require marking a TD
                  resolved while its `Layers:` omits the debt ledger. Fixtures retained (L-058) — a
                  guard shipped without the input that makes it fail is the failure it exists to prevent
      touches:    the qa gate script · its leg inventory doc · the retained eval fixture set · the tech
                  debt ledger (marks TD-020 resolved — declared deliberately, since omitting exactly
                  this kind of DoD-implied file IS what TD-020 names)
      depends-on: none
      assumes:    grep-shaped over the Plan's existing markup — no new file format and no second source
                  of truth (ADR-013 already rejected a compiled DAG). Fails toward over-reporting: a
                  false positive costs a glance, the current false negative costs a corrupted merge
      tracker:    TD-020 · L-071
      state:      ready

- [ ] TASK-133 — Record an unattended run's own cost and throughput as pre-flight and rollup data  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  the unattended pre-flight states the run's own expected cost as a line distinct from
                  its tasks' verification cost (the conflation L-073 names), and the morning rollup
                  carries actual cost, turn count, wall-clock, and units of work completed. SPRINT-041's
                  recorded figures are entered as the first calibration row, with the format stating
                  plainly that one row is an estimate and not a budget
      touches:    the unattended-run reference's pre-flight and morning-rollup sections · the sprint
                  template's retro section
      depends-on: none
      assumes:    a headless run can observe its own cost from the harness result output; if it cannot,
                  the row degrades to the observable fields (turns · wall-clock · units) and says so
                  rather than omitting the line — the degraded form still yields a calibration series
      tracker:    L-073
      state:      ready

### P2 — Quality / Polish

### P3 — Long-term

> TASK-120 (checkpointed run-state) → routed to `.out-of-scope/checkpointed-run-state.md` (2026-07-30) — ADR-013's kill-switch fired: the promotion trigger (a real unattended run the Execution Log + `/handoff` could not resume) stayed unfired through the 5-sprint window; revisit-if + the reconciliation-rule precondition recorded. Learning: L-068.
> TASK-040 (derived graph view) → routed to `.out-of-scope/derived-graph-view.md` (2026-07-29) — council-2 gate held; the TASK-041 retrieval-miss signal never fired; graphify serves the need ad-hoc (revisit-if + 3 guardrails recorded).
> TASK-047 (council multi-model backend) → routed to `.out-of-scope/council-multi-model-backend.md` (2026-07-29) — TASK-048 + TASK-065 probes found no exposed crack; revisit-if: a cross-provider test shows a real shared factual error (BYO-provider seam only).
> TASK-006 (gate-guard hook) → decided 2026-07-29, SPRINT-030 — **ADR-011: no gate enforcement** (in-core hook killed by platform fact; sibling plugin YAGNI) · trail: `.out-of-scope/gate-guard-hook.md` (revisit-if recorded) · facts: `docs/research/pretooluse-gate-guard.md`.
> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — Sprint history → [`CHANGELOG.md`](CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
