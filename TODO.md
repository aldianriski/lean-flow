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

> _(no active sprint — SPRINT-004 closed 2026-06-12, archived per §11; TASK-017's v1 gate still waits
> on TASK-005 + TD-005)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] **TASK-017 — v1.0 release checklist (umbrella)** [size: S] [risk: low] [HITL]
      done-when: TASK-003 · 005 · 013–016 closed; TD-005 resolved (CONTEXT ≤ cap or cap revised); final link/path consistency grep clean; manifests bumped 1.0.0 lockstep
      touches: `.claude-plugin/` · `docs/CHANGELOG.md`
      depends-on: TASK-005 (TASK-003 · 013…016 closed via SPRINT-003)
      state: blocked   (waiting on TASK-005 + TD-005)

### P2 — Quality / Polish

- [ ] **TASK-005 — Conform `/council` under the amended cap rule (ADR-006)** [size: S] [risk: low] [HITL]
      done-when: advisor definitions + prompt templates + worked example → `skills/council/references/`; SKILL.md ≤ ~110 (when-to-use · 6-step outline · red flags · per-step read pointers); the amended cap rule written into CLAUDE.md/CONTEXT.md/DOCS_Guide §2 (resolves TD-002 + TD-004)
      touches: `skills/council/` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `skills/lean-doc-generator/references/DOCS_Guide.md`
      state: ready   (decision input: ADR-006, council-pressure-tested 2026-06-11)

- [ ] **TASK-023 — Exercise the migrate consolidation sweep on a real repo** [size: S] [risk: low] [HITL]
      done-when: `/lean-doc-generator migrate` run on a real repo with known duplicate/orphan/stale docs; consolidate + retire proposed, approved per-item, applied; archive-default + gated hard-delete confirmed; zero un-approved deletions (diff verified)
      assumes: a repo with cleanup candidates is available (a dev-flow copy served prior migrate validation)
      state: ready   (from SPRINT-004 T5 — spec shipped, unexercised; L-007)

- [ ] **TASK-024 — Exercise changelog-only release-patch + diff-scoped review on real code** [size: S] [risk: low] [HITL]
      done-when: on a manifestless repo, release-patch emits a changelog-only entry (no bump); on a real code diff, the diff-scoped review skip table fires correctly (security surface → `/security-review` · behaviour unchanged → skip `/verify` · already-read → skip `Explore`); both confirmed on real input
      assumes: none
      state: ready   (from SPRINT-004 T3 + T1b — spec/doc-exercised only; L-007)

- [ ] **TASK-025 — Fix close→release-patch handoff for sprint scope (multi-commit + MINOR)** [size: S] [risk: med] [HITL]
      done-when: release-patch (or the close step) scans the sprint range `plan_commit..HEAD`, not `HEAD~1..HEAD` (else the docs-only close commit makes it wrongly skip); a feature sprint (MINOR) is routed to a by-hand MINOR path instead of a PATCH bump / skip; documented in release-patch + the close step
      touches: `skills/release-patch/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `skills/orchestrator/SKILL.md`
      assumes: none — discovered at SPRINT-004 close (T3 auto-handoff is wired but mis-scopes for a feature/multi-commit sprint)
      state: ready   (from SPRINT-004 close)

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
- **TD-002** severity: minor | status: open | created: build-0
  - Summary: `skills/council/SKILL.md` is ~331 lines, far over the ~110 SKILL cap (faithful multi-agent method). Tracked under TASK-005.
- **TD-003** severity: minor | status: resolved → SPRINT-004 T1 (2026-06-12)
  - Summary: `skills/orchestrator/SKILL.md` was at the ~110 cap. Resolved by offloading the Review detail to `skills/orchestrator/references/review-scoping.md`; SKILL trimmed to 107 ≤ 110.
- **TD-004** severity: trivial | status: open | created: build-0
  - Summary: CLAUDE.md states a ~110 SKILL cap that `/council` violates — cap-rule vs reality inconsistency (council is the documented exception, but the rule reads absolute).
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
