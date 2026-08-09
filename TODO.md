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

> _None._ SPRINT-054 closed 2026-08-09.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-166 — Correct the README repo-layout block and give its counts a check  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  `README.md` § Architecture "Repo layout" states the real template count
                  (32 core + 2 non-core = 34, not "30 … = 32 total") and lists `.codex-plugin/`
                  alongside `.kimi-plugin/`; and the count claim is covered by a check, so it
                  cannot drift again
      touches:    README.md · scripts/qa-check.sh · evals/fixtures/ (a must-FAIL fixture if a
                  check is added — L-058)
      depends-on: none
      assumes:    the drift is unguarded rather than unnoticed — `qa-check.sh` verifies the template
                  count in `.claude/CLAUDE.md` and `docs/architecture/overview.md` and passes today,
                  so extending the same check to the README is the small version. Confirm that before
                  writing a new checker
      tracker:    SPRINT-054 T1 (found, deliberately not swept in — pre-existing, outside T1's scope)
      state:      ready — found during SPRINT-054 T1 while updating the same block for the new root
                  docs. Left alone at the time under "clean up only your own mess"; filed here so it
                  is not lost. Same family as TD-041: a claim nothing checks drifts silently, and this
                  one is consumer-facing.

### P3 — Long-term

> TASK-148 (bulk-throughput proof) → routed to `.out-of-scope/bulk-throughput-proof.md` (2026-08-09) — unsatisfiable by construction for three consecutive promotes: its ≥10-task Plan threshold mistook the log split's *capacity* ceiling for task *supply*. Revisit-if + a SPRINT-060 expiry recorded; the calibration-series gap it named is real and explicitly not closed by the routing.
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

_(no active sprint)_ — SPRINT-054's shipped changes are held for a MINOR release. Sprint history → [`CHANGELOG.md`](CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

