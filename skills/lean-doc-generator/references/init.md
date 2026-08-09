# Init — scaffold a fresh repo

Used by `/lean-doc-generator init`. For a **greenfield** repo with no lean-flow docs yet — the twin
of migrate (decision: `docs/research/init-vs-migrate.md`). **Scope-interactive + docs-only**,
bounded by the safe-scaffold allowlist (ADR-012).

## Procedure

1. **Detect substrate** — read `package.json` / `pyproject.toml` / `go.mod` / etc. and the existing
   file tree to infer stack, and whether a database or auth substrate is present. If inaccessible,
   ask the user to paste the manifest + file tree.
2. **Scaffold the base tier** — the TemiDev mandatory minimum (table below), each via the
   template-load protocol (DOCS_Guide §2: **Read** `${CLAUDE_SKILL_DIR}/templates/<X>.md.template`
   before writing — never free-generate; real content prompts, never empty shells). Most rows are
   unconditional; four carry a **substrate condition** and are skipped when that substrate is absent,
   exactly as step 3's conditional rows fire only on detection. Gate per substrate, never on a repo
   label: "docs-only" is not a condition — a docs repo that publishes an artifact still deploys, and
   its deployment guides are correct. A skipped row is **reported, not silent** (step 5's file list
   names it and the condition that skipped it), so an absent doc reads as a decision rather than a miss.
3. **Offer higher tiers via an AskUserQuestion popup** — default the selection from the substrate
   detection in step 1, let the user confirm/override:
   - **Substrate-conditional rows** fire automatically when detected (confirmed, not asked):
     `database/erd.md` + `database/schema.md` + `database/migration-guide.md` (DB exists) ·
     `architecture/authentication.md` (auth exists). Templates → table below.
   - **Backend/integration tier** (API or external integrations detected) — scaffolds
     `architecture/data-flow.md` · `architecture/integrations.md` · `docs/api/` (below) ·
     `architecture/authentication.md` if not already fired by the DB/auth substrate check above.
   - **Medium/complex tier** (multi-dev, sustained, or architecturally forked) — `docs/adr/` +
     `DECISIONS.md` (create-lazily — DOCS_Guide §2 rule: never pre-created empty; scaffold
     `DECISIONS.md` only once the first qualifying decision (§4) exists, and write the ADR
     itself alongside it, not before) · `docs/flows/` (offer, via the same popup, creating the
     FIRST flow doc from `flows.md.template` for the project's main business flow — e.g. the
     primary user journey the app exists to support; skip if the user has no flow in mind yet).
   - Scaffold only what's chosen. Full tier table → DOCS_Guide §6.
   - **Headless (the popup cannot be answered)** — detect it, don't assume it: probe the channel
     (`ToolSearch select:AskUserQuestion` → *no matching deferred tools* means unregistered; `dontAsk`
     auto-denies any prompting call). An interactive run asks the popup normally — that stays correct.
     Once verified headless, the tier choice can be neither asked nor assumed. Record the park before halting:
     write the detected substrate, the tiers you would have offered, and the unblock condition
     ("owner picks the tiers") into a `/handoff` doc — there is no sprint file at this entry point.
     Base-tier scaffolding waits with it: it is additive, but it is downstream of a choice nobody made
     (TD-017 · night-run.md Part 0). Declining in prose alone leaves no artifact that init ran.

   | Doc | Fires on | Template |
   |---|---|---|
   | `docs/database/erd.md` | DB exists | `database-erd.md.template` |
   | `docs/database/schema.md` | DB exists | `database-schema.md.template` |
   | `docs/database/migration-guide.md` | DB exists | `database-migration-guide.md.template` |
   | `docs/architecture/data-flow.md` | backend/integration tier | `architecture-data-flow.md.template` |
   | `docs/architecture/authentication.md` | auth exists | `architecture-authentication.md.template` |
   | `docs/architecture/integrations.md` | backend/integration tier | `architecture-integrations.md.template` |
   | `docs/adr/ADR-NNN-<slug>.md` + `DECISIONS.md` | medium/complex tier, first qualifying decision | `ADR.md.template` + `DECISIONS.md.template` |
   | `docs/flows/<slug>.md` | medium/complex tier, offered for the main flow | `flows.md.template` |

   **`docs/api/` placement rule** — `api/openapi.yaml` is project-generated; init **never**
   generates its content (no template). When an API is detected, init creates `docs/api/` and
   (write-if-absent) `docs/api/README.md`, a 3-liner: *"Commit the OpenAPI source (`openapi.yaml`)
   here; generated HTML docs need not be committed."* — carrying a `<sub>` footer ownership line
   (§3 pointer-file exception, like AGENTS.md; a doc without an owner is an orphan, §7).
