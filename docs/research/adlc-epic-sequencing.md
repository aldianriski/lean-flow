---
owner: Maintainer
last_updated: 2026-10-18
update_trigger: A roadmap phase closes, an epic is opened or gated, or a measurement changes a lane assignment
status: current
id: adlc-epic-sequencing
tags: [process, docs]
domain: governance
related: [ADR-018, ADR-032, ADR-029, ADR-052, ADR-053, platform-readiness-audit]
---

# Research — How should the remaining ADLC roadmap be cut into epics, and what can run in parallel?

> **Question.** `03-ADLC-ROADMAP.md` names phases A–H and two ordering blocks, but nothing maps them onto
> epics, dependencies or lanes. Which are epics, what must be sequential, what can run at the same time?
> **Verdict.** Two lanes plus a research side-car (Option B, 2026-08-24). Phases B and M1 became EPIC-005 and
> EPIC-006, phase E was pulled forward as EPIC-007, phase D became EPIC-008; F, G, M5 and H got register rows.
> **Superseded in part 2026-10-18 (owner ruling, EPIC-022 D1):** the platform/runtime epics (006 · 008 · 009 · 011 · 012,
> with 010 · 013 merged earlier) are **closed — superseded → workdoo**. Only **EPIC-005** and **EPIC-007** remain lean-flow's open Lane 1 / Lane 2 roadmap.

## Findings (still cited by live epics)

**F1 — The roadmap contradicts itself on emission versus protocol, three sources to one.** `03 § Roadmap
Adjustment` orders *Run Protocol → Plugin Event Emission*; `03` Phase D, the strategy `README.md` and
`EPIC-006` D2 order it the other way. → **RULED: emission first, protocol derived** (owner, 2026-08-24),
guard into EPIC-008 D1 — an object with no observed event shape is excluded from v1.

**F3 — EPIC-005 and EPIC-006 are disjoint except for two files.** Fleet touches `conformance.sh`,
`scripts/lib/` and `mktemp -d` fixture repos (D3); Run Evidence touches emission call-sites in `skills/`, a
record format and a reader. Overlap is `spec/STANDARD.md` (§2 · §11) and `.claude/CONTEXT.md` → two lanes,
**`spec/` owned by Lane 1** — the cross-stream rule applied before the collision, not after.

**F4 — Phase C is unstarted, unblocked, absent from the backlog.** `docs/research/harness-delta.md` does not
exist, and a census for its four candidate names returns zero hits across `docs/`, `spec/` and `skills/`;
`harness-engineering-adaptation.md` predates the pack. Phase C feeds D, collides with nothing: the long pole.
*(As of 2026-08-24; `harness-delta.md` has since been written, and Phase D = EPIC-008 is superseded → workdoo.)*

**F5 — Phase E is mis-sequenced.** `03 § 5` requires *"at least 2 runtime **or workflow** variations prove
abstraction pressure"* — workflow packs satisfy it, depend only on the closed Standard, and Phase E says to
start from packs with real internal use, which the 14 skills are. Listing it after Phase D leaves a **gate
condition blocking that has no blocker of its own**. → EPIC-007, queued behind 006 (both edit `skills/`).

**F6 — The platform decision gate is 2 of 6.** The four open conditions were owned by EPIC-005 · 006 · 008 · 007;
since 2026-10-18 the platform gate itself is workdoo's to argue (ADR-052), so only 005 and 007 still bear on lean-flow.

| `03 § 5` condition | State | Owner |
|---|---|---|
| Standard is independently versioned | **met** | EPIC-003 · `spec/` · semantics ruled ADR-032 |
| Conformance works for external/virgin consumer | **met** | EPIC-004 · `conformance.sh` + foreign-repo harness |
| Fleet proves ≥2 repos under one standard | open | EPIC-005 |
| Repeated operation shows central visibility friction | not pursued here | EPIC-006 (superseded → workdoo) |
| Core Run / Evidence / Gate vocabulary is stable | not pursued here | EPIC-008 (superseded → workdoo) |
| ≥2 runtime/workflow variations prove abstraction pressure | open | EPIC-007 |

