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
sprint: SPRINT-146
depends-on: []
---

# TASK-530 — qa-verdict names a skipped bun test

## Why
TD-155, defect fix (unfrozen, ADR-053): `package.json`'s `test` chains `qa-verdict.ts … && bun test`, so any non-zero
verdict skips the whole TypeScript suite and nothing says so. The chain and exit semantics stay unchanged (no ADR-033
amendment, owner choice at intake); only the skip becomes visible. G2 review-round cap: 2.

## Done when
- [x] On a non-zero exit, `qa-verdict.ts` prints a line stating the chained `bun test` stage does not run. ✓ 41347cf2: chainSkipNotice names the && stage on a non-zero exit when the package.json script chains one (owner ruling R3); real run printed it naming bun test
- [x] On a passing run that line is absent. ✓ passing sample under the test script text: no notice, exit 0 (qa-verdict.test.ts, coordinator re-run 26 pass 0 fail)
- [x] Exit codes are unchanged on every existing qa-verdict path (existing tests stay green). ✓ judgeOutput/runAndJudge and their reasons unchanged; every pre-existing qa-verdict test green (26 pass, 0 fail)
- [x] A retained Bun test covers both paths (truncated/failed sample → line + non-zero; passing sample → no line); a seeded removal of the print reddens only that test. ✓ spawned tests: fail and truncated samples give notice + exit 1, passing gives none + exit 0, gate text gives none; seeded removal of the print reddened only the 2 notice tests (24/2), restored byte-identical
- [x] Run on the real artifact: a real gate run truncated on purpose (a small `QA_BUDGET_SECONDS`) through `package.json`'s `test` prints the line and exits non-zero; a real passing gate run (VPS) prints no line. ✓ local: QA_BUDGET_SECONDS=5 bun run test truncated (17 UNRUN), printed the notice naming bun test, exit 1, no bun test output; VPS at 834e237d: bun run test, outer verdict QA-CHECK 304 pass 0 fail, no outer notice, bun test 563 pass 0 fail, rc 0
- [x] TD-155 resolved → TASK-530. ✓ TD-155 status: resolved -> TASK-530 (Sprint-146), 4b52c83e

## Touches
`scripts/qa-verdict.ts` · its test.

## Assumes
- none

## Tracker
TECH-DEBT TD-155 · owner choice at /prime overview 2026-10-27 (false-green guard cluster).
