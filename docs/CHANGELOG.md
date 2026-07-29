---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.16.0 — TemiDev Repo-Structure Standard (2026-07-29)

MINOR — SPRINT-032 (TASK-067…073) — TemiDev repo-structure standard adoption (ADR-012).

**What changed for you:**
- **New consumer-core standard** — lean-doc-generator's §2 core set adopts the TemiDev repo-structure
  standard as its baseline: a mandatory minimum scaffolded at init (root set + AI context +
  `docs/product|architecture|development|testing|deployment`), conditional substrate rows
  (database/auth), and a full create/update/archive lifecycle contract on every doc.
- **15 new/relocated templates** — root governance (`CONTRIBUTING` · `SECURITY` · `AGENTS`),
  product (`requirements` · `acceptance-criteria`), architecture siblings (`data-flow` ·
  `authentication` · `integrations`), database (`erd` · `schema` · `migration-guide`),
  development/testing (`setup` · `coding-standards` · `testing-guide`), and deployment split into
  `deployment-guide` + `rollback-guide` (was single-file `DEPLOY.md`).
- **4-tier init scaffold** — base (every repo) → backend/integration (API/external integrations) →
  medium/complex (`adr/` + `DECISIONS.md` + `flows/`) → multi-service, each tier's docs created by
  event (first API, second dev, second service), never by ceremony.
- **Init safe-scaffold allowlist** — the only non-doc files `init` writes: `.env.example` (names
  only, never values) · `.gitignore` (from the §12 boundary rule) · `LICENSE` — write-if-absent,
  never overwritten, every write/skip listed in the init report.
- **§12 Git boundary + migrate boundary scan** — a new DOCS_Guide section states what never belongs
  in the repo (secrets, credentials, PII, commercial/legal material) regardless of format; `migrate`
  now scans the tracked tree for §12b violations and reports them (report-only, never auto-remediates).
- **Close-time doc-freshness check** — sprint close now checks touched docs' `last_updated` /
  `status` against the session's changes, flagging anything stale instead of leaving it to the next
  60-day scan.
- **Per-doc lifecycle contract** — every §2 row now states its create/update/archive triggers
  explicitly (mirrored in the doc's `update_trigger` header field), replacing the old
  create-lazily-only rule for the mandatory minimum.

See ADR-012 for the full decision record and blast radius.

---

## v1.15.0 — Tech-Debt Split (2026-07-29)

MINOR — SPRINT-031 (TASK-066).

**What changed for you:**
- **Tech Debt gets its own root ledger** — new core template `TECH-DEBT.md.template` renders root `TECH-DEBT.md`; `TODO.md` keeps the Backlog + active-sprint pointer only (a pointer line replaces § Tech Debt). Two big queues no longer crowd one file.
- **Fully wired** — Sprint Close files `TD-NNN` there · Promote ages it · `/triage` grooms it (legacy in-TODO § still read) · `/prime` slot 5 reads it · DOCS_Guide §2/§10/§11 + migration-map updated; adopted repos: `migrate` now splits an in-TODO § Tech Debt out verbatim.
- **De-leak** — repo-specific `TASK-040` pointer removed from the shipped SPRINT template + DOCS_Guide retrieval-miss note (L-015 class).

Repo housekeeping (same day, pre-sprint): TASK-040 + TASK-047 routed to `.out-of-scope/` with revisit conditions — Backlog now empty.

---

_Older releases (**v1.14.2** and earlier) → [`docs/changelog/CHANGELOG-1.14.2.md`](changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](changelog/CHANGELOG-1.7.1.md)._
