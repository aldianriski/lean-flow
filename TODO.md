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

> **SPRINT-047 — Sprint Log Split** → [`docs/sprint/SPRINT-047-sprint-log-split.md`](docs/sprint/SPRINT-047-sprint-log-split.md)

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

- [ ] TASK-147 — Split the sprint Execution Log into an uncapped sibling  [size: M] [risk: high] [HITL]
      class:      decision
      done-when:  the Execution Log lives outside the `docs/sprint/SPRINT-*.md` glob; DOCS_Guide §2 row + §9 + §11
                  retention updated; SPRINT.md.template's Log section repointed; the append-during-sprint rule
                  repointed in lean-doc-generator; ALL THREE qa-check globs (cap-400 :33 · task-schema :267 ·
                  layers-completeness :405) proven not to mis-fire on the new file — EACH with a retained negative
                  fixture that FAILS with its named finding (L-058, TD-012); one real sprint migrated; measured
                  Plan-file headroom reported (target: a Plan holds ≥15 tasks under 400)
      touches:    DOCS_Guide §2/§9/§11 · SPRINT.md.template · lean-doc-generator/SKILL.md · scripts/qa-check.sh ·
                  evals/fixtures · docs/sprint/
      depends-on: none
      assumes:    A3 — a subdirectory escapes the glob (non-recursive, same reason `archive/` already does) ·
                  A4 — Plan file keeps its 400 cap, sibling is append-only/uncapped like CHANGELOG.md ·
                  A5 — alters ADR-012 repo structure, so an ADR may be required (G2 decides)
      tracker:    none — local plugin repo, no external tracker
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-144 — Re-scan mattpocock/skills for adoption delta  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  `docs/research/mattpocock.md` carries a delta-map row for `grill-me`, `writing-for-agents`,
                  `wizard`, `wait-what` plus a `wayfinder` re-check row; each row states Keeper|Reject mapped to the
                  lean-flow surface it duplicates; the verdict line states the keeper count; `last_updated` refreshed
      touches:    docs/research/mattpocock.md
      depends-on: none
      assumes:    the 5 named skills are the whole delta since the 2026-07-10 scan · the prior scan's 3 keepers all
                  shipped (Standards-vs-Spec · skill-powered dispatch · wayfinder→fog-map), so wayfinder is a
                  re-check only · keepers are FILED as follow-up TASKs, never adopted in this task · L-017 is the
                  durable rubric (judge the delta over existing surface, not standalone merit) ·
                  AFK precondition: a headless run has WebFetch allowed — if not, this reverts to HITL
      tracker:    https://github.com/mattpocock/skills — docs at https://www.aihero.dev/skills
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
