---
id: TASK-617
title: "Trial rows 1, 2 and 3 together on one real sprint and record the verdict"
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
gates_signed: G1,G2 @ a20b4879
---

# TASK-617 — Trial rows 1, 2 and 3 together on one real sprint and record the verdict

## Why
Rows 1 and 2 each read inconclusive on work too small to show a difference, and row 2's promote worker and question round have not run in this repo. The owner ruled to test the small coordinator as a whole, then rule on the router from the result (epic D11).

## Approved design
Run from `trial/epic-024-bundle` at `e485a7cc` in worktree `D:\Project\lean-flow-worktrees\e024-bundle`: rows 1 and 2 with main merged, plus row 3. Row 3 was built by Codex from a clean base and reviewed by Claude; the `## Stack` search was checked on six fixtures, the real overview and the template.

The host brings evidence-backed architecture diagrams into lean-flow from `present-system-architecture` in `D:\Research\video_maker\TemiDev-Video-Kit-v1.1.0\skills`. Out: the router, any release, motion, video and Archify parts, TemiDev assets. Decompose settles whether this is a new skill or part of `lean-doc-generator`. Claude workers on Sonnet build.

The session starts from `D:\Project\lean-flow` with the plugin loaded from the trial worktree, the kit's skills folder added, and the window unset. Its commits go to `main`. This task is not a sprint member and is ticked after the sprint closes. The launch check is read from the transcript afterwards, so it adds nothing to the measured context.

Baselines, on the epic's basis: 0.88 to 1.41 USD/box and 4.1 to 6.2 min/box (SPRINT-139, 140, 146). Context 83k after `/prime` (median of 10), 152k after decompose (one session). The 75k limit assumes `/prime` skips 38.5 KB, roughly 10k tokens, an estimate.

## Done when
- [x] The trial branch holds rows 1, 2 and 3 and the off-host gate passes. ✓ `e485a7cc`: `bun test` 589 pass, 0 fail; `QA-CHECK: 456 pass, 0 fail`.
- [x] The transcript shows the skills loaded from `e024-bundle`, the window unset, and `/prime` reading neither `CONTEXT.md` nor the architecture map in full. ✓ Every skill's base dir is under `D:\Project\lean-flow-worktrees\e024-bundle\skills`, the main thread ran `claude-opus-5-5` with 0 compactions up to a 313k peak, and `/prime` made 0 Reads of either file and one `^## Stack\b` Grep count.
- [x] Decompose and promote each run through one `sonnet` worker whose prompt starts `Worker contract (lean-flow):`. Questions return `blocked`, reach the owner by popup and resume the same id. This settles TASK-616's two open boxes. ✓ Intake `aa28700f581622085`: 3 questions, one popup, resumed by `SendMessage`, then resumed again to write on `approve`. Promote `af7065ab458cd9a7a`: blocked at the governance checkpoint, 4 questions, one popup, resumed the same id.
- [x] Every build dispatch starts with the contract and sets a model, every miss named. ✓ 3 of 3: T1 `a34e7ffcc26c3523b`, T2 `a860ebe0063fb1379`, T3 `a55141039455ea464`, all `sonnet`, each with its `worker ·` Log line. No miss.
- [x] Each drafted task has an observable criterion and a `Negative:` box. Owner corrections are counted and traced to the bundle or not. ✓ TASK-618, 619 and 620 each carry one `Negative:` box and checks run on real input. Owner corrections: 0, every popup took the recommended option. One wrong premise, not traced: see § Results.
- [x] No stage misses a fact `/prime` used to load. Any miss is named, with the stage and the fact. ✓ One miss, named: the orchestrator stage never read `.claude/CONTEXT.md` § Gates, so it missed the commit-subject rule and the review-depth vocabulary. See § Results.
- [x] The measures are recorded: context after `/prime`, after decompose and at the first build step, compactions, USD and minutes per box, close-time gate failures and blocking findings. ✓ § Results.
- [x] The verdict is recorded in EPIC-024 as direction (D4). **Keep:** below 0.88 USD/box or below 4.1 min/box, context at most 75k after `/prime` and 118k after decompose, no guard worse. **Drop:** worse than both 1.41 USD/box and 6.2 min/box, context at or above 83k after `/prime` or 152k after decompose, or a gate failure, blocking finding or owner correction traced to the bundle, including a stage missing a fact `/prime` used to load. Otherwise **inconclusive**, not shipped. ✓ Drop, owner popup 2026-11-08, recorded in EPIC-024 row 3.
- [x] On keep, rows 1 to 3 land on `main` in their own commit, then the clean-install and no-agent checks run before any release (D5). Whatever the verdict, the owner then rules on the router. ✓ Not keep, so nothing landed. Router: owner popup 2026-11-08, row 4 waits until a fixed bundle reruns and reads keep.
- [x] Negative: `git diff main...trial/epic-024-bundle -- skills/orchestrator/references/night-run.md` is empty, no trial text reaches `main` before the verdict, and no motion, video, Archify or TemiDev material is added. ✓ The diff is empty, `git diff 847e27db..32d0cc3e` names none of the 11 trial files, and no such material was added; 0 five-word runs are shared with the kit.

