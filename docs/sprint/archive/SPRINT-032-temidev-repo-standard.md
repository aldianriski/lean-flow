---
sprint: 032
slug: temidev-repo-standard
owner: Maintainer
last_updated: 2026-07-29
status: closed
plan_commit: ba30a52
close_commit: 94da637
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
- [x] §2 table rewritten — TemiDev mandatory minimum core, per-file caps + owners, legacy paths second
- [x] Per-doc lifecycle contract (LAW 3) on every §2 row — create trigger · update trigger (the event, e.g. schema.md ← migration lands) · archive/retention trigger
- [x] §6 tier model: base / backend-integration / medium-complex gating + **multi-service top tier retained** (service registry · dependency map · global decisions)
- [x] Cap-hit growth rule stated — a core file at its cap **splits into its tree** (overview → siblings), never compresses signal away
- [x] LAW-1 reinterpretation stated (mandatory minimum scaffolded at init; non-mandatory create-lazily)
- [x] ADR-012 written per template + `docs/DECISIONS.md` row; supersession of prior placement noted

### T2 — Relocate colliding core templates to TemiDev placement + rewire readers `[size: M · risk: high]`
Layers: `skills/lean-doc-generator/templates/` · `skills/prime/SKILL.md` · `skills/release-patch/SKILL.md` · `skills/lean-doc-generator/SKILL.md`
ARCHITECTURE→`docs/architecture/overview.md` · SETUP→`docs/development/setup.md` ·
DEPLOY→`docs/deployment/{deployment-guide,rollback-guide}.md` · CHANGELOG→root. Every reader follows:
/prime slots, release-patch prepend target, §11 rotation, sprint promote/close refs.

**Acceptance:** /prime passes on BOTH layouts (new canonical first, legacy matched second);
release-patch prepends root CHANGELOG.md with legacy fallback.

**DoD:**
- [x] Four templates renamed/split to new canonical paths (DEPLOY splits into deployment+rollback)
- [x] /prime read-order slots updated (canonical first, legacy second)
- [x] release-patch prepend target + §11 rotation paths updated (archives stay `docs/changelog/`)
- [x] Close-time doc-freshness check wired — sprint close maps Files Changed → §2 update triggers and prompts affected-doc refresh (propose→approve, never silent)
- [x] /prime traced on a legacy-layout fixture AND a new-layout fixture — both read cleanly

### T3 — Add root-file templates: CONTRIBUTING · SECURITY · AGENTS-pointer · .env.example/.gitignore/LICENSE `[size: M · risk: med]`
Layers: `skills/lean-doc-generator/templates/` · DOCS_Guide §2 · `skills/lean-doc-generator/SKILL.md` (init)
The TemiDev root set. AGENTS.md is a ~10-line pointer to `.claude/CLAUDE.md` (zero duplication).
Folds in **TD-008**: relocate init's procedure detail to `references/` before growing it (L-012).

**Acceptance:** init on a scratch repo scaffolds all six per repo type without overwriting existing
files; SKILL.md stays ≤110 with init detail relocated to a reference.

**DoD:**
- [x] CONTRIBUTING + SECURITY + AGENTS templates exist with §2 rows + caps + ownership headers
- [x] init offers .env.example/.gitignore/LICENSE per G2-settled non-doc rule (never-overwrite)
- [x] TD-008 fold-in: init detail → `references/`; SKILL.md ≤110 verified
- [x] Scratch-repo init exercised — six files land, existing files untouched

### T4 — Add backend/integration doc-tree templates: database/ · api/ · architecture siblings `[size: M · risk: med]`
Layers: `skills/lean-doc-generator/templates/` · DOCS_Guide §2 · `skills/lean-doc-generator/SKILL.md` (init)
erd (Mermaid) · schema · migration-guide · architecture/{data-flow,authentication,integrations}.
openapi.yaml gets a placement rule only — spec content is project-generated, not doc-generator business.

**Acceptance:** init's backend/integration gate scaffolds exactly this set; §2 rows present.

**DoD:**
- [x] database/{erd,schema,migration-guide} templates (ERD in Mermaid) with §2 rows
- [x] architecture/{data-flow,authentication,integrations} templates with §2 rows
- [x] openapi.yaml placement rule recorded (no template)
- [x] Backend-gate init exercised on a scratch repo — exact set scaffolds

