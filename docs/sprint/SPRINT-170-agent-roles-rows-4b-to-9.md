---
sprint: 170
slug: agent-roles-rows-4b-to-9
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-08
status: active
update_trigger: sprint execute/close events
---

# SPRINT-170 — Agent Roles, Rows 4b to 9, Trialled Together

> **Theme:** run EPIC-024's remaining ladder rows (4b to 9) together under one 60 USD all-in cap, by owner ruling on 2026-11-08. Each row is still its own trial with its own recorded verdict (epic D2). A pass on rows 7 to 9 ships only by owner exception (ADR-053).

## Scope

**In:** the thin router and Executor trial, built and replayed (row 4b) · same-builder fix rounds (row 5) · the merger trial (row 6) · the watcher, checker and reproducer on planted failures (rows 7 to 9) · a recorded verdict per row.
**Out (deferred):** any release, push or `night-run` · trial files on `main` or in `.claude/agents/` · gate changes · comparing the watcher with the night-run watchdog.

## Members

- docs/work/todo/TASK-632-trial-deepseek-s-thin-router-and-record-row-4b-s-verdict.md
- docs/work/todo/TASK-638-run-the-four-replays-and-record-row-4b-s-verdict.md
- docs/work/todo/TASK-633-trial-same-builder-fix-rounds-and-record-row-5.md
- docs/work/todo/TASK-634-trial-a-merger-worker-and-record-row-6.md
- docs/work/todo/TASK-635-trial-a-watcher-on-a-planted-hung-worker-and-record-row-7.md
- docs/work/todo/TASK-636-trial-a-checker-on-a-planted-defect-and-record-row-8.md
- docs/work/todo/TASK-637-trial-a-reproducer-on-a-seeded-bug-report-and-record-row-9.md

## Plan

### T1 — Build the thin router and Executor files and probe the shared harness `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: none
Cites: TASK-632, `.claude/CONTEXT.md`, `deepseek-ai/dsh-superagent-prototype`, `docs/research/router-mode.md`, SD3
Row 4b's build half: the trial files live on a trial branch only, and the probe proves both arms run on identical settings before any paid replay.

**Acceptance:** router and Executor files built on the trial branch, Codex fidelity review clear, and both arms' probes show identical settings.

### T2 — Run the four SPRINT-167 replays and record row 4b's verdict `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: T1
Cites: TASK-638, TASK-630 § Results, SD3, SD4
Two ordinary and two thin-router runs, alternated, on the settings the build half's G2 froze. The ordinary runs are the baseline the merger trial consumes.

**Acceptance:** four replay runs recorded and a row 4b verdict by the go rule.

### T3 — Trial same-builder fix rounds against fresh subagents `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: none
Cites: TASK-633, SD5, TASK-632 (harness settings)
Starts after the harness settings freeze (SD5), a settings dependency, not a wait on the row 4b verdict.

**Acceptance:** a row 5 verdict, with each round's cost, time and oracle result recorded.

### T4 — Trial a merger worker on the merge-back queue `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: T2
Cites: TASK-634, SD3, TASK-638 (ordinary baseline)
Consumes T2's two ordinary runs as its baseline; an invalid baseline run voids both verdicts.

**Acceptance:** a row 6 verdict against a merge oracle frozen at G2, including the unsafe-merge case.

### T5 — Trial a watcher on a planted hung worker `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: none
Cites: TASK-635, EPIC-024 D13
A planted failure with a control run that leaves a healthy worker alone.

**Acceptance:** a row 7 verdict, with the controls run.

### T6 — Trial a checker on a planted defect `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: none
Cites: TASK-636, EPIC-024 D13
A defect that passes the gate and review, with a clean control.

**Acceptance:** a row 8 verdict, with the controls run.

### T7 — Trial a reproducer on a seeded bug report `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: none
Cites: TASK-637, EPIC-024 D13
A seeded bug report, measured by its delta over `/diagnose`'s own reproduce step.

**Acceptance:** a row 9 verdict, with the controls run.

## Owner-action checklist

- [ ] Confirm the VPS gate dirs `~/lf-gate-*` are free before the replays.

