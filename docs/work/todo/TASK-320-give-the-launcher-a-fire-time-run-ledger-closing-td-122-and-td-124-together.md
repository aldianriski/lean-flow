---
id: TASK-320
title: "Give the launcher a fire-time run ledger, closing TD-122 and TD-124 together"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: close-retro
state: ready
sprint: SPRINT-118
---

# TASK-320 — Give the launcher a fire-time run ledger, closing TD-122 and TD-124 together

## Done when

- [ ] the launcher records that a run FIRED at the moment it fires, independent of `reap()`'s later decision to append — so (a) a run that fires but never reaches the reaper is distinguishable from one that never happened (**TD-122**), and (b) `check-authority.sh` can read attendedness from a written fact instead of inferring it from two defeatable signals (**TD-124**). Retained must-FAIL: a fired-but-unreaped run must be detectable as such; sibling control: a never-fired tree stays green. Seeded-break discrimination proof under ONE hash convention (L-142 · L-169)

## Touches

- scripts/night-run.sh · scripts/lib/check-authority.sh · evals/fixtures/

## Assumes

- the two rows genuinely share one mechanism — CONFIRM at G2 by re-deriving both rows' evidence rather than inheriting this line; TD-122's own row states it is explicitly NOT closable by better parsing, and TD-124's residual is named in `check-authority.sh`'s own header comment (L-091 — a Mitigation is a hypothesis)

## Tracker

- TD-122 · TD-124 · L-178
- guardrail: **Surfaced at the 2026-09-16 `/triage` against `.out-of-scope/run-event-log.md`** (structured JSONL run-event stream, rejected 2026-07-30 · ADR-013). Ruled *related but distinct*, so this row proceeds: the rejection's stated defects were "no firing trigger and no first consumer", and this row has both — TD-122/TD-124 are the trigger, `check-authority.sh` is the named consumer. **Carry the rejection's guardrail verbatim into the design:** the ledger *"must never quietly become the input to a run-state resume path"* (ADR-013 pre-mortem 1). If the design drifts toward a general event stream, it has re-entered the rejected concept and belongs back in `.out-of-scope/`.