### T5 — Add product/flows/testing/coding-standards templates (medium/complex gate) `[size: M · risk: med]`
Layers: `skills/lean-doc-generator/templates/` · DOCS_Guide §2 · `skills/lean-doc-generator/SKILL.md` · `skills/task-decomposer/SKILL.md`
product/{requirements,acceptance-criteria} · flows/ (Mermaid) · testing/testing-guide ·
development/coding-standards. task-decomposer's PRD output gains its durable home.

**Acceptance:** medium/complex init gate scaffolds the set; task-decomposer PRD notes
`docs/product/requirements.md` as its durable home.

**DoD:**
- [x] product/{requirements,acceptance-criteria} + flows + testing-guide + coding-standards templates with §2 rows
- [x] task-decomposer PRD output wired to `docs/product/requirements.md`
- [x] Medium/complex-gate init exercised on a scratch repo — exact set scaffolds

### T6 — Add "what belongs in Git" boundary section + wire into init/migrate `[size: S · risk: med]`
Layers: DOCS_Guide.md · `skills/lean-doc-generator/SKILL.md` · `references/migration-map.md`
The decision rule + never-commit lists (secrets · contracts · PII · backups · design sources ·
meeting notes → proper homes: secret manager · document storage · PM tool · design tool).

**Acceptance:** init scaffolds .gitignore from the boundary rule; migrate's adoption scan flags
committed violations report-only.

**DoD:**
- [x] Boundary section in DOCS_Guide (decision rule + never-commit lists + proper-home table)
- [x] init .gitignore scaffold derives from it
- [x] migrate adoption scan flags violations (report-only) — traced on a fixture with a planted `.env`

### T7 — Update migration map for legacy-lean → TemiDev layout + end-to-end consumer verify `[size: M · risk: med]`
Layers: `references/migration-map.md` · README.md · `.claude/CONTEXT.md` · CHANGELOG
depends-on: T2–T6. The L-016 consumer-path proof: init exercised at all three tiers on scratch
fixtures, /prime reads each cleanly; legacy-lean repos get a relocation proposal via migrate re-run.

**Acceptance:** three-tier fixture verify passes; README + CHANGELOG + CONTEXT §Doc standard reflect
the new standard; migrate re-run on a legacy layout proposes relocation, never clobbers.

**DoD:**
- [x] migration-map legacy-lean → new-canonical mapping added (re-run sync proposes, never clobbers)
- [x] init exercised at base / backend / medium-complex tiers — /prime reads each cleanly
- [x] README + CHANGELOG + CONTEXT.md §Doc standard updated (consumer-facing surface, L-015)

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

### 2026-07-29 | T7 complete | Migration map + 3-tier consumer verify + own surface (fresh-context Sonnet + coordinator)
migration-map retargeted to ADR-012 canonical (CHANGELOG direction reversed) + Legacy-lean
relocation block (propose→approve, never clobber). Three-tier verify: base 21 files / backend 34 /
complex 37 — every /prime slot resolves (canonical-first confirmed; MISSING only where legit),
headers present. Own surface: README count claim 15→30/32 + feature paragraph; CHANGELOG Unreleased
block; CONTEXT §Doc standard → TemiDev core + tiers + §12 (127/130). **Fresh-context review caught
2 shipped defects, both fixed by coordinator:** (1) docs/api/README.md scaffold lacked ownership —
init.md now gives it the §3 footer exception; (2) DECISIONS.md path ambiguous in §2 — pinned "under
docs/". Fixture tier-boundary blur (login-flow in backend fixture) noted as fixture-reuse artifact,
not a skill defect. qa-check 56/0.

### 2026-07-29 | T6 complete | §12 Git boundary + init/migrate wiring (Sonnet dispatch + coordinator review)
DOCS_Guide gains §12 (47 lines): decision rule table · never-commit table with proper-home routing ·
generated-excludes classes · the 5-home clean separation · "private repo = potentially exposed".
§2's .gitignore forward-ref now resolves. init .gitignore derives from §12c; migrate detect gains a
Boundary scan (§12b, report-only + rotation owner-action — removal doesn't un-leak history; purge →
host security process). Fixture trace: planted .env + dump.sql both flagged with routing;
migrations/001_init.sql correctly NOT flagged (DDL ≠ dump). qa-check 56/0.

