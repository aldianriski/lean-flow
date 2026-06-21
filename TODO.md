---
owner: Maintainer
last_updated: 2026-06-21
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file**
> - **Session start** — `/prime`; read this before touching code.
> - **`/triage`** grooms the Backlog (re-rank, state, route rejects to `.out-of-scope/`).
> - **`/lean-doc-generator promote`** forms a sprint from `ready` Backlog tasks → `docs/sprint/`.
> - **`/orchestrator sprint-bulk`** builds it; **`/lean-doc-generator close`** runs the Retro → §10 routing.
> - Tech Debt: `TD-NNN`, never deleted; aged at promote (≥3 sprints → re-review; `high` → auto P1).

---

## Active Sprint

> **SPRINT-008 — QA discipline** → docs/sprint/SPRINT-008-qa-discipline.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

<!-- Promoted to SPRINT-008 (2026-06-21). Tombstones — cleared at sprint close (§11). -->
- TASK-009 promoted → SPRINT-008 (T1)
- TASK-013 promoted → SPRINT-008 (T2)
- TASK-017 promoted → SPRINT-008 (T3)

### P2 — Quality / Polish

<!-- Re-ranked by /triage 2026-06-21. TASK-010 promoted to SPRINT-008 (T4); remaining held for SPRINT-009. -->

- [ ] **TASK-011 — Audit allowed-tools least-privilege across 14 skills** [size: S] [risk: low] [HITL]
      done-when: a report lists each skill's allowed-tools vs what it actually needs; over-grants flagged as follow-up fixes; no-unsafe-instruction check passes
      touches:   skills/*/SKILL.md (read), audit report
      state:     ready
- [ ] **TASK-012 — Audit description-trigger accuracy (skill-creator eval)** [size: M] [risk: low] [HITL]
      done-when: skill-creator eval tooling run over skill descriptions; mis-trigger / under-trigger cases reported with proposed wording fixes (proposals only, not applied)
      touches:   skills/*/SKILL.md descriptions (read), eval output
      assumes:   skill-creator eval tooling available in this environment (confirm-or-fallback to manual review at G1)
      state:     ready
- TASK-010 promoted → SPRINT-008 (T4)
- [ ] **TASK-014 — Add soft test/QA prompts to SPRINT + task templates + Review** [size: S] [risk: low] [HITL]
      done-when: SPRINT + task templates and the orchestrator Review step RAISE "tests? lint? security-review? perf budget?" as SUGGESTIONS; wording confirmed non-blocking (not a gate)
      touches:   templates/SPRINT.md.template, task-entry shape, orchestrator/references/review-scoping.md
      state:     ready
- [ ] **TASK-015 — Write a test-strategy reference (choose test TYPE per task)** [size: M] [risk: low] [HITL]
      done-when: a reference sibling to tdd/references/testability.md guides choosing unit/integ/e2e/perf/load per task FOR THE USER'S CODE; tdd + orchestrator point to it; NO new skills added
      touches:   skills/tdd/references/test-strategy.md (NEW), pointers from tdd + orchestrator
      assumes:   hard constraint — guidance only, never per-test-type skills (dev-flow bloat trap)
      state:     ready

### P3 — Long-term

- [ ] **TASK-016 — Audit session/loop mechanics → findings + proposals** [size: M] [risk: low] [HITL]
      done-when: an audit doc reports prime read-order necessity, handoff→prime redundancy, CLAUDE/CONTEXT/README load overlap (ADR-007 dedup claim verified), gate re-grill cost, each with a proposed optimization for approval; NO source edits this task (proposals only)
      touches:   audit/research doc only
      assumes:   approved proposals spawn follow-up tasks; this slice is investigate-then-propose
      state:     ready


- [ ] **TASK-006 — Evaluate an opt-in PreToolUse gate-guard hook** [size: M] [risk: med] [HITL]
      done-when: decision recorded (ADR/council) on whether enforced gates are worth a hook
      next: **gather data first** — research Claude Code PreToolUse hooks (can a hook block a tool call on gate state? capabilities/limits) → draft a proposed ADR → decide (it touches the agent-free-core principle, so likely /council before the ADR)
      state: blocked   (deferred — research hooks next session)
- TASK-008 — Define `/insights` → **built** 2026-06-16: anytime friction → `L-NNN` candidate (bumps a match's `count`) into `docs/LEARNINGS.md` (the §10 feed); exercised → L-010. _(unreleased — bundle into the next MINOR)_

> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

<!-- TD-NNN, separate from TASK-NNN. Never deleted — resolved → status: resolved → TASK-NNN.
     Filed by Sprint Close Retro. Aging at Promote: ≥3 sprints → re-review; high → auto P1.
     severity ∈ trivial · minor · medium · high. -->

<!-- TD-001…004 collapsed at SPRINT-008 promote (resolved ≥3 sprints ago, §11) — full history in git + sprint files. -->
- **TD-001** resolved → SPRINT-003 T1+T2 (migrate · council · verdict→ADR-006 feed — all exercised on real input)
- **TD-002** resolved → SPRINT-005 T1 (council SKILL 341→60; artifacts → references/, ADR-006)
- **TD-003** resolved → SPRINT-004 T1 (orchestrator SKILL → 107 ≤110; Review → references/)
- **TD-004** resolved → SPRINT-005 T1 (cap-rule wording fixed — artifacts in references/ don't count; ADR-006)
- **TD-005** severity: medium | status: resolved → SPRINT-006 T2 (2026-06-12)
  - Summary: `.claude/CONTEXT.md` was 151 vs its 100-line cap. Resolved via hybrid (ADR-007): dedup diet 151 → 127 (prose duplicating CLAUDE.md/README → pointers, no info lost) + cap revised 100 → 130 in DOCS_Guide §2.

---

## Changelog (current sprint only)

> Move to `docs/CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — Sprints 001–002 are recorded in [`docs/CHANGELOG.md`](docs/CHANGELOG.md).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
