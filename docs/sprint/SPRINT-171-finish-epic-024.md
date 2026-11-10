---
sprint: 171
slug: finish-epic-024
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-11
status: closed
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
Cites: TASK-641, TASK-634 § Results, EPIC-024 D15, `agents/merger.md` (trial branch, read only), `scripts/gate-remote.ts` (read only, run by path), `keys/s130.json`, `s130.json`, `s130-swapped.json` (oracle keys outside the repo, read only)
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
| `scripts/trials/` (11 files) | T1 | Trial harness moved out of operator scratch so every trial reuses one tested kit; `agent-cost.ts` later skips zero-usage API-error turns (T6) | med | `test/trials/` 29/0; selftest PASS; fresh-clone dry run |
| `test/trials/`, `test/fixtures/trials/` | T1 | Fixtures and must-FAIL cases for the harness, plus the synthetic-turn regression | low | red then green on each fix |
| `evals/run-emitter-column-fixtures.ts` | T1 | Declares the maintainer-only harness out of the emitter-column census | low | PASS with the rule; FAIL (11 files) without |
| `docs/epic/EPIC-024-agent-roles-one-by-one.md` | T2 T3 T5 T6 T7 | D16 to D21: gate packet, protocol, row 9 no-go, row 6 inconclusive, no-ship ruling | low | prose-density 27/0; doc caps PASS |
| `docs/research/trial-cost-allocation.md`, `trial-replication-protocol.md` | T4 T5 | Cost method note; replication and stop protocol, review drift fixed | low | doc caps PASS; scoped review re-checked |
| `TECH-DEBT.md`, `CHANGELOG.md`, `docs/LEARNINGS.md` | close | TD-307 to TD-309, one Unreleased line, L-311 to L-313 | low | gate at close |

## Retro

**Verdicts.** EPIC-024's last two rows are ruled, and the epic closes.
- Row 9 inside `/diagnose`: **no-go** (D19). The helper fired and reproduced correctly, but a full pass cost 1.58× and took 1.65× the unchanged skill on both seeds (bars 0.75× and 1.10×).
- Row 6 confirmed on SPRINT-130: **inconclusive** (D20). The futility stop ended it at 1 valid ordinary run and 0 valid merger runs.
  Both completed merger runs merged correctly (oracle PASS, files preserved) but were void: a red `layers observed` gate twice each, from builder commits no task owns, which only the ordinary coordinator repairs; and helper writes to `/tmp`. K2 was host-killed and relaunched.
- Neither row ships (D21, owner popup). Also delivered: the harness in `scripts/trials/` (T1), the D16 gate packet (T3), the cost method note (T4) and the replication protocol D17 (T5).

**Owner load (TASK-644).** 21 popups and 36 answers over two sessions, promote included, against SPRINT-170's about 23 and 32. The owner's active time: under 30 min. D16 recoveries ran without a popup inside their caps (case 1 for K2, case 3 for T2 and T6 harness faults). Faults beyond a cap still went to the owner, as did host memory, verdict and validity questions.

**Cost.** Measured trial runs 8.56 USD: T2 1.10 of its 4, T6 7.45 of its 26. Workers had spent 4.96 USD by G2-B, which overran their 3 USD line and raised D1 to 40. Later in-session workers and the T5 review left no transcript (TD-306). Codex builds ran outside the cap. About 13.5 USD measured of 40.

**System verify.** The first close gate at `da6c4dbd` read `QA-CHECK: 504 pass, 12 fail`. Eleven were fixed, in eight commits. At `8a695d27`: `bun test` 618/0 and `QA-CHECK: 509 pass, 1 fail`, the one being `7407e49c`'s attribution, closed under the owner's ruling (TD-307).

**Retrieval check.** L-261 (a field a guard parses is not prose) missed a sixth time. All seven `consequence ·` lines carried their reasons inline, so `check-review-depth` could not read them, and T5's owed independent review stayed hidden until close. Run, it found real drift: the note had dropped the signed design's "in both of its runs" screen-out condition.

**Worked**
- The futility stop skipped four runs that could not change the verdict.
- Oracles were calibrated free before use: the merge-preservation rule read PASS on the reference, FAIL on the swapped key, FAIL on a merge that dropped or altered one T2 line.
- Every kit or harness fix carried a control that must fail: the `agent-cost` regression red then green, the futility controls red with the throw disabled.
- The next session rebuilt the unlogged K1, K2 and three verbatim owner rulings from the previous transcript before any further spend.

**Friction**
- Host memory: K2 stalled 1 h 52 min at about 1.5 GB free and then lost its launcher to the reaper. Three `test/trials/` tests timed out at bun's 5000 ms default at 1.07 GB free (TD-309).
- A session ended with two paid runs and three owner rulings missing from the Log (L-311).
- Helper agents' `/tmp` scratch writes voided both completed merger runs; "no write leaves the clone" never reached a worker brief (L-312).
- A harness fix committed under a non-sprint subject cannot be attributed later (TD-307, L-313).

**Pattern candidate**
- L-261 gains its sixth sighting (count 5 → 6, already promoted). Placement held, retrieval did not: the rule sits in § Durable rules, but nothing in the flow puts it in front of the coordinator while it writes a consequence line.
