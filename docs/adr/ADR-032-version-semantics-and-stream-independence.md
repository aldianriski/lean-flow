---
id: ADR-032
tags: [process, docs]
domain: doc-standard
status: accepted
related: [ADR-018, ADR-023, ADR-024, ADR-028]
---

# ADR-032 — A version number means a moved verdict; streams are independent and declare their range

- **Status:** accepted (2026-08-24)
- **Deciders:** Maintainer
- **Context driver:** EPIC-005 Fleet cannot define an upgrade path without a rule for what an upgrade
  is permitted to break — its first exit condition is *"pinned to one standard version and upgraded
  together."*

## Context

`spec/` has shipped nine versions in eight days — `0.1.0` → `0.9.0`, **every one MINOR**. That is not a
pattern anyone chose. `§2` said only *"bump per `spec/CHANGELOG.md`"*, `release-patch` explicitly
refuses MINOR and MAJOR as *"governance-level decisions"*, and no governance artifact defined them. An
absent rule has exactly one output, and MINOR was it.

Measured blast radius, and why it is larger than a numbering preference:

- **Four version streams now exist or are committed.** `plugin.json` + `marketplace.json` at 1.55.0
  (lockstep), `spec/` independent (ADR-023), a protocol stream committed by EPIC-008 D3, and a
  workflow-pack contract likely by EPIC-007. Nothing states how they relate.
- **EPIC-005's core mechanic is downstream of the missing rule.** Pin-and-upgrade-together is
  undefinable without knowing what an upgrade may break, so Fleet carried a prerequisite that was not
  written in its own file — the failure L-111 names, in an epic that cites L-111.
- **`03-ADLC-ROADMAP.md § 3` already lists `standard_upgrade_failure_rate`** as a metric to collect,
  which presupposes an upgrade has a defined success and failure. It did not.
- **`0.9.0` had no stated exit.** The next bump was `0.10.0` or `1.0.0` and nothing ruled which.

## Decision

**A version number of the standard reports a moved verdict, not an author's sense of significance.**
The test is mechanical and is what §15 now states: run the previous version's checks and this version's
checks over the same unchanged repository — **any verdict moving pass → fail is MAJOR.** Reading the
diff's intent is not the test. Reclassifying a rule from `judgment-only` to `mechanical` is MAJOR under
it, though no rule text changed, because a repository never evaluated on that rule can newly fail.

**`1.0.0` is earned, not scheduled: it lands when the standard governs a repository that is not the one
that wrote it** — EPIC-005's first exit condition, two or more repos pinned to one version and upgraded
together. Alternatives were a date, a feature count, and "it is already consumer-facing so go now". The
third is the tempting one and is refused for a specific reason: `conformance.sh` being a documented
contract makes 1.0 *plausible*, not *demonstrated*, and the property the number claims — that adopters
can rely on it — has never been exercised on a tree we do not own.

**The four streams are independent, and a dependent artifact declares the range it implements**
(`standard: ">=0.9 <1.0"`). Not lockstep: folding `spec/` back into the plugin's number reverses
ADR-018's extraction and makes the standard un-adoptable without the tool. Not a compatibility matrix
doc: a maintained table is a second SSOT that drifts, no tool reads it, and it is the exact shape L-151
names — a decision recorded where its reader cannot reach it. A declaration travels with the artifact it
constrains and is readable from a clone alone, which is also what fleet pinning needs, so the mechanism
is built once instead of twice.

**Where an adopting repository declares its pin is deliberately not specified.** That is a fleet
mechanism and EPIC-005's open question already routes the choice (per-repo pin file · manifest repo ·
both) to its first sprint's G2. Specifying it here would freeze a shape before anyone has built one.

## Consequences

**Positive:** EPIC-005 can define an upgrade path, because "what may an upgrade break" now has an
answer. `standard_upgrade_failure_rate` becomes computable. The `1.0.0` claim becomes checkable by an
adopter rather than announced. Nine-MINOR drift cannot recur: MINOR is now a verdict class, not a
default. The range declaration doubles as the pinning primitive Fleet needs.

**Negative (trade-offs accepted):** The verdict test **requires running two versions' checks over a
repository** — cheap here, where a conformance engine exists, and not free for an adopter implementing
the standard without one; for them §15's test degrades to a judgement, which is honest but weaker.
Tying `1.0.0` to EPIC-005 means the standard stays `0.x` while it is already being adopted, and `0.x`
signals instability the document no longer has. And §15 ships **without rule rows** — the engine's rule
source reads a fixed §1–§13 range, so publishing them is a Tier G change under ADR-029 (fixtures plus a
discrimination proof) that buys an adopter nothing today, since all four constraints are
`standard-directed`. Deferred to the sprint that specifies the pin rule, which is when §15 gains its
first adopter-evaluable rule and the engine change earns itself. **Recorded rather than left implicit:
until then §15 is a rule no tool enforces**, which is the state ADR-028 warns about — accepted here
because its subject is our release process, and the person it binds is the one reading it.

## Alternatives considered

| Option | Why rejected |
|---|---|
| MAJOR = any rule added, amended or reclassified (§2's literal update trigger) | The standard would major constantly and the number would stop carrying signal — the same failure as never majoring, from the other end |
| MAJOR = conformance-breaking only, id stability left to §14's promise | Leaves id renumbering unnumbered, so a report's ids could move under an adopter with no version signal. §14 already promises stability; this prices it |
| Lockstep plugin and spec | Reverses ADR-018 · ADR-023. A standard adoptable only at the tool's version is not separable, which is the whole extraction |
| Independent streams + a maintained compatibility matrix | A second SSOT no tool reads (L-151). The declaration replaces it and is reachable from a clone |
| `1.0.0` at the platform decision gate (all six `03 § 5` conditions) | Ties the spec's maturity to platform work that is explicitly downstream of the spec — the tail wagging the artifact it depends on |
