---
id: TASK-404
title: "Cut the Shell conformance engine's per-file process spawning (TD-168)"
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
sprint: SPRINT-124
depends-on: [TASK-421]
---

# TASK-404 — Cut the Shell conformance engine's per-file process spawning (TD-168)

## Why

ADR-051 retired the TypeScript port, so the Shell engine (`scripts/lib/conformance-engine.sh`) is the only engine and TD-168's
cost is now paid there for good. Measured at SPRINT-103 (`qa-gate-timing.md` Rounds 17–18): 173.1 s real against this repo,
60% of CPU time in the kernel, because the engine shells out per file per rule and pays `fork()` emulation on each. On Linux the
whole `QA_FULL=1` gate runs in 105–109 s (Round 22), so the cost is Windows-shaped, and an adopter on Windows pays it through
`conformance.sh`. Filed at SPRINT-116 T1 by owner ruling (TD-168 stays `high`).

**Consequential Tier G** (ADR-050): the engine is what `conformance.sh` executes, so this takes the full bar.

## Done when

- [x] The engine's run against this repo on the Windows host drops by a stated, measured fraction, with the before and after taken on ✓ 417.4 s → 136.3 s (−67%; target ≤216.5 s), full report byte-identical (cmp; also dash+gawk/mawk on VPS); seeds redden their cases in ownership-header, adr-family, sprint-family; isolated verify CONFIRMED at b4ee69a6; Codex R2 residuals → TD-249 (2d07c3f2..449acf7f)
      the same host and tree, and no rule's verdict, finding id, or exit meaning changes (ADR-034's compatibility contract), proven by the
      retained engine fixtures plus a seeded break per changed evaluator.

## Assumes

- needs-info: the target fraction, set by the owner once the profile exists. Unblock: the first Done-when box ticked.
- **blocked-by:** TASK-421 (the profile, and the owner's target proposed from it).
- **target (ruled 2026-10-10 by the SPRINT-121 G2 rule):** 50% cut of the engine's Windows wall clock (433.1 s → ≤ 216.5 s), from Round 23.

## Amended 2026-10-10

Split by owner ruling at the SPRINT-121 promote (Codex review H1): the profiling box moved to **TASK-421**,
so this task keeps only the optimization and waits on that profile. The `needs-info` line above is now discharged by TASK-421.

## Tracker

- TD-168 · ADR-051 · ADR-043 (engine consumer contract) · ADR-034 · `docs/research/logs/qa-gate-timing.md`
