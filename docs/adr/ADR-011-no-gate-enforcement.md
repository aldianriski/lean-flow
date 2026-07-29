---
id: ADR-011
tags: [process, tooling]
domain: governance
status: accepted
related: ADR-002 · pretooluse-gate-guard
---

# ADR-011 — No gate enforcement: G1/G2 stay human discipline (no hook, no sibling plugin)

- **Status:** accepted (2026-07-29)
- **Deciders:** Maintainer
- **Context driver:** TASK-006's open question — are enforced gates worth a PreToolUse hook? — resolvable only after the platform facts were measured.

## Context

lean-flow's gates (G1 Scope · G2 Design) are suggestion + human sign-off; the core ships no hooks
(ADR-002 lineage). TASK-006 asked whether an *opt-in* PreToolUse "gate-guard" hook — blocking
Edit/Write until a gate-approval marker exists — should harden them. The 2026-07-29 research
(`docs/research/pretooluse-gate-guard.md`) settled the facts: blocking is feasible and fail-open,
a hook deny overrides every permission mode — but **plugin hooks auto-activate with no per-hook
disable**, so an in-core hook would be mandatory for every installer. That platform fact reduced
the fork to A (status quo) vs C (a separate opt-in sibling plugin, `lean-flow-gate-guard`).

## Decision

**A — status quo.** lean-flow ships no gate enforcement anywhere: no in-core hook (ruled out on
platform fact), and no sibling plugin (rejected on YAGNI). Gates remain human discipline. Rationale:
there is zero demand signal for enforced gates — no consumer report of gate-skipping as a real
failure — and C's costs (a second maintained artifact, a marker-file public contract, Windows
portability work) are certain while its benefit is speculative. Owner decision at the G2 gate
(council run waived as a logged scope-change — the fork was judged decidable without it).

## Consequences

**Positive:** the hook-free core stays intact and honest — "no hooks" remains literally true across
the ecosystem, not just the core; zero new surface, contract, or maintenance burden.
**Negative (trade-offs accepted):** gates remain skippable — an agent or user can bypass G1/G2 with
nothing but discipline in the way; if gate-skipping ever becomes a recurring observed failure, this
decision must be reopened (revisit trigger recorded in `.out-of-scope/gate-guard-hook.md`).

## Alternatives considered

| Option | Why rejected |
|---|---|
| B — hook inside the lean-flow plugin | Platform fact: hooks auto-activate with the plugin, no per-hook disable ⇒ mandatory for every consumer — violates the opt-in requirement and the hook-free core. |
| C — opt-in sibling plugin (`lean-flow-gate-guard`) | Feasible (fail-open, real enforcement) but YAGNI: certain maintenance + contract + portability costs against unproven demand. |
