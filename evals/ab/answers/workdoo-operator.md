# Workdoo: operator answers
Operator-only. Never copied into a trial.

## Stack
1. React, strict TypeScript, Vite, Node.js 24.16 or newer, native Node SQLite, Better Auth, Three.js (React Three Fiber and Drei) for factory scenes.
2. Node's built-in SQLite is a release candidate in 24.16, so the Node version is pinned; older Node refuses to start the server or runners.
3. Sign-in is email and password through Better Auth with opaque, database-backed sessions in an HttpOnly cookie.
4. Tests are Node assertion scripts, esbuild-bundled TSX checks and Playwright browser journeys. Lint is not configured; strict TypeScript and the production build are the static checks.
5. AI specialists run the Claude CLI and the Codex CLI as child processes (pinned Claude Code 2.1.303 and codex-cli 0.162.1) under the server operator's signed-in account.
6. Hosting is one Node server with one persistent private data folder behind a same-host HTTPS proxy (Caddy) and a systemd unit, on the R&D VPS. Releases are immutable folders switched by a link.
7. The app is private (not published to npm), package version 0.4.4, package manager npm with a lockfile.
8. SQLite is single-writer: one server, no replicas.

## Conventions in use
1. Components are PascalCase `.tsx` with a matching `.module.css`; models are lower-camel-case `.ts`; verification entries are `verify-<subject>.mjs`.
2. Every API error returns `{ error: { code, message } }`; success bodies are endpoint-specific and described in the OpenAPI file.
3. Departmental screens select views of the original shared records; they never copy a project, person, bill or request.
4. Motion is decorative only; reduced-motion and non-WebGL fallbacks must stay available.
5. Test and demo data is fictional or synthetic; screenshots stay synthetic.
6. Work runs through the lean-flow loop: prime, doc update, orchestrated task with a G1 Scope gate and a G2 Design gate, then repeat. Tasks live in `docs/work/`, sprints in `docs/sprint/`, an epic in `docs/epic/`. The pinned reference is lean-flow 2.14.0 / Standard 0.18.1; its skills are not vendored.
7. An ADR is added only for a qualifying confirmed decision. Three ADRs exist (persisted onboarding on SQLite, per-case captured configuration, source-bound AI proposals).
8. Releases are triggered by pushing a git tag `vMAJOR.MINOR.PATCH[-suffix]` on `main` of the GitHub repository `aldianriski/workdoo`. There is no commit hook; commit messages are short summaries, in practice prefixed like `sprint(004): ...` or `release: v0.4.4 ...`.
9. Dependency versions live in `package.json` and the lockfile; run `npm audit` when dependencies change.
10. Definition of done: acceptance criteria verified with passing regressions; strict TypeScript and build pass; UI changes have desktop and mobile browser evidence; self-review leaves no blocking issue; affected docs updated; G1/G2 sign-off and stage preview acceptance recorded when they apply.
11. Doc files carry an owner given as a role (Frontend Maintainer, Backend Maintainer, Technical Maintainer, Product Maintainer, QA Maintainer, Project Owner), not a person.
12. Validation: model, component, browser and production-build checks cover each implemented stage; browser claims need an observed browser run.

## Setup answers
1. Higher doc tiers: the backend/integration tier applies (an HTTP API plus Claude and Codex CLI integrations); the medium/complex tier applies (several roles, ADRs, an epic and sprints). Database, authentication and deployment docs apply.
2. First milestone, proof goal: the EPIC-001 outcome (live daily use on the VPS): the TemiDev team uses Workdoo daily over HTTPS on the VPS with tagged releases, health-checked automatic rollback, server-side Claude and Codex specialists and nightly off-host backups. (Owner interview 2026-10-30.)
3. First milestone, stopping condition: the EPIC-001 "Closed when" list: GitHub `main` holds the code with CI green; a `v*` tag deploys and a failed health check rolls back; the old app is retired; the migrated workspace is served over HTTPS with the owner and one operator signed in and cross-company access denied; Claude specialists complete one artifact preparation on the VPS; Codex specialists do the same behind verified isolation; a nightly off-host backup lands and a restore rehearsal passes. The first four are done; the last three were still open when the epic was last updated.
4. First milestone, integration boundary: live. Allowed side effects: artifact versions and attempt records in the company's SQLite database, spawning the owner's signed-in Claude and Codex CLIs (subscription usage), the VPS deploy and the encrypted off-host backup. Not allowed: repository access, payments, email, external publication, or granting any human approval.
5. Main business-flow doc: the main business flow is real manual Software delivery (owner interview 2026-10-30). A People and HR onboarding flow doc already exists.
6. Code of conduct: defer until a monitored enforcement address exists (owner interview 2026-10-30); no code of conduct file for now. Team size for this purpose is not decided yet; the git history has one author.
7. Vulnerability-reporting contact: keep unconfigured for now (owner interview 2026-10-30); no monitored private address exists.
8. License: proprietary, all rights reserved; the project is private.
9. Unrecognized docs: `docs/preview/` holds dated verification evidence and screenshots linked from the README and requirements; keep it where it is. `docs/design/`, `docs/bugs/`, `docs/changelog/CHANGELOG-pre-0.2.md` and `docs/archive/` stay in place (owner interview 2026-10-30).
10. Work store: the repository already uses `docs/work/<status>/TASK-NNN-*.md` with sprints and an epic; there is no TODO.md to convert.
11. Retired docs are archived only, never hard-deleted (owner interview 2026-10-30).
