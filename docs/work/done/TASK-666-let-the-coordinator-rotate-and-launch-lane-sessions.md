---
id: TASK-666
title: "Let the coordinator rotate and launch lane sessions"
type: feature
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
sprint: SPRINT-178
state: ready
depends-on: []
---

# TASK-666 — Let the coordinator rotate and launch lane sessions

## Why

The 2026-11-14/15 four-lane run measured ~480k average context over ~24h per long session, with subagents at 3-6% of those sessions' cost; lean-flow has no lane lifetime or context ceiling. Codex-reviewed (NOT CLEAR, corrections accepted): 200k is a starting target to trial and re-measure, not an optimum.

## Done when

- [x] **Exercised first (L-007).** On real input, with a throwaway lane and coordinator, a `claude --bg "<lane brief>"` launch is run. A lane finishes a task, writes `/handoff` and sends "rotate me `<handoff path>`". The coordinator runs `claude stop <old>` and `claude --bg "<brief + handoff path>"`, and the fresh lane `/prime`s and continues. Results recorded for: (a) the `--bg` launch; (b) cross-session `SendMessage` reaching a `--bg` session; (c) an `AskUserQuestion` popup after `claude attach <id|name>`; (d) the new session name logged. Not done while any of (a) to (d) is unrecorded. On failure the recorded fallback is that the owner opens the fresh lane in a terminal with the same brief, and the text is written with that fallback. ✓ run 2026-11-16 on probe-1 → probe-4: (a) launch, (b) SendMessage + pong, (c) owner attach answered Yes from a real terminal, (d) stop + --bg relaunch, ids/names logged (Log, a6055538)
- [x] coordinator.md gains a short "Lane rotation" section: the lane acts only at a task boundary, because a session cannot see its own context size; 200k is the coordinator's and owner's target (it reads a lane's transcript usage or the owner's status line), overridable by the host CONTEXT line `lane-context-ceiling: <tokens>` or the lane brief; above 200k mid-task the lane finishes its coherent step and is then rotated; the `claude --bg` / `agents` / `attach` / `logs` / `stop` route is named as CLI-version-dependent, with the fallback; rotating an existing lane needs no popup. ✓ coordinator.md § 8 Lane rotation; Codex R1 Med (initiator split) fixed, R2 CLEAR
- [x] coordinator.md §2 "Launching a lane" gains the coordinator-launch route: the coordinator proposes a brand-new lane (stream, sprint, worktree, why) in one popup, and on the owner's yes launches it with `claude --bg`. That popup yes is the authority for a new lane. ✓ § 2 one-popup launch paragraph
- [x] The §2 lane brief gains one line: "ceiling `<n>` (default 200k); at a task boundary write `/handoff` and send 'rotate me `<handoff path>`'". ✓ § 2 brief bullet, exact text
- [x] Coordinator self-rotation is advisory, not a gate: at a checkpoint it writes `/handoff` and hands to a successor, or tells the owner one line: `/clear`, then `/prime` and the handoff path. ✓ § 8 last-but-one bullet
- [x] handoff "When to invoke" and flow step 6 use the same number, replacing "context budget low". The CONTEXT Streams rule points here. A `grep` shows the number and route agree across coordinator.md, handoff SKILL.md, flow SKILL.md and CONTEXT. ✓ grep 200k 4/4 and Lane rotation 4/4; CONTEXT Streams pointer net-zero (doc-caps 12679 ≤ 12691, 150/150)
- [x] Negative: a lane is never rotated or stopped mid-step; a task is never blocked waiting on a rotation; no ledger field, checker or poller is added. ✓ § 8 text; diff lists only the 5 Layers files, no script/hook/ledger

## Touches

`skills/orchestrator/references/coordinator.md` (§2 and a new section), `skills/handoff/SKILL.md`, `skills/flow/SKILL.md`, `.claude/CONTEXT.md`, `CHANGELOG.md` ([Unreleased] bullet).

## Assumes

- Claude Code 2.1.325 CLI per `claude --help`, read 2026-11-16.
- 200k is a trial target, re-measured by TASK-668.
- **open (unverified, settled by the first box):** `--bg` sessions receive `SendMessage` and support popups once attached.

## Tracker

Owner intent 2026-11-16; memory note lane-token-cost-is-session-length.
