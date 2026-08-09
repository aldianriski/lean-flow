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

> **SPRINT-051 — Keeper Adoption** → [`docs/sprint/SPRINT-051-keeper-adoption.md`](docs/sprint/SPRINT-051-keeper-adoption.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-156 — Add a redaction discipline to /diagnose  [size: S] [risk: med] [HITL]
      class:      execution
      done-when:  /diagnose instructs redacting secrets before showing any captured artifact, and
                  states the mechanism rather than only the warning — build feedback loops against
                  env vars so the credential stays in the environment, and quote only the
                  signal-carrying lines of a captured trace. Consumer-facing surface checked (L-015):
                  the rule must read correctly for a repo that is not lean-flow
      touches:    skills/diagnose/SKILL.md · skills/diagnose/references/feedback-loops.md
      depends-on: none
      assumes:    this is a real gap, not a stylistic one — /diagnose actively instructs capturing
                  HAR files, log dumps and replayed payloads, and those routinely carry auth headers;
                  the skill currently has zero occurrences of redact/secret/credential (verified
                  SPRINT-050 T1)
      tracker:    docs/research/mattpocock.md § Keepers K1
      state:      ready

- [ ] TASK-157 — Add the tautological-test anti-pattern to /tdd  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  /tdd names the anti-pattern and its tell — an assertion that recomputes the expected
                  value the way the code does passes by construction and can never disagree with the
                  code — and states the fix: expected values come from an independent source of truth
                  (a known-good literal, a worked example, the spec)
      touches:    skills/tdd/SKILL.md · skills/tdd/references/testability.md
      depends-on: none
      assumes:    genuinely absent — /tdd carries implementation-coupled and horizontal-slicing but
                  not this one (verified SPRINT-050 T1) · same family as L-058, a check that can only
                  pass is the failure it exists to prevent
      tracker:    docs/research/mattpocock.md § Keepers K5
      state:      ready

- [ ] TASK-158 — Adopt three micro techniques from the scan-3 keepers  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  all three land, each one or two lines, none expanding into a new skill:
                  (a) /refactor-advisor gains a scoping step before it scans — walk git history for
                  hot spots, since deepening only pays off where change is frequent;
                  (b) /prototype retains a spent prototype on a throwaway branch with a pointer
                  instead of deleting it outright;
                  (c) dispatch.md's merge-back queue says to recover each side's intent from commit
                  messages/PRs before resolving, preserve both intents, never invent behaviour, and
                  always resolve rather than --abort
      touches:    skills/refactor-advisor/SKILL.md · skills/prototype/SKILL.md ·
                  skills/orchestrator/references/dispatch.md
      depends-on: none
      assumes:    all three are genuinely micro — if any turns out to need a section rather than a
                  line, it splits out rather than growing this task quietly (L-088)
      tracker:    docs/research/mattpocock.md § Keepers K2 · K3 · K4
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

