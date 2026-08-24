---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: A roadmap phase closes, an epic is opened or gated, or a measurement changes a lane assignment
status: current
id: adlc-epic-sequencing
tags: [process, docs]
domain: governance
related: [ADR-018, ADR-032, ADR-029, platform-readiness-audit]
---

# Research — How should the remaining ADLC roadmap be cut into epics, and what can run in parallel?

> **Question.** `03-ADLC-ROADMAP.md` names phases A–H and two further ordering blocks, but nothing maps
> them onto epics, dependencies or lanes. Which remaining phases are epics, which are not, what must be
> sequential, and what can run at the same time?
> **Verdict.** Two lanes plus a research side-car. Phases B and M1 are already open as EPIC-005 and
> EPIC-006 and are structurally disjoint, so they run concurrently rather than in a queue. Phase E is
> mis-sequenced late and is pulled forward as EPIC-007; Phase D becomes EPIC-008, gated on EPIC-006.
> Phases F, G, M5 and H get **register rows with named admission conditions**, not epic files — the
> roadmap's own anti-goal forbids platform abstractions before real consumers exist.

## Why this matters

`platform-readiness-audit.md` sequenced EPIC-002…005 and that held 20 sprints; it has now run out —
EPIC-004 closed 2026-08-23 and nothing past Phase B has been costed. The failure mode tested for is not
picking the wrong phase, it is running phases **serially that have no dependency on each other**.

## Options considered

- **A — Single stream, resequenced.** Zero coordination cost, matches 81 sprints of history; but 005 and 006 have no dependency either way, so serialising buys nothing and costs an era.
- **B — Two streams plus a research side-car.** Lane 1 spec/tooling · Lane 2 skills/runtime · Phase C floating. Needs one shared-file ownership ruling; pays for itself because the open epics touch disjoint trees.
- **C — Three streams.** Phase E as its own lane now. Fastest on paper, but 006 and 007 both edit `skills/`, converting a sequencing fact into a live overlap risk.

## Findings

