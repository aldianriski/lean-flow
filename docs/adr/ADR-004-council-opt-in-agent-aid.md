---
id: ADR-004
tags: [process]
domain: skills
status: accepted
related: [ADR-002, ADR-005]
---

# ADR-004 — Admit /council as an opt-in agent decision aid

- **Status:** accepted (2026-06-09)
- **Deciders:** Maintainer
- **Context driver:** get strong multi-perspective decision support for hard/ambiguous calls

## Context

`/council` (Karpathy's LLM Council — 5 advisors + anonymous peer review + chairman) genuinely helps
exactly the decisions ADRs are for: hard-to-reverse, ambiguous, high-stakes. But it spawns ~11
sub-agents per run, which collided with lean-flow's then-absolute "no agents" framing. Per ADR-001
the bar is review, not a ban — so the real question was whether council *clears the bar* and how to
keep it lean. It does (the maintainer uses it by use-case and finds it high-value), provided its
output is contained.

## Decision

**`/council` is included as the one opt-in, agent-using decision aid**, reserved for high-stakes
forks (it is expensive). It writes a single lean **`verdict-<slug>.md`** (verdict only, not the
transcript; same slug the ADR will use) → fed into a rich ADR, then deleted. The absolute "no agents"
claim is dropped in favour of "agent-free *core loop* + one reviewed opt-in agent aid".

## Consequences

**Positive:** strong, independent multi-angle pressure-testing before recording a hard decision; lean
output (one verdict file → ADR → delete); honest, precise positioning.
**Negative (trade-offs accepted):** ~11 model calls/run (cost — reserve for expensive-to-get-wrong
calls); `/council` is ~331 lines, over the SKILL cap (TD-002 / TASK-005); "no agents" is no longer a
clean one-liner.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep council out (user-level / external) | Over-weighted positioning purity over a genuinely useful tool the maintainer wants |
| Inline 5-lens pressure-test (no sub-agents) | Weaker — one model role-playing 5 lenses loses the independence that makes council work |
