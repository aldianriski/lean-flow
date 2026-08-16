---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: A skill's tool grant changes, the git boundary changes, or the reporting process changes
status: current
---

# lean-flow — Security

<!-- Divergence from SECURITY.md.template, noted per DOCS_Guide §2's template-as-canonical rule:
     the template's Authentication, Logging-restrictions and PII sections are stated as
     not-applicable with their reason rather than dropped silently, and "Secure coding" is replaced
     by "What this plugin can do in your repo" — the honest threat surface for a skill library that
     ships no executable product. An empty section is not a doc (§2, create-lazily). -->

lean-flow is a library of markdown skills for Claude Code. It ships **no executable product** — no
server, no runtime, no network calls, no data storage. What it does ship is *instructions an agent
follows in your repository*, and the tool permissions those instructions run under. That is the whole
threat surface, and it is what this file is about.

## What this plugin can do in your repo

Skills declare their own tool grants. Of the 14:

| Grant | Skills |
|---|---|
| **Unscoped `Bash`** | `diagnose` · `flow` · `handoff` · `orchestrator` · `prototype` · `tdd` |
| Scoped `Bash(git *)` etc. | `lean-doc-generator` · `release-patch` |
| No shell at all | `council` · `insights` · `prime` · `refactor-advisor` · `task-decomposer` · `triage` |

Unscoped is deliberate where arbitrary commands are inherent to the job — a test runner or build tool
cannot be enumerated in advance. It is not a licence: your Claude Code permission mode still gates
every call, and a denied call is a denial the skill must adapt to, never retry around.

Three guarantees are load-bearing and are enforced by review, not by hooks (this plugin installs none):

- **`release-patch` never runs `git push`.** It bumps, writes the changelog, and stops at the gate.
- **G1 Scope and G2 Design require a human sign-off.** No skill self-approves a gate.
- **`scripts/night-run.sh` runs unattended** and is the one surface where no human is present. Its
  charter is execute-only: a step needing a human decision is *parked*, never answered by the run. A
  missing ask-channel is a block, not a default-yes.

## Secret handling

- Secrets are **never committed** — not in code, config, or `.env`. This repo has no environment
  configuration at all, and therefore no `.env.example`.
- The full commit boundary — what belongs in a repo and what never does, by category — is
  `spec/STANDARD.md` §12. `/lean-doc-generator migrate` scans an
  adopted repo against it and **reports only**; it never auto-removes anything.
- Skills that capture diagnostic artifacts (HAR files, logs) are responsible for redaction before those
  artifacts land anywhere durable.

## Dependency management

Zero runtime dependencies. Maintainer tooling under `scripts/` is dependency-free POSIX `sh`. There is
no lockfile to audit and no scanner to run, because there is nothing installed to scan.

## Not applicable — and why

- **Authentication / authorization** — the plugin has no auth surface, which is why no
  `docs/architecture/authentication.md` exists (DOCS_Guide §6 gates that row on auth existing).
- **Logging restrictions** — nothing here writes logs.
- **PII handling** — nothing here touches personal data. Doc templates use sanitized example values.

## Reporting a vulnerability

Email the maintainer privately: **aldian.mar@gmail.com** (the address published in
`.claude-plugin/plugin.json`). Please do **not** open a public issue for a security report.

Useful things to include: the skill involved, the tool grant it used, and the sequence that produced
the behaviour. A skill that instructs an agent toward something destructive, or that widens a tool
grant beyond what its job needs, is in scope and worth reporting.
