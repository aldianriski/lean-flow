---
sprint: 151
slug: s0-answers-tasks-arms-judges
epic: EPIC-023
owner: Maintainer
last_updated: 2026-10-30
status: active
plan_commit: ce517bbf
gates_signed: G1,G2 @ d12a4cf6
update_trigger: sprint execute/close events
---

# SPRINT-151 — S0: Answers, Tasks, Arms and Judges

> **Theme:** EPIC-023's S0 in one push instead of one link per sprint. The answers files open the chain. Four task batches and
> the two frozen arms are then built in parallel, and the judges and the measured-run pipeline close it. That leaves only the
> pre-registration freeze (TASK-544) and the paid baseline (TASK-545). Beside it, the composition ruling this sprint needed
> becomes the promote standard.

## Scope

**In:** wave 0, the answers files and access protocol (T1, TASK-536) and the promote rule for in-sprint blockers (T2,
TASK-558) · wave 1, four task batches (T3..T6, TASK-537..540) and arms A0/A1 frozen (T7, TASK-541) · wave 2, judges and the
measured-run pipeline (T8, TASK-543).
**Out (deferred):** TASK-544 (pre-registration freeze) and TASK-545 (paid A0+A1 baseline) · S1's TASK-548..555 · TASK-489 ·
TASK-367, 402, 498 (blocked) · TASK-507, 523 (`needs-info`) · TASK-557's guard idea (L-265, count 1).

## Members

- docs/work/todo/TASK-536-prepare-ab-answers-files-and-access-protocol.md
- docs/work/todo/TASK-537-author-workdoo-ab-task-batch-a.md
- docs/work/todo/TASK-538-author-workdoo-ab-task-batch-b.md
- docs/work/todo/TASK-539-author-clinic-ab-task-batch-a.md
- docs/work/todo/TASK-540-author-clinic-ab-task-batch-b.md
- docs/work/todo/TASK-541-construct-and-freeze-ab-arms-a0-a1.md
- docs/work/todo/TASK-543-build-ab-judges-and-measured-run-pipeline.md

## Plan

### T1 — Prepare the A/B answers files and the evidence-access protocol `[size: S · risk: high · class: decision · HITL · J2]`
Layers: `evals/ab/answers/`
  · `docs/work/todo/TASK-536-prepare-ab-answers-files-and-access-protocol.md`
  · `docs/work/in_progress/TASK-536-prepare-ab-answers-files-and-access-protocol.md`
  · `docs/work/done/TASK-536-prepare-ab-answers-files-and-access-protocol.md`
Depends-on: none
Cites: `TASK-536` · `lean-flow-3-foundation.md` (in `docs/research/`; §7 Controls, R-a) · `BUSINESS-NOTES.md` (the name the answers file takes in each arm)

Wave 0. Every arm's business evidence, and now also the seven profile topics (I-6). The workdoo file needs an owner interview.

**Acceptance:** one answers file per repo covering every 2.19.1 question, the lost-detail facts and the seven profile topics, and a written access protocol.

### T2 — Let promote pull a dependent task together with its blockers `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/references/sprint-by-reference.md` · `skills/lean-doc-generator/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-558-let-promote-pull-a-dependent-with-its-in-sprint-blockers.md`
  · `docs/work/in_progress/TASK-558-let-promote-pull-a-dependent-with-its-in-sprint-blockers.md`
  · `docs/work/done/TASK-558-let-promote-pull-a-dependent-with-its-in-sprint-blockers.md`
Depends-on: none
Cites: `TASK-558`

Wave 0, parallel with the answers files; no shared file. Turns this sprint's own composition ruling into the promote standard (owner ask). Shipped skill: Codex loop.

**Acceptance:** the promote procedure lets a dependent join with its in-sprint blockers in an earlier wave, without a state ruling.

### T3 — Author workdoo A/B task batch A `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `evals/ab/tasks/workdoo/batch-a/`
  · `docs/work/todo/TASK-537-author-workdoo-ab-task-batch-a.md`
  · `docs/work/in_progress/TASK-537-author-workdoo-ab-task-batch-a.md`
  · `docs/work/done/TASK-537-author-workdoo-ab-task-batch-a.md`
Depends-on: T1
Cites: `TASK-537` · `BUSINESS-NOTES.md` · `lean-flow-3-foundation.md` (named only as material the author must never see)

Wave 1. Four frozen tasks with failing-then-passing acceptance tests, by an isolated author that never sees 3.0 material.

**Acceptance:** four workdoo tasks with recorded red and green runs, and the owner's realism review signed.

### T4 — Author workdoo A/B task batch B `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `evals/ab/tasks/workdoo/batch-b/`
  · `docs/work/todo/TASK-538-author-workdoo-ab-task-batch-b.md`
  · `docs/work/in_progress/TASK-538-author-workdoo-ab-task-batch-b.md`
  · `docs/work/done/TASK-538-author-workdoo-ab-task-batch-b.md`
Depends-on: T1
Cites: `TASK-538` · `BUSINESS-NOTES.md` · `lean-flow-3-foundation.md` (named only as material the author must never see)

