---
id: TASK-630
title: "Trial the router on one real task and a matched SPRINT-167 replay, and record row 4's verdict"
type: feature
epic: EPIC-024
priority: P1
size: L
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
gates_signed: G1,G2 @ 407987df
---

# TASK-630 — Trial the router on one real task and a matched SPRINT-167 replay, and record row 4's verdict

## Why
Rows 1 and 2 landed and the D12 check passed (SPRINT-168). In SPRINT-166 to 168, 60 to 69% of main-thread cost sat in shell and edit turns a router would hand to workers, about 45 to 55% of delivery cost, above the research doc's 20% bar. Only a matched replay can show whether that becomes a saving (`docs/research/router-mode.md` § Plan).

## Approved design
Owner popups, 2026-11-08: G1 and G2 signed as designed; step 1 on TASK-628; the replay rebuilds SPRINT-167, headless, gates pre-signed; release route decided when it passes.

- **Router.** `agents/router.md` on `trial/epic-024-router` (worktree `D:\Project\lean-flow-worktrees\e024-router`), loaded only by `--plugin-dir` with `--agent lean-flow:router`, never left in `.claude/agents/` (D1). Tools: Read, Glob, Grep, Agent, AskUserQuestion, SendMessage, Skill. No Bash, Edit or Write. The session model keeps gates and judgment (D6).
- **Rules.** The router runs the loop through its skills. Every command, edit, commit, gate run, tick, move and Log entry goes to a worker. Builders get the worker contract. Bookkeeping goes to one clerk worker per sprint, reused by `SendMessage`, which does only what the router orders, word for word. Fixes go back to the worker that wrote the code.
- **Step 1.** TASK-628 built under the router in an attended window, its sprint closed on `main`.
- **Replay.** SPRINT-167 rebuilt from `6a7cadf2` (G1 and G2 signed, builder checks logged): two ordinary runs and two router runs. Both arms load the same `main` skills, so the router is the only difference.
  Each run is `claude -p` in its own scratch worktree with its own `LF_GATE_DIR`, one at a time, never merged or pushed. A HITL question takes the recommended option and is logged, the same in both arms.
- **Cap.** 100 USD across step 1 and the four runs; stop at the cap and record what was measured.
- Out: any release, pushing, `night-run`.

Verdict rule, set before the run:
- **Go:** both router runs cost at least 25% less than the ordinary runs' mean, elapsed time is no worse, and every box, the gate and review pass in both router runs.
- **No-go:** anything else, including inconclusive.

## Done when
- [x] The router is built on the trial branch, Codex reviews it (at most 2 rounds), and the off-host gate passes on its head. ✓ `c234911e`: Codex R1 NOT CLEAR (two High, one Med, all fixed), R2 CLEAR; `bun test` 589 pass, 0 fail; `QA-CHECK: 487 pass, 0 fail`.
- [x] A probe shows the router refusing a shell command and a file write while a worker it dispatches does both. ✓ Headless on a scratch repo, `f898802d`, 0.16 USD: `NO_SHELL` and `NO_WRITE`, no `a.txt` or `b.txt`; a `haiku` worker wrote `c.txt` and `d.txt`. R2 only added plan-mode tools, which write nothing.
- [x] Step 1: TASK-628's sprint closes under the router, every command run by a worker, with the measures recorded. ✓ SPRINT-169 closed under the router at 121b89a8 (record a4140fd0): main thread 0 shell, edit or write calls; measures in EPIC-024's SPRINT-169 row and the archived Retro
- [x] The four replay runs finish within the cap, each with USD, elapsed minutes, boxes ticked, gate verdict and review result recorded. ✗ **Not met as written; closed by owner ruling as a deviation**, 2026-11-08.
  O1 and O2 completed. R1 and R2 died headless at 14 minutes. R1b was relaunched with a setting O1 and O2 lacked, and completed. The owner stopped R2b once R1b had fixed the verdict. Measures and deviations in § Results.
- [x] The verdict is recorded in EPIC-024 row 4 by the rule above. ✓ **No-go**: EPIC-024 row 4 and D14. Codex reviewed the verdict and its framing before it was recorded.
- [x] Negative: no router file reaches `main` or `.claude/agents/` before a go, and no replay run merges, pushes or writes outside its scratch worktree. ✓ `main` has no `agents/` and no `.claude/agents/`; the router file is only on `trial/epic-024-router` and in the router arm's scratch plugin folder.
  No replay commit is on any local or remote branch. One slip: O1 wrote a gate log to the worktrees' parent folder and deleted it at once, recorded in its own Log.

## Results
SPRINT-167 rebuilt from `6a7cadf2`, headless, same prompt and pinned skills in both arms. USD is billed `total_cost_usd`; the operator's token-times-price figure is in brackets and ran 3 to 11% above it.

| Run | Arm | Outcome | USD | Wall min | Main peak |
|---|---|---|---|---|---|
| O1 | ordinary | 11/11, gate green, closed | 4.37 (4.51) | 28 | 176k |
| O2 | ordinary | 11/11, gate green, closed | 3.37 (3.47) | 19 | 150k |
| R1 | router | died at 14 min | 1.16 (1.29) | 14 | 50k |
| R2 | router | died at 14 min; a worker was denied Edit on `.claude/CONTEXT.md` | 1.66 (1.77) | 14 | 89k |
| R1b | router, relaunched | 11/11, gate green, reviews first round, closed | 4.94 (5.32) | 40 | 168k |
| R2b | router, relaunched | stopped by the owner before a commit | (0.65) | 1 | 65k |

- **Verdict: no-go.** The bar was at most 2.90 USD and no slower than the ordinary runs. R1b cost 28% more than the ordinary mean of 3.87 and took 70% longer, worse than either ordinary run alone.
- **Where the money went.** The router's own thread fell only about 4% (3.26 against a 3.40 mean), and worker cost rose about 3.5 times (2.06 against 0.60). It still read 45 times itself and took in every worker's report.
- **The forecast was wrong in principle.** That 60 to 69% of main-thread cost sat in shell and edit turns did not mean that cost leaves with the tools: the coordinator still reads, decides, dispatches and reads results.
- **Step 1** (SPRINT-169, attended, 3 boxes): 12.3 to 13.6 USD, 4.1 to 4.5 USD/box, 19.4 min/box on this epic's basis; router main 7.2 USD at a 293k peak. Unmatched, so direction only.
- **Deviations.** R1 and R2 died because headless print mode stops background workers 10 minutes after the main thread's last turn, and the router ended its turns waiting.
  R1b and R2b ran with `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`; O1 and O2 did not. R1b's two builds shared one tree. Both arms hit the same `LF_GATE_DIR` rewrite and fixed it inline. One router run completed, so spread is unknown.
- **No leak.** No run read `main` or the finished solution; plugin-folder reads were the orchestrator's own references.
- **Scope (Codex review).** This rejects the router as built, a thick one: no shell, but it kept gates, design, review and code reading. It says nothing about DeepSeek's design.
  DeepSeek's router keeps a limited shell, makes no technical decisions and writes routing notes of at most 30 words; one Executor per ticket owns the technical work. Its own benchmark traded tokens for time (23.2M cache reads against 10.8M).
- **Spend:** about 38 USD of the 100 USD cap (the router window, step 1 and launching, 21.5; the six runs, 16.2).
- **Next:** the faithful shape gets its own trial, EPIC-024 row 4b, TASK-632, held to the same cost bar (owner popup, 2026-11-08).

## Touches
Trial branch: `agents/router.md`. `main`: this file, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 row 4 · `docs/research/router-mode.md` § Plan · TASK-628
