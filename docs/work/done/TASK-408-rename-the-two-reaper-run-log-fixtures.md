---
id: TASK-408
title: "Rename the two reaper run.log fixtures out of the generated-artifact class"
priority: P2
size: S
risk: low
autonomy: AFK
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-120
depends-on: []
---

# TASK-408 — Rename the two reaper run.log fixtures out of the generated-artifact class

## Why

Two hand-written reaper inputs under the night-run-reaper fixtures are named `run.log`, which matches §12c's `*.log` class, so
`conformance.sh` reports them as committed generated artifacts (`S12.GENERATED`, Structural). They are inputs, not output, and the
reaper takes any log path, so the name is incidental. Owner ruling (SPRINT-120 decompose): rename them, with no engine exemption.

## Done when

- [x] Both fixture logs and their `.exit` companions carry a name outside every §12c class, and each harness that stages them reads the ✓ `739872b3`: both fixture logs and their exit companions renamed to the JSON-lines extension; the rollup harness reads the new name
      new name.
- [x] `sh conformance.sh .` reports 0 `S12.GENERATED` findings, and the night-run rollup and reap-terminal harnesses report the same ✓ `S12.GENERATED` PASS (full run, `d64f13ac`); rollup 11 → 11 PASS, reap-terminal 12 → 12 PASS
      pass and fail counts as before the rename.

## Touches

- `evals/fixtures/night-run-reaper/` (the two `run.log` + `run.log.exit` pairs) · `evals/run-night-run-rollup-fixtures.sh`

## Assumes

- Harnesses that create a scratch `run.log` at run time are untouched: an untracked scratch file is not a committed artifact.

## Tracker

- STANDARD §12(c)
