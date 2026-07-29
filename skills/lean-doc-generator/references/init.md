# Init — scaffold a fresh repo

Used by `/lean-doc-generator init`. For a **greenfield** repo with no lean-flow docs yet — the twin
of migrate (decision: `docs/research/init-vs-migrate.md`). **Scope-interactive + docs-only**,
bounded by the safe-scaffold allowlist (ADR-012).

## Procedure

1. **Detect substrate** — read `package.json` / `pyproject.toml` / `go.mod` / etc. and the existing
   file tree to infer stack, and whether a database or auth substrate is present. If inaccessible,
   ask the user to paste the manifest + file tree.
2. **Scaffold the base tier (always)** — the TemiDev mandatory minimum (table below), each via the
   template-load protocol (DOCS_Guide §2: **Read** `${CLAUDE_SKILL_DIR}/templates/<X>.md.template`
   before writing — never free-generate; real content prompts, never empty shells).
3. **Offer higher tiers via an AskUserQuestion popup** — default the selection from the substrate
   detection in step 1, let the user confirm/override:
   - **Substrate-conditional rows** fire automatically when detected (confirmed, not asked):
     `database/erd.md` + `database/schema.md` + `database/migration-guide.md` (DB exists) ·
     `architecture/authentication.md` (auth exists).
   - **Backend/integration tier** (API or external integrations detected) — `api/openapi.yaml`
     (placement rule, project-generated, no template) · `architecture/integrations.md`.
   - **Medium/complex tier** (multi-dev, sustained, or architecturally forked) — `docs/adr/` +
     `DECISIONS.md` · `docs/flows/`.
   - Scaffold only what's chosen. Full tier table → DOCS_Guide §6.
4. **Safe-scaffold allowlist (ADR-012)** — the only non-doc files init writes. See below.
5. **Write** — target canonical placement (DOCS_Guide §2: root for README/CONTRIBUTING/SECURITY/
   AGENTS/CHANGELOG/LICENSE/TODO/TECH-DEBT · `.claude/` for AI-context · `docs/` for the rest);
   enforce the line cap and the ownership header (§3) on every file touched.
6. **Verify** — `/prime` reads cleanly (no missing-file errors on required reads); every scaffolded
   file's ownership header + placement match DOCS_Guide §2/§3; report the full file list, including
   safe-scaffold writes and any skips.

## Base-tier mandatory minimum (always scaffolded)

| File | Template |
|---|---|
| `README.md` | `README.md.template` |
| `CONTRIBUTING.md` | `CONTRIBUTING.md.template` |
| `SECURITY.md` | `SECURITY.md.template` |
| `AGENTS.md` | `AGENTS.md.template` |
| `CHANGELOG.md` | `CHANGELOG.md.template` |
| `LICENSE` | safe-scaffold (below) — no markdown template |
| `TODO.md` | `TODO.md.template` |
| `TECH-DEBT.md` | `TECH-DEBT.md.template` |
| `.claude/CLAUDE.md` | `CLAUDE.md.template` |
| `.claude/CONTEXT.md` | `CONTEXT.md.template` |
| `docs/product/requirements.md` | inline format (DOCS_Guide §2; no template yet) |
| `docs/product/acceptance-criteria.md` | inline format (DOCS_Guide §2; no template yet) |
| `docs/architecture/overview.md` | `architecture-overview.md.template` |
| `docs/development/setup.md` | `development-setup.md.template` |
| `docs/development/coding-standards.md` | inline format (DOCS_Guide §2; no template yet) |
| `docs/testing/testing-guide.md` | inline format (DOCS_Guide §2; no template yet) |
| `docs/deployment/deployment-guide.md` | `deployment-guide.md.template` |
| `docs/deployment/rollback-guide.md` | `deployment-rollback.md.template` |

Missing template for a base-tier row → WARN and fall back to DOCS_Guide §2's inline description
(template-load protocol step 2); never hard-stop.

## Safe-scaffold allowlist (ADR-012 — the only non-doc files init writes)

Exactly three, **write-if-absent only** — an existing file is never overwritten, only skipped +
reported:

| File | Content rule |
|---|---|
| `.env.example` | Variable **names only**, detected from the codebase (env-var reads, config loaders) — **never values**. |
| `.gitignore` | Standard generated-artifact classes for the detected stack (build output, dependency dirs, editor/OS cruft, local env files). Full content rule lands as the **§12 boundary rule** in DOCS_Guide — this is a forward pointer, not the final spec. |
| `LICENSE` | User chooses a license; a private repo gets a proprietary notice instead. |

Every write (or skip-because-exists) is listed in the init report. `settings.json` and every other
non-doc file stay **banned** from init — no exceptions.

## Verify

- `/prime` reads the new docs cleanly.
- Every file carries its DOCS_Guide §3 ownership header (or the README/AGENTS footer-line
  exception) with `owner` a role, never a person.
- Placement matches DOCS_Guide §2 exactly — root vs `.claude/` vs the `docs/` tree.
- Report: files written · files skipped (pre-existing) · any WARN (missing template).
