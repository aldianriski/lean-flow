---
id: TASK-530
title: "Make qa-verdict.ts say when the chained bun test stage will not run"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-530 — qa-verdict names a skipped bun test

## Why
TD-155, defect fix (unfrozen, ADR-053): `package.json`'s `test` chains `qa-verdict.ts … && bun test`, so any non-zero
verdict skips the whole TypeScript suite and nothing says so. The chain and exit semantics stay unchanged (no ADR-033
amendment, owner choice at intake); only the skip becomes visible. G2 review-round cap: 2.

## Done when
- [ ] On a non-zero exit, `qa-verdict.ts` prints a line stating the chained `bun test` stage does not run.
- [ ] On a passing run that line is absent.
- [ ] Exit codes are unchanged on every existing qa-verdict path (existing tests stay green).
- [ ] A retained Bun test covers both paths (truncated/failed sample → line + non-zero; passing sample → no line); a seeded removal of the print reddens only that test.
- [ ] TD-155 resolved → TASK-530.

## Touches
`scripts/qa-verdict.ts` · its test.

## Assumes
- none

## Tracker
TECH-DEBT TD-155 · owner choice at /prime overview 2026-10-27 (false-green guard cluster).
