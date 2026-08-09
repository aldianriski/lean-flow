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

> **SPRINT-053 — Surface Truth** → [`docs/sprint/SPRINT-053-surface-truth.md`](docs/sprint/SPRINT-053-surface-truth.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-162 — Substrate-gate `init`'s base tier so absent substrate scaffolds nothing  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  `init` no longer scaffolds docs for substrate a repo does not have — a docs-only
                  repo gets no `testing/testing-guide`, `development/coding-standards` or
                  `deployment/{deployment,rollback}-guide` — using the same substrate gating the
                  higher tiers already apply (DB → database docs · API → integrations). DOCS_Guide §6
                  then carries the stated exemption, so the standard and the tool agree rather than
                  contradicting each other, and lean-flow's own absent base docs resolve as
                  correct-by-exemption or get created
      touches:    skills/lean-doc-generator/references/init.md · references/DOCS_Guide.md §6 ·
                  docs/product/requirements.md (only if the answer is "create them")
      depends-on: none
      assumes:    substrate detection already exists for the higher tiers and extends to "has code" /
                  "is deployable" without new machinery — confirm at G2 by reading init's step 1
                  detection. If it needs new detection, this is L-sized and splits
      tracker:    init.md:12 "Scaffold the base tier (always)" · DOCS_Guide §6 "base = every dev repo"
      state:      ready — consumer-facing (L-015): a consumer running `init` on a docs, config or
                  content repo today gets four docs describing a substrate that is not there.
                  lean-flow is the proof case — the repo shipping `init` deliberately has none of them.

### P2 — Quality / Polish

- [ ] TASK-163 — Name the `Cites:` escape in the two completeness FAILs (TD-039)  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  an author who trips either completeness FAIL learns the escape exists from the
                  message itself, rather than by reading the checker's source. The row's Mitigation is
                  **re-derived before it is built** (L-091, this ledger's header): confirm the FAIL
                  message is where an author actually looks, and that naming an escape there does not
                  read as an invitation to silence the gate
      touches:    scripts/lib/check-layers-completeness.sh · evals/fixtures/layers-completeness/ ·
                  docs/QA.md (only if the documented wording changes)
      depends-on: none
      assumes:    the abuse is already guarded — a token in both `Cites:` and `Layers:` is a
                  contradiction with its own named FAIL — so the cheap version is safe. This is a gate
                  change: it needs a must-FAIL fixture per check (L-058) and the red-on-new /
                  green-on-old pair to prove the change rather than the code (L-090); fixtures retained
      tracker:    TECH-DEBT.md TD-039
      state:      ready

- [ ] TASK-164 — Clear two stale doc facts  [size: S] [risk: low] [HITL]
      class:      mechanical-ingest
      done-when:  `docs/sprint/INDEX.md`'s SPRINT-049 and SPRINT-051 rows no longer read "PATCH
                  pending" — both shipped in v1.27.1, which is now public — and `.claude/CONTEXT.md`
                  either carries the domain glossary it promises at line 97 or drops the promise
      touches:    docs/sprint/INDEX.md · .claude/CONTEXT.md
      depends-on: none
      assumes:    the glossary is a drop-or-relocate, not an add — CONTEXT.md sits at 123/130, so a
                  new section would need something displaced; check whether any consumer-facing surface
                  promises the glossary before deleting the claim
      tracker:    CONTEXT.md:97 · docs/sprint/INDEX.md
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

_(no active sprint)_ — Sprint history → [`CHANGELOG.md`](CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

