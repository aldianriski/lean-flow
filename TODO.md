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

> **SPRINT-046 — Permission Surface** → docs/sprint/SPRINT-046-permission-surface.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-146 — Establish what actually governs command denial in a headless run  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  a research note records, from real headless sessions rather than inference, two
                  things that are currently guesses: **(a)** whether mid-session denial correlates with
                  elapsed time, turn count, tool-call count — or none of them, stated as "not
                  established" if the effect does not reproduce; and **(b)** which permission-rule
                  forms actually match, tested directly one form at a time (exact-file · directory
                  prefix · glob · bare command), rather than inferred from documentation. Every claim
                  carries its evidence, and anything unproven is **named as unproven**
      touches:    a research note · the unattended reference, only if a form finding is conclusive
                  enough to change the guidance there
      depends-on: none
      assumes:    the effect is observable within one session — the run that surfaced it saw denials
                  by turn 25 — but if a single session does not reproduce it, the note says so instead
                  of extrapolating from one prior observation
      tracker:    TD-027 · TD-028
      state:      ready
      notes:      **No mitigation ships from this task.** Its entire purpose is to stop guessing; the
                  owner decision on TD-027 was reproduce-before-mitigate, because a defence built on an
                  unpinned mechanism is exactly what produced TD-024's two wrong diagnoses

- [ ] TASK-147 — Exclude agent worktree paths from the observed-layers check  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  the check no longer counts in-repo agent worktree paths as changed-but-undeclared,
                  with the reason stated inline the way every other exclusion is — never a silent skip.
                  Negative-tested with a retained fixture: a genuinely undeclared file outside those
                  paths must still FAIL by name, since an exclusion that swallowed the real case would
                  satisfy the acceptance and hollow out the guard
      touches:    the observed-layers checker · its retained fixture set
      depends-on: none
      assumes:    the worktree path prefix is stable enough to match on; if dispatch ever relocates
                  worktrees outside the repo the exclusion becomes dead code rather than wrong code
      tracker:    TD-030
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
