---
sprint: 017
slug: doc-gen-features
owner: Maintainer
last_updated: 2026-07-10
status: active
plan_commit: pending
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-017 — Doc-Gen Features

> **Theme:** Three consumer-facing `/lean-doc-generator` features from the backlog — close captures
> ALL session tech-debt/follow-ups (not just what's written down), migrate becomes a re-runnable
> plugin-update sync, and a new scope-interactive `init` scaffolds fresh repos. Ships as a v1.7.0 MINOR.

## Scope

**In:**
- close's §10 Retro routing sweeps the full session for TD + follow-ups (TASK-055).
- `migrate` is re-runnable as an idempotent plugin-update sync (TASK-052).
- `init` — a scope-interactive greenfield scaffold mode, docs-only (TASK-059).

**Out (deferred):** recon+tiers (TASK-056, needs `/council`) · brainstorming K1/K2 fold (TASK-058, P3) ·
blocked P3 items (006 · 040 · 047).

## Plan

### T1 — close: sweep the full session for TD + follow-ups `[size: M · risk: med]`  *(TASK-055)*
Layers: `skills/lean-doc-generator/SKILL.md` (close) · `references/DOCS_Guide.md` §10
Today close routes only the buckets already written into the sprint. Make its §10 Retro step actively
sweep the session (Execution Log + the live conversation's surfaced-but-unfiled items) for tech-debt
and follow-ups, so nothing said mid-sprint is lost at close.

**Acceptance:** close's procedure instructs a full-session sweep for TD/follow-ups → `TD-NNN`/`TASK-NNN`,
beyond items already recorded; exercised once (a mid-sprint aside becomes a filed item at close).

**DoD:**
- [ ] close (SKILL + DOCS_Guide §10) instructs the full-session TD/follow-up sweep
- [ ] exercised once on real input — a surfaced-but-unfiled item is captured at a close (L-007)
- [ ] `lean-doc-generator/SKILL.md` ≤ 110 (depth → `references/DOCS_Guide.md`, uncounted — L-012)

### T2 — Make `migrate` re-runnable as a plugin-update sync `[size: M · risk: med]`  *(TASK-052)*
Layers: `skills/lean-doc-generator/SKILL.md` (migrate) · `references/DOCS_Guide.md`
Extend migrate so re-running it on an already-adopted repo pulls forward new standard/template changes
from a plugin update — **idempotent, reports what changed, never clobbers user edits** (the hard part:
distinguish template drift from the user's own edits).

**Acceptance:** re-running migrate on an adopted repo is idempotent when nothing changed, and on a
plugin update reports the specific standard/template deltas without overwriting user content; exercised once.

**DoD:**
- [ ] migrate documents/handles the re-run (sync) path — idempotent, change-report, no clobber
- [ ] exercised once on real input — a re-run reports "no change" then a simulated template delta (L-007)
- [ ] cap respected (depth → DOCS_Guide.md)

### T3 — Add `/lean-doc-generator init` mode (scope-interactive scaffold) `[size: M · risk: med]`  *(TASK-059)*
Layers: `skills/lean-doc-generator/SKILL.md` · `references/DOCS_Guide.md` · `templates/`
Add an `init` mode: scaffold a **fresh** repo's docs — always the core set, and **interactively scope**
which optional docs (DESIGN/RESEARCH/DEPLOY/…) to include by repo type. **Docs-only — never writes
`.claude/settings.json`.** Distinct from migrate (adopt-existing) per `docs/research/init-vs-migrate.md`.

**Acceptance:** `/lean-doc-generator init` on a scratch/empty dir scaffolds the core docs + only the
optional docs the user selects; writes no settings.json; exercised once on a real empty dir.

**DoD:**
- [ ] `init` mode added (SKILL mode table + procedure); scope-interactive optional-doc selection
- [ ] docs-only guarantee stated (no settings.json)
- [ ] exercised once on real input — init on a scratch dir produces the scoped doc set (L-007)
- [ ] cap respected (depth → DOCS_Guide.md); CONTEXT.md + README updated if the mode roster is user-visible

## Owner-action checklist
- (none)

## Decisions (pre-locked)
- **D1 — Overlap ownership.** T1·T2·T3 all edit `skills/lean-doc-generator/SKILL.md`; T1·T2·T3 also touch
  `references/DOCS_Guide.md`. Single owner = this sprint (serial); **commit order T1 → T2 → T3**; stage
  the shared files per-hunk, never a plain `git add` over another task's WIP (L-042/L-037).
- **D2 — Cap landing.** `lean-doc-generator/SKILL.md` at 91/110 (comfortable), but `init` (T3) is the
  biggest add — land depth in `references/DOCS_Guide.md` (uncounted, ADR-006), keep SKILL lean.
- **D3 — Consumer-facing MINOR.** New `init` mode + migrate re-run + close-sweep are user-visible →
  **v1.7.0 by hand at close** (manifests lockstep + CHANGELOG); check README/CONTEXT for the mode roster (L-015).

## Assumptions
- **A1** — `init` = core docs always + interactive optional-doc scoping by repo type; docs-only.
  *Confirm: `docs/research/init-vs-migrate.md` (the TASK-051 decision).*
- **A2** — migrate re-run must distinguish template drift from user edits to avoid clobbering.
  *Confirm: the no-clobber mechanism at G2/build (this is the task's real risk).*
- **A3** — "sweep the session" (T1) = close reviews the Execution Log + surfaced-but-unfiled items from
  the run. *Confirm: the sweep mechanism at G2.*

## Execution Log

### 2026-07-10 | promote | plan locked
Formed after SPRINT-016 close (user chose the lean-doc-generator feature batch). Governance: promoted
**L-017 → CLAUDE.md anti-pattern** (count 2) before planning. Shared-file overlap on
`lean-doc-generator/SKILL.md` locked serial in D1 (T1→T2→T3).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro
<!-- Written at close. Route buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive → docs/sprint/archive/ + INDEX line. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
