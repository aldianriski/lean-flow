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

> _None._ SPRINT-049 closed 2026-08-09.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-153 — Scan the mattpocock remainder (scan 3)  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  the 13 skills named as "Not scanned" in docs/research/mattpocock.md are mapped
                  against lean-flow's existing surface per L-017 (delta first, standalone merit
                  never), each with an explicit Keep/Reject and a one-line reason; keepers are FILED
                  as TASK-NNN and not adopted inside the scan task; the § Not scanned list is either
                  emptied or restated with what still remains
      touches:    docs/research/mattpocock.md · TODO.md (keepers filed)
      depends-on: none
      assumes:    the prior two scans' hit rate holds — 5 keepers from 12 skills examined across two
                  scans, so expect mostly fast rejects and budget accordingly · TD-033 (this doc is
                  136 lines against a 120 soft cap) will be forced by a third scan, so the split or
                  collapse it proposes lands here rather than separately
      tracker:    docs/research/mattpocock.md § Not scanned
      state:      ready

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

- [ ] TASK-154 — Settle skill self-fork (mechanism B) vs runtime invocation (mechanism C)  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the open question carried in docs/research/mattpocock.md since scan 1 is closed
                  either way — B adopted with its per-run fork cost measured, or rejected with a
                  written revisit-if condition so the null result is itself a verdict (L-068). A
                  deferral without an expiry does not close it
      touches:    docs/research/mattpocock.md · docs/adr/ADR-010-*.md (only if the answer changes it)
      depends-on: none
      assumes:    mechanism C (runtime Skill invocation on a general-purpose agent) is shipped and
                  working, so this is an optimisation question, not a gap — if C is failing in
                  practice, this is the wrong task and it becomes a /diagnose
      tracker:    docs/research/mattpocock.md § Still open
      state:      ready

- [ ] TASK-155 — Get evidence on whether ❌ negation in anti-patterns backfires  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the question `writing-for-agents` raised — prohibition activates the forbidden
                  behaviour, which cuts against CLAUDE.md's ❌ house style — is answered with
                  evidence rather than style preference, and either the house style is amended or the
                  question is closed with why
      touches:    .claude/CLAUDE.md · skills/*/SKILL.md § Red flags (only if the answer changes them)
      depends-on: none
      assumes:    our ❌ rows already pair each trap with a positive rule, which the research doc notes
                  blunts the effect — so the honest null result ("no change warranted") is a real
                  possible outcome and should be recorded as one
      tracker:    docs/research/mattpocock.md § Still open
      state:      needs-info — needs an evidence source before it is plannable; a style debate with no
                  evidence is not a task. Unblock when either a measurable signal is identified or the
                  owner rules it closed on judgement.

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

