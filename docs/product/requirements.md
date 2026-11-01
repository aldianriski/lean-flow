---
owner: Maintainer
last_updated: 2026-11-01
update_trigger: A requirement is approved or changed (via PR)
status: current
---

<!-- Lives at docs/product/requirements.md (lean-flow STANDARD §2). Written by `/lean-doc-generator
     migrate`'s profile pass. This repo's AI-context files already are the spec (.claude/CONTEXT.md
     the behaviour, .claude/CLAUDE.md the principles and DoD), so each topic they settle is CITED
     here, never copied: a third copy would be a second SSOT (STANDARD §2, requirements row). -->

# lean-flow — Requirements

## Business goal
<!-- Each fact ends with its source: `(from <path> § <heading>)` · `(owner, migrate)`. -->
- Coding agents fail in recognizable ways, and each skill is the fix for one of them: a lean agentic dev loop for Claude Code (from README.md § Why lean-flow)
- Curated, not copied: nothing is added until it is genuinely useful, important and actually used (from .claude/CLAUDE.md § Design Principles)
- A tool that improves the coding process and evolves with the standard as it is used on real projects such as workdoo, with a plan to handle agent work through agents with a specific speciality each (owner, migrate)

## Users [CUSTOMIZE]
Not decided yet (owner, migrate)

## Solution scope [CUSTOMIZE]
Not decided yet (owner, migrate)

## Non-goals
- No app-code generation, CI/CD pipeline, automated coverage tooling or telemetry (from README.md § What lean-flow does NOT do)
- No project scaffold written into an adopter's repo (from README.md § What lean-flow does NOT do)
- adlc-flow's ADLC artifacts, agent and hook scaffolding are not lean-flow's to own (from docs/architecture/overview.md § Boundaries (what lean-flow does NOT own))

## Main flows
- The loop: `/prime`, intake, `promote`, `/orchestrator`, repeat; `/handoff` ends a session and the next `/prime` resumes it (from .claude/CONTEXT.md § The loop)
- The sprint lifecycle: `promote` renders and freezes the plan, execute ticks member DoDs into the Execution Log, `close` writes the Retro and routes its buckets (from .claude/CONTEXT.md § Sprint model)

## Invariants
- G1 Scope and G2 Design pass with explicit human sign-off before any commit (from .claude/CLAUDE.md § Design Principles; .claude/CONTEXT.md § Gates)
- `release-patch` never runs `git push`; it stops at the gate (from .claude/CLAUDE.md § Design Principles)
- A sprint's Plan is frozen at promote; a scope shift logs a `scope-change` entry before the Plan changes (from .claude/CONTEXT.md § Sprint model)
- Every versioned manifest carries the same version (from .claude/CLAUDE.md § Definition of Done)

## First milestone [CUSTOMIZE]
<!-- Init-only: migrate's profile pass does not ask it. -->

Not decided yet (owner, migrate)

## Functional requirements [CUSTOMIZE]
<!-- No R-numbers yet: the skill roster in .claude/CONTEXT.md § Skill roster is the behaviour spec.
     Numbers are assigned when a sanitized feature PRD lands; never renumber, only append or deprecate. -->

None numbered yet; the skill roster is the behaviour spec (from .claude/CONTEXT.md § Skill roster)

## Quality attributes [CUSTOMIZE]

| Category | Requirement | Source |
|:---------|:------------|:-------|
| Performance | The always-loaded `CLAUDE.md` + `CONTEXT.md` pair stays inside its token budget; each `SKILL.md` stays within ~140 lines of procedure | (from docs/adr/ADR-048-the-always-loaded-read-set-is-budgeted-in-tokens.md; .claude/CLAUDE.md § Design Principles) |
| Availability | Not decided yet | (owner, migrate) |
| Security | Each skill declares its own tool grants; nothing is sent anywhere | (from SECURITY.md § What this plugin can do in your repo; README.md § What lean-flow does NOT do) |
| Scalability | Not decided yet | (owner, migrate) |

## Open questions [CUSTOMIZE]
None open (owner, migrate)
