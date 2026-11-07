---
id: TASK-616
title: "Trial decompose and promote in workers on one real sprint and record row 2's verdict"
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
gates_signed: G1,G2 @ 396cc47c
---

# TASK-616 — Trial decompose and promote in workers on one real sprint and record row 2's verdict

## Why
EPIC-024 row 2. `/prime` leaves the main thread at 83k and decompose takes it to 152k before any build, because all planning reads happen there. Row 1 did not shrink that, and it was not meant to. This row tests moving those reads into a worker.

## Approved design
Run from `trial/epic-024-row2` in worktree `D:\Project\lean-flow-worktrees\e024-row2-trial`, a child of `trial/epic-024-row1` with `main` merged, so row 1 is in place and the epic's `32ac2f42` stays where it is. Row 2's four files come from `prep/epic-024-row2`. That branch's `task-decomposer/SKILL.md` predates SPRINT-164 and drops its Negative-box rule, so the rule is kept and only row 2's lines are applied.

The host is the first of three pieces of owner work on `D:\Research\video_maker\TemiDev-Video-Kit-v1.1.0`: adopt, then improve the kit, then make a video. Only adopt hosts this row, because it runs in this repo and the context baselines were measured here. The trial's decompose works out what the kit adds beyond lean-flow's skills (ADR-001, L-017), so no host task is written before the launch.

The session starts from `D:\Project\lean-flow` with `claude --plugin-dir D:\Project\lean-flow-worktrees\e024-row2-trial --add-dir D:\Research\video_maker\TemiDev-Video-Kit-v1.1.0` and the window unset. Its work and commits go to `main`. The kit is read as data and nothing runs from it. This task is not a member of the host sprint, so it is ticked after that sprint closes.

Owner rulings, 2026-11-07, by popup. Scope as above; out: rows 3 on, any release, improving the kit, making the video, TemiDev brand assets. Intake and promote workers name Sonnet; the coordinator's review stays on the session model (D6). Claude workers build, for this sprint only, so row 1's contract stays in place. If little clears the bar, adopt only that, record the context number, report cost as not measured and add no padding tasks. NOTICE.md assigns no redistribution license, so shipping anything from the kit needs a separate ruling.

Baselines, on the epic's basis from row 2 on: 0.88 to 1.41 USD/box from promote to last sprint commit, and 4.1 to 6.2 min/box from merged activity (SPRINT-139, 140, 146). Context 83k after `/prime` (median of 10), 152k after decompose (one session, other work). The 118k limit below is half of the 69k that decompose adds.

## Done when
- [x] The trial branch differs from `main` in exactly seven files: row 1's three and row 2's four, with both `SKILL.md` files within cap. Verify: `git diff --stat main...trial/epic-024-row2`; `wc -l`. ✓ `65ace762`: seven files; `task-decomposer` 138 lines, `lean-doc-generator` 140.
- [x] The off-host gate passes on the trial head. Verify: `bun --no-env-file scripts/gate-remote.ts`, run from the trial worktree. ✓ `65ace762`: `bun test` 589 pass, 0 fail; `QA-CHECK: 454 pass, 0 fail`.
- [x] Codex reviews the worker route, at most 2 rounds, findings fixed or ruled. ✓ R1 `VERDICT: clear` on `03cb2f6d`, and its log shows it read all four files. `65ace762` afterwards only adds the owner's model line, which was out of that review's scope.
- [ ] Before any sprint work in the launched session, `/prime`'s `Skills:` row reads `live checkout`, the orchestrator's base dir is the trial worktree, `CLAUDE_CODE_AUTO_COMPACT_WINDOW` prints unset, and the kit's README reads. On a cache path, stop and relaunch with the installed plugin disabled.
- [ ] Decompose and promote each run through one general-purpose worker: its prompt starts `Worker contract (lean-flow):`, its model is `sonnet`, its id is recorded, and its questions return `blocked`, reach the owner by popup and resume that same id. Verify: a transcript count reading every record and deduping tools by id.
- [ ] The launch's conversation-only constraints reach the worker verbatim: the first intake dispatch carries the launch request's constraints, and the drafted tasks honour them. Verify: the dispatch text and drafted tasks from the transcript.
- [ ] Task quality is no worse: every drafted task has an observable criterion and a `Negative:` box, and the owner's corrections to the draft are counted, each one traced to the route or not.
- [ ] The host sprint is promoted and closed on `main`, or the thin case is recorded with what was adopted and why the rest was not.
- [ ] The measures are recorded against the baselines: context after `/prime`, after decompose and at the first build step, compactions, USD per box across all agents, minutes per box, close-time gate failures, blocking review findings, owner corrections and the window state.
- [ ] Row 2's verdict is recorded in EPIC-024 as direction (D4), by this rule: **keep** below 0.88 USD/box or below 4.1 min/box, with context after decompose at most 118k and no guard worse; **drop** if worse than both 1.41 USD/box and 6.2 min/box, if context is at or above 152k, or on a gate failure, blocking finding or owner correction traced to the route, including intent lost on the way to a worker; anything else is **inconclusive**, not shipped. In the thin case cost is not measured, so the verdict can read drop on the other conditions or inconclusive, never keep. On keep, rows 1 and 2 land on `main` in their own commit; no release here (D5).
- [ ] Negative: `git diff main...trial/epic-024-row2 -- skills/orchestrator/references/night-run.md` is empty, an unattended run still reads inline, no draft text reaches `main` before the verdict, and no TemiDev brand asset is added.