### 2026-07-29 | T5 complete | Product/flows/testing/coding-standards templates + PRD durable home (Sonnet dispatch + coordinator review)
5 templates (requirements 48 · acceptance-criteria 32 · flows 45 · testing-guide 40 ·
coding-standards 49 — all under caps), leak-scan clean; sanitize-PRD comment + config-vs-doc
boundary (standards config can express live in config) encoded. init.md base rows point at real
template names; medium/complex tier adds adr/ create-lazily + first-flow offer. task-decomposer
--prd now names docs/product/{requirements,acceptance-criteria}.md as the approved PRD's durable
home (92/110). Counts 25→30 core (32 total); CLAUDE.md 80/80 zero-net. Fixture: 4 re-renders +
flows/login-flow.md land coherently. qa-check 56/0.

### 2026-07-29 | T4 complete | Backend/integration doc-tree templates (Sonnet dispatch + coordinator review)
6 templates landed (erd 44 · schema 45 · migration-guide 37 · data-flow 43 · authentication 44 ·
integrations 30 — all well under §2 caps), Mermaid skeletons, migration-files-are-SSOT stance,
leak-scan clean. openapi placement rule in init.md (docs/api/README 3-liner, no template — spec is
project-generated). Backend tier gating extended in init.md (DB/auth/API substrate-conditional).
Counts 19→25 core (27 total); CLAUDE.md exactly 80/80. Fixture exercised with migrations+routes
stubs: all 7 artifacts land, T3 files untouched. qa-check 56/0. **Carry-forward for T7:** lean-flow's
own README.md:287 claims "15 canonical doc templates" — stale (pre-dates this sprint), qa-check
doesn't lint README counts; fix in T7's README pass.

### 2026-07-29 | T3 complete | Root-file templates + init rework, TD-008 folded (Sonnet dispatch + coordinator review)
CONTRIBUTING (53) · SECURITY (47) · AGENTS (9, footer-ownership — §3 README-exception extended by
one sentence) templates landed, leak-scan clean (paths + ID namespaces). Init procedure relocated
SKILL.md → references/init.md and extended there: base-tier scaffold table per §2/§6, tier popup
defaulting from manifest, D5 safe-scaffold allowlist (3 files, write-if-absent, reported), verify
step. SKILL.md 106→104/110 (TD-008 mitigation executed — mark TD-008 resolved at close). Count
claims 16→19 core (21 total). Exercised on fixture-init (Express stub): 18 base docs + 3 scaffolds
landed; pre-existing .gitignore custom line intact (skip+report verified). qa-check 56/0.
**Carry-forward for T7:** migration-map.md placement table still targets pre-ADR-012 legacy paths —
already in T7 scope, agent re-confirmed.

### 2026-07-29 | T2 complete | Templates relocated + readers rewired (Sonnet dispatch + coordinator review)
git-mv renames (ARCHITECTURE→architecture-overview · SETUP→development-setup · DEPLOY→split
deployment-guide + deployment-rollback); prime slot 6, release-patch changelog target (root-first,
legacy fallback), DOCS_Guide §10/§11, SKILL Golden-Rule/bundled-assets/close-row all
canonical-first; close-time doc-freshness check woven into the close row (no net lines — SKILL.md
held 106/110, CLAUDE.md 80/80). Template count claims 15→16 core (18 total) — qa-check tmpl-core
passes. Fixture trace: legacy resolves via 2nd candidate, new via 1st, no dead ends. Coordinator
review pass fixed 8 residual stale canonical refs the agent's file-list excluded (§2 example
template name · SKILL Retro bucket · README/TODO/SPRINT template links). Remaining stale refs are
T7's files (migration-map.md · lean-flow's own README). qa-check 56/0.

