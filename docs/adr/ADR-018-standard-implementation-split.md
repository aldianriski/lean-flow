---
id: ADR-018
tags: [process, docs, tooling]
domain: governance
status: accepted
related: ADR-008, ADR-011, ADR-012
---

# ADR-018 — Extract the standard from the implementation; target fleet-scale adoption

- **Status:** accepted (2026-08-10)
- **Deciders:** Maintainer
- **Context driver:** the stated goal — lean-flow as a software-delivery standard for the AI era,
  adoptable across many repos, with agentic delegation under provable HITL quality.

## Context

lean-flow has closed 61 sprints. Measured across three eras, the share of change volume landing in
`skills/` — the product — declined monotonically: **23.7% → 13.5% → 5.7%**. In the last 15 sprints
that is 10.9 lines of documentation churn per line of product churn, or 15:1 counting evals and
scripts (`docs/research/platform-readiness-audit.md` F1).

That number is not a quality failure. The guard machinery it represents finds real defects —
SPRINT-056 found five gates reporting green over input they never examined, and L-058 caught a
stripped guard clause passing a real overlap. The guards are correct. They simply consume nearly all
capacity, while the thing they guard stopped growing, and no external signal existed to correct it:
public for two months with 5 stars, 0 forks and 0 issues, every quality signal was self-generated (F8).

Against the stated goal, three properties a standard requires are absent, and all three are structural
rather than incremental:

1. **The specification is not separable.** It is `skills/lean-doc-generator/references/DOCS_Guide.md`
   — 450 lines inside one skill's references folder, with no version of its own and no changelog. An
   adopter cannot take the standard without taking the plugin (F3).
2. **The rules cannot be checked by the people adopting them.** Eleven checkers and 24 eval harnesses
   encode most of the standard; ADR-008 scopes every one of them to this repo (F4).
3. **Human approval is recorded but not attested.** `gates_signed: G1,G2 @ <sha>` records which gates
   at what commit — not who, and only per sprint batch (F5).

Now is the right time because the alternative is not stable: with no feedback channel, the current
allocation has no mechanism that would ever correct it, and `CLAUDE.md` (80/80) and `CONTEXT.md`
(132/150) are both at cap, so the repo cannot absorb new rules at all without a deliberate pass.

## Decision

**The standard is extracted from the implementation, and the target is fleet-scale adoption.**

The lean-flow specification — doc standard, gate contract, task/sprint/epic schema, and HITL
attestation format — becomes a first-class artifact with its own semantic version and changelog,
versioned independently of `plugin.json`. The Claude Code / Codex / Kimi skill pack is documented as
its *first conformant implementation*, not as the standard itself. A spec-driven conformance engine,
shipped to consumers, answers whether a given repo conforms and at what level. An organisation then
pins one standard version across many repos.

**HITL attestation is git-native**: a trailer on each task's own commit (`Gate-Signed-By:` · `Gate:` ·
`Evidence:`) plus optional commit signing. This is chosen as the stronger option, not the cheaper one
— it raises granularity from sprint-batch to per-task, derives identity from the commit author and
signature, and is verifiable by anyone with a clone, with no service to run or trust.

Sequenced as four epics: **EPIC-002 Make Room → EPIC-003 The Standard → EPIC-004 Conformance →
EPIC-005 Fleet.** Subtraction runs first because the SSOT caps are a hard blocker for everything after
it (F7).

## Consequences

**Positive:** the standard becomes adoptable, citable and pinnable independently of any CLI; a
consumer can verify conformance instead of taking it on faith; human approval becomes provable from a
clone alone; and the roadmap acquires a direction that a daily-fix cadence cannot supply.

**Negative (trade-offs accepted):** this is a large, hard-to-reverse reshaping undertaken with no
external adoption pressure — 0 forks and 0 issues is the current evidence base, so the demand is
asserted from the goal rather than measured. Extraction creates a real risk of a second SSOT while
rules live in two places mid-migration (LAW 4 · the anti-SSOT rule), which EPIC-003's third open
question exists to prevent. Maintaining a versioned spec is permanent overhead on every future change:
a rule now costs a spec edit plus an implementation edit plus a conformance check. And capacity spent
here is capacity not spent on the guard machinery that has been demonstrably finding real defects.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Extend the plugin; its behaviour *is* the standard | Cheapest and preserves the current shape, but an adopter can never take the standard without taking the tool, so "standard" stays a claim the artifact cannot support. Fails the stated goal directly. |
| Defer until adoption pressure appears (a second org, a fork, an issue) | Avoids a speculative refactor, but F8 shows there is no channel through which that pressure would arrive, and the current allocation has no self-correcting mechanism. Waiting is a decision to stay where we are. |
| Portable-only: make lean-flow install cleanly in any repo, no shared governance | A materially smaller build and genuinely useful, but it answers "works in many repos" rather than "one standard governs many repos" — explicitly not the goal chosen. Retained as EPIC-003/004's practical substrate. |
| Build fleet mechanics first, extract the spec later | Inverts the dependency: a fleet needs something to pin and something to report. Both would have to be invented badly inside the harder problem. |
| Bespoke attestation (identity service, signed records outside git) | Stronger on paper, but contradicts the no-database/no-lock-in promise adoption rests on, and adds a service an adopting org must trust and run. Git trailers already provide per-task identity and clone-side verifiability. |
