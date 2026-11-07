---
id: TASK-613
title: "Trial the worker contract and dispatch standard on one real sprint and record row 1's verdict"
type: feature
epic: EPIC-024
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
gates_signed: G1,G2 @ 3783d320
---

# TASK-613 — Trial the worker contract and dispatch standard on one real sprint and record row 1's verdict

## Why
EPIC-024 row 1. 90 of 327 dispatches over 14 days named no model, and `dispatch.md` defines no worker report states or route for a worker's question. The draft has not run on real work.

## Approved design
Run from a trial branch, not `main`: `trial/epic-024-row1` from `main` in worktree `D:\Project\lean-flow-worktrees\e024-trial`, taking only `skills/orchestrator/SKILL.md`, `references/dispatch.md` and `references/worker-brief.md` from 9e9b5804. `prep/epic-024-row1` differs from `main` in five other skill files, so launching from it would run stale skills, and a `drop` costs no revert.

Two edits on the branch. The draft's "every dispatch pastes" becomes: every dispatch names its model; every **build** dispatch pastes the brief. Recon, builder-check readers and review passes get no brief, since its text does not fit them and Explore and Plan cannot be resumed. `dispatch.md` gains one sentence for the record: one Execution Log line per build dispatch, `worker · Tn · <agent id> · <model> · <isolation or none>`, which survives compaction and `/handoff`; outside a sprint it stays in the conversation. No new file, field or checker (ADR-053 basis: measured cost, the 90 of 327). Isolation takes no new rule; `dispatch.md` § Worktree dispatch protocol already rules it.

The host sprint runs in a session started from `D:\Project\lean-flow` with `claude --plugin-dir D:\Project\lean-flow-worktrees\e024-trial` and the window unset; its work and commits go to `main`. This task is not a member of that sprint: a non-sprint commit during a sprint fails its close check, so items 6 to 9 are ticked after it closes. Docs say the checkout replaces the installed plugin; L-277 measured the opposite twice in interactive runs, hence item 5.

Owner rulings, 2026-11-07: scope, Claude as builder for this sprint only, the bundle as one change under D2, the share, the record, the verdict rule, the planted question. builder-check · row 1 · 4 contradictions · 5 questions · facts and contradictions settled here, intent ruled by the owner.

Baselines, session-cost USD over `docs/sprint/INDEX.md` boxes, active minutes from `turn_duration`, with the limit beside each. No window: SPRINT-139 1.27 USD/box, 6.4 min/box; SPRINT-140 1.46, 6.7; SPRINT-146 1.40, 16.8; SPRINT-133 to 151 about 1.7. `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000`: SPRINT-164 1.03, 4.9, 160k at the first build step, 6 compactions at 168k to 174k; built inline, so not comparable on builds.

## Done when
- [x] The trial branch differs from `main` in exactly the three files, with both edits, and `SKILL.md` stays within its cap. Verify: `git diff --stat main...trial/epic-024-row1`; `wc -l`. ✓ `32ac2f42`: the three files only, 140 lines. The verify now uses three dots, since `main` moves on during the trial.
- [x] The off-host gate passes on the trial head. Verify: `bun --no-env-file scripts/gate-remote.ts`, run from the trial worktree in a one-call subshell because it ships HEAD, prints both stage lines with 0 fail and exits 0. ✓ `32ac2f42`: `QA-CHECK: 504 pass, 0 fail`, `bun test` 589 pass, 0 fail. Two earlier runs failed prose-density, 14 dense lines against a baseline of 13; a repeated sentence was deleted.
- [x] Codex reviews the two edits and the final diff, at most 2 rounds, findings fixed or ruled. ✓ R1 two findings, both fixed in `72f4e2d1` (the Log line gets its own `progress` entry; a host with no resume gets a route); R2 CLEAR. `32ac2f42` afterwards only deletes one sentence.
- [ ] The host sprint is promoted with TASK-614 and TASK-615 as its members.
- [ ] Before any sprint work in the launched session, `/prime`'s `Skills:` row reads `live checkout`, the orchestrator's printed base dir is the trial worktree, and `CLAUDE_CODE_AUTO_COMPACT_WINDOW` prints unset. On a cache path, stop and relaunch with the installed plugin disabled.
- [ ] Every build dispatch in the sprint's main thread carries the first line `Worker contract (lean-flow):` and a set `model`, every miss named. Other dispatches' model share is reported; `/code-review` and `/council` children are excluded and named. Verify: a transcript count reading every record and deduping tools by id, result in the Log.
- [ ] TD-298's stub-home question comes back from its builder as `blocked`, reaches the owner by AskUserQuestion, and the answer returns through SendMessage to the same agent id. Verify: the id and turns from the transcript, in the Log.
- [ ] The trial session's measures are recorded against the baselines: USD per box across all agents, active minutes per box, context after `/prime` and at the first build step, compactions, close-time gate failures, blocking review findings, owner corrections, and the window state.
- [ ] Row 1's verdict is recorded in EPIC-024 as direction (D4), by this rule: **keep** below 1.27 USD/box or below 6.4 min/box with no guard worse; **inconclusive** inside the band; **drop** if worse on both, or on a gate failure, blocking finding or owner correction traced to the brief. The verdict says the blocked question was planned. On keep, the three files land on `main` in their own commit; no release here (D5).
- [ ] Negative: `git diff main...trial/epic-024-row1 -- skills/orchestrator/references/night-run.md` is empty, and no draft text reaches `main` before the verdict.

## Touches
Trial branch: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/dispatch.md` · `skills/orchestrator/references/worker-brief.md`. `main`: `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Assumes
- A 2 to 3 task sprint will likely land inside the band; the owner ruled knowing that. Inconclusive means not shipped.

## Tracker
EPIC-024 row 1 · `docs/research/router-mode.md`
