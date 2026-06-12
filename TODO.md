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

> **SPRINT-006 — Review Depth & Context Diet** · status: active · 2 tasks (TASK-026·027)
> → [`docs/sprint/SPRINT-006-review-depth-and-context-diet.md`](docs/sprint/SPRINT-006-review-depth-and-context-diet.md)
> _(TASK-017 v1.0 gate: TASK-027 here resolves the last blocker TD-005)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] **TASK-017 — v1.0 release checklist (umbrella)** [size: S] [risk: low] [HITL]
      done-when: TASK-003 · 005 · 013–016 closed; TD-005 resolved (CONTEXT ≤ cap or cap revised); final link/path consistency grep clean; manifests bumped 1.0.0 lockstep
      touches: `.claude-plugin/` · `docs/CHANGELOG.md`
      depends-on: TD-005 (TASK-005 closed via SPRINT-005; TASK-003 · 013…016 via SPRINT-003)
      state: blocked   (waiting on TD-005 only — TASK-027 addresses it)

- TASK-027 — CONTEXT.md diet / resolve TD-005 → promoted to SPRINT-006 (T2)

### P2 — Quality / Polish

- TASK-026 — Scale review depth (single scoped reviewer; `/code-review` for large/high-risk) → promoted to SPRINT-006 (T1)

### P3 — Long-term

- [ ] **TASK-006 — Evaluate an opt-in PreToolUse gate-guard hook** [size: M] [risk: med] [HITL]
      done-when: decision recorded (ADR) on whether enforced gates are worth a hook — *after* learning hooks
      state: blocked   (depends-on: learning Claude Code hooks)
- [ ] **TASK-007 — Evaluate a tuned `recon` agent vs built-in `Explore`** [size: S] [risk: low] [HITL]
      done-when: decision recorded — only if Explore's brief proves insufficient in real use
      state: needs-info
- [ ] **TASK-008 — Wire `/insights` → `LEARNINGS` governance feed** [size: S] [risk: low] [AFK]
      done-when: friction from `/insights` flows into the §10 learnings review
      state: needs-info

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
- **TD-005** severity: medium | status: open | created: Sprint-002 (worsened SPRINT-004: 137 → 151)
  - Summary: `.claude/CONTEXT.md` is **151 lines** against its own 100-line cap — the SSOT violates the standard it anchors. Bumped minor → medium at SPRINT-004 close (the tier-map section pushed it ~50% over). Surfaced by the Sprint-002 review pass.
  - done-when: CONTEXT.md ≤ 100 lines via content diet (move detail to skill references), or the cap is formally revised in DOCS_Guide §2.

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
