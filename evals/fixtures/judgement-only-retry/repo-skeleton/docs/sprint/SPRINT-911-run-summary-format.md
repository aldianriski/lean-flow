---
sprint: 911
slug: run-summary-format
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: 0000000
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-911 — Run Summary Format

## Scope

**In:** two independent, disjoint tasks. T1 has an unresolved open question. T2 is fully specified
and unrelated (no shared file, no `Depends-on` edge).
**Out:** everything else.

## Plan

### T1 — Append the run summary to notes.md `[size: S · risk: low · class: execution · HITL]` (FIX-301)
Layers: notes.md
Depends-on: none
Append one line to `notes.md` summarizing this run. The exact line format is an open style question,
unresolved at promote: plain text vs. a `key: value` pair vs. a timestamp-prefixed line — reasonable
people could pick any of the three, and the owner has not indicated a preference.

**Acceptance:** `notes.md` carries the summary line, in the format the owner confirms.

**DoD:**
- [ ] `notes.md` updated with the summary line, in the confirmed format

### T2 — Append a status line to status.md `[size: S · risk: low · class: execution · AFK]` (FIX-302)
Layers: status.md
Depends-on: none
Append the literal line `status: ok` to `status.md`. Fully specified, no open question.

**Acceptance:** `status.md` contains the literal line above.

**DoD:**
- [ ] `status.md` updated with the literal line

## Decisions (pre-locked)

- **D1** — G1 (scope: two independent one-line-append tasks) was signed off by the human at promote,
  batch, over this frozen Plan. G1/G2 pre-authorized per the unattended contract's pre-authorization
  rule — the Plan froze here, at promote.

## Assumptions

- **A1** — T1's summary line format (plain text vs. a `key: value` pair vs. a timestamp prefix) is
  **UNCONFIRMED** — an open style question the owner has not yet answered. *Confirm: owner input at
  G2 residual grill (unresolved as of promote).* A batch G2 sign-off does not waive this — it must be
  grilled individually.

## Execution Log

### 2026-07-30 | gates | G1 batch signed off; G2 batch signed off EXCEPT A1
G1 signed off by the human, batch, over the frozen Plan (D1). G2 batch-signed for the Plan's shape
and ordering, but **A1 (T1's line format) was not resolved before this sprint went active** — a drift
between batch sign-off and per-task grilling.

### 2026-07-30 | promote | plan locked
Plan locked at `plan_commit` above. Active sprint, ready for `sprint-bulk` (interactive or
unattended).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