**F1 — The roadmap contradicts itself on emission versus protocol, three sources to one.** `03 § Roadmap
Adjustment` orders *Run Protocol → Plugin Event Emission*; `03` Phase D (objects *"must be designed from
event shapes that occur"*), the strategy `README.md` read order and `EPIC-006` D2 all order it the other
way. → **RULED: emission first, protocol derived** (owner, 2026-08-24), with the guard carried into
EPIC-008 D1 — an object with no observed event shape behind it is speculative and excluded from v1.

**F2 — A second contradiction is *not* ruled here, and is named rather than parked.** `03 § Roadmap
Adjustment` places Memory/Context/Cost Controls **after** the gateway; the strategy `README § Updated
Platform Sequence` places it **before** dashboard observability. A **judgement call**, so it closes by
ruling, never by waiting for a measurement (L-094) — but it gates nothing before the decision gate, so
it routes to the EPIC-011 register row with its options stated.

**F3 — EPIC-005 and EPIC-006 are disjoint except for two files.** Fleet touches `conformance.sh`,
`scripts/lib/` and synthesised fixture repos under `mktemp -d` (its D3); Run Evidence touches emission
call-sites in `skills/` (`orchestrator` · `tdd` · `diagnose` · `lean-doc-generator` · `flow`), a record
format and a reader. Overlap is `spec/STANDARD.md` (§2 row · §11 row) and `.claude/CONTEXT.md`. → two
lanes, **`spec/` owned by Lane 1** — the cross-stream rule applied before the collision, not after.

**F4 — Phase C is unstarted, unblocked, and absent from the backlog.** Its deliverable
`docs/research/harness-delta.md` does not exist, and a census for its four candidate names
(`reconstructible` · `dispatch replay` · `reversible effect` · `mechanical batching`) returns zero hits
across `docs/`, `spec/` and `skills/`. `harness-engineering-adaptation.md` is not it — it predates the
pack and answers another question. Phase C collides with nothing and feeds Phase D.

**F5 — Phase E is mis-sequenced.** The decision gate (`03 § 5`) requires *"at least 2 runtime **or
workflow** variations prove abstraction pressure"* — workflow packs satisfy that clause, depend only on
the closed Standard, and `03` Phase E says to start from packs with real internal use, which the 14
skills are. Listing it after Phase D leaves a **gate condition blocking that has no blocker of its own**.
→ pulled forward as EPIC-007, queued behind EPIC-006 in Lane 2 because both edit `skills/` (F3).

**F6 — The platform decision gate is 2 of 6, and every open condition now has a named owner.**

| `03 § 5` condition | State | Owner |
|---|---|---|
| Standard is independently versioned | **met** | EPIC-003 · `spec/` v0.10.0 · semantics ruled ADR-032 |
| Conformance works for external/virgin consumer | **met** | EPIC-004 · `conformance.sh` + foreign-repo harness |
| Fleet proves ≥2 repos under one standard | open | EPIC-005 |
| Repeated operation shows central visibility friction | open | EPIC-006 |
| Core Run / Evidence / Gate vocabulary is stable | open | EPIC-008 |
| ≥2 runtime/workflow variations prove abstraction pressure | open | EPIC-007 |

The register below is therefore not speculative — its gated rows are `03`'s own open conditions, owned.

**F7 — Intake is the bottleneck.** One `ready` task (TASK-259), one deliberately `blocked` (TASK-188)
— both lanes starve without a decompose pass, whatever the plan says.

## Recommendation

**Option B — two lanes plus the research side-car**, with the register gating everything past the
decision gate.

```text
Lane 1  spec / tooling     EPIC-005 Fleet ───────────────────────┐
                                                                 ├─▶ gate ─▶ EPIC-009 · EPIC-010
Lane 2  skills / runtime   EPIC-006 Evidence ─▶ EPIC-007 Packs ─▶ EPIC-008 Protocol
side-car (research)        Phase C harness-delta ───────────────▶ feeds EPIC-008
```

`spec/STANDARD.md` and `.claude/CONTEXT.md` are **owned by Lane 1**; a Lane 2 §2 or §11 row is handed to
Lane 1 as a coordinated commit, never written in parallel (F3).

**Opened now — full epic files.** [EPIC-007](../epic/EPIC-007-workflow-packs.md) Workflow Packs ·
[EPIC-008](../epic/EPIC-008-run-protocol.md) Run Protocol.

**Register — named, dependency-mapped, deliberately not written as epic files.** Each row's admission
condition is the trigger that converts it into one; until then it is a plan, not scope.

| Future epic | Phase / stage | Admitted when | Blocked by |
|---|---|---|---|
| EPIC-009 — Shadow Observability | G · M1 · dashboard **MVP0** | EPIC-006 produces records a reader consumes, and two real sprints of them exist | EPIC-006 |
| EPIC-010 — Connected Workspace | M2 · dashboard **MVP1** | MVP0 is read-only and in real use, and `06 § 9`'s first three exit criteria hold | EPIC-009 · EPIC-008 |
| EPIC-011 — Context & Cost Controls | `07` | EPIC-006 shows which of `03 § 3`'s ~25 metrics are reachable at all — F2's ordering is ruled at this row | EPIC-006 |
| EPIC-012 — Runtime Adapters + Gateway | F · M4 | EPIC-008 ships a protocol a second runtime can consume | EPIC-008 |
| EPIC-013 — Managed ADLC | M5 · dashboard **MVP2** | all nine of `06 § 9`'s exit criteria are `[x]` | 010 · 011 · 012 |
| — Beyond Software | H · dashboard **MVP3** | *demand-gated by design* — `03` says the candidate order comes from repeated use, not product imagination. **No id reserved** | real demand |

**The dashboard is five rows, not one.** `08 § 16`'s four MVPs are different outcomes: MVP0 is read-only emission (M1); MVP1 is bidirectional — dashboard creates and assigns Work Items, plugin syncs back, a Human Inbox exists (M2). An earlier draft folded M1 and M2 together, which is what `06 § 3` warns against in as many words: *"do not jump directly to Managed Mode."*

**Not epics, deliberately.** Phase C is a research sprint (`03`: *"No new epic until evidence identifies
the real delta"*). Phase H reserves no id — reserving one is the imagination move it warns against.

**One prerequisite was found missing while costing this and is now closed.** EPIC-005's pin-and-upgrade
mechanic had no rule for what an upgrade may break, while `spec/` shipped nine MINOR bumps in eight
days. Ruled at this pass → **ADR-032** · `spec/` §15 · spec 0.10.0 · EPIC-005 D4.

## Out of scope / open questions

- Memory/Context/Cost ordering (F2) → ruled at the EPIC-011 register row; options already stated.
- Whether the emission-first ruling (F1) is ADR-grade → likely (§4). **Offered, not written:** EPIC-006's
  first sprint already opens with a superseding ADR for ADR-013 (c), which may carry both rulings.
- Whether a workflow pack alone satisfies decision-gate condition 6 → EPIC-007 open question; rule it
  before claiming the condition met.
- Phase C's task is not filed — the cheapest unblocked work on the board; next decompose pass.
