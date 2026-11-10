---
sprint: 171
slug: finish-epic-024
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-10
status: active
plan_commit: 18148168
gates_signed: G1,G2 @ 1533e423
update_trigger: sprint execute/close events
---

# SPRINT-171 — Finish EPIC-024: Confirm Rows 6 and 9, Then Rule on Shipping

> **Theme:** close EPIC-024's last open condition. The owner's 2026-11-10 ruling (D15) ships rows 6 and 9 only after a named confirmation each, so this sprint moves the trial harness into the repository, runs both confirmations and brings the ship ruling to the owner. By owner ruling at this promote it also carries the three trial-cost follow-ups from SPRINT-170, so the next trial costs less.

## Scope

**In:** the trial harness in `scripts/trials/` with a clean-clone check and a preflight (TASK-640) · the reproducer measured inside a full `/diagnose` pass (TASK-642) · the merger confirmed on a different sprint (TASK-641) · the owner's ship ruling on rows 6 and 9 under D5 (TASK-646).
Also in, by owner ruling: a frozen replication and stop protocol (TASK-643), a gate-packet rule for trial sprints (TASK-644) and a cost-allocation method (TASK-645).
**Out (deferred):** the row 4b retest itself (TASK-643 stays on paper) · any release or push · trial files on `main` or in `.claude/agents/` before T7's ruling · `night-run` · gate changes.

## Members

- docs/work/todo/TASK-640-promote-the-trial-harness-to-scripts-trials.md
- docs/work/todo/TASK-642-measure-a-reproducer-helper-inside-diagnose-phase-2.md
- docs/work/todo/TASK-644-cut-owner-popups-with-gate-packets-and-preauthorised-recovery.md
- docs/work/todo/TASK-645-make-trial-costs-comparable-before-any-new-resume-trial.md
- docs/work/todo/TASK-643-make-agent-role-trials-cheaper-with-frozen-replication-rules.md
- docs/work/todo/TASK-641-confirm-the-merger-trial-on-a-different-sprint.md
- docs/work/todo/TASK-646-rule-on-shipping-rows-6-and-9-under-d5.md

## Plan

### T1 — Move the trial harness into scripts/trials/ with a clean-clone check `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/trials/` · `test/` · `CHANGELOG.md` · `evals/run-emitter-column-fixtures.ts`
Depends-on: none
Cites: TASK-640, L-298 to L-307, `D:\Project\lean-flow-worktrees\s170-harness-keep\` (A1), `jev-ab-judge.ts` (its dry-run-by-default shape, cited not touched), `base-gate.log` (a kit record outside the repo, read only)
Every SPRINT-170 trial rebuilt its harness from operator scratch. The merger confirmation and the protocol note both assume it is in the repository. Tier G (other G): a must-FAIL fixture per preflight fault and one run on SPRINT-170's real inputs.

**Acceptance:** a fresh clone of `main` runs the harness dry run to a printed pass, and the preflight names each of the three seeded faults.

### T2 — Measure the reproducer inside a full /diagnose pass `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/epic/EPIC-024-agent-roles-one-by-one.md` · `docs/work/`
Depends-on: none
Cites: TASK-642, TASK-637 § Results, `skills/diagnose/SKILL.md`, EPIC-024 D5
Row 9's saving came from a run stopped after Phase 2. This measures the marginal saving inside the whole skill. The helper and any `/diagnose` edit stay on a trial branch.

**Acceptance:** row 9 carries the integrated run's marginal cost and time on at least two seeds, with a clean-twin control.

### T3 — Write the trial-sprint gate-packet rule `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: none
Cites: TASK-644, SPRINT-170 Log (about 20 popups)
SPRINT-170 spent about 20 popups on rulings a design could have foreseen. The shipped reference changes only if the rule turns out general (a G2 call, with the consumer check).

**Acceptance:** a rule lists the pre-authorised recovery cases with their caps and the rulings that always escalate.

### T4 — Make worker and coordinator costs comparable across arms `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/`
Depends-on: none
Cites: TASK-645, TASK-633 § Results (read only), TD-305, TD-306, `session-cost.ts` (read only, reconciliation source), `t3-measure2-preserved.ts` and `t4-buckets.ts` (method scripts outside the repo)
A method note, checked against row 5's recorded pairs. No verdict moves.

**Acceptance:** the method reproduces row 5's six recorded round totals within its stated rounding, or names the difference.

### T5 — Freeze the replication and stop protocol for agent-role trials `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/research/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: T1
Cites: TASK-643, EPIC-024 D15, L-310
On paper only: applied to row 4b's design with no paid run unless the owner approves one.

**Acceptance:** a protocol note, applied on paper to row 4b, shows the planned cost against SPRINT-170's per-row figures.

### T6 — Confirm the merger result on a different sprint `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/epic/EPIC-024-agent-roles-one-by-one.md` · `docs/work/`
Depends-on: T1
Cites: TASK-641, TASK-634 § Results, EPIC-024 D15, `agents/merger.md` (trial branch, read only), `scripts/gate-remote.ts` (read only, run by path)
Row 6 is a provisional go on n = 2 per side. This is a second look that shares nothing with the first: a different replay, fresh ordinary controls in the same session, interleaved order, at least three runs per side.

**Acceptance:** row 6 records confirmed, not confirmed or inconclusive, with each side's cost, time and merge-oracle result.

### T7 — Bring the ship ruling on rows 6 and 9 to the owner `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: T2, T6
Cites: TASK-646, EPIC-024 D5, ADR-053, `agents/merger.md` (trial branch; must not land before the ruling)
The epic's last Closed-when box. On a ship ruling, the agent files, a clean install and a no-agent fallback follow, and Layers is widened by a `scope-change` entry first.

**Acceptance:** the owner has ruled on each row after its confirmation, and EPIC-024's last Closed-when box is ticked with that ruling.

## Decisions (pre-locked)

- **D1** — One 40 USD all-in cap for the sprint's paid runs, warning at 32 USD. Split: T6 26, T2 4, workers, probes and review 8, reserve 2. Raised from 35 and 28 by owner popup on 2026-11-10, after the workers line overran (Log, G2-B).
  It counts every headless replay, probe, seed run, dispatched worker and retry, each measured from its own session. The operator session is reported separately and is not capped (as SPRINT-170). Owner popup, 2026-11-10.
- **D2** — T5 stays on paper. A paid row 4b run needs its own owner approval and does not draw on D1's cap without it.
- **D3** — Nothing from a trial branch lands on `main` or in `.claude/agents/` before T7's ruling. Shipping then needs EPIC-024 D5 in full.

## Assumptions

- **A1** — The SPRINT-170 harness files are still at `D:\Project\lean-flow-worktrees\s170-harness-keep\`, outside the repository, and their answer keys stay out of it. *Confirm: listed at promote (`harness.ts`, `merge-oracle.ts`, `agent-cost.ts`, `fixtures/` present); T1's G1 re-checks.*
- **A2** — T6's replay sprint and its per-run budget inside D1 are chosen at T6's G1 frontier round. *Confirm: T6 G1.*
- **A3** — TASK-637's seed and clean twin can be reused for T2. *Confirm: re-derived at T2's G2.*
- **A4** — T3's rule is ruled before T2's and T6's G2, so both paid trials can use it and the Retro can count popups against SPRINT-170's 20 (TASK-644 Done when 2). It orders the work but is not a `Depends-on:`. *Confirm: G1.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-171-finish-epic-024.md`](logs/SPRINT-171-finish-epic-024.md). Append there, never here (STANDARD §9).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close (STANDARD §10). -->
