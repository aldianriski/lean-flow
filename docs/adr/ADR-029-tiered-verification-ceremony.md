---
id: ADR-029
tags: [process, tooling]
domain: governance
status: accepted
related: [ADR-021, ADR-022, ADR-011]
---

# ADR-029 — Verification ceremony tiers by failure visibility, not uniformly

- **Status:** accepted (2026-08-23)
- **Deciders:** Maintainer
- **Context driver:** the ADLC roadmap's Phases D–H are seven phases of real software; the current
  per-unit verification cost was calibrated on gates and does not survive that scale.

## Context

lean-flow applies one verification discipline to every change: a must-FAIL fixture per check with its
named finding, a retained control, and a discrimination proof (seed the rejected design, verify the
seed landed via `cmp` against a pristine copy, restore under a checked hash, confirm the seeded
artifact still parses and is a *targeted* break, confirm the case reddens while a sibling control
stays green).

That discipline is correct and was earned. **L-058** — a gate's worst failure is the silent
false-negative — was proven live twice, once when a single stripped guard clause made a shipped
preflight report CLEAR on a real overlap. **L-137** caught three seeds that never landed, plus a
timeout that left a seeded break in a shipped file. **L-142** caught three breaks that did not redden
their case: an errored `sed` wrote an empty file every guard accepted, a control passed vacuously
because its rule did not exist yet, and a fixture wrote its trigger phrase where the anchored pattern
could never match it. Nothing here is being called excessive.

**Every one of those was learned on a gate or a checker** — code whose job is to detect something,
where a false negative is invisible by construction. The discipline is now applied uniformly,
including to markdown skill edits where a defect is visible to a human on first use.

**Measured blast radius.** Across the project's lifetime (776 commits, 79 sprints, 75 days):

| Surface | Lines changed | Share |
|---|---|---|
| `skills/` — the consumer-facing product | 8,875 | 9% |
| `scripts/` + `evals/` + `spec/` + governance records | 86,979 | 91% |

Across EPIC-004's nine sprints (~26,000 lines changed), `skills/` changed by **zero lines**. The
product surface is 14 `SKILL.md` files totalling **1,218 lines**; `scripts/lib/conformance-engine.sh`
alone is **3,042 lines**. The ceremony is not the only reason for that ratio, but it is the reason the
ratio is unaffordable to change: cost per unit is set by the guard discipline whether or not the unit
is a guard.

EPIC-004 is one roadmap phase — a single-repo markdown checker — and cost nine sprints. Phases D
through H are protocol, gateway, runtime adapters, control plane, and workflow families. At uniform
ceremony the sequence does not finish.

## Decision

**Verification ceremony scales to how a defect fails, not to what changed.** Three tiers, declared per
task at G2 alongside `class:`, defaulting **up** when the call is unclear.

- **Tier G — guard.** Code whose job is to detect: the conformance engine, `scripts/lib/check-*.sh`,
  eval harnesses, `qa-check.sh` gates. A false negative is silent by construction.
  → **Full discipline, unchanged.** Must-FAIL fixture per check with its named finding, retained
  (TD-012), plus the complete discrimination proof of L-137 and L-142.
- **Tier X — executable, non-guard.** Code that *does* rather than judges: emitters, adapters,
  generators, run plumbing. A defect surfaces as wrong output, not as silence.
  → Retained fixture for the contract. **No discrimination proof.**
- **Tier P — prose.** `SKILL.md`, templates, docs, spec text. A defect is visible on first use.
  → G1 plus a read-through. **No fixtures.**

**L-007 is untouched and binds all three tiers**: a new behaviour's final DoD is still exercised once
on real input. That rule is not what is expensive — the gate half is.

The discriminator is *failure visibility*, because that is the property every one of L-058, L-137 and
L-142 actually turned on.

## Consequences

**Positive:** product work becomes affordable at a cost proportional to its risk; the roadmap's
platform phases become tractable; the guard discipline is concentrated where it was proven rather than
diluted across everything, which also makes a Tier-G exemption conspicuous.

**Negative (trade-offs accepted):**
- A Tier-X or Tier-P defect that *does* fail silently will now ship where today it would not. Accepted
  on the argument that the tiers track failure visibility — but the classification is itself a
  judgement call, and a mis-tiered component gets the wrong treatment with no check that says so.
- Mitigation is procedural, not mechanical: tier is declared at G2 where `class:` is already ruled,
  the default is to tier **up**, and a component that turns out to gate something is re-tiered on
  discovery rather than at the next promote.
- A second thing to get right per task, on gates already carrying a checklist each.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep the ceremony uniform | The measured 91/9 split and the seven remaining roadmap phases make it the binding constraint on delivery, not a safety margin. |
| Drop the fixture/discrimination discipline entirely | L-058 was proven live twice; one stripped guard clause put a CLEAR report on a real overlap. The discipline earns its cost on guards. |
| Tier by change size (S/M/L) | Size does not predict silent failure. L-058's live sighting was a one-line guard-clause edit — the smallest possible change to the highest-risk surface. |
| Tier by `class:` (decision/execution/mechanical-ingest) | That axis describes who should do the work and at what model tier, not whether the work can fail quietly. A mechanical-ingest edit to a checker is still a guard. |
