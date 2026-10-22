---
id: TASK-479
title: "a retained must-FAIL for the harnesses' ANSI pass-count parse"
sprint: SPRINT-137
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-479 — a retained must-FAIL for the harnesses' ANSI pass-count parse

## Why
TD-165 (medium): the `bun test` pass-count parse (strip ANSI with `sed`, then take the first `N pass`) has no retained must-FAIL;
SPRINT-102 proved its discrimination live and reverted the seed. Recon 2026-10-22: the TD row names one surviving harness
(`run-dod-delta-fixtures.sh`), but the identical parse line is in SIX harnesses (authority · doc-caps · dod-delta · epic-archive ·
layers-completeness · night-run-rollup), so the population is six, derived by grep. Fix direction from the row: a TypeScript test
over a captured ANSI-coloured `bun test` summary — tests the parser, not a suite, and needs no shipped broken test and no new
shell. Admission (ADR-053): TD-165's measured defect -- 156 assertions silently unrun at SPRINT-102 behind an ANSI-blind
parse. Host: the existing dod-delta test suite, the harness TD-165 names, so no new harness, no change to the gate's harness
list and nothing to retire (ADR-050 §2). G2 review-round cap: 2.

## Done when
- [ ] A retained TypeScript test finds every `evals/run-*` harness that parses a `bun test` pass count, selected by the pass-count
      assignment, not by the ANSI-strip token (six today; the test FAILs if it finds fewer than it finds `bun test` calls feeding a
      count, or none), extracts each parse line (indentation trimmed), and runs it through `sh` over a captured ANSI-coloured
      `bun test` summary, asserting the true pass count.
- [ ] Must-FAIL: the same parse with the ANSI strip removed yields the wrong count over the same sample, and the test's control
      catches it by name; one seeded revert of the strip in a real harness reddens the test, restored byte-identical
      (`git hash-object <p>` == `git rev-parse HEAD:<p>`).
- [ ] The test lives in the dod-delta test suite and runs in the gate through `run-dod-delta-fixtures.sh` (no new `.sh`, no new
      harness, no change to the harness list); its `min_tests` floor is raised by the new cases in the same commit, as its header requires.
- [ ] TD-165 narrowed in `TECH-DEBT.md`: the pass-count parse is resolved; its SPRINT-103 clock-input sighting stays open.

## Touches
the dod-delta TypeScript test suite and its harness's test-count floor · `TECH-DEBT.md`

## Assumes
- The six parse lines are textually identical apart from the input variable name (recon: 5× `$out`, 1× `$nrr_out`).
- A parse a harness removed entirely (no count at all) is out of scope: that harness then fails its own minimum-count check.

## Tracker

- TD-165 · intake draft reviewed by Codex 2026-10-22 (APPROVE WITH FIXES, folded in before approve)