## Decisions (pre-locked)
<!-- Numbered SD to stay apart from EPIC-024's D-numbers (D2, D13 below mean the epic's). -->
- **SD1** — Rows 4b to 9 run together as one sprint; one change per trial (epic D2 stands). Owner ruling, 2026-11-08, which also updates epic D13's order to "together".
- **SD2** — Budget: 60 USD all-in across the six trials (builds, probes, reviews, seeds, failures, retries). Owner ruling, 2026-11-08; supersedes TASK-632's earlier 62 USD A2.
  - Warn at 48 USD (80%, owner answer); the hard stop stays at 60 USD.
  - The coordinator logs a running tally after every paid run. At the cap the sprint stops and records what was measured.
  - Cut reruns first; if still infeasible, ask the owner to defer rows 7 to 9 before weakening any repetition or control. Row limits are frozen at G2.
- **SD3** — G2 notes for TASK-632, carried verbatim from the owner's notes file (2026-11-08):
  - 1. Cap: A2 becomes the sprint's 60 USD total across all six trials, all-in (builds, probes, reviews, seeds, failures, retries), with row limits frozen at G2 and a hard total stop. Cut reruns first; if still infeasible, ask the owner to defer rows 7-9 before weakening any repetition or control.
  - 2. Ownership: TASK-632 owns the shared harness, worktree isolation and the two ordinary baseline runs; TASK-634 consumes them. Runs may merge back inside their own scratch repository, Git metadata included. Each experiment enables only its own treatment. Shared runs are charged once; a baseline invalidation affects both verdicts.
  - 3. Freeze before runs: revisions, briefs, models and effort by function, permissions, gate and review, measurement boundaries, cache policy (each run starts cold, from a fresh session), interleaved order. Audit router tool use, unchanged relays and Executor identity.
  - 4. Ordinary runs must each pass all 11 boxes, the gate and review, with both merge-backs, or they are invalid. Each router run's time must not exceed the ordinary mean. Missing evidence, treatment violations, drift, aborts or incomplete samples cannot yield a go.
  - 5. Probe: a worker must survive past the former 10-minute cutoff, and the permitted `.claude/CONTEXT.md` edit is actually made, not just allowed.
  - 6. EPIC-024 D13's order is updated to the 2026-11-08 ruling (rows 4b to 9 together) at promote.
  - 7. Harness logs (stream-json, stderr, gate logs) go to the operator's scratch folder only, never the run's worktree or its parent; a run writes only inside its scratch repository.
  - Split at promote: note 2's "TASK-632 owns ... the two ordinary baseline runs" now reads TASK-632 the harness and TASK-638 the two ordinary runs (owner ruling, 2026-11-08).
- **SD4** — Shared execution set-up, from TASK-630 § Results and the owner ruling of 2026-11-08:
  - Worktrees `D:\Project\lean-flow-worktrees\replay-*`, VPS gate dirs `~/lf-gate-*`, and `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`.
  - Gate settings passed so Git Bash cannot rewrite them; a replay prompt that allows worktree isolation inside each run's scratch repository.
  - Fresh ordinary runs under the same settings; earlier O1 and O2 runs lacked the ceiling setting and are not baselines.
- **SD5** — T3 to T7 reuse the settings T1's G2 freezes. That is a settings dependency, not a verdict dependency, so it is recorded here and not in a `Depends-on:` line.
- **SD6** — The coordinator is the single owner of EPIC-024 row edits and commits them one at a time, per hunk (L-042). Six tasks share that file.
- **SD7** — Trial-branch files (`agents/*.md`) never land on `main`, so no `Layers:` line names them; each Tn names only its member file area and the epic file.

## Assumptions

- **A1** — G2 notes 1 and 6 are met by SD2 and the promote-time epic edit. *Confirm: G2.*
- **A2** — The `replay-*` worktrees and `~/lf-gate-*` VPS dirs from TASK-630 are still usable. *Confirm: G2 recon (the VPS was not checked at promote).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-170-agent-roles-rows-4b-to-9.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/work/**` | T1 to T7 | member tasks moved with ticks and results | low | by-reference close check |

## Retro

_Written at close._
