---
id: TASK-409
title: "Make the conformance engine skip Claude Code worktrees"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-120
depends-on: []
---

# TASK-409 — Make the conformance engine skip Claude Code worktrees

## Why

`conformance.sh` reports `HANDOFF-LEDGER.md` as outside its canonical placement because it found a file of that name inside
`.claude/worktrees/`, where Claude Code keeps whole repo copies for isolated agents. Any adopter who uses worktree isolation gets the same
false findings: the engine reads directories that are not the repository (L-170's contamination class, now in the adopter's tool).

**Consequential Tier G** (ADR-050): the engine is what `conformance.sh` executes, so this takes the full bar. That means a must-FAIL
fixture and a control per check, seeded breaks under one hash convention, and a worktree-isolated outside review.

## Done when

- [x] A retained fixture with a canonical-named file present only inside `.claude/worktrees/` produces no placement finding, while the ✓ engine harness cases worktree-placement-ignored (and a bracketed-root variant) with outside-dir controls; the pre-change engine reports the worktree-sourced finding and seeds of each exclusion redden only their own case; 71 PASS at `31b88f09`
      pre-change engine reports one on the same fixture. A sibling control with the same file at a wrong path outside the worktrees
      directory still FAILs `S2.R-PLACEMENT`.
- [x] `sh conformance.sh .` on this repo, with agent worktrees present, reports 0 `S2.R-PLACEMENT` findings. No other rule's verdict ✓ full conformance on main at `8e227bba` with 17 agent worktrees present: S2.R-PLACEMENT PASS, level Structural; no other verdict changed (isolated review: old vs new engine byte-identical without worktrees)
      changes, except findings that were sourced from inside the worktrees directory.

## Touches

- `scripts/lib/conformance-engine.sh` · `evals/` (engine fixtures and their harness)

## Assumes

- G2 rules the scope: whether the exclusion applies to every file walk in the engine (recommended) or only to the placement rule.
- Overlaps TASK-404 (engine spawn cost) and TASK-410 on the same file, so they are sequenced, never built in parallel.

## Tracker

- ADR-050 · ADR-034 (compatibility contract) · L-170
