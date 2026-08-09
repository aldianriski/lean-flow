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

> **SPRINT-054 — Rulings** → [`docs/sprint/SPRINT-054-rulings.md`](docs/sprint/SPRINT-054-rulings.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-165 — Resolve lean-flow's six absent base-tier docs  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  each of the six base-tier rows lean-flow lacks for **no substrate reason** —
                  `CONTRIBUTING.md` · `SECURITY.md` · `AGENTS.md` · `docs/product/requirements.md` ·
                  `docs/product/acceptance-criteria.md` · `docs/development/setup.md` — is either
                  created from its template or recorded as a deliberate, reasoned exemption. Not a
                  bulk scaffold: LAW 1 says a doc exists only where its absence causes repeated
                  mistakes, so "create all six" is a candidate answer, not the default
      touches:    CONTRIBUTING.md · SECURITY.md · AGENTS.md · docs/product/ · docs/development/setup.md
      depends-on: TASK-162
      assumes:    these six are genuinely not substrate-gateable — checked at the SPRINT-053 G2 against
                  all 18 base rows. The two that ARE gateable (coding-standards, testing-guide) belong
                  to TASK-162 and are excluded here; deployment guides already exist and are correct
      tracker:    SPRINT-053 § Decisions D6 · docs/sprint/logs/SPRINT-053-surface-truth.md scope-change
      state:      ready — **unblocked at the SPRINT-053 close**: TASK-162 landed (T1), and the
                  conditions it set gate only `coding-standards` and `testing-guide`, neither of which
                  is in this task's six. The blocker's question is answered, and the answer did not
                  shrink the list.

### P2 — Quality / Polish

### P3 — Long-term

- [ ] TASK-159 — Get evidence on whether "push right" beats gate-before-work  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the tension `loop-me` raised — defer a human checkpoint as far as it will go, ask
                  once, late, fully prepared — is resolved against our G1/G2 gate-before-work model
                  with evidence, and either the gate placement is amended or the question is closed
                  with why. Same shape as TASK-155; both are tensions, not defects
      touches:    .claude/CONTEXT.md § Gates · skills/orchestrator/SKILL.md (only if the answer changes them)
      depends-on: none
      assumes:    the two are not actually opposed — our gates approve *direction* before wasted work,
                  while push-right defers *verification* until work is presentable, so the honest
                  outcome may be "both, at different points" rather than a winner
      tracker:    docs/research/mattpocock.md § Still open
      state:      ready — re-stated at the SPRINT-052 triage. This was `needs-info` waiting on "a
                  measurable signal" that cannot arrive: applying L-094's test names it a **judgement
                  call** about our own gate placement, and no instrument for it exists or will. It is
                  settled by argument (owner ruling, optionally `/council`), not by evidence, and the
                  `assumes:` above already sketches the likely answer.

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
      state:      ready — re-stated at the SPRINT-052 triage. This was `needs-info` waiting on a
                  "measurable signal"; L-094's test names it a **documented-behaviour** question —
                  prompting literature on negation exists, and no repo-local measurement was ever going
                  to accumulate. Plannable now as desk research: read the sources, write the verdict,
                  and record a null result as a real outcome if that is what they say.

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

_(SPRINT-054 in flight — nothing shipped yet)_ — Sprint history → [`CHANGELOG.md`](CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