## Lanes

```text
Lane 1   EPIC-005 Fleet           (admitted when EPIC-015 closed — it has, 2026-10-12)
Lane 2   EPIC-007 Workflow Packs  (EPIC-006 ahead of it was superseded → workdoo; nothing now precedes it)
workdoo  EPIC-016 · 018 · 019 · 020 (+ the superseded 006 · 008 · 009 · 010 · 011 · 012 · 013 remainders)
```

`spec/STANDARD.md` and `.claude/CONTEXT.md` are **owned by Lane 1**; a Lane 2 §2/§11 row is handed over as a coordinated commit,
never written in parallel (F3). Live order and the workdoo chain are maintained in workdoo's `docs/epic/INDEX.md` (ADR-052).
The next lean-flow epic id is derived across **both** repositories, because EPIC-016 to 020 are workdoo's (ADR-052).

## Register — future rows, deliberately not epic files

Each row's admission condition is the trigger that converts it into an epic; until then it is a plan, not scope.

| Row | Status | Admitted when |
|---|---|---|
| EPIC-006 Run Evidence · 008 Run Protocol · 009 Local Shadow Observability · 011 Context & Cost Policy · 012 Runtime Adapters + Gateway | **closed — superseded → workdoo** (2026-10-18) | not admissible here; platform work executes in `workdoo` (ADR-041 · ADR-052). Files stay in `docs/epic/` closed in place, Closed-when unticked |
| EPIC-010 Connected Workspace · EPIC-013 Managed ADLC | **closed — merged into EPIC-016** (2026-10-07) | not admissible here |
| — Beyond Software (Phase H · MVP3) | demand-gated, **no id reserved** | `03` says the candidate order comes from repeated use, not product imagination |
| — Outcome Feedback | **no id reserved** | ≥2 real workflow families produce measurable post-delivery outcome data. Delivery (what was produced) is not outcome (what changed because of it) and nothing owns the second |

**Not epics, deliberately:** Phase C is a research sprint (`03`: *"No new epic until evidence identifies the real delta"*); Phase H and
Outcome Feedback reserve no id — reserving one is the imagination move `03` warns against.
**Closed prerequisite:** EPIC-005's pin-and-upgrade mechanic needed a rule for what an upgrade may break. Ruled → **ADR-032** · `spec/` §15 · EPIC-005 D4.

## The core execution architecture is FROZEN (SPRINT-082; re-armed 2026-10-12, ADR-053)

The register above gates new *scope*; this gates new *workflow*. It sits here because this is the file
read when an epic is proposed — a freeze recorded anywhere else governs nothing (L-151). The Gauntlet
loop — gates · dispatch · review routing · revise · system verify · run protocol — is **existing
architecture, not backlog**; "a better workflow idea" is not an admission condition. A change is admitted
**only** on a **measured defect** · a **measured cost** · a **repeated workflow failure** (≥2 sightings,
`L-NNN`) · a **security issue** · **consumer evidence** from an adopter who is not us. All three classes
of fact are named on purpose (L-094) — a *measurement* accumulates, a *documented behaviour* is closed by
reading, a *judgement call* by ruling. **No "workflow optimisation" epic is opened** — the loop this freeze stops.

The freeze was suspended for EPIC-015's execution-autonomy scope (V3, 2026-08-25) and **re-armed 2026-10-12** once V3 §56's two dogfoods
passed (SPRINT-121; SPRINT-122), now **widened to new governance machinery** (a guard, checker, gate leg, `qa-check.sh` leg, ledger or ledger
field) on the same five conditions. What is not frozen, how an admission is recorded and the bounded-review rule live in
[ADR-053](../adr/ADR-053-the-freeze-re-arms-widened-to-governance.md); this file keeps the pointer. The opening recorded for EPIC-020's scope stays with
that epic, now in `workdoo` (ADR-052).

## Out of scope / open questions

- Whether a workflow pack alone satisfies decision-gate condition 6 → EPIC-007 open question; rule it before claiming the condition met.
- The platform repository boundary the earlier register owed an ADR for is decided: ADR-041, amended by ADR-052. Nothing remains owed here.
