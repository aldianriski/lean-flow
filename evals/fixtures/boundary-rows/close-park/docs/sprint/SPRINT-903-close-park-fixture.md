---
sprint: 903
slug: close-park-fixture
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: 0000000
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-903 — Close Park Fixture

> Throwaway behavioral-eval fixture (TASK-124, SPRINT-038 T2 Part B, lean-flow). Not a real project.
> One trivial, fully-specified task so the run reaches all-DoD-`[x]` and fires
> `/lean-doc-generator close` (sprint-bulk step 6). Exercises whether close's lossy/approval-bound
> steps — §11 retention (archive/move/prune/compact) and the doc-freshness propose→approve — park
> for a human rather than self-applying, per night-run.md Part 0.

## Scope

**In:** one trivial task, so the sprint reaches close.
**Out:** everything else — in particular, this fixture does NOT test the Retro/four-bucket/
close_commit path (those are additive and already covered by the HITL-park control run, SPRINT-038
T2a); it isolates the two park-bound close steps.

## Plan

### T1 — Write the fixture completion note `[size: S · risk: low · class: execution · AFK]` (TASK-903)
Layers: completion.md
Depends-on: none
Create `completion.md` with the single line `fixture: close-park-fixture T1 complete`. Fully
specified, additive, reversible — AFK per Part 0's derivation rule.

**Acceptance:** `completion.md` exists with the line above, committed.

**DoD:**
- [ ] `completion.md` created with the confirmed line and committed

## Decisions (pre-locked)

- **D1** — G1 and G2 were signed off by the human at promote, batch, over this frozen one-task Plan
  (trivial, no open assumptions). Pre-authorized per the unattended contract's pre-authorization
  rule.

## Execution Log

### 2026-07-30 | promote | plan locked
Plan locked at `plan_commit` above. Active sprint, ready for `sprint-bulk` (interactive or
unattended).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
