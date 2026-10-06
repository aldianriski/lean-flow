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
state: needs-info
depends-on: []
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

- [ ] A fresh profile on the Windows host names the engine's hottest spawn sites, with counts and wall-clock per site, recorded as a new
      `qa-gate-timing.md` Round. TD-168's Mitigation is a hypothesis (L-091), so this replaces it as the basis for the fix.
- [ ] The engine's run against this repo on the Windows host drops by a stated, measured fraction, with the before and after taken on
      the same host and tree, and no rule's verdict, finding id, or exit meaning changes (ADR-034's compatibility contract), proven by the
      retained engine fixtures plus a seeded break per changed evaluator.

## Assumes

- needs-info: the target fraction, set by the owner once the profile exists. Unblock: the first Done-when box ticked.

## Tracker

- TD-168 · ADR-051 · ADR-043 (engine consumer contract) · ADR-034 · `docs/research/logs/qa-gate-timing.md`