Wave 1, parallel with the other batches and the arms.

**Acceptance:** four more workdoo tasks, same bar, realism review signed.

### T5 — Author clinic A/B task batch A `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `evals/ab/tasks/clinic/batch-a/` · `tsconfig.json`
  · `docs/work/todo/TASK-539-author-clinic-ab-task-batch-a.md`
  · `docs/work/in_progress/TASK-539-author-clinic-ab-task-batch-a.md`
  · `docs/work/done/TASK-539-author-clinic-ab-task-batch-a.md`
Depends-on: T1
Cites: `TASK-539` · `BUSINESS-NOTES.md` · `lean-flow-3-foundation.md` (named only as material the author must never see)

Wave 1.

**Acceptance:** four clinic tasks with recorded red and green runs, realism review signed.

### T6 — Author clinic A/B task batch B `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `evals/ab/tasks/clinic/batch-b/`
  · `docs/work/todo/TASK-540-author-clinic-ab-task-batch-b.md`
  · `docs/work/in_progress/TASK-540-author-clinic-ab-task-batch-b.md`
  · `docs/work/done/TASK-540-author-clinic-ab-task-batch-b.md`
Depends-on: T1
Cites: `TASK-540` · `BUSINESS-NOTES.md` · `lean-flow-3-foundation.md` (named only as material the author must never see)

Wave 1.

**Acceptance:** four more clinic tasks, same bar, realism review signed.

### T7 — Construct and freeze A/B arms A0 and A1 for both repos `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `evals/ab/arms/` · `evals/ab/lib/arm.ts` · `evals/ab/lib/freeze.ts` · `evals/ab/lib/setup.ts` · `evals/ab/lib/snapshot.ts`
  · `evals/ab/lib/trial.ts` · `evals/ab/run-trial.ts` · `evals/ab/selftest.ts` · `evals/ab/setup-a1.ts` · `evals/ab/fixtures/arm-freeze/`
  · `docs/work/todo/TASK-541-construct-and-freeze-ab-arms-a0-a1.md`
  · `docs/work/in_progress/TASK-541-construct-and-freeze-ab-arms-a0-a1.md`
  · `docs/work/done/TASK-541-construct-and-freeze-ab-arms-a0-a1.md`
Depends-on: T1
Cites: `TASK-541` · `BUSINESS-NOTES.md`

Wave 1. Tier G (maintainer-only): a must-FAIL per check and one real run. A1 clinic needs a real 2.19.1 init answered from the answers file.

**Acceptance:** both arms frozen by a per-file hash manifest that the harness enforces, A0 and A1 differing only in the declared doc set.

### T8 — Build the blinded A/B judges and the full measured-run pipeline `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `evals/ab/` · `docs/research/logs/ab-measurements.md`
  · `docs/work/todo/TASK-543-build-ab-judges-and-measured-run-pipeline.md`
  · `docs/work/in_progress/TASK-543-build-ab-judges-and-measured-run-pipeline.md`
  · `docs/work/done/TASK-543-build-ab-judges-and-measured-run-pipeline.md`
Depends-on: T3, T4, T5, T6
Cites: `TASK-543`

Wave 2. Tier G (maintainer-only). Calibrated on reference and deliberately wrong solutions, never on trials.

**Acceptance:** per-dimension blind judges calibrated against the owner's read, and a run record plus analysis report computed on fixture data.

## Decisions (pre-locked)

- **D1** — Waves: W0 = T1 ∥ T2 · W1 = T3..T7 in parallel, one isolated worktree each, merged back in plan order · W2 = T8.
  Each wave starts only once its blockers are in `done/`. Dependents joined ready by owner ruling (2026-10-30), the precedent
  T2 makes standard. No two wave-1 tasks share a declared path: the batches write to their own subfolders. T8's `evals/ab/`
  contains T7's `evals/ab/arms/`, so T8 depends on T7 too and T7 owns that folder first.
- **D2** — S0 is maintainer-only measurement (`evals/ab/`), never a gate or `qa-check.sh` leg. T7 and T8 are Other G
  (ADR-050): a must-FAIL fixture per check and one real run. T2 is a shipped-skill change and takes the owner's Codex loop.
  Review runs once per wave (owner lever), the coordinator re-running every check rather than reading a builder's report.
- **D3** — Status moves, Log, sprint-file edits and merge-back resolutions commit as bare `sprint(151):` (L-238), and so
  does a tick in a folder a task's `Layers:` do not name (L-258). A file a task turns out to need joins by scope-change first
  (L-229). Every builder brief touching `.ts` names `bunx tsc --noEmit` (L-262).

## Assumptions

- **A1** — The workdoo answers file needs an owner interview (T1). *Confirm: T1 G2.*
- **A2** — The task authors (T3..T6) must not see 3.0 material, but a worktree of this repo contains it. *Confirm: T3..T6 G2
  (where the authoring agent runs and what its brief holds).*
