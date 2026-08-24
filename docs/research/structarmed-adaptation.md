---
owner: Maintainer
last_updated: 2026-07-10
update_trigger: The structarmed repository changes, or a rejected row becomes a keeper against lean-flow's current surface
status: current
id: structarmed-adaptation
tags: [process]
domain: governance
related: []
---

# structarmed — adaptation scan (TASK-049)

Scan of [boundwize/structarmed](https://github.com/boundwize/structarmed) for anything worth adapting
into lean-flow. Goal: extract only what fits the **lean · curated · agent-free · human-gated** ethos;
reject the rest.

## Verdict summary

**Domain mismatch — 0 keepers.** structarmed is a **PHP static-analysis / architecture-enforcement
library** (same space as Deptrac / PHPArkitect): it lets a PHP project declare architectural layers +
dependency rules and fails the build on violations (CLI `analyse` pass + PHPUnit extension). It has
**no** sprints, gates-as-workflow, agents, orchestration loop, doc standard, or task tracking — none of
the surface lean-flow occupies. It is not an AI-assisted-development framework at all; the URL looked
adjacent by name only.

## Rejects (why nothing lands)

| structarmed feature | Why REJECT |
|---|---|
| Layers-as-config + dependency rule engine | PHP code-architecture linting — outside lean-flow's scope (workflow, not app-code enforcement); belongs to a host project's own CI, not a dev-loop plugin |
| `init --preset` scaffolding · `analyse` CLI · PHPUnit extension | tool mechanics for a PHP linter; nothing transferable to a markdown skill-library |
| Strict internal quality-gate stack (PHPStan max, Codecov, rector, typos.toml) | generic PHP tooling hygiene, not a workflow concept |

## The one conceptual adjacency (already tracked)

The single idea with any philosophical overlap is **"encode a decision as an *enforced*, automated
check" (gate-as-code / rules-as-code)** — structarmed enforces architecture rules rather than leaving
them as documentation. lean-flow deliberately makes its gates **suggestion + human sign-off**, not
enforcement (ADR: agent-free, no hooks). Whether enforced gates are worth it is **already the open
question in [TASK-006](../../TODO.md)** (opt-in PreToolUse gate-guard hook). structarmed adds no new
information there beyond confirming the enforcement-vs-suggestion tension is a real, recurring design axis.

**No follow-up filed** — no keepers; TASK-006 already owns the only adjacent question.
