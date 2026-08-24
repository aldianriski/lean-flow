---
owner: Maintainer
last_updated: 2026-07-17
update_trigger: Question revisited, or a new architecture/SDLC baseline changes the no-adoption verdict
status: current
id: architecture-baselines
tags: [process]
domain: governance
related: [loop-hygiene-prd]
---

# Research — should lean-flow adopt an architecture/SDLC baseline (SOLID, clean/hexagonal, FDD, DDD-lite, or other SDLC practice)?

> **Question.** Should lean-flow formally adopt SOLID, clean/hexagonal/onion architecture,
> feature-driven/vertical-slice development, DDD-lite, or an SDLC baseline (DoR/DoD, threat
> modeling, perf budgets, DORA, trunk-based dev, CODEOWNERS) as part of its skill library?
> **Verdict.** No baseline adoption. 2 minimal keepers (one-clause additions to existing
> references, no new vocabulary/file/skill); everything else is already covered or is an
> anti-delta for a host-agnostic plugin.

## Why this matters

lean-flow could bolt on a named architecture/SDLC methodology to sound more rigorous. Getting this
wrong either bloats the library with jargon that duplicates what `/refactor-advisor` and `/tdd`
already say better, or — worse — makes a markdown skill library **prescribe the consumer's app
architecture**, which breaks the "adaptable, host-agnostic" principle (CLAUDE.md).

## Method

Per L-017 (CLAUDE.md anti-pattern list): judge each candidate on its **delta over lean-flow's
existing surface**, never standalone merit. Existing surface read first: `refactor-advisor`
(deepening.md — module/interface/depth/seam/adapter vocab, dependency categories, design-it-twice),
`tdd` (testability.md, test-strategy.md, test-standard.md), `task-decomposer` (prd-and-slices.md —
tracer-bullet vertical slices), `orchestrator` (G1/G2, review-scoping.md — Standards-vs-Spec axes,
skip table, QA suggestion), `.claude/CONTEXT.md` (glossary, sprint/streams model, gates), and the
`ARCHITECTURE.md.template` / `STANDARD.md` §4 (ADR bar). Grep confirmed no existing mentions of
SOLID/STRIDE/DORA/hexagonal/bounded-context/CODEOWNERS/trunk-based outside this scan.

## Verdict table

