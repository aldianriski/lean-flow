---
owner: Maintainer
last_updated: 2026-08-09
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

> **SPRINT-049 — Layer-Check Redesign** → [`docs/sprint/SPRINT-049-layer-check-redesign.md`](docs/sprint/SPRINT-049-layer-check-redesign.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-152 — Redesign the three layers checks as one, not three patches  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  TD-031, TD-032 and TD-035 are addressed together: changed paths are attributed to
                  **who** changed them (task commit on an agent branch vs coordinator bookkeeping)
                  rather than to whether a frozen declaration named them; per-task attribution replaces
                  the all-task union; and prose that merely *mentions* a filename no longer registers
                  as a touch. Negative-tested per L-058 — SPRINT-041's real miss (a TD marked resolved
                  with the debt ledger undeclared) must still FAIL, and a task editing a file only
                  another task declared must **newly** FAIL
      touches:    scripts/lib/check-layers-completeness.sh · scripts/lib/check-layers-observed.sh ·
                  scripts/qa-check.sh · evals/
      depends-on: none
      assumes:    TD-032's own stated trigger ("if a third arrives, the checks want a rethink rather
                  than another narrowing") **fired at SPRINT-048 close** — TD-035 is the third ·
                  TD-035 is a false NEGATIVE in the collision check, so this is correctness, not polish
      tracker:    TECH-DEBT.md TD-031 · TD-032 · TD-035
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-148 — Prove bulk throughput on one real night run  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  a ≥10-task Plan promoted and fired unattended; ≥8 units landed; calibration row recorded in
                  night-run.md with cost · turns · wall-clock · units · shape
      touches:    docs/sprint/ · orchestrator/references/night-run.md (calibration row)
      depends-on: TASK-147
      assumes:    the log split is the binding constraint — if the run still halts early, the cause is elsewhere
                  (headless turn budget / AFK classification) and this task becomes a /diagnose ·
                  cost at recorded $5.42–8.27 per unit delivered ≈ $55–85 for ten units
      tracker:    none — local plugin repo, no external tracker
      state:      blocked — done-when needs a ≥10-task Plan; the backlog holds three tasks, so this is
                  unsatisfiable today. Unblock when the backlog carries ≥10 ready AFK-suitable tasks,
                  or when the owner lowers the threshold to what a real Plan can reach.

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

