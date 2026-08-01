---
owner: Maintainer
last_updated: 2026-08-01
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
skills/           14 skills (auto-discovered at root)
  flow/                                                  opt-in conductor
  prime/ lean-doc-generator/ orchestrator/ task-decomposer/ triage/
  prototype/ tdd/ diagnose/ refactor-advisor/ release-patch/ handoff/ insights/   12 stage-skills
  council/                                               opt-in agent decision aid
  <skill>/references/   on-demand depth (DOCS_Guide, testability, feedback-loops, deepening, …)
  lean-doc-generator/templates/   30 canonical doc templates (core; +2 non-core: DESIGN · QA-TESTCASE = 32 total)
.claude/          CLAUDE.md (shape) · CONTEXT.md (vocab · loop · gates · modes — SSOT)
docs/             architecture/ · deployment/ · DECISIONS.md · LEARNINGS.md · adr/ · sprint/
scripts/          qa-check.sh · gen-index.sh · night-run.sh (unattended launcher) · lib/ (extracted checkers)
                                                maintainer tooling for the REPO itself (ADR-008)
evals/            must-FAIL/must-SKIP fixtures + assertion scripts guarding a SHIPPED skill's
                  behavioural contract; lib/ · fixtures/                        (SPRINT-038)
TODO.md · TECH-DEBT.md · README.md · CHANGELOG.md
```

`scripts/` and `evals/` are both **maintainer-oriented** — they target *this* repo and no consumer
invokes them. They are **not**, however, absent from an install: `plugin.json` declares no file
manifest, so `plugin install` copies the whole repo and both directories land in the consumer's cache
verbatim (verified against a real install, SPRINT-042). The distinction that matters for a
consumer-facing check (L-015) is therefore *usable surface*, not presence on disk. They differ by
*what they guard*: `scripts/` supports this repo (lint, index generation), `evals/` guards behaviour
that ships inside a skill. The zero-API `evals/` harnesses run inside `qa-check.sh` — always-on ones
on every run, the slow selftests under `QA_FULL=1` (TD-016); the paid behavioural fixtures stay a
manual step (`evals/README.md`).

## The loop

`/prime → /lean-doc-generator → /orchestrator → repeat`, with the **gates** (G1 Scope · G2 Design,
human-approved) and **§10 governance** (Sprint-Close Retro routes to CHANGELOG / `TD-NNN` /
`TASK-NNN` / `LEARNINGS.md`; promote-time review). `/flow` conducts it end-to-end.

## Key integration points

| System | How | Where |
|---|---|---|
| **Claude built-in agents** | dispatched in an **isolated pass** (no shipped agent files) — recon→`Explore` · review→`/code-review` · verify→`/verify` · security→`/security-review` | `CONTEXT.md` § Built-in leverage · `orchestrator` (ADR-002) |
| **Claude built-in commands** | wired at loop points — `/goal` · `/plan` · `/batch` · `/loop` · `/run` · `/simplify` | `orchestrator` · `flow` |
| **Hooks** | none — deliberately (the loop is suggestion + gates, not enforcement) | — |
| **Cloud / fan-out tools** | **out of lean scope** — `/workflows` · `/ultracode` · `/ultraplan` · `/ultrareview` are user-triggered and billed; lean-flow never launches one | — |
| **`/council` sub-agents** | the one skill that orchestrates sub-agents *internally* (opt-in, high-stakes only) | `council` (ADR-004) |

## Boundaries (what lean-flow does NOT own)

App-code generation · CI/CD · coverage tooling · telemetry · agent/hook scaffolding · adlc-flow's
ADLC artifacts. Adopting an existing repo's docs is handled by `/lean-doc-generator migrate`;
scaffolding a fresh repo by `/lean-doc-generator init`.

## Decision records

See [`DECISIONS.md`](DECISIONS.md) (the index) → [`docs/adr/`](adr/) for the decisions behind this
structure (ADR-001…005).
