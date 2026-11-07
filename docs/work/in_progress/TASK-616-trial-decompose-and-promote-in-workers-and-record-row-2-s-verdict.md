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
- [x] Before any sprint work in the launched session, `/prime`'s `Skills:` row reads `live checkout`, the orchestrator's base dir is the trial worktree, `CLAUDE_CODE_AUTO_COMPACT_WINDOW` prints unset, and the kit's README reads. On a cache path, stop and relaunch with the installed plugin disabled. ✓ Live checkout at 2.21.0, orchestrator base dir `D:\Project\lean-flow-worktrees\e024-row2-trial\skills\orchestrator` (read by a one-line `haiku` probe, to keep the skill out of the measured context), window unset in Bash and PowerShell, README read in full, launch flags match the process command line.
- [ ] Decompose and promote each run through one general-purpose worker: its prompt starts `Worker contract (lean-flow):`, its model is `sonnet`, its id is recorded, and its questions return `blocked`, reach the owner by popup and resume that same id. Verify: a transcript count reading every record and deduping tools by id. Not met, thin case: decompose ran through one worker, starting with the contract, on `sonnet`, id `a8bf63684667e46ba`. It asked no questions, and promote never ran. See § Results.
- [x] The launch's conversation-only constraints reach the worker verbatim: the first intake dispatch carries the launch request's constraints, and the drafted tasks honour them. Verify: the dispatch text and drafted tasks from the transcript. ✓ The dispatch carries the owner's constraint sentence verbatim (string match on the transcript). No task was drafted; the worker ran read-only commands and wrote nothing.
- [ ] Task quality is no worse: every drafted task has an observable criterion and a `Negative:` box, and the owner's corrections to the draft are counted, each one traced to the route or not. Not exercised, thin case: no task was drafted, so there is no draft to judge. Owner corrections: 0.
- [x] The host sprint is promoted and closed on `main`, or the thin case is recorded with what was adopted and why the rest was not. ✓ Thin case, § Results.
- [x] The measures are recorded against the baselines: context after `/prime`, after decompose and at the first build step, compactions, USD per box across all agents, minutes per box, close-time gate failures, blocking review findings, owner corrections and the window state. ✓ § Results; cost and time not measured, by the thin-case ruling.
- [x] Row 2's verdict is recorded in EPIC-024 as direction (D4), by this rule: **keep** below 0.88 USD/box or below 4.1 min/box, with context after decompose at most 118k and no guard worse; **drop** if worse than both 1.41 USD/box and 6.2 min/box, if context is at or above 152k, or on a gate failure, blocking finding or owner correction traced to the route, including intent lost on the way to a worker; anything else is **inconclusive**, not shipped. In the thin case cost is not measured, so the verdict can read drop on the other conditions or inconclusive, never keep. On keep, rows 1 and 2 land on `main` in their own commit; no release here (D5). ✓ Inconclusive, owner popup 2026-11-07.
- [x] Negative: `git diff main...trial/epic-024-row2 -- skills/orchestrator/references/night-run.md` is empty, an unattended run still reads inline, no draft text reaches `main` before the verdict, and no TemiDev brand asset is added. ✓ The `night-run.md` diff is empty, the worker routes in both `SKILL.md` files still send unattended runs inline, only this file and the epic changed on `main`, and no brand asset was added.

## Results
Session `c5ea78f4-f998-4cd9-b061-ad658ba652af`. Thin case: the owner ruled by popup on 2026-11-07 to adopt nothing and read row 2 as inconclusive.

**Adopted.** Nothing. No task file was written and no sprint ran, so `/lean-doc-generator promote` was never called.

**Why the rest was not.** What the kit adds is video production: brief to delivery, voice, motion, mixing, render and export checks, in Python and Node. lean-flow's consumer installs a development workflow and has no surface that could use it. Its process ideas are already covered: independent review and bounded repair by `review-scoping.md`, stop and resume by `/handoff` and `/prime`, inspecting the artifact over its status by CLAUDE.md § edit-safety. `write-natural-copy` drafts new copy and narration, which `/humanizer` excludes by design, and SlopMonster is an English-only Python checker. The one unmatched item is the per-edge evidence record for architecture diagrams. It has one sighting and no consumer evidence, and the owner declined it by popup. Brand assets stayed out, and NOTICE.md assigns no redistribution license.

**Route.** One intake dispatch: `general-purpose`, `sonnet`, prompt starting `Worker contract (lean-flow):`, id `a8bf63684667e46ba`. Its tools were 1 `Read` and 12 `Bash`, all reading, with no writes, no `AskUserQuestion` and no redispatch. Its first report came back `ready` with no questions, so a question returned as `blocked`, carried by popup and resumed was not exercised. The owner's one popup came from the coordinator. A separate `haiku` probe read the orchestrator's base dir and is not a decompose or promote worker.

**Coordinator review.** The worker's first report wrote "derives from" where the kit says "Reviewed" and "independently authored", and it took some production references by heading only. Spot-checks from the main thread found both. One resume to the same id read those files in full; the wording changed and the verdict did not.

**Measures.**
| Measure | Trial | Baseline |
|---|---|---|
| Context after `/prime` | 97.7k | 83k median |
| Context after decompose, at the owner's popup | 129.2k, 31.5k added | 152k, 69k added |
| Context at the first build step | none, no build | n/a |
| Compactions, window | 0, unset | n/a |
| USD/box, min/box | not measured, no boxes | 0.88 to 1.41, 4.1 to 6.2 |
| Close-time gate failures | none, no close | n/a |
| Blocking findings, owner corrections | 0, 0 | n/a |

The `/prime` figure is inflated by an interrupted `/lean-doc-generator` run: at least 9.5k of reads, plus its skill text. The decompose figure is above the 118k limit and below 152k, and it is not comparable: this intake had no question round, no draft and no approval. The harness counted 101,392 subagent tokens for the worker at its last stop.

**Verdict: inconclusive, not shipped.** No drop condition fired: context stayed below 152k, with no gate failure, blocking finding or owner correction traced to the route, and no intent lost on the way to the worker. Keep is ruled out in the thin case. The promote worker and the question-and-resume round remain untested, so this says little about either. Row 2's text stays on `trial/epic-024-row2` at `65ace762`.

**Open boxes.** The two unticked boxes cannot be met in the thin case. This task stays in `in_progress` until the owner rules, because no task in `done/` carries an open box (0 of 74). EPIC-024's row 2 condition also stays unticked, because `epic-state` requires a tick to name a member sprint and row 2 has none.

**Gate on this record.** The first run failed 2 checks, both on the wording of this record in the epic: `epic-state` and `prose-density`. Neither traces to the route. Both were fixed by changing the text, not the checks.
