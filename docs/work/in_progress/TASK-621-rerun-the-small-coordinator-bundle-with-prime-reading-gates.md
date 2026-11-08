---
id: TASK-621
title: "Rerun the small-coordinator bundle with /prime reading CONTEXT.md's Gates section, and record the verdict"
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
depends-on: [TASK-617]
gates_signed: G1,G2 @ 3ed1fff9
---

# TASK-621 — Rerun the small-coordinator bundle with /prime reading CONTEXT.md's Gates section, and record the verdict

## Why
TASK-617 read drop on one cause: the orchestrator skipped its deferred read of CONTEXT.md, so the first gate failed on two rules in § Gates (L-294). Cost, time and context read keep. The owner ruled by popup on 2026-11-08: fix that read in a slot no stage can skip, then rerun on a real sprint. The router waits for this result.

## Approved design
Owner popups, 2026-11-08: the verdict and retry, the fix, and the host. Run from `trial/epic-024-bundle` at `66292855` in worktree `D:\Project\lean-flow-worktrees\e024-bundle`: TASK-617's bundle with `main` merged, plus one change. `/prime` now reads CONTEXT.md's `## Gates` section in full, about 2k tokens, and still skips the rest. A host without that heading reports `no § Gates`.

The host sprint builds TD-301, scoping `/diagram`'s `Bash` grant to read-only git, and TD-302, winning back room in the always-loaded token budget. Claude workers on Sonnet build. Out: the router, any release, pushing.

Launch as TASK-617 did, from `D:\Project\lean-flow` with `--plugin-dir` on the trial worktree and the window unset. Its commits go to `main`. This task is not a sprint member and is ticked after the sprint closes from the transcript. Nobody messages the session (D10).

Verdict rule, TASK-617's, unchanged:
- **Keep:** below 0.88 USD/box or below 4.1 min/box, context at most 75k after `/prime` and 118k after decompose, no guard worse.
- **Drop:** worse than both 1.41 USD/box and 6.2 min/box, context at or above 83k after `/prime` or 152k after decompose, or a gate failure, blocking finding or owner correction traced to the bundle.
- Otherwise **inconclusive**, not shipped.

## Done when
- [x] The trial branch holds the fix and the off-host gate passes. ✓ `66292855`: `bun test` 589 pass, 0 fail; `QA-CHECK: 466 pass, 0 fail`.
- [ ] The transcript shows the skills loaded from `e024-bundle`, the window unset, and `/prime` reading CONTEXT.md's Gates section and nothing else of CONTEXT.md or the architecture map.
- [ ] Every sprint commit subject and `consequence ·` line passes the first full gate's checks for them. Any failure is named and traced to the bundle or not.
- [ ] Decompose, promote and every build dispatch run through `sonnet` workers whose prompt starts `Worker contract (lean-flow):`, every miss named.
- [ ] No stage misses a fact `/prime` used to load. Any miss is named, with the stage and the fact.
- [ ] The measures are recorded on TASK-617's basis: context after `/prime`, after decompose and at the first build step, compactions, USD and minutes per box, close-time gate failures, blocking findings and owner corrections.
- [ ] The verdict is recorded in EPIC-024 as direction (D4), by the rule in § Approved design.
- [ ] On keep, rows 1 to 3 land on `main` in their own commit, then the clean-install and no-agent checks run before any release (D5), and the owner rules on the router's cap and release route.
- [ ] Negative: `git diff main...trial/epic-024-bundle -- skills/orchestrator/references/night-run.md` is empty, and no trial text reaches `main` before the verdict.

## Touches
Trial branch: `skills/prime/SKILL.md`. `main`: this file and `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 rows 1 to 3 · TASK-617 § Results
