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
> are each derived from an event that actually happened — so the same Work Item at the same repo
> revision reconstructs the same lean-controlled dispatch, through more than one runtime.

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
`Evidence` · `Decision` · `Gate` · `Effect` · `ConformanceResult` · the reconstructible-dispatch proof ·
independent versioning with its own changelog · a compatibility rule for when the protocol moves.

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

- **D1** — **Emission first; every object is derived from a recorded event.** The guard that makes this
  checkable rather than rhetorical: an object with no observed event shape behind it in EPIC-006's
  records is **marked speculative and excluded from v1**. Without that clause the ruling is a preference
  and the eight-object list from `03` walks in unchallenged.
- **D2** — Not a workflow engine (`03 § 4`). The protocol describes runs; it does not schedule or drive
  them. Anything that would need a queue, a scheduler or a service belongs to Phase F or the Control
  Plane, where `00 § 5.4`'s graduated-infrastructure rule admits it on proven need.
- **D3** — Versioned independently, with its own changelog — ADR-023's precedent (`spec/` versioned
  separately from `plugin.json`), for the same reason: a consumer must be able to pin it.
- **D4** — Depends on EPIC-006 (event shapes), EPIC-005 (a `ConformanceResult` that has crossed more than
  one repo), and Phase C's `harness-delta.md` research, whose four candidates — reconstructible dispatch,
  independent replay, reversible effects, mechanical batching — are this epic's input, not its scope.
  Phase C is **unstarted and unblocked**, so it is the long pole nobody has started.

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

- [ ] Every shipped object traces to at least one event shape observed in EPIC-006's records; unobserved
      candidates are marked speculative and excluded from v1 — asserted per object, not in aggregate
- [ ] The reconstructible-dispatch proof runs: same Work Item + same repo revision + same workflow
      contract → the same lean-controlled dispatch
- [ ] The reproducibility claim is stated in words and explicitly disclaims model-request reproducibility
- [ ] The protocol is independently versioned with its own changelog
- [ ] ADR-013 (b) run-state resume is still out of scope — asserted at close, not assumed
- [ ] Decision-gate condition *"Core Run / Evidence / Gate vocabulary is stable"* is recorded met or not
