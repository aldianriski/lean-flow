---
id: ADR-025
tags: [process, docs]
domain: governance
status: accepted
related: ADR-018, ADR-024
---

# ADR-025 — HITL attestation is three git trailers on the task's own commit, and unsigned it is a claim

- **Status:** accepted (2026-08-16)
- **Deciders:** Maintainer
- **Context driver:** EPIC-003's **Attested** conformance level is defined and currently unreachable
  by anyone, including this repository. Nothing can claim it, and nothing can be built to check it,
  until the format it names exists in the spec an adopter actually pins.

## Context

ADR-018 chose git-native attestation over a bespoke record or an external service, and named the
three fields (`Gate-Signed-By:` · `Gate:` · `Evidence:`) without specifying them. ADR-024 then defined
**Attested** — approval provable to a third party from a clone alone — and deliberately declined to
specify the wire format, on the reasoning that a level whose description required its engine would
make the standard depend on one implementation of itself. EPIC-003 D2 has carried "ADR pending, once
the trailer format is designed against a real sprint's commits" ever since.

Two constraints shaped the specification more than the field list did.

**The format has to live in `spec/`, not only in an ADR.** The spec is what an adopter pins; the ADR
is why we chose it. A format documented only here would oblige every implementer to read our decision
history to write a trailer — which is the coupling ADR-023 extracted the standard to remove.

**The reference implementation cannot demonstrate the strong case.** Measured at the time of writing,
not assumed: `git log --format=%G?` returns `N` for **673 of 673 commits** in this repository. Nothing
here is signed. Any worked example drawn from this history is necessarily the weak case, and the
alternative — inventing a signed example — would have the standard's own first illustration
misrepresent its author's conformance.

## Decision

**Three trailers on the task's own implementation commit, specified in `spec/STANDARD.md` §13, with
the claim-vs-proof boundary stated in the spec rather than left to an implementer's judgement.**

`Gate-Signed-By:` names the human approver, `Gate:` names the gates covered, `Evidence:` points at the
in-repo record. All three are required together; a `Gate:` without a `Gate-Signed-By:` asserts a gate
applied while declining to say who approved it, which is weaker than silence.

Two things are ruled explicitly because both are easy to overstate and costly to correct later:

1. **The trailer carries the sprint-level sign-off onto the commits it covers; it does not raise
   approval to a per-task cadence.** The gain is *verifiability* — a reader with a clone reaches the
   fact without parsing our sprint file — not approval frequency. This **corrects ADR-018**, which
   framed git-native attestation as raising granularity from sprint-batch to per-task. Per-task gate
   signing was considered and declined: batch G1/G2 is what makes `sprint-bulk` viable at all, and a
   format that implied otherwise would describe a process no conformant implementation runs.
2. **An unsigned trailer is a claim, not proof, and §13 says so in those words.** Trailers are plain
   text; anyone who can write a commit can name anyone as approver. A verifier may conclude that the
   repository *states* an approval and where it says so — never that the named person approved
   anything. Signing is what converts the claim to proof, and it binds the **signer**, so
   `Gate-Signed-By:` is proof only where signer and named approver coincide.

It follows, and is stated rather than buried, that **Attested is not reachable by trailers alone.**
An implementation emitting perfect trailers over unsigned commits has reached Gated with more legible
records. This repository is in exactly that position.

## Consequences

**Positive:** the Attested level becomes describable, and therefore buildable against — EPIC-004's
checker now has a contract to read rather than a decision to make. An adopter can write a conformant
trailer from `spec/` alone. And the honest boundary means a repo can adopt the format immediately,
at Gated, without either lying about its level or waiting for a signing rollout.

**Negative (trade-offs accepted):** the reference implementation now ships a specification for
something it does not do — §13 is spec-only until commit signing exists here, which is the shape of
debt TD-001 named. It is accepted deliberately: the format had to be designed against real commits
before signing could sensibly be adopted, and the worked example is drawn from real history rather
than invented, so the gap is documented rather than hidden. A second cost: `Evidence:` is a
repo-relative path, so a repo that relocates its planning records invalidates trailers already
written into immutable history — the pointer rots and the commit cannot be amended to fix it.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Per-task gate signing (ADR-018's original framing) | Would make each task's commit carry its own fresh approval — genuinely stronger, and incompatible with the batch G1/G2 that makes `sprint-bulk` viable. Adopting it would have changed the process to fit the format. Declined at SPRINT-070's promote (D1); the trailer carries the batch fact instead. |
| Specify the format in this ADR only, leaving `spec/` untouched | Cheaper, and wrong for the artifact: the spec is what an adopter pins. Implementers would have to read our decision history to write a trailer — exactly the standard-to-implementation coupling ADR-023 removed. |
| Soften the claim-vs-proof language ("attestation is recorded in the commit") | Reads better and would let this repository describe itself as Attested. Rejected as the precise failure ADR-024 § Consequences warns about: a conformance level that can be claimed without the property is theatre, and the first repo to exploit the ambiguity would be our own. |
| Derive the approver from the commit's `author` / `committer` | No new field needed. But author identity varies by setup — an agent may commit as itself or under a human's git config with `Co-Authored-By:` (this repository does the latter), and neither says anything about who approved a gate. A verifier deriving approval from authorship would be reading a fact that was never asserted. |
| Wait for commit signing before specifying anything | Would let the first worked example be the strong case. Rejected because it inverts the dependency: the format has to exist before there is anything for a signature to cover, and EPIC-004's checker is blocked on the format, not on our signing posture. |
