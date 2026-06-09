---
sprint: 001
slug: ship-and-validate
owner: Maintainer
last_updated: 2026-06-09
status: active
plan_commit: d8b09c0
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-001 — Ship & Validate

> **Theme:** Prove the foundation before extending it. Lock the build in (commit), run the loop once
> on real work to surface genuine gaps, and capture the build's own decisions as ADRs. No new
> features — foundations first, the curated way. Tier-0 of `TODO.md`.

## Scope

**In:** commit + push the v0.1.0 build · dogfood the full loop on one real feature · backfill ADRs for the build's architecture decisions.
**Out (deferred):** `migrate` test (TASK-003) · council slimming (TASK-005) · hooks / recon / insights (TASK-006–008). Slug confirmation + the actual `git push` are owner-action (below).

## Plan

### T1 — Commit + push the initial build `[size: S · risk: low]` — from TASK-001
Lock the whole build in (40 files, zero history) before anything else can drift it.
**Acceptance:** repo committed and pushed; GitHub slug confirmed in `plugin.json` + `marketplace.json`.
**DoD:**
- [x] GitHub slug confirmed (`aldianriski/lean-flow`) and correct in both manifests
- [x] Initial commit created (`d8b09c0` — conventional message)
- [x] Pushed to the remote → https://github.com/aldianriski/lean-flow (main)

### T2 — Dogfood the full loop on one real feature `[size: M · risk: med]` — from TASK-002
Run lean-flow end-to-end on a real change in another repo (umkm-indo) — the only way real gaps surface.
**Acceptance:** `/prime → /task-decomposer → promote → /orchestrator → close` run on a real change; every gap/friction captured to `LEARNINGS.md` (this seeds the §10 governance).
**DoD:**
- [ ] Loop run start-to-close on a real task
- [ ] Friction + gaps recorded in `LEARNINGS.md`
- [ ] Any confirmed bug filed (`TD-NNN` or `/diagnose`)

### T3 — Backfill ADRs for the build's decisions `[size: M · risk: low]` — from TASK-004
Capture the WHY behind the hard-to-reverse calls made during the build, in the rich per-file format.
**Acceptance:** `docs/adr/` holds an ADR for each; `DECISIONS.md` index built.
**DoD:**
- [x] ADR — Curated, not copied (the governing principle) → ADR-001
- [x] ADR — Leverage Claude built-ins; ship no agent definitions → ADR-002
- [x] ADR — Rich per-file ADRs in `docs/adr/` + `DECISIONS.md` index (vs minimal single-log) → ADR-003
- [x] ADR — `/council` admitted as an opt-in agent decision aid (drops absolute "no agents") → ADR-004
- [x] ADR — `/flow` opt-in conductor + the standalone contract → ADR-005
- [x] `DECISIONS.md` index lists all five

## Owner-action checklist
- [ ] Confirm the GitHub slug (`aldianriski/lean-flow` or correct it)
- [ ] Run `git push` (the skill never pushes)

## Decisions (pre-locked)
- **D1** — The first sprint is **ship + validate**, not feature work: a curated tool earns its next additions from *real usage*, not speculation. → qualifies as ADR (T3).

## Assumptions
- **A1** — A target repo (umkm-indo) is available to dogfood T2. *Confirm: owner.*
- **A2** — GitHub slug is `aldianriski/lean-flow`. *Confirm: owner (T1).*

## Execution Log

### 2026-06-09 | promote | sprint planned
Promoted TASK-001/002/004 from the Backlog (first run of `/lean-doc-generator promote` on lean-flow
itself). Governance review: no `LEARNINGS.md` yet; tech debt all `build-0`, none aged. Plan frozen.

### 2026-06-09 | T3 complete | ADRs backfilled (AFK)
Wrote ADR-001…005 (rich per-file) + the `DECISIONS.md` index — first real exercise of the ADR
generation flow (partially burns down **TD-001**: ADR path was spec-only).

### 2026-06-09 | T1 complete | shipped to GitHub
Initial commit `d8b09c0` (50 files) pushed to https://github.com/aldianriski/lean-flow (`main`).
Repo confirmed PUBLIC; slug verified across both manifests + README. **T2 (dogfood) remains** — needs
a target repo + a real feature; sprint stays `active` until then.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/adr/ADR-001…005-*.md` | T3 | NEW — capture the build's hard-to-reverse decisions (rich format) | Low | self |
| `DECISIONS.md` | T3 | NEW — ADR index | Low | — |

## Retro
_(written at close)_
