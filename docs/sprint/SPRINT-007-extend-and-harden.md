---
sprint: 007
slug: extend-and-harden
owner: Maintainer
last_updated: 2026-06-16
status: active
plan_commit: pending
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-007 — Extend & Harden

> **Theme:** Harvest the daily-project (Kalasuara) experience into the plugin. Two new doc-type
> templates (research · deploy) extend lean-doc-generator's set; battle-tested learnings become
> durable rules (stream/commit discipline · three skill red-flags); and dead weight is pruned
> (graphify). Curated, not copied — every item cleared the bar at decompose + triage.

## Scope

**In:** RESEARCH + DEPLOY doc-type templates · stream/commit-contamination hardening (shipped surface + CLAUDE/CONTEXT) · three skill red-flags from the mine · LEARNINGS `related:` field · graphify removal · **adopter transition path** (migrate + upgrade notes).
**Out (deferred):** TASK-006 (gate-guard hook — blocked) · TASK-008 (`/insights` — needs-info) · the ~37 Kalasuara-domain learnings (CSS/CMS/SEO — not generalizable) · push automation in `/release-patch` (core principle — never). **Version:** feature sprint → MINOR bump `1.0.0 → 1.1.0` by hand at close (release-patch is PATCH-only).

## Plan

### T1 — Harden stream/commit model from L-042 + L-037 `[size: M · risk: med]`
Layers: `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · **shipped surface** — `skills/orchestrator/SKILL.md` (G2) + `templates/SPRINT.md.template` (stream note).
lean-flow's own L-003 flagged stream collision; Kalasuara **L-042** proved it bites at the *commit*
phase (`git add <shared>` stages another stream's WIP → mis-attributed, hard-to-reverse commit), and
**L-037** says lock overlap-ownership in G2. Encode both so the loop prevents it. Do first — it
establishes the rule the rest of this sprint must follow on shared files (D1).

**Acceptance:** CLAUDE.md carries the commit-contamination anti-pattern; CONTEXT § Streams + § Gates(G2) carry the commit-phase rule + overlap-ownership-mapping; caps respected.

**DoD:**
- [ ] CLAUDE.md anti-pattern: shared-file commits contaminate at the COMMIT phase, not just merge → serialize the stream, or `git add -p <shared>` + verify `git diff --cached` before commit; never plain `git add <shared>` while another stream has WIP in it
- [ ] CONTEXT § Sprint model/Streams gains the commit-phase rule (extends "coordinate, never parallel-build")
- [ ] CONTEXT § Gates/G2 gains an overlap-ownership-mapping step (map DoD + cross-task file overlap → single owner + order, before first task)
- [ ] **rule also lands in a SHIPPED surface** — orchestrator SKILL G2 step + `SPRINT.md.template` stream note — so adopters get it, not only lean-flow's internal CLAUDE/CONTEXT
- [ ] cross-checked vs L-003; CLAUDE.md ≤80, CONTEXT ≤130 caps respected

### T2 — Add RESEARCH doc type: template + `docs/research/` convention `[size: M · risk: low]`
Layers: `skills/lean-doc-generator/templates/RESEARCH.md.template` · `references/DOCS_Guide.md` (§2) · `lean-doc-generator/SKILL.md` · `.claude/CONTEXT.md` (doc standard) · `README.md` (artifacts).
Capture desk/options research (question → sources → findings → recommendation → feeds an ADR) — the
gap between `/prototype` (design you must *feel*) and `/council` (hard fork). No new skill (the
deep-research built-in conducts; the template captures).

**Acceptance:** RESEARCH.md.template exists; DOCS_Guide §2 lists it + `docs/research/` placement; SKILL routes to it; **rendered once on a real research question.**

**DoD:**
- [ ] RESEARCH.md.template added (question · sources · findings · recommendation · feeds-ADR), WHY/WHERE only
- [ ] DOCS_Guide §2 row + `docs/research/` placement added
- [ ] lean-doc-generator SKILL.md routes to it (when to use; boundary vs `/prototype` + `/council`)
- [ ] CONTEXT doc-standard + README artifacts table updated
- [ ] rendered once on a real research question (anti spec-only-debt)

### T3 — Add DEPLOY doc type: template + `/release-patch` pointer `[size: M · risk: low]`
Layers: `templates/DEPLOY.md.template` · `references/DOCS_Guide.md` (§2) · `skills/release-patch/SKILL.md` · `.claude/CONTEXT.md` · `README.md`.
Generalize a real DEPLOY.md into a host-repo standard-release template; fold **L-010** (server-snapshot
reconcile before deploy) + **L-030** (ops traps: watcher self-match, LLM-call throttle). `/release-patch`
points to it but still hard-stops before push. Shares files with T2 → after T2 (D1).

**Acceptance:** DEPLOY.md.template exists; DOCS_Guide §2 placement; release-patch stop-message points to it; **rendered once on a real release**; release-patch still never pushes.

**DoD:**
- [ ] DEPLOY.md.template added (snapshot-reconcile · ops traps · rollback · verify-by-real-signal)
- [ ] DOCS_Guide §2 row + `docs/` placement
- [ ] `/release-patch` SKILL stop-message points to DEPLOY.md; still hard-stops before push
- [ ] CONTEXT + README updated
- [ ] rendered once on a real release

### T4 — Three targeted skill red-flags from the mine `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md` · `skills/task-decomposer/SKILL.md` · `skills/tdd` or `diagnose/SKILL.md`.
Promote three generalizable Kalasuara learnings into skill red-flags.

**Acceptance:** each red-flag present in the matching SKILL, ≤2 lines, caps respected.

**DoD:**
- [ ] orchestrator red-flag (L-024: don't silently flip an encoded safeguard/doctrine under autonomy/sprint-bulk — gate default-OFF + surface the conflict for owner decision)
- [ ] task-decomposer red-flag (L-017: pin a domain term with a concrete example, not a multiple-choice option — MCQ captures preference, not definition)
- [ ] tdd|diagnose red-flag (L-016: gate the commit on the test-runner exit code, not grep-filtered output)
- [ ] each ≤2 lines; SKILL caps respected

### T5 — Upgrade LEARNINGS template: add `related:` cross-link field `[size: S · risk: low]`
Layers: `skills/lean-doc-generator/templates/LEARNINGS.md.template`.
The Kalasuara ledger cross-links sibling learnings (`related:`) — richer recall. Bring the field into
the template.

**Acceptance:** template carries `related:` + guidance + an updated example.

**DoD:**
- [ ] `related:` line + one-line guidance added
- [ ] filled example entry shows it

### T6 — Remove graphify integration; leave one on-demand pointer `[size: S · risk: low]`
Layers: `skills/prime/SKILL.md` · `README.md` · `docs/ARCHITECTURE.md` · `.claude/CONTEXT.md` (Orientation) · `docs/adr/ADR-007` (cross-ref only).
Verdict (this session): graphify output is redundant vs the curated doc set + `Explore` for daily
work. Strip the "optional orientation source" wiring; keep one honest on-demand pointer. Shares
CONTEXT + README → last among the shared-file tasks (D1).

**Acceptance:** the 6 mention sites cleaned to a single CONTEXT pointer; archived SPRINT-006 untouched.

**DoD:**
- [ ] graphify wiring stripped from prime/SKILL.md · README · ARCHITECTURE.md · CONTEXT Orientation · ADR-007 cross-ref
- [ ] single CONTEXT pointer added: *"graphify is a fine on-demand tool for onboarding an unfamiliar repo or a pre-refactor audit — lean-flow neither integrates nor depends on it"*
- [ ] archived SPRINT-006 left untouched (history)

### T7 — Smooth upgrade path for existing adopters (TASK-034) `[size: M · risk: low]`
Layers: `skills/lean-doc-generator/references/migration-map.md` · `skills/lean-doc-generator/templates/LEARNINGS.md.template` (optional-field note) · `docs/CHANGELOG.md` (upgrade notes).
A plugin update shouldn't break or strand existing adopters. `migrate` is the on-ramp: teach it the
new doc types, keep the LEARNINGS change backward-compatible, and surface the one behavior change
(graphify). Runs **last** — depends on T2/T3/T5/T6 existing. Files are unshared with the D1 set, so
no new contention.

**Acceptance:** a dry-run `migrate` on a repo with an ad-hoc DEPLOY note + a `graphify-out/` + a pre-`related` LEARNINGS.md produces a correct, **non-destructive** plan; CHANGELOG carries an upgrade-notes block.

**DoD:**
- [ ] `migration-map.md` gains rows: existing ad-hoc deploy doc / `deploy/` → `docs/DEPLOY.md` via template · research/spike notes → `docs/research/` via template (Placement + Known/Generic sections)
- [ ] LEARNINGS `related:` documented as **optional + additive** — migrate does NOT backfill existing ledgers; entries without it stay conforming (backward-compat)
- [ ] migrate detect/plan recognizes a user's `graphify-out/` + graphify mentions → notes lean-flow no longer integrates it (on-demand now); offers leave/clean, **never auto-deletes** user content
- [ ] `docs/CHANGELOG.md` v1.1.0 entry carries an **"Upgrade notes (existing users)"** block: new opt-in doc types · LEARNINGS field additive · graphify now on-demand
- [ ] dry-run migrate on the synthetic repo yields a correct non-destructive plan (exercise-on-real-input)

## Owner-action checklist
- [ ] At close: MINOR version bump `plugin.json` + `marketplace.json` `1.0.0 → 1.1.0` (lockstep) — by hand (release-patch is PATCH-only).

## Decisions (pre-locked)
- **D1** — **Shared-file edit order locked** (the L-037/L-042 lesson applied to this sprint): on `.claude/CONTEXT.md` → T1 → T2 → T3 → T6; on `README.md` → T2 → T3 → T6; on `DOCS_Guide §2` + version files → T2 → T3. Single owner, sequential — do **not** `/batch`-parallelize these tasks. No ADR (process rule).
- **D2** — **graphify integration removed**, kept as an optional on-demand pointer only. WHY: redundant vs the curated doc set (ARCHITECTURE + `Explore`) for daily work. *Reopen-if:* onboarding large *unfamiliar* repos becomes a common lean-flow use case. No ADR (easy to reverse).

## Assumptions
- **A1** — Research/Deploy/Learnings docs stay WHY/WHERE only. *Confirm: HOW filter at write (DOCS_Guide §5).*
- **A2** — Research doc = desk-synthesis capture, not a new skill. *Confirmed at decompose.*
- **A3** — Deploy = template + pointer, no push automation. *Confirmed.*
- **A4** — Mine = generalizable-only (L-042 · L-037 · L-024 · L-017 · L-016). *Confirmed.*

## Execution Log
<!-- Append-only, dated. Surprises, scope additions, completions. Plan frozen at promote. -->

### 2026-06-16 | promote | Plan locked
Seven tasks: TASK-031/028/029/032/030/033 pulled from Backlog (dependency order) + **TASK-034 (T7) added at promote** — adopter transition path, surfaced when planning revealed lean-flow's own CLAUDE/CONTEXT aren't shipped to users. Governance review clean (no learning at count≥2, no aged/high TD). Single-stream.

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro
<!-- Written at close. Route buckets per DOCS_Guide §10. -->

**Worked**
- _(at close)_

**Friction**
- _(at close)_

**Pattern candidate**
- _(at close)_
