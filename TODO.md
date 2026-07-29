---
owner: Maintainer
last_updated: 2026-07-29
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

> **SPRINT-032 — TemiDev Repo-Structure Standard** → docs/sprint/SPRINT-032-temidev-repo-standard.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-067 — Rewrite DOCS_Guide core set to the TemiDev structure + record ADR-012  [size: M] [risk: high] [HITL]
      done-when: §2 table lists the TemiDev mandatory minimum as core (new placements canonical, legacy second), tier gating (base/backend/complex) replaces §6, LAW-1 reinterpretation stated, and docs/adr/ADR-012 records full-adoption + placement-wins + AGENTS-pointer + deviations (CHANGELOG always-core · init non-doc loosening)
      touches: skills/lean-doc-generator/references/DOCS_Guide.md · docs/adr/
      assumes: tier gating = mandatory always · backend adds api/integrations · medium/complex adds adr+flows; CHANGELOG stays always-core (lean sprint close depends on it); lean discipline (headers · WHY/WHERE · caps) persists on the new set
      tracker: none — internal standard change
      state: ready
- [ ] TASK-068 — Relocate colliding core templates to TemiDev placement + rewire readers  [size: M] [risk: high] [HITL]
      depends-on: TASK-067
      done-when: ARCHITECTURE→docs/architecture/overview.md · SETUP→docs/development/setup.md · DEPLOY→docs/deployment/{deployment-guide,rollback-guide}.md · CHANGELOG→root; /prime slots, release-patch prepend target, §11 rotation, and sprint promote/close refs point at new canonical paths with legacy matched second — verified by /prime passing on both layouts
      touches: lean-doc-generator templates/ · prime SKILL.md · release-patch SKILL.md · lean-doc-generator SKILL.md
      assumes: rotation archives stay docs/changelog/
      tracker: none — internal standard change
      state: ready
- [ ] TASK-069 — Add root-file templates: CONTRIBUTING · SECURITY · AGENTS-pointer · .env.example/.gitignore/LICENSE  [size: M] [risk: med] [HITL]
      depends-on: TASK-067
      done-when: CONTRIBUTING.md.template + SECURITY.md.template + AGENTS.md.template (~10-line pointer to .claude/CLAUDE.md) exist with §2 rows + caps; init offers all six per repo type and scaffolds them on a scratch repo without overwriting existing files
      touches: lean-doc-generator templates/ · DOCS_Guide §2 · lean-doc-generator SKILL.md (init)
      assumes: init docs-only rule loosened for exactly .env.example/.gitignore/LICENSE (never-overwrite) — settle at G2, record in ADR-012
      tracker: none — internal standard change
      state: ready
- [ ] TASK-070 — Add backend/integration doc-tree templates: database/ · api/ · architecture siblings  [size: M] [risk: med] [HITL]
      depends-on: TASK-067
      done-when: erd (Mermaid) · schema · migration-guide · architecture/{data-flow,authentication,integrations} templates exist with §2 rows; openapi.yaml placement rule recorded (no template — spec is project-generated); init backend/integration gate scaffolds exactly this set
      touches: lean-doc-generator templates/ · DOCS_Guide §2 · lean-doc-generator SKILL.md (init)
      assumes: ERD uses Mermaid; no API-spec generation in scope
      tracker: none — internal standard change
      state: ready
- [ ] TASK-071 — Add product/flows/testing/coding-standards templates (medium/complex gate)  [size: M] [risk: med] [HITL]
      depends-on: TASK-067
      done-when: product/{requirements,acceptance-criteria} · flows/ (Mermaid) · testing/testing-guide · development/coding-standards templates exist with §2 rows; medium/complex init gate scaffolds them; task-decomposer PRD output notes docs/product/requirements.md as its durable home
      touches: lean-doc-generator templates/ · DOCS_Guide §2 · lean-doc-generator SKILL.md · task-decomposer SKILL.md
      assumes: none
      tracker: none — internal standard change
      state: ready
- [ ] TASK-072 — Add "what belongs in Git" boundary section + wire into init/migrate  [size: S] [risk: med] [HITL]
      depends-on: TASK-067
      done-when: DOCS_Guide gains the decision rule + never-commit lists (secrets/contracts/PII/backups/design sources/meeting notes → proper homes); init scaffolds .gitignore from it; migrate adoption scan flags committed violations (report-only)
      touches: DOCS_Guide.md · lean-doc-generator SKILL.md · references/migration-map.md
      assumes: none
      tracker: none — internal standard change
      state: ready
- [ ] TASK-073 — Update migration map for legacy-lean → TemiDev layout + end-to-end consumer verify  [size: M] [risk: med] [HITL]
      depends-on: TASK-068, TASK-069, TASK-070, TASK-071, TASK-072
      done-when: migration-map.md maps legacy lean placements → new canonical (re-run sync proposes relocation, never clobbers); init exercised on a scratch fixture repo at all three tiers and /prime reads each cleanly (L-016 consumer-path proof); lean-flow README + CHANGELOG + CONTEXT.md §Doc standard reflect the new standard
      touches: references/migration-map.md · README.md · .claude/CONTEXT.md · docs/CHANGELOG.md
      assumes: lean-flow's own repo does NOT migrate now (later migrate re-run flags it)
      tracker: none — internal standard change
      state: ready

### P2 — Quality / Polish

### P3 — Long-term

> TASK-040 (derived graph view) → routed to `.out-of-scope/derived-graph-view.md` (2026-07-29) — council-2 gate held; the TASK-041 retrieval-miss signal never fired; graphify serves the need ad-hoc (revisit-if + 3 guardrails recorded).
> TASK-047 (council multi-model backend) → routed to `.out-of-scope/council-multi-model-backend.md` (2026-07-29) — TASK-048 + TASK-065 probes found no exposed crack; revisit-if: a cross-provider test shows a real shared factual error (BYO-provider seam only).
> TASK-006 (gate-guard hook) → decided 2026-07-29, SPRINT-030 — **ADR-011: no gate enforcement** (in-core hook killed by platform fact; sibling plugin YAGNI) · trail: `.out-of-scope/gate-guard-hook.md` (revisit-if recorded) · facts: `docs/research/pretooluse-gate-guard.md`.
> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to `docs/CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — Sprint history → [`docs/CHANGELOG.md`](docs/CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
