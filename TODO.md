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

> _(no active sprint — SPRINT-001 closed 2026-06-11; promote next from `ready` Backlog tasks)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

_(TASK-001 promoted → SPRINT-001 T1)_

### P1 — Next Phase Required

- [ ] **TASK-003 — Test `/lean-doc-generator migrate`** [size: M] [risk: med] [HITL]
      done-when: migrate run against a real dev-flow / adlc-flow repo; plan→approve→apply verified to not delete content
      touches: `skills/lean-doc-generator/references/migration-map.md`
      state: ready

- [ ] **TASK-009 — Define canonical doc placement (root vs docs/) and align prime + migrate** [size: M] [risk: low] [HITL]
      done-when: DOCS_Guide §2 has a Placement column (root: README · TODO — `.claude/`: CLAUDE · CONTEXT — `docs/`: the rest); `/prime` read-order lists the `docs/` paths first; migration-map gains relocate rules; generation targets the new paths
      touches: `skills/lean-doc-generator/references/DOCS_Guide.md` · `skills/prime/SKILL.md` · `skills/lean-doc-generator/references/migration-map.md` · `skills/lean-doc-generator/SKILL.md`
      assumes: README + TODO stay at root (daily working files); CLAUDE/CONTEXT stay in `.claude/`
      state: ready   (from L-001, dogfood feedback)

- [ ] **TASK-010 — Move the full grill to task-decomposer intake; thin orchestrator G2 to a residual check** [size: M] [risk: med] [HITL]
      done-when: grill moves (glossary challenge · sharpen fuzzy terms · edge-case invention · code cross-reference · prototype/council routing) live in `/task-decomposer` Clarify; the "don't re-interview" escape hatch tightened to zero-open-assumptions; orchestrator G2 keeps a residual grill check; sprint-bulk batch-G2 grills any task with unconfirmed `assumes:`; `/flow` text aligned
      touches: `skills/task-decomposer/SKILL.md` · `skills/orchestrator/SKILL.md` · `skills/flow/SKILL.md` · `.claude/CONTEXT.md` · `README.md`
      assumes: orchestrator keeps a thin grill for cold `quick`/`mvp` invocations (standalone contract)
      state: ready   (from L-002, dogfood feedback)

- [ ] **TASK-011 — Support parallel work streams — one sprint per stream** [size: M] [risk: med] [HITL]
      done-when: sprint frontmatter gains `stream:`; TODO § Active Sprint becomes a per-stream table; `/flow` rule becomes one-sprint-per-stream; `/prime` counts open DoD across all active sprints (reported per stream); batch-G2 flags cross-stream file overlap; single-stream repos see zero change
      touches: `templates/SPRINT.md.template` · `templates/TODO.md.template` · `skills/flow/SKILL.md` · `skills/prime/SKILL.md` · `skills/orchestrator/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `.claude/CONTEXT.md`
      assumes: streams are optional — the single-stream path stays the default and unchanged
      state: ready   (from L-003, dogfood feedback)

- [ ] **TASK-012 — Add DOCS_Guide §11 Retention (compress + archive) and wire doc-aging into promote governance** [size: M] [risk: med] [HITL]
      done-when: §11 defines TODO pruning (promoted-task tombstones deleted at close · resolved TD rows collapsed after 3 sprints · ~150-line soft cap) · CHANGELOG rotation (current + previous minor inline, older → `docs/changelog/`) · LEARNINGS collapse-on-promote · closed sprints → `docs/sprint/archive/` + one-line index; promote governance runs doc-aging next to TD aging
      touches: `skills/lean-doc-generator/references/DOCS_Guide.md` · `skills/lean-doc-generator/SKILL.md` · `templates/` (TODO · CHANGELOG · LEARNINGS · SPRINT)
      assumes: git history is the full audit trail — archives compress, never rewrite it
      depends-on: TASK-009 (archive paths assume the new placement)
      state: ready   (from L-004, dogfood feedback — promote after TASK-009, same-sprint ordering ok)

_(TASK-002 → SPRINT-001 T2 · TASK-004 → SPRINT-001 T3)_

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

---

## Changelog (current sprint only)

> Move to `docs/CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — the initial build is recorded in [`docs/CHANGELOG.md`](docs/CHANGELOG.md) (v0.1.0).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