## Results
Session `df80d35e-e73c-4ec3-b6a8-b3d15fba9263`, 126 main-thread turns, five workers. Host: SPRINT-166, 16 of 16 boxes, closed `e13120d1`.

**Verdict: drop**, owner popup 2026-11-08. Cost, time and context all read keep. A gate failure traced to the bundle fires the drop rule, as written before the run.
Nothing ships. Next: fix row 3 so a step that cannot be skipped reads CONTEXT.md § Gates before the first commit, then rerun the bundle on the next real sprint.

| Measure | Trial | Keep if | Baseline |
|---|---|---|---|
| Context after `/prime` | 67k | at most 75k | 83k |
| Context after decompose, tasks written | 115k | at most 118k | 152k |
| Context at the first build step, peak | 170k, 313k | | row 1: 241k, 340k |
| Compactions | 0 | | |
| USD/box, promote to last sprint commit | 0.68 to 0.71 | below 0.88 | 0.88 to 1.41 |
| Min/box, merged activity, gaps over 5 min dropped | 2.9 | below 4.1 | 4.1 to 6.2 |
| First full gate | 5 fail | no guard worse | 3, 1, 2; row 1: 2 |
| Blocking findings | Codex R1: 3 Medium on T1 | | |
| Owner corrections | 0 of 11 popups | | |

**Cost.** Tokens times fitted price; the session is still open, so it has no cost row. Main thread 8.77 USD, workers 2.17 to 2.67: two Sonnet price tables, the fitted one and Opus's scaled by 0.6, because the fit gave a negative output price.
The whole session reads 0.82 to 0.86 USD/box. Codex and the gate host are in neither figure. Active time 47.2 min from promote; the 481 min wall clock includes a 7 h overnight pause.

**The miss.** The orchestrator stage made 0 Reads and 0 Greps of `.claude/CONTEXT.md`, though the bundle's `skills/orchestrator/SKILL.md` line 13 says to read its applicable rules before dispatch.
So it never saw the `sprint(NNN) Tn:` commit-subject rule or the review-depth vocabulary, both in § Gates, which the old `/prime` loaded in full. Row 1's sprint, with the full `/prime`, wrote both correctly.
The fix cost a subject rewrite of 13 unpushed commits and three log lines, both by owner ruling (L-294). The gate's third finding, a 504-character description line, was the T1 worker's and does not trace to the bundle.

**Not traced.** TASK-618's box 4 called `D:\Research\workdoo` git-less. The intake worker took that from the operator's memory index, which was out of date; the index is now fixed.
T2 and T3 used the shared tree because 17 leftover agent worktrees stood; that is the protocol's fallback, not the bundle.

**Limits.** One 16-box sprint, different work from the baselines, and three changes in one trial (D11), so a result cannot be split by row. Direction, not proof (D4).
