---
id: ADR-002
tags: [process, tooling]
domain: skills
status: accepted
related: [ADR-001, ADR-004]
---

# ADR-002 — Leverage Claude built-ins; ship no agent definitions

- **Status:** accepted (2026-06-09)
- **Deciders:** Maintainer
- **Context driver:** get independent-perspective + lean-context benefit without duplicating maintained tooling

## Context

dev-flow shipped 6 specialist agents (code-reviewer, security/scope/design/migration/performance
analysts). Most re-create capabilities Claude Code now ships as maintained built-ins: `/code-review`,
`/security-review`, `/simplify`, `/verify`, the `Explore` and `Plan` agents, `/goal`, `/batch`,
`/loop`, `/run`. Re-shipping them would be a worse, self-maintained copy — the dev-flow trap. The
genuine value of a sub-agent is *context isolation* (fresh perspective + a lean main loop), not a
shipped file.

## Decision

**lean-flow ships no agent definitions of its own.** The loop *dispatches Claude's built-in agents
and commands* at the points where isolation pays off — recon → `Explore`, review → `/code-review`,
verify → `/verify`, security → `/security-review` (its own uncontaminated pass) — and wires `/goal`,
`/plan`, `/batch`, `/loop`, `/run`, `/simplify` into the loop stages. `/council` is the one skill
that orchestrates sub-agents *internally*.

## Consequences

**Positive:** zero duplication; built-ins stay maintained by Anthropic; the main loop's context stays
lean; independent review beats self-review without shipping a file.
**Negative (trade-offs accepted):** behaviour depends on Claude Code versions/availability of those
built-ins; less lean-flow-specific tuning than a bespoke agent would give.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Re-ship dev-flow's 6 specialist agents | Duplicates maintained built-ins, worse coverage + upkeep |
| Inline everything (self-review only) | Self-review is the same context grading its own work — weak |
| Ship one tuned `recon` agent | Marginal over built-in `Explore`; deferred until proven needed (TASK-007) |
