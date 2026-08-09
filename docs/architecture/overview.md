---
owner: Maintainer
last_updated: 2026-08-09
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
  lean-doc-generator/templates/   33 canonical doc templates (core; +2 non-core: DESIGN · QA-TESTCASE = 35 total)
.claude/          CLAUDE.md (shape) · CONTEXT.md (vocab · loop · gates · modes — SSOT)
docs/             architecture/ · development/ · deployment/ · adr/ · DECISIONS.md · LEARNINGS.md
                  · research/ · qa/
  epic/             EPIC-NNN-<slug>.md + INDEX.md — multi-sprint outcomes (ADR-014 era; archive/ once closed)
  sprint/           SPRINT-NNN-<slug>.md (Plan, 400 hard) · logs/ (Execution Log, uncapped — ADR-014)
                    · archive/ + archive/logs/ (the pair moves together at close) · INDEX.md
  changelog/        CHANGELOG-<version>.md — rotated out of root at each new MINOR (§11)
  research/         <slug>.md · archive/ — a spent verdict moves there once `status: superseded`
                    AND nothing live cites it; it stays in the generated index, marked (§11)
scripts/          qa-check.sh · gen-index.sh · night-run.sh (unattended launcher) · lib/ (extracted checkers)
                                                maintainer tooling for the REPO itself (ADR-008)
evals/            must-FAIL/must-SKIP fixtures + assertion scripts guarding a SHIPPED skill's
                  behavioural contract; lib/ · fixtures/                        (SPRINT-038)
TODO.md · TECH-DEBT.md · README.md · CHANGELOG.md · AGENTS.md · SECURITY.md · LICENSE
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

### Base-tier docs this repo deliberately does not have

Ruled at SPRINT-054 T1. Each row below is an **exemption with a reason**, not an oversight — the point
of writing them down is that a future reader (or `init` run) can tell the two apart. Substrate-gated
rows are excluded: they are skipped, not owed (DOCS_Guide §6), and are not listed here.

| Absent | Why | Revisit when |
|---|---|---|
| `CONTRIBUTING.md` | §2 gates it on *team ≥ 2, or on request*. Single maintainer, no request received — the standard's own condition never fired, so this is not a deviation. | a second maintainer joins, or an external contributor asks |
| `CODE_OF_CONDUCT.md` | Same gate as CONTRIBUTING (§2, added SPRINT-055 T7), and the same unmet condition: one maintainer, no request. The template ships so `init` can scaffold it for a consumer who *has* met the condition — lean-flow shipping the template is not lean-flow owing the file. Its enforcement contact is load-bearing, and a solo repo has no one to route a report to. | a second maintainer joins, an external contributor asks, or the project accepts public contributions |
| `docs/product/requirements.md` | What it would hold already exists and is owned elsewhere: `.claude/CONTEXT.md` carries the roster · loop · gates · modes (what the product **is**), `.claude/CLAUDE.md` the design principles + DoD (what it must **satisfy**). A third copy would be a second SSOT, which LAW 4 and the anti-SSOT rule both forbid. The alternate trigger — a sanitized feature PRD landing — has never fired. | a feature PRD is sanitized into a durable requirement, or the AI-context files stop being the spec |
| `docs/product/acceptance-criteria.md` | §2 trigger is *with requirements*. Dependent row; its condition is unmet while the row above is exempt. | with `requirements.md` |

## Decision records

See [`DECISIONS.md`](DECISIONS.md) (the index) → [`docs/adr/`](adr/) for the decisions behind this
structure — ADR-001…005 shaped the skill library; the `docs/` tree above is ADR-012 (repo-structure
core) and ADR-014 (the sprint Plan/log split, which the `epic/` and `sprint/logs/` rows follow).
