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
- [ ] Step 1: TASK-628's sprint closes under the router, every command run by a worker, with the measures recorded.
- [ ] The four replay runs finish within the cap, each with USD, elapsed minutes, boxes ticked, gate verdict and review result recorded.
- [ ] The verdict is recorded in EPIC-024 row 4 by the rule above.
- [ ] Negative: no router file reaches `main` or `.claude/agents/` before a go, and no replay run merges, pushes or writes outside its scratch worktree.

## Touches
Trial branch: `agents/router.md`. `main`: this file, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 row 4 · `docs/research/router-mode.md` § Plan · TASK-628
