---
sprint: 164
slug: never-run-branches
owner: Maintainer
last_updated: 2026-11-06
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-164 — Execution Log

> Append-only companion to [`../SPRINT-164-never-run-branches.md`](../SPRINT-164-never-run-branches.md).
> Uncapped by design (STANDARD §9). **Never edit a past entry**; correct it with a new one.

### 2026-11-06 | promote | plan locked, governance signed, three members: the three branches TD-294 says never ran
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due (19 learnings at count ≥ 2, all promoted; all 44 `promoted: no` entries at count 1).
- ☑ TD aging: 112 rows, all open; none `high` (66 low, 24 minor, 15 medium, 7 trivial). 107 are aged ≥ 3 sprints and were held; nothing auto-escalates to P1.
- ☑ doc-aging, §11: nothing due. ☑ doc-aging, §2: no breach (`check-doc-caps`).
- ☑ epic rollup currency: no active epic. ☑ epic coverage: none. ☑ roadmap: none. ☑ handoff ledger: none.
Composition: TASK-610, TASK-611 and TASK-612 (ready, P2, from the TD-294 intake, Codex-reviewed in 1 round, CLEAR); single stream. Sizes M, S, S; no `L`.
TASK-612 depends on the other two for shared-file order and the TD-294 flip, and all three join here, so it sits in the second wave. Status moves in `85bcb960`.
G1 and G2 are not signed; `/orchestrator` signs them.
promote-check: 10 pass, 0 fail.

### 2026-11-06 | progress | opt-in gate green off-host at the recorded plan_commit
`gate-remote.ts` ran `45707062`: `QA-CHECK: 507 pass, 0 fail`, `bun test` 589 pass, 0 fail.

### 2026-11-06 | progress | builder check run on the three G2 designs before sign-off
builder-check · T1 · 0 contradictions · 4 questions · settled: the mixed answer moved off migrate, so box 2's label has one reading (R1 init keeps it for box 5, and box 3's second entry is added on the copy by the coordinator); bullet shape read from `setupBullets` and printed before any paid run; a third ask counts as a defect; a fix may land in `skills/lean-doc-generator/references/migration-map.md`
builder-check · T2 · 2 contradictions · 5 questions · settled: the rule goes in the task-file guidance bullet; the no-write check covers all of `docs/work/`; the shown box is matched as a whole line (`grep -Fx`) from the decoded result; D2 and D3 re-run as controls; a scenario is step 6's own definition; up to two added lines (138)
builder-check · T3 · 0 contradictions · 2 questions · settled: step 3 already holds a bug with no box and only lacks the evidence condition, so the text changes whatever the before-run shows and a clean before-run is recorded as that; box 2 runs through the report, with the code path not run and stated

### 2026-11-06 | progress | batch G1 and G2 signed by the owner (popup) on `a535b273`
G1 fast path: scope unchanged since approval. G2 design, all three tasks J2, HITL, each `consequence · behaviour:material · governance:low`:
- Shared files: `CHANGELOG.md`, `README.md`, `TECH-DEBT.md` in T1, T2, T3 order on main (D1); preflight: no cycle, no parallel wave, so no worktree. The coordinator owns the sprint file, this log, ticks and moves.
- Fix route (owner ruling, this sprint only): Claude writes the few lines of rule text and Codex reviews it (D4), rather than Codex building. The before-run is each behaviour fix's pin, the after-run on a new pin its green.
- T1 runs: R1 init on a code-only copy with SOLID plus one standard with checks; R2 migrate with SOLID only; R3 migrate re-run; R4 init answering `none`; R5 a scoped review of a violating diff. Box 3's second entry is added on the migrate copy by the coordinator. Not run: a mixed answer on migrate, for which `skills/lean-doc-generator/references/migration-map.md` names no report label.
- T2 runs: D1 no scenario, D1b fresh approve, D2 scenario named, D3 docs with nothing to guard. A1 confirmed: 136 lines today, at most 138.
- T3 runs: B1 known cause outside the checkout (A4's pick: the copy's code can always suggest a neighbour for a bug inside it); B2 one session with an evidenced bug, an unknown cause and a seeded `ready` bug. A1 confirmed: 132 lines, edits inside existing lines. Box 2 runs through the report; the code path is not run.
Every box is a judgment tick or a stated query on a run's artifact (`check-verify-reaches`: 0 mechanical `Verify:` clauses). The owner rules each result when shown.
