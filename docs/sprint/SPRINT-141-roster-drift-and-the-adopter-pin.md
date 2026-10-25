---
sprint: 141
slug: roster-drift-and-the-adopter-pin
owner: Maintainer
last_updated: 2026-10-25
status: active
plan_commit: 9e693f41
update_trigger: sprint execute/close events
---

# SPRINT-141 — Roster Drift and the Adopter Pin

> **Theme:** SPRINT-140 left three loose ends. SECURITY.md still says "Of the 14" when the roster has been 15 since
> SPRINT-139, and no check reads that file. A prose-density baseline row is spent and still there. And workdoo, the only
> adopter, still runs lean-flow 2.0.0, so nothing shipped since then reaches the one repo that could show it helps. This
> sprint fixes the drift where it happened, deletes the spent row, and gets the owner's ruling on the pin.

## Scope

**In:** delete the spent CLAUDE.md prose-density row (T1) · SECURITY.md's count and grant table made current, plus a route
that stops the count drifting again (T2) · the owner's bump-or-decline ruling on workdoo's pin (T3).
**Out (deferred):** TASK-507 (cross-OS CI, `needs-info`) · TASK-367 and TASK-402 (blocked) · TASK-498 (blocked on
upstream) · any count-claims surface other than SECURITY.md · writing anything in `D:\Project\workdoo` (the pin is the
owner's act in that repo).

## Members

- docs/work/todo/TASK-510-delete-spent-claude-md-prose-density-row.md
- docs/work/todo/TASK-509-fix-security-md-roster-drift.md
- docs/work/todo/TASK-489-decide-workdoo-s-lean-flow-pin.md

## Plan

### T1 — Delete the spent CLAUDE.md prose-density row `[size: S · risk: low · class: mechanical-ingest · HITL · J1]`
Layers: `scripts/lib/prose-density-baseline.txt`
  · `docs/work/todo/TASK-510-delete-spent-claude-md-prose-density-row.md`
  · `docs/work/in_progress/TASK-510-delete-spent-claude-md-prose-density-row.md`
  · `docs/work/done/TASK-510-delete-spent-claude-md-prose-density-row.md`
Depends-on: none
Cites: `TASK-510` · `check-prose-density.ts` · SPRINT-140 T9

SPRINT-140 T9 took CLAUDE.md from 4 dense lines to 0, so the row is spent. A ratchet baseline exists to reach empty.

**Acceptance:** the row is gone and `check-prose-density.ts` passes with no "spent" note for CLAUDE.md.

### T2 — Make SECURITY.md's roster current and stop the count drifting `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `SECURITY.md` · `scripts/lib/check-count-claims.sh` · `evals/run-count-claims-fixtures.sh`
  · `evals/fixtures/count-claims/` · `CHANGELOG.md`
  · `docs/work/todo/TASK-509-fix-security-md-roster-drift.md`
  · `docs/work/in_progress/TASK-509-fix-security-md-roster-drift.md`
  · `docs/work/done/TASK-509-fix-security-md-roster-drift.md`
Depends-on: none
Cites: `TASK-509` · L-210 · ADR-053 · ADR-029

The count drifted because nothing re-derives it. Both candidate routes are declared: extend the checker (with a must-FAIL
fixture), or replace the count with a pointer to the roster. G2 rules between them and prunes the losing route's `Layers:`
tokens by a `scope-change` in the same G2 entry (L-240). Tier G (maintainer-only check) is declared by default-up; if G2
rules the pointer route, re-tier to P on the record.

**Acceptance:** SECURITY.md names the current count (or points to the roster) and lists every skill's grant, `humanizer`
included, and the chosen route fails on a seeded wrong count and passes on the real file.

### T3 — Rule on workdoo's lean-flow pin `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/research/learning-loop-architecture.md`
  · `docs/work/todo/TASK-489-decide-workdoo-s-lean-flow-pin.md`
  · `docs/work/in_progress/TASK-489-decide-workdoo-s-lean-flow-pin.md`
  · `docs/work/done/TASK-489-decide-workdoo-s-lean-flow-pin.md`
Depends-on: none
Cites: `TASK-489` · research candidate C5 · L-247

The owner action was listed in the SPRINT-127 and SPRINT-128 Retros and then dropped. The research doc is touched only on
a decline; on a bump, G2 drops it by `scope-change` (L-240). The bump itself is the owner's act in workdoo.

**Acceptance:** the owner's ruling is recorded on the task, with the bump in effect in workdoo's own record, or a reason and
a revisit-if condition.

## Owner-action checklist

- [ ] T3: rule bump or decline. On a bump, change the pin in workdoo and note it in workdoo's own log.
- [ ] Close: push, if close cuts a release.

## Decisions (pre-locked)

- **D1** — No file is shared between tasks, so the order is free; it runs T1 → T2 → T3, sequentially in the main tree.
  Status moves, log and sprint-file edits commit as bare `sprint(141):` (L-238).
- **D2** — One `consequence · Tn ·` line per task in this sprint's log (SPRINT-137 T3).
- **D3** — T2 is "other G": a maintainer-only check, so it takes a must-FAIL fixture plus one run on the real SECURITY.md,
  with no mutation campaign and no mandatory outside review. Review cap 2 rounds.
- **D4** — The coordinator never opens workdoo's secret files and never writes in `D:\Project\workdoo` (L-247); the pin
  is read from workdoo's own non-secret record.
- **D5** — No shipped skill or template is planned to change. Close decides the release: release-patch skips a docs-only
  diff.

## Assumptions

- **A1** — SECURITY.md is at 72 of its 80-line cap (measured 2026-10-25), so a `humanizer` row fits. *Confirm:
  `check-doc-caps.ts` at T2's review.*
- **A2** — No check reads SECURITY.md's count today: `check-count-claims.sh` reads CLAUDE.md, README and overview.md only.
  *Confirm: grep `scripts/` and `evals/` at T2 G2.*
- **A3** — workdoo's pin can be read from a non-secret record in that repo. *Confirm: owner at T3.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-141-roster-drift-and-the-adopter-pin.md`](logs/SPRINT-141-roster-drift-and-the-adopter-pin.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
