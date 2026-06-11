---
owner: Maintainer
last_updated: 2026-06-11
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

> _(no active sprint — SPRINT-002 closed 2026-06-11, archived per §11; promote next from `ready` Backlog tasks)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] **TASK-003 — Test `/lean-doc-generator migrate`** [size: M] [risk: med] [HITL]
      done-when: migrate run against a real dev-flow / adlc-flow repo; plan→approve→apply verified to not delete content
      touches: `skills/lean-doc-generator/references/migration-map.md`
      state: ready

### P2 — Quality / Polish

- [ ] **TASK-005 — Decide council size: slim or formalise the exception** [size: S] [risk: low] [HITL]
      done-when: `/council` either trimmed toward the cap, or its over-cap status documented as an accepted exception in CLAUDE.md
      touches: `skills/council/SKILL.md` · `.claude/CLAUDE.md`
      state: needs-info

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

- **TD-001** severity: medium | status: open | created: build-0
  - Summary: `migrate`, `/council`, and the council→`verdict-<slug>.md`→ADR feed are **spec-only** — defined but never executed against a real repo.
  - done-when: each exercised once on real input; behaviour confirmed.
- **TD-002** severity: minor | status: open | created: build-0
  - Summary: `skills/council/SKILL.md` is ~331 lines, far over the ~110 SKILL cap (faithful multi-agent method). Tracked under TASK-005.
- **TD-003** severity: minor | status: open | created: build-0
  - Summary: `skills/orchestrator/SKILL.md` is at the ~110 cap — further wiring risks overflow; may need to push detail into a reference.
- **TD-004** severity: trivial | status: open | created: build-0
  - Summary: CLAUDE.md states a ~110 SKILL cap that `/council` violates — cap-rule vs reality inconsistency (council is the documented exception, but the rule reads absolute).
- **TD-005** severity: minor | status: open | created: Sprint-002
  - Summary: `.claude/CONTEXT.md` is ~137 lines against its own 100-line cap (pre-existing; +4 this sprint) — the SSOT violates the standard it anchors. Surfaced by the Sprint-002 review pass.
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
