---
id: TASK-632
title: "Build DeepSeek's thin router and one-Executor-per-task files on a trial branch, and probe the shared harness (row 4b, build half)"
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
depends-on: []
---

# TASK-632 — Build DeepSeek's thin router and one-Executor-per-task files on a trial branch, and probe the shared harness (row 4b, build half)

## Why
Row 4 was a no-go, but it tested a thick router: no shell, while it kept gates, design, review and code reading (TASK-630 § Results). Its own thread fell only about 4% while worker cost rose about 3.5 times.
Codex's review, against DeepSeek's own docs and prompts, found the opposite trade in DeepSeek's design. Its main session keeps a limited shell, "makes no technical decisions" and writes routing notes of at most 30 words. One Executor per ticket owns the technical work and its follow-ups.
Owner popup, 2026-11-08: trial the faithful shape, held to the same cost bar, because the goal is still faster and cheaper with quality held.
Split at promote (SPRINT-170): this task builds the files and proves the harness; TASK-638 runs the four replays and records the verdict.

## Approved design (owner popup, 2026-11-08; detail at G2)
- **Router.** Adapted from DeepSeek's `prompts/orchestrator.md`, `prompts/dispatch.md` and `docs/004-prompts.md`. It routes, relays G1 and G2 to the owner, keeps a shell limited to routing and bookkeeping, and reads no code. It makes no technical decision and never waits on a worker.
- **Executor.** One per task, adapted from `prompts/worker.md` and `prompts/work.md`. It reads the sources, drafts the design, builds, verifies and takes its own review and gate fixes. Questions, G2 included, go up in its report, and the router forwards them unchanged.
- **Same harness for both arms.** `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`, the gate settings passed so Git Bash does not rewrite them, and the same effective edit permission on `.claude/` for workers in both arms.
- **Shared harness (this task owns it; TASK-638 and TASK-634 consume it).** Worktree isolation inside each run's scratch repository, with the merge-back kept inside that repository, Git metadata included. Each experiment enables only its own treatment. Everything is frozen at G2 before any run: revisions, briefs, models and effort by function, permissions, gate and review, measurement boundaries, cache policy (each run starts cold, from a fresh session) and interleaved order.
- **Replay.** SPRINT-167 from `6a7cadf2` (run by TASK-638).
- Out: any release, pushing, `night-run`, changing the gates.

## Done when
- [ ] The router and Executor files are built on a trial branch with a table mapping each DeepSeek rule to kept, changed or dropped, with a reason. Codex reviews their fidelity against DeepSeek's files, at most 2 rounds.
- [ ] A headless probe in each arm shows the same settings in effect: `LF_GATE_DIR` arrives unchanged, a background worker outlives the main thread's last turn and survives past the former 10-minute cutoff, and a worker's permitted `.claude/CONTEXT.md` edit is actually made, not only allowed. Probe logs (stream-json, stderr, gate logs) go to the operator's scratch folder, never a run's worktree or its parent.

## Assumes
- **A1** — A thin router with one Executor per task needs no change to lean-flow's skills; the agent files carry the difference. *Confirm: G2 names any skill step the router cannot route.*
- **A2** — All-in spend (builds, probes, reviews, retries) is charged to the sprint's 60 USD cap, shared with TASK-633 to 638. Row limits are frozen at G2; reruns are cut first. *Confirm: sprint decisions SD2.*

## Touches
Trial branch: `agents/router.md`, `agents/executor.md`. `main`: this file, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 row 4b, D14 · TASK-638 (replays and verdict) · TASK-630 § Results · `docs/research/router-mode.md` § Amended 2026-11-08 · `deepseek-ai/dsh-superagent-prototype`