4. **Safe-scaffold allowlist (ADR-012)** — the only non-doc files init writes. See below.
5. **Write** — target canonical placement (DOCS_Guide §2: root for README/CONTRIBUTING/SECURITY/
   AGENTS/CHANGELOG/LICENSE/TODO/TECH-DEBT · `.claude/` for AI-context · `docs/` for the rest);
   enforce the line cap and the ownership header (§3) on every file touched.
6. **Verify** — `/prime` reads cleanly (no missing-file errors on required reads); every scaffolded
   file's ownership header + placement match DOCS_Guide §2/§3; report the full file list, including
   safe-scaffold writes and any skips.

## Base-tier mandatory minimum

**Condition** blank = always scaffolded. A named condition is checked against step 1's detection and
the row is skipped when absent — same mechanism as step 3's substrate-conditional rows, applied one
tier down. The two substrates that gate a base row:

- **has code** — a language manifest (`package.json` · `pyproject.toml` · `go.mod` · `Cargo.toml` …)
  or source files outside `docs/`. A pure docs, content or config repo has neither.
- **publishes an artifact** — the repo ships something a consumer installs or runs: a package
  manifest with a version, a plugin/extension manifest, a Dockerfile, a deploy config. Independent of
  *has code* — a markdown plugin publishes without holding a line of application code.

| File | Condition | Template |
|---|---|---|
| `README.md` | | `README.md.template` |
| `CONTRIBUTING.md` | | `CONTRIBUTING.md.template` |
| `SECURITY.md` | | `SECURITY.md.template` |
| `AGENTS.md` | | `AGENTS.md.template` |
| `CHANGELOG.md` | | `CHANGELOG.md.template` |
| `LICENSE` | | safe-scaffold (below) — no markdown template |
| `TODO.md` | | `TODO.md.template` |
| `TECH-DEBT.md` | | `TECH-DEBT.md.template` |
| `.claude/CLAUDE.md` | | `CLAUDE.md.template` |
| `.claude/CONTEXT.md` | | `CONTEXT.md.template` |
| `docs/product/requirements.md` | | `product-requirements.md.template` |
| `docs/product/acceptance-criteria.md` | | `product-acceptance-criteria.md.template` |
| `docs/architecture/overview.md` | | `architecture-overview.md.template` |
| `docs/development/setup.md` | | `development-setup.md.template` |
| `docs/development/coding-standards.md` | **has code** | `development-coding-standards.md.template` |
| `docs/testing/testing-guide.md` | **has code** | `testing-guide.md.template` |
| `docs/deployment/deployment-guide.md` | **publishes an artifact** | `deployment-guide.md.template` |
| `docs/deployment/rollback-guide.md` | **publishes an artifact** | `deployment-rollback.md.template` |

Why only these four: the rest describe the *project*, not its substrate. Every repo has a reason to
exist (`product/`), a shape (`architecture/`), a way in (`README` · `setup`), and a security contact —
a docs repo included. Coding standards and a testing guide describe code that may not exist, and
deployment describes a release that may never happen; those are the ones that become ceremony.

Missing template for a base-tier row → WARN and fall back to DOCS_Guide §2's inline description
(template-load protocol step 2); never hard-stop.

## Safe-scaffold allowlist (ADR-012 — the only non-doc files init writes)

Exactly three, **write-if-absent only** — an existing file is never overwritten, only skipped +
reported:

| File | Content rule |
|---|---|
| `.env.example` | Variable **names only**, detected from the codebase (env-var reads, config loaders) — **never values**. |
| `.gitignore` | DOCS_Guide **§12c** classes (build output, dependency dirs, editor/OS cruft, local env files) as the standard baseline, plus stack-detected additions on top (e.g. a Python repo adds `__pycache__/`, a Node repo adds `node_modules/`). |
| `LICENSE` | User chooses a license; a private repo gets a proprietary notice instead. |

Every write (or skip-because-exists) is listed in the init report. `settings.json` and every other
non-doc file stay **banned** from init — no exceptions.

## Verify

- `/prime` reads the new docs cleanly.
- Every file carries its DOCS_Guide §3 ownership header (or the README/AGENTS footer-line
  exception) with `owner` a role, never a person.
- Placement matches DOCS_Guide §2 exactly — root vs `.claude/` vs the `docs/` tree.
- Report: files written · files skipped (pre-existing) · any WARN (missing template).
