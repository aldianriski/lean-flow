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

> **SPRINT-048 — Epic Layer** → [`docs/sprint/SPRINT-048-epic-layer.md`](docs/sprint/SPRINT-048-epic-layer.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-145 — Add the EPIC doc layer (template + §2 lifecycle row)  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  `EPIC.md.template` exists; DOCS_Guide §2 carries an `epic/EPIC-NNN-<slug>.md` row with cap +
                  create/update/archive triggers, §11 carries its retention leg; the linted template counts move in
                  the same commit (`.claude/CLAUDE.md` + `docs/architecture/overview.md`; CONTEXT.md § Doc standard
                  for accuracy); ONE real epic rendered from the template — the fleet epic, retro-fitted from
                  SPRINT-025/026 + `docs/research/agents-md-adoption.md`; `scripts/qa-check.sh` green
      touches:    lean-doc-generator/templates · DOCS_Guide §2/§11 · .claude/CLAUDE.md · .claude/CONTEXT.md ·
                  docs/architecture/overview.md · docs/epic/
      depends-on: none
      assumes:    A1 — /lean-doc-generator owns epic creation, /task-decomposer `--epic` consumes it (G2 confirms) ·
                  A2 — 31 core + 2 non-core = 33 templates, count linted at qa-check.sh:40-59
      tracker:    none — local plugin repo, no external tracker
      state:      ready

- [ ] TASK-146 — Wire the epic into decompose → promote → close  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  `--epic` resolves to a real epic doc and decomposes it into TASK-NNN; promote sets `epic:`
                  frontmatter on member sprints; close rolls the member sprint's outcome up into the epic;
                  CONTEXT.md SSOT + README reflect the new layer; the chain FIRES end-to-end once on TASK-145's
                  real epic — not spec-only (L-020 wiring check, L-007 spec-only-debt)
      touches:    task-decomposer/SKILL.md · lean-doc-generator/SKILL.md · SPRINT.md.template ·
                  .claude/CONTEXT.md · README.md
      depends-on: TASK-145
      assumes:    the epic artifact from TASK-145 is the input contract; no new skill is added (existing two grow)
      tracker:    none — local plugin repo, no external tracker
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-149 — Replace the grill's "one question at a time" rule with frontier batching  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  the grill rule states the discriminator is **dependency, not count** — ask every
                  question whose prerequisites are settled as one round, serialise only the dependent
                  ones, stop when the frontier is empty; `.claude/CLAUDE.md` Behavioral Guidelines,
                  `/task-decomposer` Clarify, and its "four questions at once" red flag all updated to
                  agree; the fact/decision separation ("finding facts is the agent's job, never the
                  user's") stated alongside
      touches:    .claude/CLAUDE.md · .claude/CONTEXT.md · task-decomposer/SKILL.md · orchestrator/SKILL.md
      depends-on: none
      assumes:    the current rule over-corrects rather than being wrong — batching DEPENDENT questions
                  really does produce vague answers, so the fix narrows the ban, it does not lift it ·
                  SPRINT-047 demonstrated the gap live (two popups carried two independent questions
                  each, justified ad hoc) — evidence, not theory
      tracker:    docs/research/mattpocock.md § Re-scan, Keeper 1
      state:      ready

- [ ] TASK-150 — Adopt writing-for-agents' disclosure test + completion-criteria sharpness  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  ADR-006's rule carries the branching **test** for what goes in SKILL.md vs
                  `references/` — "inline what every path needs, disclose what only some reach" —
                  since the cap is a size limit, not a criterion; and the DoD/Acceptance guidance says
                  completion criteria are behavioural levers (demand "every rule applied", not
                  "understanding reached")
      touches:    docs/adr/ADR-006-*.md · .claude/CLAUDE.md · lean-doc-generator/references/DOCS_Guide.md
      depends-on: none
      assumes:    ADR-006 is append-only once decided, so this lands as a superseding note or an
                  amendment rather than an edit to the decided text
      tracker:    docs/research/mattpocock.md § Re-scan, Keeper 2
      state:      ready

- [ ] TASK-151 — Fix the launcher's DEAD-ON-ARRIVAL false verdict (TD-029)  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  the buffering claim is **reproduced first** (does `--output-format json` actually keep
                  the log empty for a whole healthy run?), then either `stream-json` is accepted and any
                  new line counts as progress, or a buffered format reports a named `UNKNOWN` instead of
                  `DEAD-ON-ARRIVAL`; the calibration row's `total_cost_usd` need is met either way, and
                  the chosen behaviour is exercised against a run that is genuinely healthy
      touches:    scripts/night-run.sh · orchestrator/references/night-run.md (Part 3)
      depends-on: none
      assumes:    TD-029's stated mechanism (json buffers until exit) is a **hypothesis, not a finding** —
                  L-087 applies, so reproduce before mitigating · the json-vs-stream-json conflict is
                  real: json is what exposes total_cost_usd for the calibration row
      tracker:    TECH-DEBT.md TD-029
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
