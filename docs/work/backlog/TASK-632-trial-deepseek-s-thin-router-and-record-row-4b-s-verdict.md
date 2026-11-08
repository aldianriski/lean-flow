---
id: TASK-632
title: "Trial DeepSeek's thin router, with one Executor per task, on the matched SPRINT-167 replay, and record row 4b's verdict"
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
---

# TASK-632 — Trial DeepSeek's thin router, with one Executor per task, on the matched SPRINT-167 replay, and record row 4b's verdict

## Why
Row 4 was a no-go, but it tested a thick router: no shell, while it kept gates, design, review and code reading (TASK-630 § Results). Its own thread fell only about 4% while worker cost rose about 3.5 times.
Codex's review, against DeepSeek's own docs and prompts, found the opposite trade in DeepSeek's design. Its main session keeps a limited shell, "makes no technical decisions" and writes routing notes of at most 30 words. One Executor per ticket owns the technical work and its follow-ups.
Owner popup, 2026-11-08: trial the faithful shape, held to the same cost bar, because the goal is still faster and cheaper with quality held.

## Approved design (owner popup, 2026-11-08; detail at G2)
- **Router.** Adapted from DeepSeek's `prompts/orchestrator.md`, `prompts/dispatch.md` and `docs/004-prompts.md`. It routes, relays G1 and G2 to the owner, keeps a shell limited to routing and bookkeeping, and reads no code. It makes no technical decision and never waits on a worker.
- **Executor.** One per task, adapted from `prompts/worker.md` and `prompts/work.md`. It reads the sources, drafts the design, builds, verifies and takes its own review and gate fixes. Questions, G2 included, go up in its report, and the router forwards them unchanged.
- **Same harness for both arms.** `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`, the gate settings passed so Git Bash does not rewrite them, and the same effective edit permission on `.claude/` for workers in both arms.
- **Replay.** SPRINT-167 from `6a7cadf2`, two ordinary runs and two thin-router runs, alternated, fresh ordinary runs under the same settings. Same go rule as row 4.
- Out: any release, pushing, `night-run`, changing the gates.

## Done when
- [ ] The router and Executor files are built on a trial branch with a table mapping each DeepSeek rule to kept, changed or dropped, with a reason. Codex reviews their fidelity against DeepSeek's files, at most 2 rounds.
- [ ] A headless probe in each arm shows the same settings in effect: `LF_GATE_DIR` arrives unchanged, a background worker outlives the main thread's last turn, and a worker may edit `.claude/CONTEXT.md`.
- [ ] The four replay runs finish within the cap, each with USD, elapsed minutes, boxes ticked, gate verdict and review result recorded, or each deviation recorded.
- [ ] The verdict is recorded in EPIC-024 row 4b. Go only if both thin-router runs cost at least 25% less than the ordinary mean, elapsed time is no worse, and every box, the gate and review pass. Anything else, including inconclusive, is no-go.
- [ ] Negative: no router or Executor file reaches `main` or `.claude/agents/` before a go, and no replay run merges, pushes or writes outside its scratch worktree.

## Assumes
- **A1** — A thin router with one Executor per task needs no change to lean-flow's skills; the agent files carry the difference. *Confirm: G2 names any skill step the router cannot route.*
- **A2** — Cap: the 62 USD left of row 4's 100 USD cap. *Confirm: owner at G1.*

## Touches
Trial branch: `agents/router.md`, `agents/executor.md`. `main`: this file, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 row 4b, D14 · TASK-630 § Results · `docs/research/router-mode.md` § Amended 2026-11-08 · `deepseek-ai/dsh-superagent-prototype`
