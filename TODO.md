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

> **SPRINT-052 — Rule Placement** → [`docs/sprint/SPRINT-052-rule-placement.md`](docs/sprint/SPRINT-052-rule-placement.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-160 — Promote L-091 and L-092 into durable rules  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  both entries read `promoted: yes → <where>` and are collapsed to pointer lines (§11),
                  and each rule sits where **every flow that can hit its failure** reads it — not
                  merely in one skill. For L-092 that test points at `DOCS_Guide` §10 itself, which
                  currently offers "a CLAUDE.md anti-pattern, a CONTEXT.md rule, **or** a skill
                  red-flag" as though the three were interchangeable homes; they are not
      touches:    docs/LEARNINGS.md · skills/lean-doc-generator/references/DOCS_Guide.md ·
                  .claude/CLAUDE.md · .claude/CONTEXT.md (whichever the placement test selects) ·
                  docs/knowledge-index.md
      depends-on: none
      assumes:    L-092's own content is the criterion for its own placement — a rule about rules
                  landing in only one skill must not itself land in only one skill. If that reasoning
                  does not hold up under G2, the task is wrong-shaped and wants a ruling, not a quiet
                  reinterpretation (L-088)
      tracker:    docs/LEARNINGS.md L-091 · L-092
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-161 — Decide which surface documents the `Cites:` convention (TD-036)  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the **consumer question is answered first** (L-015) — the checker is maintainer
                  tooling (`scripts/`, ADR-008) that no consumer runs, so documenting `Cites:` in the
                  SPRINT template would advertise a convention nothing enforces on their side. Decide
                  whether it belongs in the template, in maintainer-facing docs only, or neither; then
                  the line lands in the chosen surface, or TD-036 closes with the reason it does not
      touches:    skills/lean-doc-generator/templates/SPRINT.md.template · docs/QA.md · TECH-DEBT.md
      depends-on: none
      assumes:    this is a placement question, not a content one — the escape works and is documented
                  inside the checker; what is undecided is **who should be told**. If the answer turns
                  out to require changing the escape itself, that is a different task
      tracker:    TECH-DEBT.md TD-036
      state:      ready

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
      state:      needs-info — needs an evidence source before it is plannable. Unblock when a
                  measurable signal is identified, or when the owner rules it closed on judgement.

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

_(no active sprint)_ — Sprint history → [`CHANGELOG.md`](CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

