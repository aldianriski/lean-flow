---
owner: Maintainer
last_updated: 2026-07-30
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

> **SPRINT-041 — Debt Guards** → docs/sprint/SPRINT-041-debt-guards.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-129 — Guard the headless park-record cue in qa-check  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  qa-check gains a leg asserting both the migrate and init procedures still carry
                  (a) a headless *detection* cue and (b) a park-record instruction naming the handoff
                  doc; the leg is negative-tested against a scratch copy with the cue stripped and
                  FAILs there naming which procedure lost it — a guard that can only pass is the
                  failure mode it exists to prevent (L-058)
      touches:    the qa gate script · docs/QA.md leg inventory
      depends-on: none
      assumes:    grep-shaped presence check only — model compliance stays a paid opt-in fixture,
                  per docs/QA.md's manual/gated boundary
      tracker:    TD-019
      state:      ready

- [ ] TASK-130 — Fix the zero-match grep idiom in the boundary-park assertion  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  a genuine zero-match no longer emits "integer expression expected" on stderr; the
                  FAIL no-park-record verdict is unchanged, and both the harness selftest and a real
                  zero-match case are run to prove each direction still reports correctly
      touches:    the boundary-park assertion script
      depends-on: none
      assumes:    fail-safe in both directions today (TD-018 verified it) — this is noise removal,
                  not a correctness fix, so the verdict text must not change
      tracker:    TD-018
      state:      ready

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
