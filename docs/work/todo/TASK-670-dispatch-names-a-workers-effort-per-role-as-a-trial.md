---
id: TASK-670
title: "Dispatch names a worker's model tier and effort per role, as an opt-in trial"
type: feature
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-670 — Dispatch names a worker's model tier and effort per role, as an opt-in trial

## Why

Effort is unrouted: every worker in the 2026-11-16 session ran Sonnet at default effort, including pure
mechanical jobs (baselines in TASK-671). The strongest tier is manual-only and almost never used, though a
stronger first reviewer costs little next to a missed finding. Owner ruling 2026-11-16: a measured trial of
a per-role matrix on the next real sprint, shipping only what the numbers keep.

## Done when

- [ ] dispatch.md keeps today's three class rows as the consumer default. A **trial table** (role → tier, effort) applies only where the host's CONTEXT declares a `dispatch-trial` line. This repo's CONTEXT declares it. Releases are not blocked.
- [ ] Trial cells, with their paired comparator or check that reveals a miss:
  - test runner, repo fetch → Haiku low (miss revealed by the coordinator's re-check of the verdict line or the fetched source)
  - builder-check reader → Sonnet low (miss revealed by the later review or the gate)
  - intake, promote, close workers → Sonnet medium (miss revealed by the coordinator's review of the draft, or the close gate)
  - review → strongest tier, **blind to Codex**, on the same unmodified diff; Codex does the same, each reviewer's findings logged
  - intake draft check → strongest tier, same blind pairing with Codex on the same draft
  - G2 design check → strongest tier, paired with the coordinator's own G2 check
  - diagnose escalation → strongest tier, **inside the 2026-11-13 amendment's exception**: one read-only second opinion, attended only, the coordinator checks the answer, no further rung
  - Fable effort is `high` in every cell.
- [ ] Rows outside the measured set (unchanged defaults, decision inline, and Sonnet-high build as a fallback) are marked as such.
- [ ] The table text states the **spending bound**: the trial spans one sprint, at most 6 strongest-tier dispatches across all strongest-tier cells, and past the cap the remaining strongest-tier cells use defaults and are recorded unmeasured. Cheaper cells are uncapped.
- [ ] Codex cells apply only where the host declares the cross-model channel per cross-model-route.md (off by default, attended only). When it is absent or disabled: build falls back to Sonnet high and review to the strongest tier alone. This repo's declaration does not become plugin-wide opt-in.
- [ ] The sentence "name the effort on the dispatch where the host takes one, else dispatch without it" is added. It authorises the Agent tool's `effort`.
- [ ] The strongest tier is a remappable role name, and a host without one uses the next-strongest defined tier.
- [ ] dispatch.md § Escalation agrees with the table, and the diagnose-escalation cell confines itself to that amendment.
- [ ] CONTEXT § Model tiers replaces "Fable = manual escalation, no dispatch row" with a **pointer** to dispatch.md plus the `dispatch-trial` line (not a second table, L-008).
- [ ] An ADR-010 addendum reverses **item 3 only** (the strongest tier is now trial dispatch cells). It states that item 4 stands unamended and that the escalation cell sits inside the 2026-11-13 amendment's exception.
- [ ] CHANGELOG and README are updated unconditionally (dispatch.md is user-visible).
- [ ] A **repo-local** per-dispatch record rule (this repo's CONTEXT `dispatch-trial` line and/or the trial sprint's Plan, not dispatch.md) with the fields role, cell (model + effort), reported tokens, retries, findings, and who ruled them real.
- [ ] Exercised on real input (L-007): at least one real dispatch under a trial cell, with that record.
- [ ] Codex reviews the diff (strongest tier first, at most 2 rounds). Consumer check: no lean-flow-only path in dispatch.md.
- [ ] Negative: a host with no model, effort, strongest-tier or Codex-channel parameter, and no `dispatch-trial` line, dispatches exactly as before, and no role is left without a fallback tier.
- [ ] Negative: in an unattended run no trial escalation and no Codex cell fires, and fail-twice parks as today.
- [ ] Negative: nothing in the matrix lets a dispatched worker approve G1 or G2, or escalate to another rung without the coordinator.

## Touches

dispatch.md § Route by classification and § Escalation, CONTEXT § Model tiers, ADR-010 addendum, CHANGELOG, README, the trial sprint's Plan (record rule).

## Assumes

- G2 decides: the `dispatch-trial` line format, the table's exact wording, and how the blind pairing and cap counting are checked.
- Fable effort is `high` for every cell (the owner can retune it).
- Codex's own effort setting is out of scope.
- No new guard, checker or ledger field: the record is prose in the sprint log.
- The trial is standalone, not under EPIC-026.
- Owner ruling on the Fable cap (popup, verbatim): "makesure 6 allocate is just doit simple task, not heavy, my token will burn". So the trial Plan books the 6 strongest-tier dispatches up front: review 2 · intake draft check 2 · G2 check 2; diagnose escalation only if a task fails twice, inside the 6; strongest-tier dispatches go on small, light inputs only (S-size tasks, small diffs), never heavy ones. A cell fired fewer than 2 times is inconclusive and reverts to manual-only.
- G2 note (R2 N1): Codex-paired cells (review, intake draft check) name Codex's reported token figure as the comparator unit.
- G2 note (R2 N3): the addendum states in one sentence that the 2026-11-13 failed-twice exception now also admits a same-provider strongest-tier dispatch, under the same conditions.
- G2 note (R2 N4 / Codex R2 Med): TASK-670 establishes the cheaper cells' baselines and rules before the trial sprint; strongest-tier cells register comparison rules only, no numeric baseline.
- G2 note (R2 N5): the CONTEXT `dispatch-trial` line carries the per-dispatch record rule; the trial Plan may repeat it.

## Tracker

Owner popup 2026-11-16 "Measured trial"; owner round-1 and round-2 answers; consumer opt-in and trial-budget popups; R1 Fable and Codex reviews; R2 Fable + Codex reviews CLEAR; owner approve 2026-11-16.
