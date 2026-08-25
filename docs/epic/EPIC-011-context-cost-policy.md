---
epic: 011
slug: context-cost-policy
owner: Maintainer
last_updated: 2026-08-25
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-011 — Context & Cost Policy

> **Outcome:** memory, context and cost are governed by a **declared policy** — what is written at
> each memory layer, what is retrieved, what a run may spend — and that policy is **enforced wherever a
> runtime exposes a seam, and stated as an adapter requirement wherever none exists**, never faked.

> **Admission — NOT met (gated register).** Admitted on **Platform Decision Gate PASSED** + **EPIC-006**
> + **EPIC-008**. None has happened. Note the register's own ruling of 2026-08-24: **policy before the
> gateway** — this epic is sequenced ahead of EPIC-012 deliberately, a judgement call closed by ruling
> as `L-094` prescribes.

## Why this, why now

`07` defines a five-layer memory architecture (**L0** Run context · **L1** Work Item · **L2**
Workspace/Project · **L3** Organisation · **L4** Worker profile) plus write policy, promotion,
retrieval, compaction, model routing, reasoning budget and cost telemetry. Today lean-flow has L0 and a
hand-maintained L2, no promotion rule, and no cost signal at all — so "the run got expensive" is a
feeling, not a number.

It spans sprints because **policy and enforcement separate**, and the separation is the whole point.
Some controls have a runtime seam today; most do not.

### The honest half — what cannot be enforced yet

`07`'s controls for **max output · model routing · reasoning level · memory retrieval · tool search ·
context compression · subagent limits** have **no seam** in current runtimes. This epic **states them as
requirements for EPIC-012's adapters** and enforces nothing it cannot actually intercept. Shipping a
knob that silently does nothing is worse than shipping no knob — it reads as governed while being
ungoverned, which is the false-assurance shape ADR-029 Tier G exists to prevent.

## Scope

**In:** the L0–L4 memory layers declared with a write policy per layer · a promotion rule between
layers · a retrieval policy · **cost telemetry** so a run's spend is a recorded number · a budget
declaration a run can be measured against · enforcement **only** at seams that exist · a named
requirements list handed to EPIC-012's adapter contract.

**Out (explicitly not):** building the adapters that would provide the missing seams (EPIC-012) ·
organisation knowledge as a hosted store (L3 stays git-resident until MVP3 demands otherwise) · the
dashboard's Memory and Context Inspectors, which are `07 § 18` surfaces and belong to EPIC-010's
workspace · re-deciding the repair budget, which EPIC-015 leaves as a measurement.

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-011-context-cost-policy.md per ADR-030, created
     lazily at the first member close. -->

_None promoted, and none promotable_ — see § Admission above.

## Decisions

- **D1** — **Policy is defined in full; enforcement ships only for real seams.** Everything else becomes
  a stated adapter requirement. This is the register's wording and it is binding, not aspirational.
- **D2** — **A control with no seam is declared unenforced, in the artifact its reader parses.** Not in
  a commit message and not only here — a ruling its consumer cannot reach governs nothing (L-151).
- **D3** — **Cost telemetry precedes any budget ceiling.** A number frozen before measurements exist is
  L-130's failure; EPIC-015's repair-budget question is parked on exactly this epic's records, so
  inventing a ceiling here would close that question with a guess.
- **D4** — **ADR-029 Tier G.** A retrieval policy that silently returns nothing, or a budget that
  silently fails open, reports success either way. Retained must-FAIL + sibling control + seeded-break
  discrimination, per task.
- **D5** — **L3 stays git-resident.** Organisation knowledge in a service is infrastructure ahead of
  demand (`00 § 5.4`); it graduates when a second workspace proves the need, not before.

## Open questions

- **Which seams actually exist today?** → a **measurement**, and the first sprint's opening task: audit
  each of `07`'s controls against the live runtime and record enforce / state-as-requirement per row.
  It accumulates, so it is correctly gated on evidence (L-094).
- **Does the memory promotion rule need an ADR?** → likely (STANDARD §4): hard-to-reverse once L1/L2
  content has been promoted under it. Ruled at the first G2.
- **Does cost telemetry belong here or in EPIC-006's run evidence?** → **EPIC-006 owns the record; this
  epic owns the policy read from it.** Recorded so the two do not mint competing schemas — the same trap
  EPIC-015 § Open questions names for `RunSummary`.

## Closed when

- [ ] **L0–L4 are declared** with a write policy, a promotion rule and a retrieval policy per layer
- [ ] Every `07` control is classified **enforced** or **stated-as-adapter-requirement**, with no third
      category and no silently-inert knob — retained must-FAIL fixture for an inert control
- [ ] A run's **cost is a recorded number**, readable without re-running it
- [ ] A **budget declaration** exists and a run can be measured against it
- [ ] The **adapter requirements list** is written where EPIC-012's contract reads it (L-151)
