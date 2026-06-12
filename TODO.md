---
owner: Maintainer
last_updated: 2026-06-12
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

> _(no active sprint — SPRINT-006 closed 2026-06-12, archived per §11; **TASK-017 (v1.0) now fully
> unblocked** — TASK-005 + TD-005 both resolved)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- TASK-017 — v1.0 release checklist → **shipped in v1.0.0** (2026-06-12): consistency grep clean · manifests 1.0.0 lockstep

### P2 — Quality / Polish

_(empty — TASK-026 shipped in SPRINT-006)_

### P3 — Long-term

- [ ] **TASK-006 — Evaluate an opt-in PreToolUse gate-guard hook** [size: M] [risk: med] [HITL]
      done-when: decision recorded (ADR/council) on whether enforced gates are worth a hook
      next: **gather data first** — research Claude Code PreToolUse hooks (can a hook block a tool call on gate state? capabilities/limits) → draft a proposed ADR → decide (it touches the agent-free-core principle, so likely /council before the ADR)
      state: blocked   (deferred — research hooks next session)
- [ ] **TASK-008 — Define `/insights`, then wire it → `LEARNINGS` §10 feed** [size: S] [risk: low] [HITL]
      done-when: `/insights` is defined (what it produces) AND its friction output flows into the §10 learnings review
      next: **define `/insights` first** — it's a planned idea, not built; a non-existent source can't be wired
      state: needs-info   (clarify/define the source before building)

> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

<!-- TD-NNN, separate from TASK-NNN. Never deleted — resolved → status: resolved → TASK-NNN.
     Filed by Sprint Close Retro. Aging at Promote: ≥3 sprints → re-review; high → auto P1.
     severity ∈ trivial · minor · medium · high. -->

- **TD-001** severity: medium | status: resolved → SPRINT-003 T1+T2 (2026-06-11)
  - Summary: `migrate`, `/council`, and the council→`verdict-<slug>.md`→ADR feed were **spec-only**. All three legs exercised on real input: migrate on the dev-flow copy (T1, full apply verified) · council 5-advisor + peer-review run (T2) · verdict → ADR-006 (the feed).
  - done-when: each exercised once on real input; behaviour confirmed. ✓
- **TD-002** severity: minor | status: resolved → SPRINT-005 T1 (2026-06-12)
  - Summary: `skills/council/SKILL.md` was ~341 lines. Resolved per ADR-006: executable artifacts (advisors · prompts · example) → `council/references/`; SKILL trimmed to 60.
- **TD-003** severity: minor | status: resolved → SPRINT-004 T1 (2026-06-12)
  - Summary: `skills/orchestrator/SKILL.md` was at the ~110 cap. Resolved by offloading the Review detail to `skills/orchestrator/references/review-scoping.md`; SKILL trimmed to 107 ≤ 110.
- **TD-004** severity: trivial | status: resolved → SPRINT-005 T1 (2026-06-12)
  - Summary: cap-rule vs reality inconsistency. Resolved: cap rule amended (ADR-006 wording — artifacts in `references/` don't count) in CLAUDE.md + DOCS_Guide §2; council now conforms, so no exception remains.
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
