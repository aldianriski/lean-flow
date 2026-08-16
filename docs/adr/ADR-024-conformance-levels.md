---
id: ADR-024
tags: [process, docs]
domain: governance
status: accepted
related: ADR-018, ADR-023
---

# ADR-024 — Three conformance levels: Structural → Gated → Attested

- **Status:** accepted (2026-08-16)
- **Deciders:** Maintainer
- **Context driver:** EPIC-003 open question 1, which the epic routes to its first member sprint's
  G2 — the level set shapes the extracted spec's structure, so ruling it after the extraction would
  mean re-cutting the tree.

## Context

ADR-018 makes conformance the thing an adopting organisation pins: a repo either conforms to the
lean-flow standard or it does not, and a fleet needs to say *at what level*. EPIC-003 proposes the
shape "structure → gates → attested" but leaves the count open, with the explicit criterion that
**each level be independently checkable** — the count mattering less than that property.

Two constraints bound the answer. First, EPIC-004 builds the engine; this ruling must not depend on
it, so a level whose only description is "the checker says so" is not admissible. Second, a level
must be checkable from **evidence that already exists in a clone** — ADR-018 chose git-native
attestation precisely so verification needs no service to trust.

The measured position of the reference implementation is the deciding evidence. lean-flow today
records human approval as `gates_signed: G1,G2 @ <sha>` in sprint frontmatter — a real, machine-read
record of which gates were signed at which commit. What it does **not** yet have is the per-task
commit trailer ADR-018 specifies (`Gate-Signed-By:` · `Gate:` · `Evidence:`), which EPIC-003 D2
still marks "ADR pending". So the standard's own first conformant implementation sits strictly
between "has the structure" and "approval is provable from a clone" — and a level set with no rung
there would leave it unable to claim anything above the lowest.

## Decision

**Three levels, strictly increasing, each checkable from a different class of artifact:**

1. **Structural** — the core doc set exists in canonical placement, each file carrying an ownership
   header, within its stated cap. *Checkable from the file tree alone*, with no history and no
   process record.
2. **Gated** — Structural, plus human approval is recorded against the work: the promote → execute →
   close lifecycle is followed, gate sign-off is recorded where a reader can find it, and criteria
   name how they were verified. *Checkable from the repo's own planning records.*
3. **Attested** — Gated, plus that approval is provable to a third party from a clone alone: the
   approval is bound to the commit it approved, by the commit's own metadata. *Checkable from git
   history alone, by anyone, with nothing to trust but the clone.*

The rationale for three over the alternatives is that the rungs are not degrees of the same
evidence — they are **different evidence classes** (a tree · a record · a signature), each verifiable
without the one above it. That is what makes them independently checkable, which was the epic's
stated criterion, and it is why collapsing the middle rung loses a real distinction rather than
simplifying a scale.

**Deliberately not specified here:** the wire format of the attestation (EPIC-003 D2's own ADR), and
the engine that computes a level (EPIC-004). This ruling names *what is true at each level*, never
*how a tool decides it* — a level whose description required the engine would make the standard
depend on one implementation of itself.

## Consequences

**Positive:** an adopter can self-assess with `ls` and `git log` before adopting any tooling, which
is the property that makes the standard adoptable independently of the plugin. The ladder is honest
on day one — the reference implementation lands at **Gated**, not at the top, so the levels describe
a real gradient rather than a badge the author already holds. Extraction now has a shape to organise
against: three levels give the spec three natural conformance sections.

**Negative (trade-offs accepted):** three levels is a public contract that is expensive to change —
an adopter pinning "Gated" has to be re-assessed if the rungs move, so this is hard to reverse by
construction. The gradient is also coarse: two repos can both be Gated while differing widely in how
rigorously they gate, because the level checks that approval was *recorded*, not that it was
*thoughtful* — no artifact-based check can close that gap, and pretending otherwise would be the
theatre this standard exists to avoid. And Attested is currently unreachable by anyone, including
lean-flow, until the trailer format lands.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Two levels: Structural → Attested | Sharper contrast, fewer rungs to maintain. But it collapses exactly the position the reference implementation occupies: lean-flow records gate sign-off today and cannot produce commit trailers yet, so the standard's own first implementation could claim only the lowest level. A ladder whose author cannot climb it reads as aspirational, and the middle rung is a real, separately verifiable property — not a courtesy step. |
| Four levels: + Governed (§10's learning/TD loop) | The continuous-learning loop is genuinely distinctive to this standard and a defensible top rung. Rejected on evidence class: its check is "a checklist was run", which is an assertion about process conduct rather than an artifact a third party can verify — strictly weaker than a tree, a record, or a signature, and it would put the weakest evidence at the strongest level. Revisit if a durable artifact for it appears. |
| Numbered levels (L1/L2/L3) with no names | Compact and familiar from other standards. Rejected because the names carry the check — "Attested" says what is true and what would falsify it, where "L3" needs a lookup, and the whole point is self-assessment without tooling. |
