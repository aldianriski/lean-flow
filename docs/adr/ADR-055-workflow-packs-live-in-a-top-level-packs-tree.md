---
id: ADR-055
tags: [process, docs]
domain: governance
status: accepted
related: [ADR-010, ADR-030, ADR-031, ADR-053]
---

<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-055 — Workflow packs and their contract live in a top-level `packs/` tree, beside the Standard

- **Status:** accepted (2026-10-20, owner, at SPRINT-132 G2)
- **Deciders:** Maintainer
- **Context driver:** EPIC-007's first exit condition needs a pack contract and a first pack, and its open questions left the
  placement and the layer to this G2.

## Context

EPIC-007 expresses lean-flow's proven procedures as workflow packs: one file per procedure, with an eight-field declaration,
that any agent can follow without the plugin installed. Two questions had to be ruled before the first file could be written.
- **Where do packs live?**
- **Is the contract part of the Standard (Layer A in the ADLC architecture) or beside it (Layer E)?**

The epic named the pull between them. A clean layering puts the contract beside the Standard. The conformance engine reads only
`spec/` rules, so mechanical checkability pulls it into the Standard.

That pull was removed one day earlier. The owner ruled that "checkable" means a reader can check a declaration against the
contract's checklist, and that no mechanical checker is built (EPIC-007 D6). ADR-053 freezes new checkers in any case.

## Decision

**Packs and their contract live in a top-level `packs/` tree, at Layer E, beside the Standard and not in it.**
- `packs/CONTRACT.md` holds the contract.
- `packs/<family>.md` holds each pack.
- `packs/examples/` holds the domain-neutral skeleton.

The tree sits outside STANDARD §2, the way `skills/`, `scripts/` and `evals/` do: §2 governs the documentation tree (SPRINT-083
G2 D4), so the tree adds no §2 row. `spec/` is not changed.

## Consequences

**Positive:**
- A consumer takes a pack by copying one file, or the whole tree.
- Nothing has to be installed, and the Standard's version does not move.
- The ADLC architecture's layer split holds.

**Negative (trade-offs accepted):**
- A future mechanical pack check cannot reuse the spec-rule engine without moving the contract into `spec/` first. That would
  be a second ADR, at the point an adopter asks for the check.
- `packs/` is one more top-level tree a reader has to learn. The architecture overview's directory map names it.

## Alternatives considered

| Option | Why rejected |
|---|---|
| The contract in `spec/` as a normative Standard section (Layer A), packs in `packs/` | Its benefit, a rule the engine can read, serves a check that D6 rules out and ADR-053 freezes. It would bump the spec version for nothing a consumer can use today. |
| Each pack beside the skill it came from (`skills/<skill>/pack.md`) | It leaves the contract no home. Skills share no reference trees, and a pack that combines steps from two skills has no single owner. |
