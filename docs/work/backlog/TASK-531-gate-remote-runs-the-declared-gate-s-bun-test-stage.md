---
id: TASK-531
title: "Make gate-remote run and judge the declared gate's bun test stage"
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-531 — gate-remote runs the declared gate's bun test stage

## Why
TD-279, defect fix of an existing tool (unfrozen, ADR-053): the off-host system verify runs `qa-check.sh` alone, while the
declared gate (`package.json` `test`, ADR-033 rung 1) chains `&& bun test`, so every close verified on the VPS skips the
TypeScript suite and prints nothing about it (measured at SPRINT-146 close). Owner ruling R1. G2 review-round cap: 2.

## Done when
- [ ] A remote run executes `QA_FULL=1 sh scripts/qa-check.sh` and then `bun test`, each writing its own remote log and rc file, and both always run; gate-remote exits 0 only when both stages pass.
- [ ] A failing `bun test` stage (non-zero rc, or a summary with a non-zero fail count) under a passing qa-check exits non-zero and names the bun test stage; a retained stubbed-transport test reddens on it, beside a green control where both pass and one where only qa-check fails.
- [ ] The qa-check verdict is read from the qa-check log alone: a retained test whose bun test log carries a nested `QA-CHECK: 1 pass, 0 fail` line, under a failing qa-check log, still exits non-zero.
- [ ] A retained test pins gate-remote's stage list to `package.json`'s `test` script: a chained stage added to or removed from that script reddens it.
- [ ] Run on the real artifact: one VPS run at this task's code commit prints both stage verdicts and exits 0.
- [ ] TD-279 resolved → TASK-531.

## Touches
`scripts/gate-remote.ts` · `evals/gate-remote.test.ts` · `TECH-DEBT.md` · `CHANGELOG.md`

## Assumes
- The bun test stage passes when its rc is 0 and its summary reports `0 fail` with at least one test run; the exact
  parse is a G2 detail, judged on the VPS output captured at SPRINT-146.
- The remote run's single 900 s ssh timeout still covers both stages (bun test took ~8 s on the VPS).

## Tracker
TECH-DEBT TD-279 (SPRINT-146 close retro) · owner rulings at intake 2026-10-28 · Codex intake review R1 CLEAR, R2 CLEAR with per-class reasons.
