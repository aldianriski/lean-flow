---
id: TASK-327
title: "Exercise `check-handoff-state.sh` on the first real handoff"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: close-retro
state: ready
sprint: SPRINT-118
---

# TASK-327 — Exercise `check-handoff-state.sh` on the first real handoff

## Why

> **Opportunistic by ruling, not by priority.** Neither entry below can be scheduled — each is taken
> when a run or a session produces the vehicle for it. Promoting one into a sprint whose shape cannot
> generate that vehicle is what foreclosed SPRINT-060 T5 (L-111).

tier note: (ADR-029 — the guard is proven on fixtures and has never seen live input)

## Done when

- [x] a real `/handoff` is taken, its two-field record is written by `handoff/SKILL.md` to the sprint's Execution Log (or to `HANDOFF-LEDGER.md` when no sprint pointer exists), `prime` reports it on the next session, and the close-side reconciliation flips it to `spent` — each step observed on the live artifact, not a fixture. The DoD is met when `check-handoff-state.sh .` has printed a verdict about a record **it did not ship with**; today it prints `skip (no handoff records)` ✓ live, 2026-10-07→09: written (SPRINT-118 log, `live`) · `/prime` row `Handoff:  live -- …SPRINT-118-prove-the-run.md (not yet resumed)` · `consumed` → checker `PASS … consumed`, rc 0 · close `spent` → checker `PASS … spent`, rc 0

## Touches

- no code expected — this is L-007's exercise-on-real-input half, deliberately deferred because the vocabulary is new. Any fix it provokes lands in `scripts/lib/check-handoff-state.sh`

## Assumes

- it cannot be scheduled, only taken when a session genuinely ends mid-work
- the write · read · reconcile path traced end-to-end at SPRINT-094 T2 is correct. That trace was a **reading** of three skills, not an execution of them, which is exactly the gap this task closes (L-016: when the repo cannot dogfood a feature, verify on the consumer path — here the path finally becomes available)

## Tracker

- SPRINT-094 T2, 2026-09-04 review round 2 — "the first real `/handoff` after this sprint is what converts it from proven-on-fixtures to proven-in-place" · L-166 (a fixture proves a branch works; only the motivating case proves it is reachable) · TD-134 (the archive-side half of the same gap, ruled acceptable and forward-looking)
