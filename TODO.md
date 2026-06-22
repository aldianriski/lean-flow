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

> _(no active sprint — SPRINT-010 closed 2026-06-22; archived per §11)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

_(empty — SPRINT-008 shipped TASK-009 · 013 · 017 · 010; archived 2026-06-21)_

### P2 — Quality / Polish

<!-- Follow-ups from SPRINT-010 audits (docs/research/). -->
- [ ] **TASK-018 — Fix skill allowed-tools + verify sub-agent-dispatch gating** [size: M] [risk: low] [HITL]
      done-when: gating semantics verified (does `allowed-tools` block sub-agent dispatch?); diagnose gains `Write`, council drops `Bash`, flow `Write`/`Edit` dropped if confirmed unused; if gating confirmed → add `Task`/`Agent` to council/task-decomposer/orchestrator; qa-check green
      touches:   skills/{diagnose,council,flow,task-decomposer,orchestrator}/SKILL.md frontmatter
      assumes:   from docs/research/allowed-tools-audit.md (SPRINT-010 T1)
      state:     ready
- [ ] **TASK-019 — Defer README at prime (lazy/fallback read)** [size: S] [risk: low] [HITL]
      done-when: prime reads README only as a fallback when CLAUDE.md/CONTEXT.md missing; still health-checks its presence; degrades gracefully; saves the README read every session
      touches:   skills/prime/SKILL.md
      assumes:   from docs/research/loop-mechanics-audit.md (SPRINT-010 T3)
      state:     ready

### P3 — Long-term

- [ ] **TASK-020 — /handoff red-flag: reference durable state, don't restate** [size: S] [risk: low] [HITL]
      done-when: handoff SKILL gains a red-flag — handoff docs reference TODO/sprint state rather than restating it (avoids the handoff→prime double-read)
      touches:   skills/handoff/SKILL.md
      assumes:   from docs/research/loop-mechanics-audit.md (SPRINT-010 T3)
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
- **TD-005** resolved → SPRINT-006 T2 (CONTEXT 151→127 + cap 100→130, ADR-007)
- **TD-006** severity: medium | status: resolved → SPRINT-009 T1 (2026-06-21)
  - Summary: CONTEXT.md deduped 130 → 122 (built-in detail → ARCHITECTURE pointer; curated/loop/governance compressed); 8 lines recovered, no info lost. L-008 promoted at SPRINT-009 promote.

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
