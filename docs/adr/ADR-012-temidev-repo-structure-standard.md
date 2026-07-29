---
id: ADR-012
tags: [docs]
domain: doc-standard
status: accepted
related: [ADR-003, ADR-007]
---

# ADR-012 — Adopt the TemiDev repo-structure standard as the consumer core

- **Status:** accepted (2026-07-29)
- **Deciders:** Maintainer
- **Context driver:** the lean core set caps out on growing repos — consumer projects that scale past
  a solo/small-team shape (backend surfaces, multiple services, formal product requirements) had no
  sanctioned home for their docs; "lean-only" was becoming a ceiling, not a floor.

## Context

lean-doc-generator's §2 core set (single-file ARCHITECTURE/SETUP/DEPLOY, ~15 doc types) was designed
minimal-first (LAW 1). The maintainer's TemiDev standard defines a fuller contract: a mandatory
minimum (README · CONTRIBUTING · SECURITY · AGENTS · .env.example · .gitignore + 9 docs/ files),
conditional tiers (backend/integration · medium/complex), multi-file doc trees
(`docs/architecture/` · `docs/database/` · `docs/api/` · `docs/product/` · `docs/flows/`), and a
what-belongs-in-Git boundary rule. Blast radius of adopting it: the §2 table (every row), 4 core
templates relocated, ~15 new templates, 4 skill files rewired (/prime · release-patch ·
lean-doc-generator · task-decomposer), the migration map, and every consumer repo on the next
`migrate` re-run (report-only). Owner explicitly chose full adoption over a curated delta at intake
(2026-07-29), extending it with a lifecycle contract so completeness doesn't become rot.

## Decision

The TemiDev repo-structure standard becomes the lean standard's core: its mandatory minimum is the
§2 core set, its placements are canonical (legacy lean paths matched second, never broken), its
conditional tiers become the §6 gating (base · backend/integration · medium/complex · multi-service),
and its Git-boundary rule enters the guide. Bound to it:

- **Placement wins on collision** — ARCHITECTURE→`docs/architecture/overview.md` ·
  SETUP→`docs/development/setup.md` · DEPLOY→`docs/deployment/{deployment-guide,rollback-guide}.md` ·
  CHANGELOG→root.
- **AGENTS.md is a thin pointer** to `.claude/CLAUDE.md`; CLAUDE/CONTEXT stay the real AI surface
  (no duplicated instructions).
- **Deviation: CHANGELOG stays always-core** (the sprint lifecycle writes it every close; TemiDev
  gates it to medium+).
- **Init safe-scaffold allowlist** — init writes docs + exactly three non-doc scaffolds
  (`.env.example` · `.gitignore` · `LICENSE`), write-if-absent only, each listed in the init report;
  `settings.json` and all other non-doc files stay banned.
- **LAW 1 reinterpreted, not repealed** — the mandatory minimum is scaffolded at init; beyond it,
  create-lazily still governs. Every doc carries a full lifecycle contract (create · update event ·
  archive trigger), and a file at its cap **splits into its canonical tree** rather than compressing
  signal away.

## Consequences

**Positive:** consumer repos get a complete, big-repo-ready standard — a growth path from solo to
multi-service without leaving the standard; docs stop rotting on the 60-day scan alone (event-driven
update triggers + close-time freshness check); the boundary rule keeps secrets/PII/commercial
material out of Git by policy, not folklore.
**Negative (trade-offs accepted):** heavier scaffold and ~15 more templates to maintain in lockstep
with the guide; LAW 1's "minimal by default" is softened at init (mandatory files exist before they
are strictly demanded by pain); init's docs-only guarantee now carries a three-file exception that
must be policed; adopted repos see a relocation proposal on their next migrate re-run.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Curated delta only (CONTRIBUTING/SECURITY/boundary rule; keep single-file core) | preserves lean purity but keeps the growth ceiling — the exact problem driving the decision; owner rejected at intake |
| Tier-gated expansion (trees only at Tier 3+) | two coexisting naming conventions; the standard is never "the" structure, so consumer repos diverge by tier history |
| AGENTS.md as canonical AI file | maximum cross-tool portability, but every lean skill + /prime reads `.claude/CLAUDE.md` — largest wiring change for marginal gain |
