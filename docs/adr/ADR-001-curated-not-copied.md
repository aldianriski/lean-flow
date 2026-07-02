---
id: ADR-001
tags: [process]
domain: governance
status: accepted
related: [ADR-002]
---

# ADR-001 — Curated, not copied

- **Status:** accepted (2026-06-09)
- **Deciders:** Maintainer
- **Context driver:** avoid the documentation/skill bloat that made dev-flow unmanageable

## Context

dev-flow was a "brutal" implementation — techniques bulk-imported from every reference, the docs
folder grew past managing, and the value drowned in volume. lean-flow exists to fix that. The
governing question was: what is lean-flow's actual discipline — minimalism by rule, or something
else? Framing it as "no agents / no hooks / few features" proved too extreme and kept mis-describing
the project (it described a symptom, not the law).

## Decision

**The discipline is *reviewed inclusion*, not a feature ban.** Every component is reviewed against
"genuinely useful **and** important **and** actually used" and approved before adding. Nothing is
bulk-imported from a reference. The bar is the review — any component type (skills, agents, hooks)
is allowed *if it clears the bar*.

## Consequences

**Positive:** a stable, maintainable identity that doesn't rot; honest framing (we add things like
`/council` when they earn it, rather than pretending a rule forbids them); the bar itself is the
roadmap (add by demonstrated need).
**Negative (trade-offs accepted):** slower to add things (each candidate needs review + approval); no
crisp "we never do X" marketing line; relies on the maintainer actually applying the bar.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Minimal-by-rule ("no agents / no hooks, ever") | Too extreme — exiled genuinely useful tools (council) and mis-stated intent |
| Copy-everything (dev-flow's approach) | The exact failure lean-flow exists to fix |
