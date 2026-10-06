---
epic: 018
slug: projects-span-repositories
owner: Maintainer
last_updated: 2026-10-06
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-018 — Projects Span Repositories, End to End

> **Outcome:** an operator adds a GitHub repository to a **Project** from the workdoo dashboard without touching the server, and one
> work item can deliver a feature across several of that Project's repositories, accepted as one reviewed change per repository,
> all-or-nothing.

## Why this, why now

workdoo knows a repository only as a free-text local path on each work item (`work_items.repository` → `repositoryPath`). The first
off-host deploy (2026-10-06) made the cost concrete: adding temidev took a hand-made deploy key, a hand clone and a typed path. The
owner wants projects added from the dashboard and features delivered end to end across repos (e.g. a frontend plus its API), with more
integrations (Figma, deploy targets) later. That spans a registry, a provisioner with its own trust boundary, multi-repo attempts, and
amendments to workdoo's ADR-003/004, which is more than one sprint. Like EPIC-016, it lives here, and its member sprints are **workdoo** sprints.

## Scope

**In:** the Project / Repository / Integration model and its registry · a provisioner that adds a GitHub repository (per-repo deploy
key, clone, layout check) · the work-item form picking from the registry · multi-repo work items with all-or-nothing acceptance · the
home-repo convention for a Project's planning docs (lean-flow side: cross-repo `Layers:`).
**Out (explicitly not):** pushing branches, opening PRs, triggering deploys, Figma, each of which becomes a capability enabled later by its own
decision · multi-tenant organisations · anything inside workdoo's SPRINT-009 (isolation), which this epic sequences after.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|

## Decisions

- **D1** — A **Project** groups **Repositories** (each one registered repo: provider, remote, managed checkout, git capabilities, read
  now) and **Integrations** (Project-level connections such as a Figma file or a deploy target, later). Example: Project "Temika" →
  repositories temidev + temidev-api, integration figma:<file>. Owner, 2026-10-06.
- **D2** — A separate **provisioner** job is the only holder of the GitHub token; the dashboard records a request, and the long-running API
  never holds an admin-capable credential. Owner, 2026-10-06. Recorded in ADR-009 (workdoo) once written.
- **D3** — The token is fine-grained and limited to **selected repositories**: adding a project starts by ticking that repo on the token. Owner.
- **D4** — Access starts **read-only**. Push, PRs and deploys are capabilities, each enabled later by a recorded decision. Owner.
- **D5** — A Project has a **home repository** that holds its `docs/work` · `docs/sprint` · `docs/epic`; a task names other repositories'
  files as `<repo>:path`. Git keeps owning content (workdoo ADR-001). Owner.
- **D6** — Sequenced **after workdoo SPRINT-009** (isolated clone per attempt, ADR-008), whose checkout design the provisioner builds on. Owner.
- **D7** — Also after **EPIC-019** (the redesign), so the Projects screen and repository picker are built once, in the v0.2.0 design. Owner, 2026-10-06.

## Open questions

<!-- The fog map. Decision tickets resolve a decision and close; they never take a TASK id. -->
- **Integration-provider model and provisioning trust boundary** (Grilling → workdoo **ADR-009**). It reverses workdoo
  `docs/architecture/integrations.md` "deliberately does not integrate" and `overview.md`'s CI/CD exclusion, and it decides how a capability is
  enabled and audited. Unblocks workdoo TASK-057.
- **Multi-repo attempt shape** (Prototype `/prototype`, or `/council`): one attempt over N checkouts, or N linked attempts under one work
  item. Depends on ADR-008.
- **All-or-nothing acceptance and approval over several refs and digests** (`/council` → amendments to workdoo ADR-003/004). Depends on the
  attempt shape.
- **Cross-repo `Layers:` in the home repo** (Research, lean-flow): the `<repo>:path` token, and what layers-completeness, layers-observed and the
  spec need. Adopter-facing, so it is a lean-flow task with the consequential bar.
- **Provisioner trigger** (Research): a request table polled by a systemd timer, or a path unit, or a worker job. Depends on ADR-008's checkout model.

## Closed when

- [ ] An operator adds a GitHub repository to a Project from the dashboard, and it ends registered, keyed, cloned and layout-checked with no server login.
- [ ] One work item targets several repositories of a Project, and an accepted run lands one reviewed change per repository, all-or-nothing.
- [ ] A Project's planning docs live in its home repository, and lean-flow's checks pass on a cross-repo `Layers:` line.
- [ ] workdoo ADR-009 records the integration-provider model; enabling any further capability is a recorded decision.
