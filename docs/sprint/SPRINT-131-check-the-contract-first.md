---
sprint: 131
slug: check-the-contract-first
owner: Maintainer
last_updated: 2026-10-19
status: active
plan_commit: 8fd58050
update_trigger: sprint execute/close events
---

# SPRINT-131 — Check the Contract First

> **Theme:** the 2026-10-19 re-judgement of the reference scans (`docs/research/reference-rejudge.md`). On that day 4 of 5 real
> defects were in *what to build*, and every one was caught only after the build. A replay showed a fresh reader at G2 would
> have caught 3 of them first, so the builder check ships. The bigger changes the re-judgement raised — inline execution as the
> default, open questions for discovery, a loop map — are tested against thresholds fixed in advance, not adopted on argument.

## Scope

**In:** the G2 builder check (`458`) · the inline-vs-dispatch replay (`459`) · the question-style replay (`460`) · the loop table
with its reader test (`462`).
**Out (deferred):** the question-style trial (TASK-461, blocked on 460) · changing the dispatch default (only if 459 passes, as its
own task) · TASK-366 · 367 · 402 · the open debt rows.

## Members

- docs/work/todo/TASK-458-add-a-fresh-reader-builder-check-to-the-g2-gate.md
- docs/work/todo/TASK-459-replay-todays-six-tasks-inline.md
- docs/work/todo/TASK-460-replay-todays-questions-open-vs-picker.md
- docs/work/todo/TASK-462-loop-table-in-overview-with-reader-test.md

## Plan

### T1 — Add a fresh-reader builder check to the G2 gate `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/builder-check.md` · `skills/flow/SKILL.md`
  · `skills/orchestrator/references/night-run.md`
  · `docs/work/todo/TASK-458-add-a-fresh-reader-builder-check-to-the-g2-gate.md`
  · `docs/work/in_progress/TASK-458-add-a-fresh-reader-builder-check-to-the-g2-gate.md`
Depends-on: none
Cites: `TASK-458` · `docs/research/reference-rejudge.md` · L-237 · L-020 · ADR-006 · `CHANGELOG.md` (coordinator-owned, D1)

The replay's evidence makes this the sprint's one adoption: a reader who cannot ask the author, given the design and the frozen
Done-when, surfaces the drift and the missing wiring that today surfaced only at review.

**Acceptance:** every G2 path runs the reader before sign-off, and one real design is checked by it before its own sign-off.

### T2 — Replay today's six tasks inline `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/work/todo/TASK-459-replay-todays-six-tasks-inline.md`
  · `docs/work/in_progress/TASK-459-replay-todays-six-tasks-inline.md`
Depends-on: none
Cites: `TASK-459` · `docs/research/reference-rejudge.md` (coordinator-owned, D1) · the archived SPRINT-129 and SPRINT-130 logs

A measurement against the logged dispatch arm; the thresholds were fixed before it runs, so its verdict cannot be fitted to it.

**Acceptance:** a recorded inline-arm cost, defect count and elapsed time, and a pass or fail against the preset thresholds.

### T3 — Replay today's questions, open vs picker `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/work/todo/TASK-460-replay-todays-questions-open-vs-picker.md`
  · `docs/work/in_progress/TASK-460-replay-todays-questions-open-vs-picker.md`
Depends-on: none
Cites: `TASK-460` · `TASK-461` · `docs/research/reference-rejudge.md` (coordinator-owned, D1) · L-002

Cheap stage one: whether the open form invites the three scope-changing answers, before any change to how questions are asked.

**Acceptance:** a per-question record and a coverage verdict that unblocks or proposes cancelling TASK-461.

### T4 — Add a loop table to the overview, kept only if a reader test passes `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/architecture/overview.md`
  · `docs/work/todo/TASK-462-loop-table-in-overview-with-reader-test.md`
  · `docs/work/in_progress/TASK-462-loop-table-in-overview-with-reader-test.md`
Depends-on: none
Cites: `TASK-462` · `docs/research/reference-rejudge.md` (coordinator-owned, D1) · `docs/research/loopcraft-adaptation.md`

A navigation table earns its lines only if readers find the authoritative record faster with it.

**Acceptance:** a recorded reader test, and the table kept or removed by its preset rule, with the file within its cap.

## Decisions (pre-locked)

- **D1** — Shared files: no Layers file is shared. `docs/research/reference-rejudge.md` receives T2 · T3 · T4's verdicts and is
  coordinator-owned (written in close order); so are `CHANGELOG.md`, this file, its log and the member files.
- **D2** — Owner rulings at intake (2026-10-19): the builder check runs on every G2 design, one reader per task design · the
  dispatch arm reuses the logged SPRINT-129/130 runs · question style is staged (replay now, trial blocked) · the loop table goes
  in the overview, trimmed to fit.
- **D3** — Review: T1 is a shipped skill change → scoped Codex review + the adversarial floor, logged as `review · Tn` lines (L-151);
  T2 · T3 · T4 are measurements or a doc with a reader test → their records are reviewed once by Codex before the verdict lands.

## Assumptions

- **A1** — The orchestrator SKILL.md has one line of room (139 of ~140); T1 adds at most that and moves the prompt to a reference.
  *Confirm: the doc-caps leg after T1.*
- **A2** — The archived SPRINT-129/130 logs and transcripts carry enough cost and timing data to serve as the dispatch arm.
  *Confirm: T2's first step; if a figure is missing, T2 names it rather than estimating it.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-131-check-the-contract-first.md`](logs/SPRINT-131-check-the-contract-first.md),
> created at promote. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10). -->
