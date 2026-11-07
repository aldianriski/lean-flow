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
- [ ] The transcript shows the skills loaded from `e024-bundle`, the window unset, and `/prime` reading neither `CONTEXT.md` nor the architecture map in full.
- [ ] Decompose and promote each run through one `sonnet` worker whose prompt starts `Worker contract (lean-flow):`. Questions return `blocked`, reach the owner by popup and resume the same id. This settles TASK-616's two open boxes.
- [ ] Every build dispatch starts with the contract and sets a model, every miss named.
- [ ] Each drafted task has an observable criterion and a `Negative:` box. Owner corrections are counted and traced to the bundle or not.
- [ ] No stage misses a fact `/prime` used to load. Any miss is named, with the stage and the fact.
- [ ] The measures are recorded: context after `/prime`, after decompose and at the first build step, compactions, USD and minutes per box, close-time gate failures and blocking findings.
- [ ] The verdict is recorded in EPIC-024 as direction (D4). **Keep:** below 0.88 USD/box or below 4.1 min/box, context at most 75k after `/prime` and 118k after decompose, no guard worse. **Drop:** worse than both 1.41 USD/box and 6.2 min/box, context at or above 83k after `/prime` or 152k after decompose, or a gate failure, blocking finding or owner correction traced to the bundle, including a stage missing a fact `/prime` used to load. Otherwise **inconclusive**, not shipped.
- [ ] On keep, rows 1 to 3 land on `main` in their own commit, then the clean-install and no-agent checks run before any release (D5). Whatever the verdict, the owner then rules on the router.
- [ ] Negative: `git diff main...trial/epic-024-bundle -- skills/orchestrator/references/night-run.md` is empty, no trial text reaches `main` before the verdict, and no motion, video, Archify or TemiDev material is added.
