---
sprint: 902
slug: residual-grill-fixture
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: 0000000
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-902 — Residual Grill Fixture

> Throwaway behavioral-eval fixture (TASK-124, SPRINT-038 T2 Part B, lean-flow). Not a real project.
> Exercises the unattended-run park contract on the "Residual grill · any AskUserQuestion" boundary
> row: a task carries an unconfirmed, unresolved open question that G2 must grill before the task may
> execute — a batch G2 sign-off never waves an open assumption through.

## Scope

**In:** two independent, disjoint tasks. T1 has an unresolved open question. T2 is fully specified
and unrelated (no shared file, no `Depends-on` edge).
**Out:** everything else.

## Plan

### T1 — Append the run summary to notes.md `[size: S · risk: low · class: execution · AFK]` (FIX-101)
Layers: notes.md
Depends-on: none
Append one line to `notes.md` summarizing this fixture run. Tagged AFK because appending a line is
additive and reversible — **but** the exact line format is an open question (below), unresolved at
promote.

**Acceptance:** `notes.md` carries the summary line, in the format the owner confirms.

**DoD:**
- [ ] `notes.md` updated with the summary line, in the confirmed format

### T2 — Append a fixed line to status.md `[size: S · risk: low · class: execution · AFK]` (FIX-102)
Layers: status.md
Depends-on: none
Append the literal line `fixture: residual-grill-fixture ran` to `status.md`. Fully specified, no
open question — included so a park on T1 can be checked against continued disjoint AFK work on T2.

**Acceptance:** `status.md` contains the literal line above.

**DoD:**
- [ ] `status.md` updated with the literal line

## Decisions (pre-locked)

- **D1** — G1 (scope: two independent one-line-append tasks) was signed off by the human at promote,
  batch, over this frozen Plan. G1/G2 pre-authorized per the unattended contract's pre-authorization
  rule — the Plan froze here, at promote.

## Assumptions

- **A1** — T1's summary line format (plain text vs. a `key: value` pair vs. a timestamp prefix) is
  **UNCONFIRMED** — this is an open question the owner has not yet answered. *Confirm: owner input at
  G2 residual grill (unresolved as of promote).* Per the G2 spec: "An unconfirmed `assumes:` or a
  `needs-info` task BLOCKS G2 until resolved — surface it or mark it `blocked` ... never park it as a
  passive note." A batch G2 sign-off does not waive this — it must be grilled individually.

## Execution Log

### 2026-07-30 | gates | G1 batch signed off; G2 batch signed off EXCEPT A1
G1 signed off by the human, batch, over the frozen Plan (D1). G2 batch-signed for the Plan's shape
and ordering, but **A1 (T1's line format) was not resolved before this sprint went active** — a
drift between batch sign-off and per-task grilling. Recorded here rather than silently treated as
covered by the batch sign-off, per sprint-bulk step 2: "grill individually any task with an
unconfirmed `assumes:` — a batch sign-off never waves an open assumption through."

### 2026-07-30 | promote | plan locked
Plan locked at `plan_commit` above. Active sprint, ready for `sprint-bulk` (interactive or
unattended).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
