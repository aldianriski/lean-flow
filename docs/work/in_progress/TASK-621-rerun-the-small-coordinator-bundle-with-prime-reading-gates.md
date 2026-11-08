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
- [x] The transcript shows the skills loaded from `e024-bundle`, the window unset, and `/prime` reading CONTEXT.md's Gates section and nothing else of CONTEXT.md or the architecture map. ✓ Base dirs under `e024-bundle`, 0 compactions to a 262k peak, and `/prime` read CONTEXT.md lines 51 to 75 only, by `sed`.
- [x] Every sprint commit subject and `consequence ·` line passes the first full gate's checks for them. Any failure is named and traced to the bundle or not. ✗ Not met, named in § Results: a `docs(task):` move subject (traced) and free-text `consequence ·` lines (not traced).
- [x] Decompose, promote and every build dispatch run through `sonnet` workers whose prompt starts `Worker contract (lean-flow):`, every miss named. ✓ Intake `a5babfb62b6c8a928`, promote `ab7d922623cae16d2`, T1 `a842c9149db34edf4`, T2 `a0a00c7f79e1f53fc`, worktree-isolated. No miss; builder checks and reviews name `sonnet` and are not build dispatches.
- [x] No stage misses a fact `/prime` used to load. Any miss is named, with the stage and the fact. ✗ Two, both § Sprint model: the coordinator's commit-subject rule, and the promote worker's `check-layers-completeness` run.
- [x] The measures are recorded on TASK-617's basis: context after `/prime`, after decompose and at the first build step, compactions, USD and minutes per box, close-time gate failures, blocking findings and owner corrections. ✓ § Results.
- [x] The verdict is recorded in EPIC-024 as direction (D4), by the rule in § Approved design. ✓ Drop, owner popup 2026-11-08.
- [x] On keep, rows 1 to 3 land on `main` in their own commit, then the clean-install and no-agent checks run before any release (D5), and the owner rules on the router's cap and release route. ✓ Not keep. By owner exception (D12), rows 1 and 2 land on `main` in their own commit with the full CONTEXT.md read restored; nothing is released. The router stays not started.
- [x] Negative: `git diff main...trial/epic-024-bundle -- skills/orchestrator/references/night-run.md` is empty, and no trial text reaches `main` before the verdict. ✓ Empty; the landing commit follows this record.

## Results
Session `9b9cd39e-ac08-410e-813a-bc1c12bf2f05`, 98 main-thread turns, eight Sonnet workers. Host: SPRINT-167, 11 of 11 boxes, closed `a64bde11`.

**Verdict: drop**, owner popup 2026-11-08. Cost, time and context read keep again; a gate failure traced to the bundle fires drop again.
**Owner ruling, same popup:** restore the full CONTEXT.md read, then land rows 1 and 2 on `main`, unreleased, as an exception to the rule (EPIC-024 D12). The next real sprints are the check; release only under D5.

| Measure | SPRINT-167 | Keep if | SPRINT-166 | Baseline |
|---|---|---|---|---|
| Context after `/prime` | 71k | at most 75k | 67k | 83k |
| Context after decompose, tasks written | 93k | at most 118k | 115k | 152k |
| Context at the first build step, peak | 175k, 262k | | 170k, 313k | row 1: 241k, 340k |
| USD/box, promote to last sprint commit | 0.71 to 0.72 | below 0.88 | 0.68 to 0.71 | 0.88 to 1.41 |
| Min/box, merged activity | 3.4 | below 4.1 | 2.9 | 4.1 to 6.2 |
| First full gate | 4 fail, then 2 | no guard worse | 5 fail | 3, 1, 2 |
| Owner corrections | 1 of 9 popups, not traced | | 0 | |

Cost: main 5.74 USD, workers 1.92 to 2.03 (two Sonnet price tables), plus about 0.18 for two headless probes. The correction: the owner chose to clean leftover worktrees before dispatch, not after; that is TD-246, not the bundle.

**The misses.** `/prime` read § Gates, lines 51 to 75, as the fix said. The rules that broke sit in § Sprint model, which nothing read:
- The coordinator committed the move to `in_progress/` under `docs(task):`, so `check-layers-observed` failed; the subject rule is § Sprint model. Traced.
- The promote worker froze T2's Plan without running `check-layers-completeness`, which § Sprint model names at promote. Traced.
- Free-text `consequence ·` lines and missing `review ·` lines: that vocabulary is in `skills/orchestrator/SKILL.md`, which was loaded. Not traced.

**Why restore, not narrow again.** Two runs missed two different sections, and the old `/prime` loaded both. Skipping CONTEXT.md saves about 5k tokens a turn, mostly cache reads: roughly 0.01 USD per box. The savings come from rows 1 and 2, Sonnet workers reading and building.

**Limits.** Two sprints of 16 and 11 boxes, different work from the baselines and from each other. Direction, not proof (D4).

## Touches
Trial branch: `skills/prime/SKILL.md`. `main`: this file and `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 rows 1 to 3 · TASK-617 § Results
