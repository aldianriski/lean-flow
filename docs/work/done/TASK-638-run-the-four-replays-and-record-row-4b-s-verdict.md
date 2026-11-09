---
id: TASK-638
title: "Run the four SPRINT-167 replays, two ordinary and two thin-router, and record row 4b's verdict"
type: feature
epic: EPIC-024
sprint: SPRINT-170
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: [TASK-632]
---

# TASK-638 — Run the four SPRINT-167 replays, two ordinary and two thin-router, and record row 4b's verdict

## Why
Second half of row 4b, split from TASK-632 at promote (SPRINT-170) because the whole was size L. TASK-632 builds the thin router and Executor files and proves the shared harness; this task runs the matched replay with them and records the verdict, held to row 4's cost bar.
The two ordinary runs are the shared baseline: TASK-634 consumes them, and an invalid baseline run voids both verdicts.

## G2 (signed 2026-11-09)
Batch G2 signed for SPRINT-170: the design is the SPRINT-170 Execution Log entry "2026-11-09 | gate | G2 batch signed" (its draft section for this task, as amended by its settlements S0 to S36, which win on any conflict).

## Done when
- [x] The four replay runs of SPRINT-167 from `6a7cadf2`, two ordinary and two thin-router, alternated, each starting cold from a fresh session on the settings TASK-632's G2 froze, finish within the sprint cap. Each records USD, elapsed minutes, boxes ticked, gate verdict and review result, or each deviation is recorded. Each run builds both tasks in worktrees inside its own scratch repository and merges both back; an ordinary run that misses any of the 11 boxes, the gate, the review or either merge-back is invalid. ✓ 3 of 4 run, R2 skipped by owner exception (S12, scope-change logged 2026-11-09): O1 3.849 USD / 42.0 min, R1 2.658 / 72.7, O2 4.319 / 53.7; all 11/11 boxes, gate green in-run and on the operator rerun (qa-check 472/0), two scoped reviews, both merge-backs inside the scratch repo; T2 row 10.83 of 20 USD.
- [x] Each router run is audited for the router's tool use, unchanged relays and Executor identity. ✓ R1: no Glob/Grep/Edit/Write/Skill, no read outside the allowlist, Bash only bookkeeping and `git merge`; one Executor per task plus close, follow-ups to the same id; one question relayed with the Executor's own recommendation. Judgment note: one follow-up reasoned about the gate's review-depth check.
- [x] The verdict is recorded in EPIC-024 row 4b. Go only if both thin-router runs cost at least 25% less than the ordinary mean, elapsed time does not exceed the ordinary mean, and every box, the gate and review pass. Missing evidence, a treatment violation, drift, an abort or an incomplete sample cannot yield a go. Anything else, including inconclusive, is no-go. ✓ **no-go**: cost passes (R1 2.70 by the reading against a pass, bar 0.75 × 4.05 = 3.04) but time fails (72.7 min against the 47.85 ordinary mean). EPIC-024 row 4b and its Closed-when line updated.
- [x] Negative: no router or Executor file reaches `main` or `.claude/agents/` before a go, and no replay run merges outside its own scratch repository, pushes, or writes outside it. Harness logs go to the operator's scratch folder only, never a run's worktree or its parent. ✓ no router or Executor file on `main` or in `.claude/agents/` (they live on `trial/epic-024-thin-router` only); every run's merges stayed in its scratch clone (no remote, push denied); main-repo and worktrees-folder snapshots changed only by coordinator actions, checked by ref and creation time; harness logs in operator scratch.

## Assumes
- **A1** — The replay set-up of TASK-630 § Results is reusable: worktrees `D:\Project\lean-flow-worktrees\replay-*`, VPS gate dirs `~/lf-gate-*`, `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`, gate settings passed so Git Bash cannot rewrite them, and a replay prompt that allows worktree isolation inside each run's scratch repository. *Confirm: G2 recon (the VPS dirs were not checked).*
- **A2** — All-in spend is charged to the sprint's 60 USD cap, shared with TASK-632 to 637. Row limits are frozen at G2; reruns are cut first. *Confirm: sprint decisions SD2.*

## Touches
Scratch worktrees; the trial branch's `agents/*.md` (read only). `main`: this file, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 row 4b, D14 · TASK-632 (files, harness, settings freeze) · TASK-634 (consumes the ordinary runs) · TASK-630 § Results

## Results

**Row 4b: no-go** (2026-11-09, SPRINT-170). The thin router is cheaper but slower.

| Run | Arm | USD (stream / cost rows) | Minutes | Boxes | Gate at close | Merges |
|---|---|---|---|---|---|---|
| O1 | ordinary | 3.849 / 3.8 | 42.0 | 11/11 | 589/0 · 472/0 | 2 |
| R1 | thin router | 2.658 / 2.7 | 72.7 | 11/11 | 589/0 · 472/0 | 3 (incl. close) |
| O2 | ordinary | 4.319 / 4.3 | 53.7 | 11/11 | 589/0 · 472/0 | 2 |
| R2 | thin router | not run (S12) | | | | |

- Go rule, with the readings that work against a pass: ordinary mean 4.05 USD, bar 3.04; R1 2.70 passes cost. Time mean 47.85 min; R1 72.7 fails. R2 cannot change the outcome, so it was skipped by the owner's pre-recorded exception.
- Likely why slower (an inference from R1's stream, not measured): the router relays every step through `SendMessage` round trips (8), and each Executor runs its own `/orchestrator sprint-bulk`, reviewer dispatch and merge-check in sequence, so work the ordinary coordinator overlaps is serialised. The cost saving matches DeepSeek's claim (main thread stays small); its own docs trade tokens for time, the opposite of what this bar asks.
- Deviations: the coordinator's mistaken local `bun test` (about 125 s) during R1's first 2.5 minutes can only have lengthened R1. One router follow-up reasoned about a gate check (judgment note, audit above).
