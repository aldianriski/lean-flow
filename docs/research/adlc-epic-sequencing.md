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

**F2 — A second contradiction, now RULED by the owner.** `03 § Roadmap Adjustment` placed
Memory/Context/Cost **after** the gateway; the strategy `README` placed it **before** dashboard
observability. Neither: **after Connected Workspace, before the Gateway** — EPIC-011 (owner alignment
pass, 2026-08-24). A judgement call closed by ruling, as L-094 requires, rather than parked for a
measurement that was never coming.

**F3 — EPIC-005 and EPIC-006 are disjoint except for two files.** Fleet touches `conformance.sh`,
`scripts/lib/` and fixture repos under `mktemp -d` (its D3); Run Evidence touches emission call-sites in
`skills/` (`orchestrator` · `tdd` · `diagnose` · `lean-doc-generator` · `flow`), a record format and a
reader. Overlap is `spec/STANDARD.md` (§2 · §11 rows) and `.claude/CONTEXT.md` → two lanes, **`spec/`
owned by Lane 1** — the cross-stream rule applied before the collision, not after.

**F4 — Phase C is unstarted, unblocked, and absent from the backlog.** `docs/research/harness-delta.md`
does not exist, and a census for its four candidate names (`reconstructible` · `dispatch replay` ·
`reversible effect` · `mechanical batching`) returns zero hits across `docs/`, `spec/` and `skills/`.
`harness-engineering-adaptation.md` is not it — it predates the pack. Phase C feeds Phase D and collides
with nothing, which makes it the long pole nobody has started.

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

**F7 — Intake is the bottleneck.** One `ready` task (TASK-259), one `blocked` (TASK-188) — both lanes starve without a decompose pass.

## Recommendation

**Option B — two lanes plus the research side-car**, register gating everything past the decision gate.

```text
Lane 1   EPIC-005 Fleet ──────────────────────────────────────────┐
Lane 2   EPIC-006 Evidence ─▶ EPIC-007 Packs ─▶ EPIC-008 Protocol ┤
side-car Phase C harness-delta ─────────────────▶ feeds 008       │
            └─▶ EPIC-009 Local Shadow Observability (pre-gate,    │
                read-only, no control authority) ◀── 006          │
                                        PLATFORM DECISION GATE ◀──┘
                                          └─▶ 010 ─▶ 011 ─▶ 012 ─▶ 013
```

`spec/STANDARD.md` and `.claude/CONTEXT.md` are **owned by Lane 1**; a Lane 2 §2/§11 row is handed over as a coordinated commit, never written in parallel (F3).

**Opened now — full epic files.** [EPIC-007](../epic/EPIC-007-workflow-packs.md) Workflow Packs · [EPIC-008](../epic/EPIC-008-run-protocol.md) Run Protocol.

**Register — named, dependency-mapped, deliberately not written as epic files.** Each row's admission
condition is the trigger that converts it into one; until then it is a plan, not scope.

| Future epic | Phase / stage | Admitted when | Blocked by |
|---|---|---|---|
| EPIC-009 — **Local** Shadow Observability | M1 · **MVP0** · **pre-gate** | EPIC-006 produces records a reader consumes, and two real sprints of them exist. **Read-only local projection: no central DB, no sync, no assignment, no control authority.** Its first G2 owes an ADR on the **platform repository boundary** (§ below) | EPIC-006 |
| EPIC-010 — Connected Workspace | M2 · **MVP1** | **Platform Decision Gate PASSED** + EPIC-008 stable + EPIC-009 shadow proof + a **minimal identity/authority contract** (first-sprint ADR, not its own epic — a dashboard cannot *assign to Aldi* or *approve G2* without knowing actor and authority) | gate · 008 · 009 |
| EPIC-011 — Context & Cost **Policy** | `07` | **Policy is defined; enforcement ships only for what current runtimes expose.** Controls with no runtime seam (max output · model routing · reasoning level · memory retrieval · tool search · context compression · subagent limits) become **stated requirements for EPIC-012's adapters**, never faked here | gate · 006 · 008 |
| EPIC-012 — Runtime Adapters + Gateway | F · M4 | **Platform Decision Gate PASSED** + EPIC-008 stable + **one concrete second-runtime use case exists** (a named workflow a second worker must execute). *A protocol existing is not a gateway being needed* — graduated infrastructure, `00 § 5.4` | gate · 008 · a real need |
| EPIC-013 — Managed ADLC | M5 · **MVP2** | all nine of `06 § 9`'s exit criteria are `[x]` | 010 · 011 · 012 |
| — Beyond Software | H · **MVP3** | *demand-gated by design* — `03` says the candidate order comes from repeated use, not product imagination. **No id reserved** | real demand |
| — Outcome Feedback | — | **≥2 real workflow families produce measurable post-delivery outcome data.** The domain model separates *delivery* (what was produced) from *outcome* (what changed because of it) and nothing owns the second: a proposal delivered is not a proposal approved, an automation deployed is not manual hours reduced. Registered now so ADLC does not quietly become an activity-management system. **No id reserved** | real outcome data |

**The dashboard is five rows, not one.** `08 § 16`'s four MVPs are different outcomes: MVP0 is read-only emission (M1); MVP1 is bidirectional — dashboard creates and assigns Work Items, plugin syncs back, a Human Inbox exists (M2). An earlier draft folded M1 and M2 together, which is what `06 § 3` warns against in as many words: *"do not jump directly to Managed Mode."*

**Not epics, deliberately.** Phase C is a research sprint (`03`: *"No new epic until evidence identifies the real delta"*). Phase H and Outcome Feedback reserve no id — reserving one is the imagination move `03` warns against.

**One prerequisite was found missing while costing this and is now closed.** EPIC-005's pin-and-upgrade mechanic had no rule for what an upgrade may break, while `spec/` shipped nine MINOR bumps in eight days. Ruled → **ADR-032** · `spec/` §15 · spec 0.10.0 · EPIC-005 D4.

## Out of scope / open questions

- **Platform repository boundary** — where dashboard/gateway/adapters live *as source* is undecided and
  must be settled before EPIC-009/010. One `lean-flow/` growing `dashboard/ gateway/ database/
  frontend/ worker-runtime/` is the fastest route to dev-flow 2.0; the boundary matching the layer split
  is **lean-flow** (Standard · plugin · conformance · protocol/workflow definitions) vs **lean-platform**
  (gateway · control plane · dashboard · adapters · persistence). → ADR at EPIC-009's first G2.
- Whether the emission-first ruling (F1) is ADR-grade → likely (§4). **Offered, not written:** EPIC-006's
  first sprint already opens with a superseding ADR for ADR-013 (c), which may carry both rulings.
- Whether a workflow pack alone satisfies decision-gate condition 6 → EPIC-007 open question; rule it
  before claiming the condition met.
- Phase C's task is not filed — the cheapest unblocked work on the board; next decompose pass.
