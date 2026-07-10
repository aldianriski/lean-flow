---
owner: Maintainer
last_updated: 2026-07-10
status: current
id: model-purpose
tags: [tooling]
domain: governance
related: []
---

# Model-purpose routing — the four-tier doctrine (source)

A general, cross-project model-routing doctrine (originating outside lean-flow — Agent Factory /
KalaSuara / client pipelines). Recorded here as the **source** input; lean-flow adopts a **slimmed,
dispatch-only** subset — see **[ADR-010](../adr/ADR-010-model-dispatch-role-tiers.md)** for what
lean-flow actually takes, what it rejects (the auto-escalation ladder · the raw 4-tier import), and why.

## The four tiers

| Model | Best for | When to use |
|---|---|---|
| **Fable 5** | Judgment under ambiguity: hard planning, architecture/ADR decisions, conflict-heavy synthesis, adversarial critique | Rarely and deliberately — when the *decision* is the hard part and a wrong call is expensive to unwind. Final escalation rung. **Never as a worker.** |
| **Opus 4.8** | Default orchestrator: routine planning, task decomposition, merging results, complex multi-step reasoning | Every normal pipeline run at the top of the hierarchy. |
| **Sonnet 4.6** | Substantive execution: writing code against a spec, research, analysis, drafting, debugging | The workhorse — 70–80% of token volume. Anything a competent mid-level engineer could do from a clear brief. |
| **Haiku 4.5** | Mechanical volume: extraction, classification, formatting, validation, contract checks, routing/triage | High-volume, well-specified, repetitive tasks. Also the verify gate + the complexity classifier. |

## Routing rule

**Ambiguity and consequence route up; volume and repetition route down.** Task *size* is irrelevant —
*nature* is everything. A tiny ambiguous task ("choose the architecture") → Fable; a huge mechanical
task ("extract entities from 200 articles") → Haiku.

## Escalation ladder (source doctrine)

Haiku attempts → verify gate rejects → Sonnet retries with the error in context → still failing →
Fable gets one shot with full failure history → if even that fails, the brief is broken, so return to
planning instead of retrying harder.

> **lean-flow's adoption is deliberately narrower** (ADR-010). It's agent-free / no-hooks, so it takes
> the *role-based dispatch map* (remappable, dispatch-only enforceable) and the routing rule, but **not**
> the automated ladder — that's agent behavior it can't own. Escalation stays **manual**, optionally
> dispatching a built-in (`/verify` · `/diagnose`) at a fail point.
