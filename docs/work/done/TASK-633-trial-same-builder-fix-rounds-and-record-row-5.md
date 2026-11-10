---
id: TASK-633
title: "Trial same-builder fix rounds against fresh subagents on planted review findings, and record row 5's verdict"
epic: EPIC-024
sprint: SPRINT-170
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-633 — Trial same-builder fix rounds against fresh subagents on planted review findings, and record row 5's verdict

## Why
Row 5 asks whether a named builder, reused through `SendMessage`, beats a fresh subagent for follow-ups. No fix happened in the three completed SPRINT-167 replays (O1, O2, R1b), so a replay would measure nothing.
Real sprints sent 4 of 4 fixes back to the same builder (SPRINT-165 to 167), unmeasured. Owner popup, 2026-11-08: planted fix rounds.

## G2 (signed 2026-11-09)
Batch G2 signed for SPRINT-170: the design is the SPRINT-170 Execution Log entry "2026-11-09 | gate | G2 batch signed" (its draft section for this task, as amended by its settlements S0 to S36, which win on any conflict).

## Done when
- [x] Three independent build-and-fix pairs run, each from a seeded post-build snapshot cloned into both arms, on TASK-632's frozen harness settings. No builder sees an earlier pair's fix. ✓ Pairs q1-q3, each from a fresh host clone and its own build session; snapshot pre-check every time (oracle a FAIL, b-d PASS). Arm A in-process by owner ruling (scope-change logged): the same session sends the finding to its own builder by `SendMessage` (1 builder dispatch + 1 SendMessage per pair, brief verbatim); arm B a fresh session on a clone of the snapshot, a fresh Sonnet builder with brief and finding. No builder saw another pair's fix.
  Arm A resumes the builder that wrote the code through `SendMessage`. Arm B starts a fresh subagent with the same brief, model and tools.
- [x] Each round records USD and elapsed minutes from dispatch to verification, failed attempts included, whether the finding's oracle passes, and whether the gate passes with no regression. Build and setup costs are reported apart, and all of it is charged to the cap. ✓ Rounds, dispatch to report, USD from tokens in that window: A 0.069 / 2.36 min, 0.058 / 0.23, 0.055 / 2.34; B 0.091 / 0.61, 0.091 / 2.40, 0.081 / 0.26. Oracle 4/4 PASS in all six. Build and setup apart: pair sessions 0.266, 0.244, 0.247; arm-B sessions 0.170, 0.169, 0.147; probes and the failed fork/resume attempts 1.54. T3 row 3.03 of 6.5 USD.
- [x] The verdict is recorded in EPIC-024 row 5. Go only if all three arm-A fixes pass the oracle and the gate on their own, and arm A's mean cost is lower and its mean time no worse than arm B's. Anything else, including inconclusive, is no-go, and the conclusion names the seed it holds for. ✓ **no-go**: arm A's mean cost is lower (0.061 against 0.088 USD) but its mean time is not (1.64 against 1.09 min); and under S13's by-name gate arm A's pair-3 fix renamed the snapshot test "cli fails on invalid input", so not all three arm-A fixes pass the gate. Holds for the seed "CLI exit-64 ruling omitted from the brief".
- [x] Negative: a failed fix, a regression or a missing measure is reported as such and never counted as cheaper. Trial files stay in scratch worktrees; only this file's evidence and the epic row land on `main`. ✓ every measure recorded; the two failed resume attempts and the renamed tests are reported, not dropped; trial files stayed in scratch clones (`s170-t3-*`); only this file and EPIC-024 row 5 land on `main`.

## Touches
Scratch worktrees. `main`: this file and EPIC-024 row 5.

## Assumes
- **A1** — The seeded finding and its oracle are fixed at G2, before any round runs.
- **A2** — All-in spend (builds, probes, reviews, retries) is charged to the sprint's 60 USD cap, about 3 to 5 USD here. Row limits are frozen at G2; reruns are cut first.

## Tracker
EPIC-024 row 5 · TASK-632 (harness settings) · TASK-630 § Results

## Results

**Row 5: no-go** (2026-11-09, SPRINT-170). Resuming the builder that wrote the code is cheaper per fix, but not faster here.

| Pair | Arm A (same builder, SendMessage) | Arm B (fresh builder) | Oracle A / B | Snapshot test names kept A / B |
|---|---|---|---|---|
| 1 | 0.069 USD · 2.36 min | 0.091 · 0.61 | 4/4 · 4/4 | 12/12 · 12/12 |
| 2 | 0.058 · 0.23 | 0.091 · 2.40 | 4/4 · 4/4 | 12/12 · 11/12 |
| 3 | 0.055 · 2.34 | 0.081 · 0.26 | 4/4 · 4/4 | 10/11 · 11/11 |
| Mean | **0.061 · 1.64** | **0.088 · 1.09** | | |

- The time gap comes from a host quirk, not the treatment: three rounds (A in pairs 1 and 3, B in pair 2) hit a 120 s Bash timeout when the builder ran a bare `python`, which opens an interactive REPL on this machine. Without those stalls arm A's rounds were the shortest. The frozen rule counts failed attempts, so the verdict stands.
- The missing test names are renames of "cli fails on invalid input" to a stricter exit-64 test, by both arms once each. A by-name gate counts that as a dropped test.
- Design change on the way (owner ruling "Arm A in-process"): this CLI cannot resume a worker from a later process. A forked session never finds the worker's transcript; a plain `--resume` found it in the probe but opened a new session in the real pairs. Arm B's coordinator started cold, a bias toward B, so against a pass.
