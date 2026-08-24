---
epic: 005
slug: fleet
owner: Maintainer
last_updated: 2026-08-24
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-005 — Fleet

> **Outcome:** one standard version governs many repos — an org pins it, upgrades them together, and
> reads delivery and conformance across the whole fleet from one report.

## Why this, why now

This is the stated north star: lean-flow as a delivery standard adopted at organisation scale, with
agentic delegation under provable HITL quality. Everything in the repo today assumes one checkout and
one human — there are zero occurrences of multi-repo, monorepo, org-level or cross-repo across
`skills/`, `.claude/` and `README.md`, and the standard's own team≥2 gate has never fired
(`docs/research/platform-readiness-audit.md` F6).

It runs **last and depends on EPIC-003 + EPIC-004**, and that ordering is the point. A fleet needs
something to pin (a versioned spec) and something to report (a conformance answer). Building fleet
mechanics before either exists would mean inventing both badly, inside the harder problem.

## Scope

**In:** standard-version pinning per repo · a rollout/upgrade path when the standard moves ·
cross-repo conformance and delivery reporting · delegation policy across repos (budget and capability
per agent) · fleet state that stays git-native.

**Out (explicitly not):** a hosted service, dashboard or control plane · a database (the README
promises plain markdown, no database, no lock-in — and that promise is load-bearing for adoption) ·
telemetry of any kind · running an org's CI for them.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| _(appended at promote)_ | | | |

## Decisions

- **D1** — Fleet state is git-native. Anything else contradicts the no-database/no-lock-in promise the
  README makes and that "adopt a standard" depends on — an org will not centralise delivery governance
  on a single maintainer's service.
- **D2** — Delegation policy is declared per repo and read by the run, not held by a coordinator
  process. A coordinator is a service by another name, and L-099 already showed what happens when a
  rule lives where its reader does not read it.
- **D3** — The second and further repositories that prove § Closed-when 1 and 2 are **synthesised
  fixture repos**, built the way EPIC-004's foreign-repo harness builds `acme-widget`: created under
  `mktemp -d` with **no lean-flow file copied in**, asserted mechanically so a later edit that copies
  a template in fails loudly rather than quietly measuring our own shape. **Ruled 2026-08-23, at the
  pre-epic audit rather than at a member G2**, because two of the four exit conditions name a second
  repository and were unreachable until one was identified — a criterion resting on a decision nobody
  has taken yet is L-111's trap, and this one had no vehicle at all. **What it buys and what it does
  not:** fixtures are reproducible, gate-runnable and free of external dependency, so pinning ·
  upgrade · cross-repo reporting can each be exercised end to end. They cannot prove **adoption
  friction**, which only a real repository supplies. That limit is named here rather than discovered
  at close: a member sprint that needs friction evidence pins a real repo *in addition*, never as a
  substitute for the reproducible case.

- **D4** — **Version semantics are a prerequisite of this epic, and were missing from it.**
  § Closed-when 1 requires two or more repos *"pinned to one standard version and **upgraded
  together**"* — an upgrade path is undefinable without a rule for what an upgrade may break, and no
  such rule existed while `spec/` shipped nine consecutive MINOR bumps in eight days. **Ruled 2026-08-24
  at the roadmap-sequencing pass** (the same pre-epic position as D3, and for the same reason: a
  criterion resting on an undecided rule is L-111's trap): a bump reports a **moved verdict**, `1.0.0`
  is earned by governing a repository that is not ours — which is *this epic's own first exit
  condition* — and dependent artifacts declare a compatibility range rather than share a number.
  → **[ADR-032](../adr/ADR-032-version-semantics-and-stream-independence.md)** · `spec/` §15 · spec
  0.10.0. **What it deliberately leaves to this epic:** *where an adopting repository declares its pin*
  is unspecified in §15, because that is the mechanism the first open question below chooses. §15's
  rule rows land with it, in one engine change rather than two.

## Open questions
<!-- Ruled 2026-08-23. Two closed by reading (L-094: a documented behaviour is closed by reading, not
     by waiting for a signal), one closed by ruling, one routed to a named gate with its options
     stated — never left as a bare TBD. -->

- ~~How does fleet state stay git-native without a database — a manifest repo, per-repo pins, or
  something else?~~ **Still open, but no longer blocking: routed to the first member sprint's G2 with
  an ADR, and the options are named rather than deferred.** This is a judgement call, so it closes by
  ruling; it is ADR-grade (hard-to-reverse, surprising, a real trade-off) so it does not get ruled
  here in passing. The candidates: **(a) per-repo pin file** — each repo declares its own standard
  version, so it answers *"which version am I on"* from a clone alone, with no network and no second
  checkout; **(b) manifest repo** holding the roll-up as authority; **(c) both, with the manifest as a
  derived cache and the pin as authority.** The leading candidate is (c) on EPIC-004's own precedent —
  its decisive ruling was that a report is derived from the repo under test, never from our roadmap,
  and a manifest-as-authority repeats the mistake one level up. `/prototype` if it cannot be settled
  on paper; `/council` if the G2 finds the trade-off genuinely balanced.
- ~~What does "delivery across the fleet" report — DoD completion, conformance level, or both?~~
  **CLOSED by reading — EPIC-004 has now shown what a single-repo report is.** It is a **conformance
  level + the named findings preventing the next level + the judgment-required items**, with
  explicitly no percentage, no score and no grade (EPIC-004's own open-question ruling, and §14 now
  carries the no-percentage rule normatively). The fleet report is those same three elements per repo
  and introduces no fourth. The reason the prohibition matters more here, not less: a percentage
  averages a deliberate judgment-only boundary together with a real gap, so across N repos it would
  rank them by how much of the standard declines to automate — exactly backwards, and far more
  tempting to build on a fleet view than on one repo.
- ~~Does a fleet imply multiple *humans* signing gates, and does the attestation format from EPIC-003
  already carry that?~~ **CLOSED by reading §13 — it carries it for free, as this row suspected.**
  `Gate-Signed-By:` is specified as *"One line per approver; repeat the trailer for more than one"*,
  so multi-approver sign-off needs no new format. Two further §13 properties do fleet work unasked:
  the contract is stated for *"someone with your repository and nothing else"*, which is exactly a
  fleet auditor's position; and §13c's claim-vs-proof boundary means an unsigned trailer is an
  assertion by whoever wrote the commit — so a fleet that wants **proof** rather than a claim needs
  commit signing, which is a repo policy this epic can require but must not reinvent. **No new
  attestation work is admitted to this epic.**
- ~~Is monorepo (many teams, one checkout) served by this epic or by scaling `stream:`?~~ **RULED:
  `stream:`, not Fleet.** The admission test turns on what Fleet's mechanics actually operate on —
  *separate git histories*. Pinning, rollout and cross-repo reporting each degenerate to a no-op in one
  checkout with one history and one pin, while `stream:` already runs one active sprint per stream in a
  single tree with a cross-stream overlap rule. Admitting monorepo would mean building fleet mechanics
  for a case that has a working mechanism, which is the "forcing the abstraction" failure
  `03-ADLC-ROADMAP.md § H` warns about. **Consequence recorded:** if a monorepo need arises that
  `stream:` genuinely cannot serve, that is evidence the `stream:` model is wrong — it reopens
  `stream:`, not this epic.
## Closed when

- [ ] Two or more repos are pinned to one standard version and upgraded together
- [ ] One report covers conformance across those repos, generated without a service
- [ ] Delegation policy is declared per repo and observed by an actual run
- [ ] No fleet state lives outside git