### 2026-07-29 | T1 complete | DOCS_Guide TemiDev core + ADR-012 (inline, decision-tier)
G1/G2 batch-passed (D5 grilled → safe-scaffold allowlist). §2 rewritten as three lifecycle tables
(root · .claude/ · docs/ tree) with Create←/Update←/Archive per row; §6 = 4-tier event-gated model
(base · backend/integration · medium/complex · multi-service); growth rule (cap-hit → split into
tree) + LAW-1 reinterpretation added; ADR-012 accepted + DECISIONS row; knowledge index regenerated;
qa-check 56/0. **Note for T6:** §2 forward-references the boundary rule as "§12" — T6 must number
its new section §12. **Note for T2:** §11 table + template filenames still show legacy paths — T2's
scope.

### 2026-07-29 | scope-change | Complete-standard amendment (pre-execution)
**What broke:** owner review caught the plan adopting TemiDev *structure* without the *lifecycle
contract* — 3 gaps vs the "complete, big-repo-ready" goal: (1) T1 required caps+owners but not
per-doc create/update/archive triggers (LAW 3) for the ~15 new types; (2) the old §6 Tier 3+
(multi-service) was silently dropped and no cap-hit→split-into-tree growth rule existed — lean-only,
no growth path; (3) nothing wires sprint close's Files Changed to doc freshness (docs would rely on
the 60-day scan alone). **Impact:** T1 + T2 DoD extended (no new tasks, no size change — T1 M→M
holds, denser). **G2 re-confirmed:** owner approved all 3 amendments 2026-07-29.

### 2026-07-29 | promote | Plan locked
7 Backlog tasks (TASK-067…073) pulled in dependency order; governance checklist signed off
(no L-promotions due · TD-008 folded into T3 · no doc-aging). Decisions D1–D5 pre-locked from
intake grill (full adoption · placement wins · AGENTS pointer · CHANGELOG deviation · init loosening).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §2/§6 rewritten to TemiDev core + lifecycle contract + growth rules (the SSOT for T2–T6) | High | qa-check 56/0 · structure re-read (L-009) |
| `docs/adr/ADR-012-temidev-repo-structure-standard.md` | T1 | records full adoption + deviations (D1–D5) | Low | template-conformant · index regenerated |
| `docs/DECISIONS.md` | T1 | ADR-012 index row | Low | qa-check corpus refs |
| `docs/knowledge-index.md` | T1 | regenerated (derived) | Low | qa-check "knowledge index current" |
| `templates/{architecture-overview,development-setup,deployment-guide,deployment-rollback}.md.template` | T2 | git-mv renames + DEPLOY split to TemiDev placements | Med | qa-check tmpl-core 16=16 |
| `templates/{CHANGELOG,README,TODO,SPRINT}.md.template` | T2 | internal links → new canonical paths (consumer scaffolds emit correct pointers) | Low | grep sweep clean |
| `skills/prime/SKILL.md` | T2 | slot 6 canonical-first (`docs/architecture/overview.md`), legacy second | Med | fixture trace both layouts |
| `skills/release-patch/SKILL.md` | T2 | changelog target root-first + deploy-guide pointer split | Med | cap 98/110 · self-review |
| `skills/lean-doc-generator/SKILL.md` | T2 | placement rewiring + close-time doc-freshness check (in-place, no net lines) | High | cap 106/110 · qa-check |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T2 | §10/§11 + template-name example → canonical paths | Med | qa-check |
| `.claude/CLAUDE.md` · `docs/ARCHITECTURE.md` | T2 | template-count claims 15→16 core (18 total) | Low | qa-check tmpl-core |
| `templates/{CONTRIBUTING,SECURITY,AGENTS}.md.template` | T3 | TemiDev root-file set (AGENTS = thin pointer, footer ownership) | Med | leak-scan + fixture-init exercise |
| `skills/lean-doc-generator/references/init.md` | T3 | init procedure relocated + extended (tiers · safe-scaffold allowlist · verify) — TD-008 fold-in | Med | fixture-init exercise |
| `skills/lean-doc-generator/SKILL.md` | T3 | init section → 7-line summary + pointer; 104/110 | High | qa-check cap |
| `references/DOCS_Guide.md` §3 | T3 | AGENTS footer-ownership exception sentence | Low | qa-check |
| `.claude/CLAUDE.md` · `docs/ARCHITECTURE.md` | T3 | count claims 16→19 core (21 total) | Low | qa-check tmpl-core 19=19 |
| `templates/database-{erd,schema,migration-guide}.md.template` | T4 | DB doc set (Mermaid ERD · conventions · migration policy; migrations stay SSOT) | Med | fixture exercise + leak-scan |
| `templates/architecture-{data-flow,authentication,integrations}.md.template` | T4 | architecture siblings for the backend tier | Med | fixture exercise + leak-scan |
| `skills/lean-doc-generator/references/init.md` | T4 | backend tier gating + openapi placement rule (api/README 3-liner) | Med | fixture exercise |
| `.claude/CLAUDE.md` · `docs/ARCHITECTURE.md` | T4 | count claims 19→25 core (27 total) | Low | qa-check tmpl-core 25=25 |
| `templates/{product-requirements,product-acceptance-criteria,flows,testing-guide,development-coding-standards}.md.template` | T5 | product/flows/testing/standards set (sanitize-PRD + config-vs-doc boundary encoded) | Med | fixture render + leak-scan |
| `skills/lean-doc-generator/references/init.md` | T5 | base rows → real template names · medium/complex tier (adr create-lazily · first-flow offer) | Med | fixture exercise |
| `skills/task-decomposer/SKILL.md` | T5 | --prd durable home → docs/product/ (92/110) | Low | diff review · qa-check cap |
| `.claude/CLAUDE.md` · `docs/ARCHITECTURE.md` | T5 | count claims 25→30 core (32 total) | Low | qa-check tmpl-core 30=30 |
| `references/DOCS_Guide.md` §12 | T6 | the Git boundary: decision rule · never-commit routing · excludes · 5-home separation | Med | fixture boundary-scan trace |
| `references/init.md` · `references/migration-map.md` | T6 | .gitignore ← §12c · migrate detect + boundary scan (report-only, rotation owner-action) | Med | fixture trace (.env + dump.sql flagged, DDL not) |
| `references/migration-map.md` | T7 | relocation targets → ADR-012 canonical + Legacy-lean block (never clobber) | Med | qa-check · review |
| `README.md` · `docs/CHANGELOG.md` | T7 | count claim 30/32 + feature paragraph · Unreleased block (own paths unchanged — A1) | Low | qa-check footer-version |
| `.claude/CONTEXT.md` | T7 | §Doc standard → TemiDev core + tiers + §12 (coordinator edit) | Med | 127/130 · qa-check |
| `references/{init,DOCS_Guide}.md` | T7 | defect fixes from fresh-context verify (api/README ownership footer · DECISIONS.md path pinned) | Low | qa-check |

