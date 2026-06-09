---
owner: Maintainer
last_updated: 2026-06-09
update_trigger: Skill/component added, the loop changed, or an integration point changed
status: current
---

# lean-flow — Architecture

> **Style:** a Claude Code **plugin** — a skill library + one conductor. Not a layered application;
> the "architecture" is how the skills *compose* into a loop. Curated, not copied (ADR-001).

## Composition rule

- **Stage-skills are standalone** — each completes its own job when invoked cold. Cross-references between them are routing/handoff *suggestions* (`→ /X`), never requirements (ADR-005).
- **`/flow` is the only component allowed to depend on the others** — it *sequences* the loop (calling each standalone skill), never re-implements a stage. À la carte **or** conducted.
- **The only inherent ordering** is the sprint lifecycle: `promote → execute → close`.

## Directory structure

```
.claude-plugin/   plugin.json · marketplace.json        (lockstep versions)
skills/           13 skills (auto-discovered at root)
  flow/                                                  opt-in conductor
  prime/ lean-doc-generator/ orchestrator/ task-decomposer/ triage/
  prototype/ tdd/ diagnose/ refactor-advisor/ release-patch/ handoff/   11 stage-skills
  council/                                               opt-in agent decision aid
  <skill>/references/   on-demand depth (DOCS_Guide, testability, feedback-loops, deepening, …)
  lean-doc-generator/templates/   11 canonical doc templates
.claude/          CLAUDE.md (shape) · CONTEXT.md (vocab · loop · gates · modes — SSOT)
docs/             ARCHITECTURE.md · CHANGELOG.md · adr/ · sprint/
TODO.md · DECISIONS.md · README.md
```

## The loop

`/prime → /lean-doc-generator → /orchestrator → repeat`, with the **gates** (G1 Scope · G2 Design,
human-approved) and **§10 governance** (Sprint-Close Retro routes to CHANGELOG / `TD-NNN` /
`TASK-NNN` / `LEARNINGS.md`; promote-time review). `/flow` conducts it end-to-end.

## Key integration points

| System | How | Where |
|---|---|---|
| **Claude built-in agents** | dispatched in an **isolated pass** (no shipped agent files) — recon→`Explore` · review→`/code-review` · verify→`/verify` · security→`/security-review` | `CONTEXT.md` § Built-in leverage · `orchestrator` (ADR-002) |
| **Claude built-in commands** | wired at loop points — `/goal` · `/plan` · `/batch` · `/loop` · `/run` · `/simplify` | `orchestrator` · `flow` |
| **graphify** (optional) | if `graphify-out/graph.json` exists, `/prime` may use it for orientation — **never required** | `prime` |
| **Hooks** | none — deliberately (the loop is suggestion + gates, not enforcement) | — |
| **`/council` sub-agents** | the one skill that orchestrates sub-agents *internally* (opt-in, high-stakes only) | `council` (ADR-004) |

## Boundaries (what lean-flow does NOT own)

App-code generation · CI/CD · coverage tooling · telemetry · agent/hook scaffolding · adlc-flow's
ADLC artifacts. Adopting an existing repo's docs is handled by `/lean-doc-generator migrate`.

## Decision records

See [`DECISIONS.md`](../DECISIONS.md) (the index) → [`docs/adr/`](adr/) for the decisions behind this
structure (ADR-001…005).
