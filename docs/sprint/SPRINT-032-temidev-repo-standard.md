---
sprint: 032
slug: temidev-repo-standard
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: ba30a52
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-032 — TemiDev Repo-Structure Standard

> **Theme:** Adopt the TemiDev repo-structure standard **in full** as lean-doc-generator's consumer
> surface — the mandatory-minimum doc set, TemiDev placements, and the what-belongs-in-Git boundary
> rule become the lean standard's core. One sprint, whole standard: a partial adoption would strand
> two naming conventions and half-wired scaffolds (the L-020 trap).

## Scope

**In:** DOCS_Guide §2 rewritten around the TemiDev core + ADR-012 · four colliding core templates
relocated (ARCHITECTURE/SETUP/DEPLOY/CHANGELOG) + readers rewired · new templates (root files ·
backend tree · medium/complex tree) · what-belongs-in-Git boundary section · migration map update +
three-tier consumer verify.
**Out (deferred):** migrating lean-flow's OWN repo to the new layout (later `migrate` re-run flags
it) · API-spec content generation (placement rule only) · any `.claude/settings.json` writes ·
multi-stream changes.

## Plan

<!-- Shared-file ownership (G2 overlap map): `DOCS_Guide.md` + `lean-doc-generator/SKILL.md` are
     touched by nearly every task — T1 owns the §2 rewrite; T3–T6 append rows/gates serially in
     commit order T3 → T4 → T5 → T6 (never parallel on these two files). Templates are disjoint. -->

