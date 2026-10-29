---
epic: 023
slug: specific-not-short
owner: Maintainer
last_updated: 2026-10-29
status: active
member_sprints: [SPRINT-147, SPRINT-148]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-023 — Specific, not short (lean-flow 3.0)

> **Outcome:** lean-flow 3.0.0 ships only the discovery, carry-through and expertise components whose
> staged A/B on two real repos gained ≥ +10 pp on the primary endpoint, with no symptom measure
> regressing past −5 pp and within 2× the 2.x token cost. Where a hypothesis fails, the epic records it
> and ships the measurement harness and findings instead.

## Why this, why now

The owner sees lean-flow's trimming push results toward generic output: generic docs, a misread
business, detail lost between stages. The rules against that already exist on paper (LAW 4, "never
squeeze"). What is missing is a mechanism that produces repo-specific content and carries it to the
step that needs it. Outside evidence cuts both ways. Context files on average do not raise task success
and cost over 20% more (arXiv 2602.11988), so "more detail" is not the fix and every change has to be
measured. That makes it multi-sprint: a baseline first, then three stacked mechanisms, each with its
own A/B arm, and a release last. Full analysis, evidence and A/B design →
[`docs/research/lean-flow-3-foundation.md`](../research/lean-flow-3-foundation.md).

## Scope

**In:** the maintainer-only A/B harness and baseline (S0) · repo-profile discovery in `init`/`migrate`
with hybrid framework question sets and business discovery (S1) · the section-pointer contract
carrying non-derivable facts to builder, reviewer and handoff (S2) · expertise candidates: brief fields,
fan-out budget, specialist reviewers, tier routing, expert agents (S3) · per-candidate admission, the
STANDARD MAJOR and the 3.0.0 release (S4).
**Out (explicitly not):** prescribing any consumer architecture (`architecture-baselines` verdict
stands) · a framework encyclopedia beyond the four first profiles · turning the A/B harness into a gate
or `qa-check.sh` leg · imposing R5 (measured context changes) on adopters.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-147](../sprint/archive/SPRINT-147-first-trial-first-slice.md) | First Trial, First Slice (S0: harness tracer + clinic booking slice) | closed · `751df00d` | S0's two foundations. The harness runs one pinned, isolated, graded and costed trial (TASK-533), and the second A/B repo, Vue 3 + Go chi + PostgreSQL, books end-to-end with both invariants red-before-green (TASK-534). Closed-when 1 stays open on TASK-544/545 |
| [SPRINT-148](../sprint/archive/SPRINT-148-rules-protocol-and-a-whole-gate.md) | Rules, Protocol and a Whole Gate (S0: clinic rules + spec, trial protocol) | closed · `c8ebeea1` | The clinic repo enforces five invariants test-first (cap serialised per doctor) and its spec carries the facts not in code, signed realistic (TASK-535). The D9 two-phase protocol runs on the fixture repo with G1 pre-signed, G2 by scope check + isolated judge, popup parks recorded (TASK-542). The off-host gate is whole (TASK-531, 532, outside the epic). Closed-when 1 stays open on TASK-544/545 |

## Decisions

- **D1** — The trim rule is reframed as hypotheses (H1 specificity · H2 carry-through · H3 expertise)
  tested by a staged A/B, not asserted. The STANDARD changes last, once H1/H2 hold.
- **D2** — ADR-053 admission: S2, S3 and the STANDARD change are frozen surfaces, admitted only on S0's
  *measured defect*, which each task's `## Why` names. A symptom S0 does not reproduce admits nothing.
- **D3** — A/B rulings (owner, 2026-10-29): full budget (240 + 32 runs per candidate, plus setup) ·
  +10 pp minimum gain / −5 pp regression limit · first profiles React/Vite · Vue/Vite · Go/chi ·
  Postgres · A/B repos are the workdoo snapshot plus a new Vue 3 + Vite + Go chi + PostgreSQL repo in
  `D:\Research\`.
- **D4** — G2 in A/B trials: an **eval-only exception** to night-run Part 0. G2 is signed by a written
  policy (approve as written unless the design leaves task scope) plus a mechanical check (files
  touched ⊆ task `Layers:`), recorded as a deviation. It never applies to product runs.
- **D5** — Shipped expert agents each clear ADR-001 on their own ablation delta. Expertise ships only
  if the final set beats the carry-through arm by the minimum gain.

## Open questions

- Ship S1/S2 as 2.x MINORs as each proves out, or hold everything for 3.0.0? → owner ruling at S1 promote

## Closed when

- [ ] S0: design frozen at S0 promote; pre-registration hash frozen before any trial on an A/B repo or a
  task-set task (harness smoke runs use a separate fixture repo only; owner ruling R-c, 2026-10-29); arms
  A0 (no lean-flow docs) and A1 (2.x) measured on both repos; each of the three symptoms recorded as
  *measured defect* or *not reproduced* → TASK-544, TASK-545
- [ ] S1: `init`/`migrate` produce a repo profile on both A/B repos and on an unprofiled stack through the
  installed plugin; a real 2.x `migrate` keeps every existing decision; arm A2 measured vs A1
  → next slice: S1 Discovery
- [ ] S2: a traced run shows each required fact *read* by the builder through a resolved pointer; every
  blocking lost-detail site fixed; arm A3 measured vs A2 and A1 → next slice: S2 Carry-through
- [ ] S3: every expertise candidate runnable in the harness; arm A4 measured vs A3
  → next slice: S3 Expertise candidates
- [ ] S4: shipped set = only components with a positive ablation delta, the final set re-measured vs A1
  and A3; STANDARD MAJOR only if H1/H2 held; 3.0.0 released with migration notes (or a recorded
  no-ship with numbers) → next slice: S4 Admit + STANDARD + release
