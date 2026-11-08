---
sprint: 168
slug: jev-first-use-and-check
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-08
status: active
plan_commit: 70eb5261
update_trigger: sprint execute/close events
---

# SPRINT-168 — First Jev Use, and the EPIC-024 Check

> **Theme:** the first step of bringing Jev in (map the use cases, then one advisory script that judges Done-when boxes), plus review of the nine leftover agent worktrees. It is also the check D12 asks for: the first real sprint on `main` with rows 1 and 2 landed, read for any gate failure traced to them before row 4 starts.

## Scope

**In:** the Jev use-case map and API facts (TASK-625) · `scripts/jev-done-when.ts` with a retained fixture and one real run (TASK-626) · a ruling on each of the nine worktrees (TASK-624) · the D12 check read at close.
**Out (deferred):** Jev in `/triage`, `/insights`, A/B judging, router or watcher roles (TASK-627 to 629, blocked) · any release or push · putting the script in the gate.

## Members

- docs/work/todo/TASK-624-review-the-nine-leftover-agent-worktrees.md
- docs/work/todo/TASK-625-map-jev-use-cases-against-lean-flow-stages.md
- docs/work/todo/TASK-626-add-a-jev-done-when-judge-script.md

## Plan

### T1 — Map Jev use cases and settle the API facts `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/jev-use-cases.md`
Depends-on: none
Cites: TASK-625
The first Jev use needs its call facts confirmed and a ranked shortlist judged by the delta over what lean-flow already has (L-017).

**Acceptance:** the research doc maps every use to a stage and an existing surface, ranks the remainder, and records the API facts with a source URL each.

### T2 — Add the Done-when judge script `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `scripts/jev-done-when.ts`, `test/fixtures/`
Depends-on: T1
Cites: TASK-626, TASK-625, `docs/research/jev-use-cases.md`
An advisory maintainer instrument outside the gate. Tier G (other): one must-FAIL fixture plus one run on the real task files; G2 review-round cap 2.

**Acceptance:** the fixture run exits non-zero naming UNOBSERVABLE and NEGATIVE-VAGUE with the control box passing, and one run over the real task files is recorded with its spend.

### T3 — Rule on the nine leftover worktrees `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/work/in_progress/TASK-624-review-the-nine-leftover-agent-worktrees.md`
Depends-on: none
Cites: TASK-624
Nine agent worktrees hold uncommitted work; each sprint fan-out pays a ruling until someone reviews them. No tracked file changes.

**Acceptance:** each worktree has a recorded ruling and nothing uncommitted is discarded without one naming it.

## Decisions (pre-locked)

- **D1** — Every session in this sprint runs with `--plugin-dir D:\Project\lean-flow`, confirmed by the `/prime` `Skills:` row reading "live checkout". The installed cache holds the released 2.21.0, not `main`, and rows 1 and 2 of EPIC-024 are on `main` unreleased, so only a live checkout runs what the check is about. Owner ruling, 2026-11-08.
- **D2** — This sprint is the D12 check. It passes when no close-time gate failure traces to rows 1 and 2. The verdict goes in the close Retro and in this sprint's § Member sprints row on EPIC-024 ("gate failures traced to rows 1 and 2: N"). No extra task. Owner ruling, 2026-11-08.
- **D3** — Tier G (other) for T2: one must-FAIL fixture, a control box, one run on the real task files. G2 review-round cap 2. The 5 USD Jev cap is held by `--budget-usd` plus a by-hand note in TASK-626's Results.

## Assumptions

- **A1** — Jev Box fits both judgments at thresholds 0.7 and 0.3. *Confirm: TASK-625's API facts.*