## Retro

**Retrieval check** — no misses: L-017 (delta-map), L-015/L-016 (consumer path), L-006 (fresh-context
verify), L-012 (references-first under cap), L-009 (structure re-reads), L-045 (unpiped gates) were
all found and actively applied; no prior L/ADR was contradicted.

**Worked**
- Sequential briefed-Sonnet dispatch with a coordinator review pass per task — every agent returned
  under caps with 56/0 gates, and the review pass caught residual stale refs each time (the
  file-list boundary works as a containment, coordinator sweeps the seam).
- Pre-execution owner amendment (scope-change before T1) — the lifecycle-contract + growth-path gaps
  were caught while amendment was still cheap; the whole sprint then built on the corrected spec.
- Fixture-driven exercise at every task (L-007) — the T7 cold-context three-tier verify caught 2
  real shipped defects (api/README ownership · DECISIONS.md path) that five task-level reviews missed.

**Friction**
- CLAUDE.md pinned at exactly 80/80 forced zero-net rewording for every template-count bump (4×) —
  a recurring squeeze, but held.
- Fixture reuse across tasks blurred tier boundaries (login-flow.md present in the backend fixture) —
  next multi-tier verify: fresh fixture per tier from the start.

**Pattern candidate** (filed)
- L-051 — a placement-standard row without a full explicit path invites mis-scaffold; cold-context
  agents execute the standard literally (→ docs/LEARNINGS.md, count 1).

**Buckets routed**: Shipped → CHANGELOG v1.16.0 · Tech debt → TD-008 resolved (TASK-069), none new ·
Follow-ups → TASK-074 (own-repo migration, P3) · Learnings → L-051.