- **A3** — T7's real A1 init runs on the pinned 2.19.1 plugin SHA, which differs from the installed copy (it now carries S1
  changes). *Confirm: T7 G2 (how the pinned revision is loaded).*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-151-s0-answers-tasks-arms-judges.md`](logs/SPRINT-151-s0-answers-tasks-arms-judges.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `evals/ab/answers/` | T1 | facts, operator and provenance files per repo, and the access protocol; owner interview and setup decisions | Low | facts files grep-clean of tool and stack terms |
| `skills/lean-doc-generator/references/sprint-by-reference.md` · `skills/lean-doc-generator/SKILL.md` · `CHANGELOG.md` | T2 | promote may pull a dependent with its in-sprint blockers, wave-ordered | Med | Codex R1 CLEAR; scoped out with boxes 1-2 |
| `evals/ab/tasks/` (clinic and workdoo, batch-a and batch-b) | T3..T6 · T8 | 16 tasks with acceptance tests, reference and deliberately wrong solutions, briefs, notes, verify records | Low | coordinator re-verified 16 of 16 red then green; all 16 wrong patches apply |
| `evals/ab/arms/` | T7 | shared inventory, four frozen arms, declared lean-flow sets, setup launcher config | Med | selftest S16-S19, S35; owner-operated A1 init |
| `evals/ab/lib/` · `evals/ab/run-trial.ts` · `evals/ab/selftest.ts` · `evals/ab/setup-a1.ts` · `evals/ab/analyze.ts` · `evals/ab/judges/` | T7 · T8 | freeze preflight, judges with file context, retry and validity rules, analysis, calibration (three live runs kept) | High | selftest 40 of 40; two Codex rounds; calibration 85.5% on judged rows |
| `tsconfig.json` · `bunfig.toml` | T5 · close | the task corpus is excluded from the repo typecheck and from `bun test` | Low | tsc clean; bun test 589 of 589 |
| `docs/work/backlog/` (TASK-536, 544, 552, 559) | coordinator | TASK-536 widened and set ready; open lines on TASK-552 and TASK-544; TASK-559 filed | Low | merge-check 5 of 5 |
| `docs/LEARNINGS.md` · `docs/knowledge-index.md` | close | L-266..L-268 filed; index regenerated | Low | — |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
**Outcome** — 7 of 8 members delivered (TASK-536, 537, 538, 539, 540, 541, 543); TASK-558 scoped out with 2 of 3 boxes, its
third met at the next promote. EPIC-023's S0 now has everything its pre-registration needs except the freeze itself:
answers files, 16 independently verified tasks owner-signed realistic, four frozen arms, and blind judges calibrated at
85.5% on judged rows. Promote can pull a dependent with its in-sprint blockers. System verify on the VPS: qa-check 340/1
(review-depth, owner override recorded) and bun test 589/3 at `a27eeaed`, the three test failures fixed in `bb7c91fd`
(local bun test 589/0).

**Retrieval check** — three misses of rules on record. (1) Corpus fixtures were picked up by the repo-wide typecheck and
then by `bun test`; nobody listed the host's globbing tools when the corpus landed (L-267, count 2). (2) A self-review
record was written before the review depth was decided, and it became a permanent FAIL (L-268). (3) A builder's ``
reached the file as a backspace byte, the escaping trap the memory already names (L-266).

**Cost** — coordinator plus sub-agents: five G2 builder checks about 290k tokens; two answers drafters and a restructurer
about 330k; four task authors about 760k; the arms builder about 360k; the judges builder about 300k; the wrong-solution
author about 95k; four Codex passes about 65k. About 2.2M sub-agent tokens. Three live calibration runs (about 290 judge
calls) and one setup session on Opus, all on the subscription. One owner-operated init, two owner pushes, one disk cleanup.

**Worked**
- Waves let one sprint hold eight tasks instead of one: four authors and the arms builder ran in parallel, each in its own
  folder, and T8 started early by scope-change once its only overlap was settled.
- Re-running every author's red/green in a fresh baseline caught nothing wrong in the tasks, and it did catch a bug in the
  verifier itself (the drive letter read as a remote host) before it could pass as a clean run.
- The independent wave review found six measurement defects the fixtures could not; R2 found two more, fixed by owner ruling.

**Friction**
- C: filled mid-sprint and stopped three agents and a review at once; tool caches now go to D: per command.
- A builder waited on a "commit landed" signal that never reached it, so it sat idle until the owner asked what was
  running. A wait needs an explicit wake-up.
- The init operator answered several popups by choice rather than from the sheet; those answers were adopted as decisions,
  which kept A1 and A2 fair but cost a round.

**Pattern candidate**
- L-267 (count 2, due at the next promote): a fixture corpus of foreign code is excluded from every repo-wide tool when it lands.
- L-266, L-268 (count 1).

**Buckets routed** — Shipped: the CHANGELOG [Unreleased] lines for T2 and the S0 machinery (maintainer-only). Tech debt:
none new. Follow-ups: TASK-559 (review-depth: a later independent review supersedes an earlier self-review, `origin:
close-retro`). Learnings: L-266, L-267, L-268.
