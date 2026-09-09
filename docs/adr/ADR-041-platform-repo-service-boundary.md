---
id: ADR-041
tags: [process, tooling]
domain: governance
status: accepted
related: [ADR-035, ADR-032, ADR-027, ADR-012]
---

# ADR-041 — The pilot platform lives in its own repository; lean-flow is consumed there as a pinned plugin

- **Status:** accepted (2026-09-09)
- **Deciders:** Maintainer
- **Context driver:** the Agentic Governance Dashboard pilot targets a working run from a browser in
  five working days. Its first structural question — *which repository holds the service?* — was
  already owed as an ADR by two separate documents, and every day it stays open is a day of code
  written against an unruled boundary.

## Context

The pilot needs a web dashboard, a control API with a long-running supervisor, a durable store, and
isolated workers. lean-flow today is none of those things: it is a Claude Code **plugin** — a skill
library whose executable surface is a handful of POSIX scripts and a zero-dependency Bun workspace.

The conflict is not stylistic, and it is measurable. `plugin.json` declares **no file manifest**, so
`plugin install` copies the **entire repository** into every consumer's cache — verified against a
real install at SPRINT-042 and recorded in `docs/architecture/overview.md`. The root `package.json`
therefore carries **zero runtime dependencies** on purpose (ADR-035): Bun executes TypeScript
directly, nothing is installed, and nothing lands in a consumer's cache. A dashboard reverses that
in one commit — a UI framework, a Postgres driver, and a session/auth library pull dozens of
transitive dependencies into the cache of every repository that installs lean-flow, none of which
asked for a dashboard. That is the consumer-surface leak L-015 exists to catch, arriving at the
largest scale the repository has yet had available to it.

Two documents already recorded that this ruling was owed and neither could make it: the pilot roadmap
(§10 — *"Catat sebagai track pilot khusus dengan ADR untuk batas repo/service"*) and EPIC-009, which
owes "the platform repository boundary ADR" at its first G2. The decision was deferred because no
concrete platform existed to bound. One does now.

A third fact removes the main argument for a single tree. The pilot's deployment pattern is not being
invented: `temidev-agent-platform` already runs an **api + web + worker** topology under systemd
behind Caddy on the same VPS, which is the exact process shape the pilot needs. The reusable asset is
a *deployment pattern*, copied deliberately — not a workspace import that a shared tree would have
made free.

## Decision

**The pilot platform is built in a separate repository (`workdoo`), and lean-flow is consumed there
as a pinned plugin rather than vendored or extended.** lean-flow keeps its plugin shape, its
zero-dependency manifest, and its consumer contract unchanged.

The governance split follows from the repository split, and is ruled here so it is not re-litigated
per sprint:

- **lean-flow** owns the **outcome record** — `EPIC-016`, its § Closed-when, its admission, and the
  MVP-driven reprioritisation of EPIC-005…015. This repository remains the work-system.
- **`workdoo`** owns the **execution record** — its own `.claude/`, `TODO.md`, `docs/sprint/`, and its
  own `TASK`/`SPRINT` id-space starting at 001, scaffolded by `/lean-doc-generator init`.

The two id-spaces are deliberately disjoint. A `SPRINT-001` in `workdoo` and a `SPRINT-097` here are
different objects in different repositories, and neither numbering ever has to reserve room for the
other.

## Consequences

**Positive:**
- The plugin's zero-dependency property survives the pilot; no consumer inherits a dashboard's
  dependency tree from a repository they installed for its skills.
- `workdoo` becomes lean-flow's **first real consumer**, which finally exercises the consumer path
  this repository has never been able to dogfood — the substrate-absent case L-016 names explicitly,
  where "it didn't fire in our repo" is evidence of nothing.
- The platform is free of this repository's line caps and doc-standard obligations for its *code*
  layout, while still inheriting the loop, the gates, and the authority model as a consumer.
- The runtime-adapter seam has a real reason to stay clean: it crosses a repository boundary, so a
  Claude-Code-specific assumption cannot leak through a convenient local import.

**Negative (trade-offs accepted):**
- **Two repositories to keep in step.** EPIC-016's § Member sprints rows point at sprints in another
  repository, and a cross-repo pointer rots more quietly than a relative link — the epic-rollup
  currency check added in v1.63.0 reads *this* repository only, so it cannot see a `workdoo` sprint
  that closed without a rollup row.
- **No free type sharing.** Domain types common to both (run outcome vocabulary, authority classes)
  must be duplicated or published deliberately. Duplication that drifts is the predictable failure.
- **Governance spans two trackers**, which is exactly the shape LAW 4 warns about. It is accepted only
  because the two hold different *kinds* of record — outcome here, execution there — and never the
  same fact twice. The moment `workdoo` starts restating EPIC-016's conditions in its own tracker,
  this decision has been violated in practice while still being followed on paper.

## Alternatives considered

| Option | Why rejected |
|---|---|
| One workspace in lean-flow (`apps/dashboard`, `apps/api`) | Fastest to start and shares contracts for free, but breaks the zero-dependency manifest that ADR-035 established and `plugin install` copies wholesale — a consumer-surface leak (L-015) at the largest scale available |
| lean-flow tree with `platform/` excluded from the install | The exclusion mechanism does not exist: `plugin.json` declares no file manifest, so there is nothing to exclude *with*. Building that mechanism first is a Day-1 detour off the pilot's critical path, paid before any dashboard code is written |
| Vendor lean-flow into `workdoo` (copy the skills) | Creates a second copy of every skill that drifts from the one it copied, and would have made `workdoo` a fork rather than a consumer — losing the one dogfooding signal this split buys |
