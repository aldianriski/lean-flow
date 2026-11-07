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
- [x] The host sprint is promoted with TASK-614 and TASK-615 as its members. ✓ SPRINT-165, `plan_commit 6b12630a`, closed `b63a9acc`.
- [x] Before any sprint work in the launched session, `/prime`'s `Skills:` row reads `live checkout`, the orchestrator's printed base dir is the trial worktree, and `CLAUDE_CODE_AUTO_COMPACT_WINDOW` prints unset. On a cache path, stop and relaunch with the installed plugin disabled. ✓ `2.21.0 live checkout → fresh`, base dir under `e024-trial`, window unset; the transcript's `prime`, `orchestrator` and `lean-doc-generator` base dirs all sit under `e024-trial`.
- [x] Every build dispatch in the sprint's main thread carries the first line `Worker contract (lean-flow):` and a set `model`, every miss named. Other dispatches' model share is reported; `/code-review` and `/council` children are excluded and named. Verify: a transcript count reading every record and deduping tools by id, result in the Log. ✓ 2 of 2, no miss; result in § Results below, since the Log was archived before this count ran.
- [x] TD-298's stub-home question comes back from its builder as `blocked`, reaches the owner by AskUserQuestion, and the answer returns through SendMessage to the same agent id. Verify: the id and turns from the transcript, in the Log. ✓ `a7068354b1a6cc1d6`; the Log holds the id and returns, § Results holds the turns.
- [x] The trial session's measures are recorded against the baselines: USD per box across all agents, active minutes per box, context after `/prime` and at the first build step, compactions, close-time gate failures, blocking review findings, owner corrections, and the window state. ✓ § Results. USD is an estimate, because the session's cost row is written only when it exits.
- [x] Row 1's verdict is recorded in EPIC-024 as direction (D4), by this rule: **keep** below 1.27 USD/box or below 6.4 min/box with no guard worse; **inconclusive** inside the band; **drop** if worse on both, or on a gate failure, blocking finding or owner correction traced to the brief. The verdict says the blocked question was planned. On keep, the three files land on `main` in their own commit; no release here (D5). ✓ **Inconclusive**, by owner ruling (popup, 2026-11-07), though the rule's numbers as written read keep; § Results says why. The three files stay on the trial branch.
- [x] Negative: `git diff main...trial/epic-024-row1 -- skills/orchestrator/references/night-run.md` is empty, and no draft text reaches `main` before the verdict. ✓ Empty; `main` has no `worker-brief.md` and no `Worker contract (lean-flow)` under `skills/`.

## Results
Session `7f3a9c12-4b6e-4d81-9a25-6e1c0b7d2f40`, 72 main-thread messages, 105 tools.

**Dispatches.** 5 `Agent` calls, and 5 subagent transcripts agree. Build: 2 of 2 start with the contract, verbatim against `worker-brief.md`, model `sonnet`, no isolation: T1 `a7068354b1a6cc1d6`, T2 `ad846f93816158134`, each with its `worker ·` Log line. Other: 3 of 3 name `sonnet` and carry no brief, 2 builder-check readers and 1 reviewer. No `/code-review` or `/council` children: the only `Skill` calls are `prime`, `orchestrator` and `lean-doc-generator`. Codex ran through `codex exec`, not `Agent`.

**The question.** T1 dispatched at message 34. Return 1, `blocked`, 01:32:30 UTC, no edit made. Popup at message 38, answered 01:33:06. `SendMessage` to the same id at message 40, 01:33:26; first edit 01:35:14. This one was planned. Return 2, `blocked`, 01:42:48, was not planned: the classifier denied the builder's nested `claude -p`, the builder did not work around it, and the owner approved three runs launched by the coordinator (L-293). Return 3, `ready`.

**Cost**, 10 boxes (`docs/sprint/INDEX.md`; both member files count 5 ticked).
| Basis | SPRINT-139 | SPRINT-140 | SPRINT-146 | SPRINT-165 |
|---|---|---|---|---|
| Whole session, USD/box, as the rule states it | 1.27 | 1.46 | 1.40 | 1.14 to 1.19 |
| Promote to last sprint commit, USD/box | 1.14 | 1.41 | 0.88 | 1.09 to 1.14 |

SPRINT-165 is tokens times fitted price, two price tables, main 7.3 to 7.8 USD and workers 2.5, plus the proof's 1.65 USD from its own three cost rows. That method lands within 6% of the three baselines' cost rows. Without the proof, the second row reads 0.92 to 0.97. Each baseline session also decomposed its sprint, and two of them ran work after it; TASK-614 and 615 were filed in another session and SPRINT-165 had no release. So only the second row compares like with like. Codex spend is in neither row.

**Time**, min/box.
| Basis | SPRINT-139 | SPRINT-140 | SPRINT-146 | SPRINT-165 |
|---|---|---|---|---|
| Sum of `turn_duration`, as the baselines were taken | 6.4 | 6.7 | 16.8 | 9.0 |
| Merged main and worker activity, gaps over 5 min dropped | 4.3 | 4.1 | 6.2 | 4.9 |

The first row overcounts: some turns report a duration longer than the time since the previous turn ended. SPRINT-165's last turn reports 66.4 min, its whole session; 45.3 of its 89.8 min are that overlap. The baselines overcount the same way, by 150 to 249 min. The second row is 48.7 min, and the session's wall clock is 66 min.

**Context.** 74k after `/prime` (median 83k), 241k at the first build step (160k on SPRINT-164 under a 200k window), peak 340k. 0 compactions, window unset. Row 1 did not shrink the coordinator, and it was not built to: rows 2 and 3 aim at size.

**Guards.** Gate failures: 2 on the first full gate, on `4d97cb53`; system verify then passed on its first run. Baselines' first system verify: 3, 1 and 2. Inside the range by count, worse per box. Neither traces to the contract's text. T2's typecheck failure came from assignment text below the contract that named no leg (L-262, count 2 before this sprint, 3 after), and the other from the coordinator's own Log entry (L-234). Blocking findings: Codex R1, 2 on T1, R2 clear; the baselines ran up to 4 rounds, not counted per finding. Owner corrections: 0; every popup took the recommended option. The tally fell from 504 to 460 with the 26 task-file deletions in `d0a9752a`. `scripts/` and `evals/` are identical between those two heads, so no check was edited, but which rows went is still untraced.

**Limits.** One 10-box sprint against 18 to 45, and different work. Direction, not proof (D4). The launch loaded the checkout on Claude Code 2.1.319, one interactive run against L-277's two.

## Touches
Trial branch: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/dispatch.md` · `skills/orchestrator/references/worker-brief.md`. `main`: `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Assumes
- A 2 to 3 task sprint will likely land inside the band; the owner ruled knowing that. Inconclusive means not shipped.

## Tracker
EPIC-024 row 1 · `docs/research/router-mode.md`
