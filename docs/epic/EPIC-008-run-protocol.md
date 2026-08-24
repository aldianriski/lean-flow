---
epic: 008
slug: run-protocol
owner: Maintainer
last_updated: 2026-08-24
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-008 — Run Protocol

> **Outcome:** a portable contract between a work system and an execution runtime, whose object shapes
> each trace to something already observed or already authoritative — so that the same Work Item, over
> the same **authoritative input snapshot**, under the same workflow contract and the same runtime
> policy, reconstructs the same lean-controlled dispatch, through more than one runtime.

**"Authoritative input snapshot", not "repo revision".** A Git SHA is the *first reference
implementation* of the concept, not the concept. An ADLC Work Item does not necessarily have a
repository: a proposal's snapshot is its Drive document versions plus the CRM opportunity version; a
design's is a Figma version plus a requirements version; a research item's is its source set and
retrieval boundary. A protocol that says *repo revision* has decided that ADLC is software delivery,
which is the one thing the domain model explicitly denies.

## Why this, why now

This is roadmap **Phase D** (Layer C). `03` gates it explicitly: *"Begin only after Standard +
Conformance + Fleet have stable semantics."* Standard (EPIC-003) and Conformance (EPIC-004) are closed;
Fleet (EPIC-005) is open. It is opened now as a **file, not as work** — so that EPIC-006's format
decisions can be taken with their downstream consumer visible, which is the whole point of D1 below.

It spans sprints because there are eight candidate objects and each needs evidence before it ships,
because the reconstructible-dispatch proof is a build in its own right, and because the protocol must be
independently versioned before anything takes a dependency on it.

**The roadmap contradicts itself here, and the contradiction is ruled rather than inherited.**
`03 § Roadmap Adjustment` orders *Run Protocol → Plugin Event Emission*. `03`'s own Phase D, the strategy
`README.md` read order, and `EPIC-006` D2 all order it the other way. Ruled **emission first**, three
sources to one — `docs/research/adlc-epic-sequencing.md` F1, owner ruling 2026-08-24.

## Scope

**In:** the protocol objects that survive D1 — candidates are `WorkItem` · `RunEnvelope` · `RunEvent` ·
`Evidence` · `Decision` · `Gate` · `Effect` · `ConformanceResult` · **`ActorRef`** · **`ArtifactRef`**,
plus a `workflow_ref` into EPIC-007's contract · the reconstructible-dispatch proof · independent
versioning with its own changelog · a compatibility rule for when the protocol moves.

**Out (explicitly not):** **byte-identical model-request reproduction** — `03` and
`05-HARNESS-RESEARCH-BRIEF.md § Non-Goals` both refuse it, and the claim this epic *does* make is stated
in words at close · replacing host agent loops (same non-goals) · runtime adapters and the gateway
(Phase F) · a workflow engine, which is `03 § 4`'s named anti-goal (*workflow engine before stable
workflow semantics*) · **run-state resume** — ADR-013 (b) was *deferred*, not adopted, and EPIC-006
carries its guardrail; a protocol that quietly enables it would defeat that guardrail from underneath.

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-008-run-protocol.md per ADR-030. -->

→ [`logs/EPIC-008-run-protocol.md`](logs/EPIC-008-run-protocol.md) — appended at each member close.

## Decisions

- **D1** — **Every shipped object traces to an observed event *or* to an existing authoritative
  artifact/contract. No object is admitted because an architecture diagram listed it.** *(Revised
  2026-08-24. The first wording — "every object derives from a recorded event" — was too strict to be
  true: it is right about events and wrong about everything else. Not every protocol object is an
  event. `WorkItem` comes from the Standard's task model, `WorkflowContract` from EPIC-007,
  `ConformanceResult` from EPIC-004/005, `RunEnvelope` and `Effect` from dispatch plus the Phase C
  harness research. Under the old rule each would have been "speculative" for want of an event that was
  never going to exist, and the rule would have been quietly ignored — a guard nobody can satisfy is a
  guard nobody applies.)* The provenance every object must name:

  | Object | Traces to |
  |---|---|
  | `RunEvent` · `Evidence` · `Gate` | **EPIC-006** — observed events |
  | `WorkItem` | the **Standard** / task model |
  | `WorkflowContract` (`workflow_ref`) | **EPIC-007** |
  | `ConformanceResult` | **EPIC-004 / 005** |
  | `RunEnvelope` · `Dispatch` · `Effect` | dispatch + **Phase C** harness-delta research |
  | `ActorRef` · `ArtifactRef` | the domain model's existing identity and artifact distinctions |

  An object that can name none of these columns is excluded from v1 and recorded as excluded.
