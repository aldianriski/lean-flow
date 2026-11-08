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
- [ ] Three independent build-and-fix pairs run, each from a seeded post-build snapshot cloned into both arms, on TASK-632's frozen harness settings. No builder sees an earlier pair's fix.
  Arm A resumes the builder that wrote the code through `SendMessage`. Arm B starts a fresh subagent with the same brief, model and tools.
- [ ] Each round records USD and elapsed minutes from dispatch to verification, failed attempts included, whether the finding's oracle passes, and whether the gate passes with no regression. Build and setup costs are reported apart, and all of it is charged to the cap.
- [ ] The verdict is recorded in EPIC-024 row 5. Go only if all three arm-A fixes pass the oracle and the gate on their own, and arm A's mean cost is lower and its mean time no worse than arm B's. Anything else, including inconclusive, is no-go, and the conclusion names the seed it holds for.
- [ ] Negative: a failed fix, a regression or a missing measure is reported as such and never counted as cheaper. Trial files stay in scratch worktrees; only this file's evidence and the epic row land on `main`.

## Touches
Scratch worktrees. `main`: this file and EPIC-024 row 5.

## Assumes
- **A1** — The seeded finding and its oracle are fixed at G2, before any round runs.
- **A2** — All-in spend (builds, probes, reviews, retries) is charged to the sprint's 60 USD cap, about 3 to 5 USD here. Row limits are frozen at G2; reruns are cut first.

## Tracker
EPIC-024 row 5 · TASK-632 (harness settings) · TASK-630 § Results
