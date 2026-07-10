---
sprint: 017
slug: doc-gen-features
owner: Maintainer
last_updated: 2026-07-10
status: closed
plan_commit: 1cb8fee
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
- [x] close (SKILL + DOCS_Guide §10) instructs the full-session TD/follow-up sweep
- [x] exercised once on real input — the sweep caught the qa-check-vs-stray-file item → **TASK-060** (L-007)
- [x] `lean-doc-generator/SKILL.md` ≤ 110 (held at 91; in-place)

### T2 — Make `migrate` re-runnable as a plugin-update sync `[size: M · risk: med]`  *(TASK-052)*
Layers: `skills/lean-doc-generator/SKILL.md` (migrate) · `references/DOCS_Guide.md`
Extend migrate so re-running it on an already-adopted repo pulls forward new standard/template changes
from a plugin update — **idempotent, reports what changed, never clobbers user edits** (the hard part:
distinguish template drift from the user's own edits).

**Acceptance:** re-running migrate on an adopted repo is idempotent when nothing changed, and on a
plugin update reports the specific standard/template deltas without overwriting user content; exercised once.

**DoD:**
- [x] migrate documents/handles the re-run (sync) path — idempotent, change-report, no clobber (report-only, A2)
- [x] exercised — traced consumer-update + idempotent self-case; spec-only (no harness, L-016), internally consistent
- [x] cap respected — SKILL 93/110; re-run procedure depth → `references/migration-map.md` (uncounted)

### T3 — Add `/lean-doc-generator init` mode (scope-interactive scaffold) `[size: M · risk: med]`  *(TASK-059)*
Layers: `skills/lean-doc-generator/SKILL.md` · `references/DOCS_Guide.md` · `templates/`
Add an `init` mode: scaffold a **fresh** repo's docs — always the core set, and **interactively scope**
which optional docs (DESIGN/RESEARCH/DEPLOY/…) to include by repo type. **Docs-only — never writes
`.claude/settings.json`.** Distinct from migrate (adopt-existing) per `docs/research/init-vs-migrate.md`.

**Acceptance:** `/lean-doc-generator init` on a scratch/empty dir scaffolds the core docs + only the
optional docs the user selects; writes no settings.json; exercised once on a real empty dir.

**DoD:**
- [x] `init` mode added (SKILL mode table row + 4-step procedure); scope-interactive optional-doc selection via popup
- [x] docs-only guarantee stated (no settings.json) — and verified in the exercise
- [x] exercised on real input — scaffolded the 5 core docs at correct placement into a scratch greenfield dir; **no settings.json** confirmed (L-007)
- [x] cap respected (SKILL 104/110); CONTEXT.md mode-row + ARCHITECTURE boundary updated (L-015); README enumerates no modes → no change

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

### 2026-07-10 | T1 done | close sweeps the full session
Added a full-session sweep to close: SKILL close row + Retro-at-close paragraph + DOCS_Guide §10 now
instruct sweeping the Execution Log AND mid-run surfaced-but-unfiled items for TD/follow-ups *before*
routing the four buckets. All in-place (SKILL 91/110). **L-007 exercise:** ran the sweep over this very
session → caught the qa-check-vs-stray-untracked-file observation (the mattpocock friction, never filed
in SPRINT-016) → filed **TASK-060**. The mechanism demonstrably recovers a real dropped item.

### 2026-07-10 | T2 done | migrate re-runnable as report-only sync
A2 resolved via popup → **report-only sync** (no provenance-marker machinery). Added the re-run path:
SKILL mode row + migrate paragraph (concise) + a full **Re-run (update sync — report-only)** section in
`references/migration-map.md`. Guarantees: idempotent · never auto-writes over existing docs · compares
*shape/convention* drift, not user prose. SKILL 91→93/110 (depth in the reference). Spec-only (L-016 —
no harness); traced the consumer-update + idempotent self-case for consistency.

### 2026-07-10 | T3 done | `/lean-doc-generator init` mode added
Added `init` — a scope-interactive greenfield scaffold (mode row + 4-step SKILL section): core docs
always, optional docs (DESIGN/DEPLOY/RESEARCH) offered by repo type via an **AskUserQuestion popup**,
**docs-only** (never settings.json). SKILL 93→104/110 (fits). CONTEXT mode-row + ARCHITECTURE boundary
updated (L-015); README enumerates no modes → no change. **L-007 exercise:** scaffolded the 5 core docs
at canonical placement (.claude/ for CLAUDE+CONTEXT, root for the rest) into a scratch greenfield dir —
files landed, **no settings.json** confirmed. Token-fill + popup are per-repo (popup dogfooded all session).
Distinct from migrate per D3 / init-vs-migrate.md.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/lean-doc-generator/SKILL.md` | T1·T2·T3 | close-sweep · migrate re-run · init mode (91→104/110) | Med | trace + scratch-dir exercise |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §10 full-session sweep | Low | trace |
| `skills/lean-doc-generator/references/migration-map.md` | T2 | Re-run (report-only sync) section | Low | trace |
| `.claude/CONTEXT.md` | T3 | `init` in the mode-row | Low | read-back |
| `docs/ARCHITECTURE.md` | T3 | `init` boundary note | Low | read-back |
| `TODO.md` | T1 | filed TASK-060 (from the sweep) | Low | — |

## Retro
<!-- Written at close. Route buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive → docs/sprint/archive/ + INDEX line. -->

**Retrieval check** — no miss/contradiction. Used L-016 (spec-only exercise where no harness), L-012
(reference depth for migrate re-run + kept init lean), L-042 (serial shared-file), L-015 (consumer
surface — CONTEXT/ARCHITECTURE updated).

**Worked**
- **T1 paid off immediately** — the new close-sweep, dogfooded at *this* close, caught the SKILL near-cap
  item (→ TD-008) that would otherwise have gone unfiled. The feature validated itself.
- **Report-only design (A2)** dodged all the provenance-marker machinery — the leanest no-clobber is to
  never write, only report.
- **Serial single-owner on `SKILL.md`** (D1) — three additions, three clean commits, no WIP contamination.
- **init exercised for real** — scaffolded the core set into a scratch greenfield dir; docs-only held.

**Friction**
- **`lean-doc-generator/SKILL.md` climbed 91→104/110** across three additions — the init section is the
  tightest fit. Near-cap watch → **TD-008** (relocate init depth to a reference if the next feature needs
  headroom, per L-012).

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- None new worth promoting — the sprint applied existing rules (L-016 · L-012 · L-042 · L-015).