### T1 — Rewrite DOCS_Guide core set to the TemiDev structure + record ADR-012 `[size: M · risk: high]`
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` · `docs/adr/` · `docs/DECISIONS.md`
The SSOT change everything else hangs off: §2 lists the TemiDev mandatory minimum as core (new
placements canonical, legacy second), tier gating (base / backend-integration / medium-complex)
replaces §6, LAW-1 reinterpretation stated. ADR-012 records the full-adoption decision + deviations.

**Acceptance:** DOCS_Guide §2/§6 reflect the TemiDev core + tiers; ADR-012 exists (full-adoption ·
placement-wins · AGENTS-pointer · CHANGELOG always-core · init non-doc loosening) with DECISIONS row.

**DoD:**
- [ ] §2 table rewritten — TemiDev mandatory minimum core, per-file caps + owners, legacy paths second
- [ ] §6 tier model replaced by base / backend-integration / medium-complex gating
- [ ] LAW-1 reinterpretation stated (mandatory minimum scaffolded at init; non-mandatory create-lazily)
- [ ] ADR-012 written per template + `docs/DECISIONS.md` row; supersession of prior placement noted

### T2 — Relocate colliding core templates to TemiDev placement + rewire readers `[size: M · risk: high]`
Layers: `skills/lean-doc-generator/templates/` · `skills/prime/SKILL.md` · `skills/release-patch/SKILL.md` · `skills/lean-doc-generator/SKILL.md`
ARCHITECTURE→`docs/architecture/overview.md` · SETUP→`docs/development/setup.md` ·
DEPLOY→`docs/deployment/{deployment-guide,rollback-guide}.md` · CHANGELOG→root. Every reader follows:
/prime slots, release-patch prepend target, §11 rotation, sprint promote/close refs.

**Acceptance:** /prime passes on BOTH layouts (new canonical first, legacy matched second);
release-patch prepends root CHANGELOG.md with legacy fallback.

**DoD:**
- [ ] Four templates renamed/split to new canonical paths (DEPLOY splits into deployment+rollback)
- [ ] /prime read-order slots updated (canonical first, legacy second)
- [ ] release-patch prepend target + §11 rotation paths updated (archives stay `docs/changelog/`)
- [ ] /prime traced on a legacy-layout fixture AND a new-layout fixture — both read cleanly

### T3 — Add root-file templates: CONTRIBUTING · SECURITY · AGENTS-pointer · .env.example/.gitignore/LICENSE `[size: M · risk: med]`
Layers: `skills/lean-doc-generator/templates/` · DOCS_Guide §2 · `skills/lean-doc-generator/SKILL.md` (init)
The TemiDev root set. AGENTS.md is a ~10-line pointer to `.claude/CLAUDE.md` (zero duplication).
Folds in **TD-008**: relocate init's procedure detail to `references/` before growing it (L-012).

**Acceptance:** init on a scratch repo scaffolds all six per repo type without overwriting existing
files; SKILL.md stays ≤110 with init detail relocated to a reference.

**DoD:**
- [ ] CONTRIBUTING + SECURITY + AGENTS templates exist with §2 rows + caps + ownership headers
- [ ] init offers .env.example/.gitignore/LICENSE per G2-settled non-doc rule (never-overwrite)
- [ ] TD-008 fold-in: init detail → `references/`; SKILL.md ≤110 verified
- [ ] Scratch-repo init exercised — six files land, existing files untouched

### T4 — Add backend/integration doc-tree templates: database/ · api/ · architecture siblings `[size: M · risk: med]`
Layers: `skills/lean-doc-generator/templates/` · DOCS_Guide §2 · `skills/lean-doc-generator/SKILL.md` (init)
erd (Mermaid) · schema · migration-guide · architecture/{data-flow,authentication,integrations}.
openapi.yaml gets a placement rule only — spec content is project-generated, not doc-generator business.

**Acceptance:** init's backend/integration gate scaffolds exactly this set; §2 rows present.

**DoD:**
- [ ] database/{erd,schema,migration-guide} templates (ERD in Mermaid) with §2 rows
- [ ] architecture/{data-flow,authentication,integrations} templates with §2 rows
- [ ] openapi.yaml placement rule recorded (no template)
- [ ] Backend-gate init exercised on a scratch repo — exact set scaffolds

### T5 — Add product/flows/testing/coding-standards templates (medium/complex gate) `[size: M · risk: med]`
Layers: `skills/lean-doc-generator/templates/` · DOCS_Guide §2 · `skills/lean-doc-generator/SKILL.md` · `skills/task-decomposer/SKILL.md`
product/{requirements,acceptance-criteria} · flows/ (Mermaid) · testing/testing-guide ·
development/coding-standards. task-decomposer's PRD output gains its durable home.

**Acceptance:** medium/complex init gate scaffolds the set; task-decomposer PRD notes
`docs/product/requirements.md` as its durable home.

**DoD:**
- [ ] product/{requirements,acceptance-criteria} + flows + testing-guide + coding-standards templates with §2 rows
- [ ] task-decomposer PRD output wired to `docs/product/requirements.md`
- [ ] Medium/complex-gate init exercised on a scratch repo — exact set scaffolds

### T6 — Add "what belongs in Git" boundary section + wire into init/migrate `[size: S · risk: med]`
Layers: DOCS_Guide.md · `skills/lean-doc-generator/SKILL.md` · `references/migration-map.md`
The decision rule + never-commit lists (secrets · contracts · PII · backups · design sources ·
meeting notes → proper homes: secret manager · document storage · PM tool · design tool).

**Acceptance:** init scaffolds .gitignore from the boundary rule; migrate's adoption scan flags
committed violations report-only.

**DoD:**
- [ ] Boundary section in DOCS_Guide (decision rule + never-commit lists + proper-home table)
- [ ] init .gitignore scaffold derives from it
- [ ] migrate adoption scan flags violations (report-only) — traced on a fixture with a planted `.env`

### T7 — Update migration map for legacy-lean → TemiDev layout + end-to-end consumer verify `[size: M · risk: med]`
Layers: `references/migration-map.md` · README.md · `.claude/CONTEXT.md` · CHANGELOG
depends-on: T2–T6. The L-016 consumer-path proof: init exercised at all three tiers on scratch
fixtures, /prime reads each cleanly; legacy-lean repos get a relocation proposal via migrate re-run.

**Acceptance:** three-tier fixture verify passes; README + CHANGELOG + CONTEXT §Doc standard reflect
the new standard; migrate re-run on a legacy layout proposes relocation, never clobbers.

**DoD:**
- [ ] migration-map legacy-lean → new-canonical mapping added (re-run sync proposes, never clobbers)
- [ ] init exercised at base / backend / medium-complex tiers — /prime reads each cleanly
- [ ] README + CHANGELOG + CONTEXT.md §Doc standard updated (consumer-facing surface, L-015)

## Owner-action checklist
- [ ] None — all-dev sprint.

## Decisions (pre-locked)
- **D1** — Full adoption of the TemiDev repo-structure standard as the consumer core (not curated-delta). **→ ADR-012** (T1).
- **D2** — TemiDev placement wins on collisions; legacy lean paths stay matched second (no breaking change for adopted repos).
- **D3** — AGENTS.md = thin pointer to `.claude/CLAUDE.md`; CLAUDE/CONTEXT remain the real AI-instruction surface.
- **D4** — Deviation: CHANGELOG stays always-core (sprint close writes it every sprint; TemiDev gates it to medium+).
- **D5** — init's docs-only rule loosens for exactly `.env.example`/`.gitignore`/`LICENSE`, never-overwrite — settle final wording at G2, record in ADR-012.
- **D6** — TD-008 mitigation folds into T3 (init detail → `references/` before the section grows).

## Assumptions
- **A1** — lean-flow's own repo does NOT migrate now. *Confirm: owner said consumer-surface only; T7 keeps it Out.*
- **A2** — Tier gating: mandatory always · backend adds api+integrations · medium/complex adds adr+flows. *Confirm: TemiDev doc's conditional minimums; init popup defaults by manifest.*
- **A3** — Rotation archives stay `docs/changelog/` after CHANGELOG moves to root. *Confirm: T2, §11 wording.*
- **A4** — Lean discipline (ownership headers · WHY/WHERE · per-file caps) persists on every new template. *Confirm: T1 §2 table assigns caps.*

## Execution Log
<!-- Append-only, dated. Plan frozen at promote. -->

### 2026-07-29 | promote | Plan locked
7 Backlog tasks (TASK-067…073) pulled in dependency order; governance checklist signed off
(no L-promotions due · TD-008 folded into T3 · no doc-aging). Decisions D1–D5 pre-locked from
intake grill (full adoption · placement wins · AGENTS pointer · CHANGELOG deviation · init loosening).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate**
-
