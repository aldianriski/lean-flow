---
sprint: 170
slug: agent-roles-rows-4b-to-9
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-10
status: closed
plan_commit: 25fa20ac
gates_signed: G1,G2 @ 16ae5b99
close_commit: ed530d27
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
Cites: TASK-633, SD5, TASK-632 (harness settings), `subagents/` (CLI transcript folder)
Starts after the harness settings freeze (SD5), a settings dependency, not a wait on the row 4b verdict.

**Acceptance:** a row 5 verdict, with each round's cost, time and oracle result recorded.

### T4 — Trial a merger worker on the merge-back queue `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/` · `docs/epic/EPIC-024-agent-roles-one-by-one.md`
Depends-on: T2
Cites: TASK-634, SD3, TASK-638 (ordinary baseline), `agents/merger.md` (trial branch), `merge-oracle.ts` (operator scratch)
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
Cites: TASK-636, EPIC-024 D13, `gate-remote.ts` (main's copy, run against the T6 clone)
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

**Verdicts.** Six rows, each its own trial with a bar frozen at G2: 4b no-go · 5 no-go · 6 go · 7 no-go (overhead) · 8 no-go (no gap shown) · 9 go. Rows 6 and 9 passed, and nothing ships from them yet: shipping needs a separate D5 owner ruling (TASK-646), so EPIC-024's last Closed-when box stays open.
- 4b: the thin router cost 2.66 USD against the ordinary mean 4.05 (31 percent under; bar 3.04) but took 72.7 min against 47.85. R2 was skipped under S12.
- 5: arm A 0.061 USD and 1.64 min a round against arm B 0.088 and 1.09. Each arm renamed one test, so each failed S13's by-name gate once; three rounds also lost 120 s to a bare `python` REPL.
- 6: merger runs 3.8 and 3.9 USD, 24.0 and 27.4 min against 4.05 USD and 47.85 min; 0 bad merges on the frozen oracle and the wrong-base merge refused.
- 7: the watcher caught both hangs 6.1 and 6.3 min after last progress with no false alarm and 0.36 percent CPU, but the coordinator turns it triggered cost 0.120 USD against the 0.10 limit.
- 8: the seeded real commit (`5ca2c00e`) passed the gate, and the existing scoped review caught it in 35 s for 0.143 USD, so the checker never ran.
- 9: the reproducer reproduced 2 of 2 at 0.039 USD mean against `/diagnose`'s 0.114 (bar 0.086); the clean-twin control read `reproduced: no`. One seed, n = 2.

**Codex's two Med challenges (read-only review of the recap, `VERDICT: 2 challenges (0 High)`).**
- Row 6 is a provisional go, not a savings claim: n = 2, runs on a later day than the ordinary runs, 4 to 6 percent of cost headroom. Accepted as stated. TASK-641 files the confirmation (a different sprint, fresh controls, balanced order), and TASK-646 carries it to the D5 ruling.
- Row 8 is representative only if ordinary scoped review receives the governing text. The coordinator's answer: scoped review takes the governing decision on its Spec axis, and TD-232's text ("carrying" the tag) agrees with the seeded code and does not hint at the anchor. Recorded, not settled by the owner. It matters only if row 8 is re-run.
Codex also found a 0.7 USD slip in the spend tally (29.5, not 30.2), corrected in the Log.

**Retrieval check:** two misses, both a rule that existed and was not applied. L-261 (a guard-parsed field is not free prose): the T1 `consequence ·` line carried a trailing explanation, and tick evidence written on a continuation line read as a Done-when edit on TASK-633 and TASK-634. L-234 (a path a scope-change entry names must be declared):
T3 and T4 named `subagents/`, `agents/merger.md` and `merge-oracle.ts` without declaring them. System verify read 491/3, fixed in five commits (65a32709, 26d1bfd7, f00521ea, aa80826f, c4a4a7a0), then 493/0. A third, python string escapes breaking two script edits, is L-266's second sighting (see Pattern candidate).

**Cost:** about 31.4 USD of the 60 USD cap, counting trial runs and workers: T1 about 2.1, G2 workers about 3.5 (an estimate: in-session subagents leave no transcript, TD-306), T2 10.83, T4 9.54, T3 3.03, T5 about 1.9, T6 0.14, T7 about 0.36. Codex ran outside the cap, as tokens. The operator session was uncapped and is not measured, so this is not the cost of delivery.
About 1.05 USD per DoD box over 30 boxes, but the boxes are trial records, not delivered product, so it is not comparable with the 0.88 to 1.41 USD per box delivery baseline. Elapsed from promote on 2026-11-08 to close on 2026-11-10, with one paid run at a time and 10-minute cold-start gaps; the replays (about 4 USD and 40 min each) were most of the spend.
System verify passed off-host at `c4a4a7a0` (bun test 589/0, qa-check 493/0); one earlier run was a transport failure, not a gate result.

**Worked**
- Seven fresh builder checks at G2 found 30 contradictions before any paid run, and all were settled or ruled.
- Bars frozen before the runs, with named exceptions: S12 spared R2 (about 4 USD) because R1 had already failed the bar; row 8 stopped at the existing review, so the checker's cost was never spent.
- Oracles were shown to fail before they were trusted: the merge oracle on a swapped-sets fixture (BAD MERGE, both mismatches named), the watcher on old code (8 pass, 15 fail) against the fixed code (23 pass, 0 fail).
- Popup rulings kept the owner in control from a train; T6 and T7 ran side by side because neither verdict uses time.

**Friction**
- Host facts cost runs and hours: edits to `.claude/` denied outside bypass mode (L-298), a silent deny-rule path form (L-299), a blocked `sleep` (L-300), headless turns that end on a running job (L-301), unreliable cross-process resume (L-302, TD-305),
  the low-memory reaper (L-303), a PC suspend that cost 2.5 h and voided run 2b (L-304), path rewriting and ignored allow lists (L-305), a bare `python` REPL (L-306) and an old revision with no gate script (L-307).
- Operator errors: a backticked `echo` ran the test suite in the main repo during R1 (L-308); the first merger prompt changed the coordinator beyond the treatment and voided M1 (L-309); a settlement's wording contradicted its stated reason (S30) and went to the owner; one T1 commit mixed the Log into a `Tn:` commit and was split.
- About 20 owner popups, many foreseeable (TASK-644).
- The harness lived in operator scratch and was rebuilt or copied per trial (TASK-640).

**Pattern candidate**
- L-266 (a regex or escape-heavy edit through a shell heredoc loses a backslash) has a second sighting here: Python string escapes in shell heredocs broke two script edits, caught before anything paid ran.
  Its count is not bumped, because count 2 at `promoted: no` would redden S10.PROMOTION; promoting it needs a placement ruling (proposal in the close report: merge into the edit-safety durable rule, since the memory note "seed edits ship as a script file" already says it for this operator).
- L-261 and L-234 gain a sighting each. L-304 spans two runs in one sprint, so its count stays 1.

**Filed from this Retro.** Tech debt: TD-304 to TD-306. Follow-ups: TASK-639 (worker-brief rules) and TASK-640 (harness to `scripts/trials/`), both ruled for implementation after the close; TASK-641 to TASK-645 as backlog; TASK-646, the D5 ruling, as an owner action. Learnings: L-298 to L-309. Shipped: no CHANGELOG entry (nothing user-visible landed on `main`).
