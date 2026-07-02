---
id: ADR-005
tags: [process]
domain: skills
status: accepted
related: [ADR-004]
---

# ADR-005 — /flow opt-in conductor + the standalone contract

- **Status:** accepted (2026-06-09)
- **Deciders:** Maintainer
- **Context driver:** make the workflow's discipline reliably runnable without losing à-la-carte adoptability

## Context

lean-flow's skills are wired together (routing, feed pipeline, sprint lifecycle), yet the README
claimed "each skill standalone, none require the others". An audit confirmed the wires are all
*soft* (boundary pointers, routing suggestions, output flow) — no skill hard-requires another. But a
purely suggestion-based loop means the discipline is only as strong as whoever remembers to follow
it ("discipline you have to remember isn't discipline"). The choice was: stay à-la-carte (flexible,
but discipline optional) vs become a wired workflow (reliable, but rigid like dev-flow).

## Decision

**Keep "standalone" as a contract *and* add an opt-in conductor.** Every stage-skill completes its
own job when invoked cold (cross-references are suggestions, never requirements). `/flow` is the one
component allowed to depend on the others — it *sequences* the loop (calling each standalone skill),
never re-implements a stage. Result: à-la-carte (any skill alone) **or** conducted (`/flow` runs the
lot). Only inherent ordering is the sprint lifecycle (can't `close` what you didn't `promote`).

## Consequences

**Positive:** the discipline is reliably runnable in one command, *and* piecemeal adoption + the
lean drop-in identity are preserved; a stated maintenance rule ("a stage-skill that needs another
breaks the contract") guards it forward.
**Negative (trade-offs accepted):** `/flow` is a second way to do the same thing (two paths to teach);
the standalone contract needs ongoing enforcement as skills are wired.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Pure à-la-carte (status quo) | Discipline depends on the user remembering the sequence |
| Workflow-first (enforced sequence) | Drifts back toward dev-flow's heaviness; weakens piecemeal adoption |