| Candidate | Existing-surface mapping (evidence) | Delta | Verdict |
|---|---|---|---|
| **SOLID principles** | `deepening.md` already covers the *outcomes* SOLID names, in Ousterhout vocabulary the project deliberately prefers: SRP≈shallow/deep + deletion test, OCP≈seam ("alter behaviour without editing in place"), LSP≈"one adapter = hypothetical, two = real", ISP≈"small surface area" (testability.md §4), DIP≈dependency categories' ports-&-adapters. `deepening.md` table explicitly lists terms to **avoid** (component/service/API/boundary) | None — a SOLID vocabulary bridge would *reintroduce* the jargon the project already replaced on purpose | **REJECT** — refutes the session-model prior's "vocabulary-bridge might be a keeper"; the bridge is anti-delta, not neutral |
| **Clean/hexagonal/onion architecture** | `ARCHITECTURE.md.template` already offers this as a **host-declared option** — its `## Dependency Rule` section's own examples are "Clean Architecture + DDD" / "Hexagonal" / "Modular monolith" | None — the plugin already accommodates it without adopting it; mandating it as lean-flow's baseline would violate the host-agnostic principle | **REJECT** — confirmed anti-delta |
| **FDD / vertical-slice architecture** | `task-decomposer/references/prd-and-slices.md` — tracer-bullet vertical slices are the mandatory decomposition unit; `orchestrator` mvp Implement runs "micro-tasks in order" | Full duplicate | **REJECT** — confirmed core-already |
| **DDD-lite: ubiquitous language** | `.claude/CONTEXT.md` §Doc standard: "Domain glossary lives here (canonical term + `_Avoid_:` synonyms)"; `task-decomposer` grill explicitly "Challenge the glossary" | Full duplicate | **REJECT** |
| **DDD-lite: bounded contexts** | No mapping — this is the *host's* domain-module boundary, not lean-flow's | Anti-delta — a host-agnostic plugin doesn't model the consumer's domain | **REJECT** — out of scope |
| **Design-by-contract** | `deepening.md` Interface definition: "everything a caller must know: signature **+ invariants, ordering, error modes, config, perf**" — stronger than typical pre/post-condition DbC | Full duplicate | **REJECT** |
| **Definition-of-Ready / Definition-of-Done** | DoR ≈ task `state: ready` requires a concrete `done-when` (`CONTEXT.md` task entry shape); DoD ≈ Sprint `Plan (Tn + DoD [ ])` per task (`SPRINT.md.template`) | Full duplicate | **REJECT** |
| **Performance budgets** | `review-scoping.md` QA suggestion: "a **perf budget** (if it's a hot path)"; `tdd/references/test-strategy.md` Perf row: "needs a baseline + stated budget" | Full duplicate | **REJECT** |
| **DORA metrics / loop telemetry** | Sprint model's TD aging (`≥3 sprints → re-review`) + Retro's 4-bucket routing are lean-flow's own analog; DORA proper needs a CI/deploy pipeline lean-flow doesn't own (markdown library, no runtime) | Anti-delta — the consumer's CI surface, not lean-flow's (no-enforcement spine) | **REJECT** |
| **Trunk-based dev + WIP limits** | `release-patch` never prescribes a branch model; `sprint-bulk`'s first-blocker halt + disjoint-only parallel dispatch (`dispatch.md`) already caps concurrent in-flight work | Anti-delta — consumer's git workflow choice; WIP-limit effect already present | **REJECT** |
| **Code-ownership models (CODEOWNERS)** | G2 already requires an "overlap-ownership map (shared files → single owner + commit order)"; Streams model adds cross-stream coordination + per-hunk staging (L-042) | Full duplicate | **REJECT** |
| **Architecture-conformance check at Review** | `review-scoping.md` Standards axis: "does the code obey the repo's conventions? (naming, structure, …; **documented repo standards override the baseline**)" — read literally, a host's `ARCHITECTURE.md`/ADRs already fall under "documented repo standards" | Marginal — the word "structure" doesn't *name* `ARCHITECTURE.md`/ADR conformance explicitly, but the catch-all clause already covers it | **REJECT** — refutes the session-model prior's "genuine gap"; already covered on a literal read, not just spirit |
| **Threat modeling (STRIDE-lite) at design time**| Security is currently only checked **reactively**, at Review's skip table ("no auth/input/secret/data-exposure surface touched → skip `/security-review`") — *after* Implement. G1/G2 have no design-time security prompt despite tasks already carrying a `risk:` field | Real — shift-left value: a design flaw caught at G2 avoids implementation rework a Review-time catch can't undo | **KEEP (minimal)** |

## Recommendation

Adopt **nothing** as a named baseline — every candidate that maps to existing surface is a full or
near-full duplicate, and the architecture-layer candidates are anti-delta by the host-agnostic
principle. One genuine gap surfaced: **security consideration happens only at Review, never at
G2 design-time**, despite `risk:` already being scored per task. Proposed shape (not applied here —
file as a `TASK-NNN` for the owner to size, since `orchestrator/SKILL.md` is at its **110/110 line
cap** and any G2 addition must displace or merge an existing line, not just append):

- Extend the existing G2 bullet — *"Hard-to-reverse decision? → record it"* — to also catch a
  `risk: high` task whose blast radius touches auth/input/secrets/data-exposure: prompt a one-line
  abuse-case sketch before Implement, not a full STRIDE checklist (that would be anti-lean).
- Alternative landing spot: a new short subsection in `review-scoping.md` (uncapped `references/`)
  that G2 points to conditionally — cheaper on the cap, costs one more file hop.
- Either way: **suggestion, not a gate** — matches the no-enforcement spine already used for
  perf budgets and the test-quality standard.

No ADR — this is a scan verdict (mostly rejects), not a hard-to-reverse structural decision.

## Out of scope / open questions

- Exact landing spot for the threat-model-lite prompt (inline G2 bullet vs. `review-scoping.md`
  subsection) is a sizing call for `/task-decomposer`, not settled here.
- Not evaluated: architecture-conformance linting as an *enforced* CI check — that's the
  enforcement-vs-suggestion tension already tracked by `TASK-006` (per `structarmed-adaptation.md`),
  not a new question this scan raises.