- **D5 — `ActorRef` and `ArtifactRef` are candidate objects, and they are not IAM.** The domain model
  already has a Worker, a gate signer, an evidence producer, an owner and an authority — but no unified
  way for an event to say **who or what produced this**. `ActorRef` is that, at the smallest useful size
  (`{type: human|worker|service|automation|external, id}`), and nothing more: a full identity model is
  EPIC-010's, where a dashboard actually needs to assign and approve. `ArtifactRef` exists because ADLC
  output is not always code — `git://` · `drive://` · `figma://` · `s3://` · `crm://` · `custom://` —
  and the domain model already distinguishes Artifact from Evidence, so the protocol needs the reference
  primitive or it will grow a software-shaped one by default.
- **D2** — Not a workflow engine (`03 § 4`). The protocol describes runs; it does not schedule or drive
  them. Anything that would need a queue, a scheduler or a service belongs to Phase F or the Control
  Plane, where `00 § 5.4`'s graduated-infrastructure rule admits it on proven need.
- **D3** — Versioned independently, with its own changelog — ADR-023's precedent (`spec/` versioned
  separately from `plugin.json`), for the same reason: a consumer must be able to pin it.
- **D4** — Depends on EPIC-006 (event shapes), **EPIC-007 (the workflow contract)**, EPIC-005 (a
  `ConformanceResult` that has crossed more than one repo), and Phase C's `harness-delta.md` research,
  whose four candidates — reconstructible dispatch, independent replay, reversible effects, mechanical
  batching — are this epic's input, not its scope. Phase C is **unstarted and unblocked**, so it is the
  long pole nobody has started. **The EPIC-007 dependency is not optional bookkeeping:** § Closed-when
  says *"same workflow contract"*, so without it this epic would mint a second representation of a
  workflow beside EPIC-007's and the two would diverge on first contact. The protocol carries a
  `workflow_ref` into EPIC-007's contract; it does not restate its schema.

## Open questions

- Where does the protocol live — inside `spec/`, or its own versioned tree? → ADR-023 is the precedent
  for a separately-versioned artifact; **ADR-grade if it adds a §2 row**. First member sprint's G2.
- Which of the eight candidate objects are actually observed? → a **measurement, so it accumulates**
  (L-094): EPIC-006's records answer it. Do not freeze the list before then — freezing it here is exactly
  the frozen-artifact query-result trap (L-130 · L-136).
- What does *"reconstruct the same dispatch"* claim — the same dispatch **plan**, or the same
  **execution**? `03` forbids claiming complete model-request reproducibility, so the claim has to be
  written before the proof is built, or the proof will be built against whichever reading is convenient.
- Does a protocol change force a Standard version bump, or are they independently versioned all the way?
  → a judgement call; rule it at the sprint that ships v0.1 of the protocol, not after.

## Closed when

- [ ] Every shipped object **names its provenance column from D1's table** — an observed EPIC-006 event,
      or a named authoritative artifact/contract. An object that can name neither is excluded from v1
      and recorded as excluded — asserted per object, not in aggregate
- [ ] The reconstructible-dispatch proof runs: same Work Item + same **authoritative input snapshot** +
      same workflow contract + same runtime policy → the same lean-controlled dispatch
- [ ] **The input-snapshot concept is not repository-shaped** — a Git SHA is the reference
      implementation, and the protocol admits at least one non-repository snapshot form (document
      versions · a design version · a retrieval boundary) without a schema change
- [ ] **`workflow_ref` resolves into EPIC-007's contract** — the protocol restates no part of that
      schema, verified by there being exactly one workflow representation across the two epics
- [ ] The reproducibility claim is stated in words and explicitly disclaims model-request reproducibility
- [ ] The protocol is independently versioned with its own changelog
- [ ] ADR-013 (b) run-state resume is still out of scope — asserted at close, not assumed
- [ ] Decision-gate condition *"Core Run / Evidence / Gate vocabulary is stable"* is recorded met or not
