---
id: TASK-412
title: "Verify lean-flow reaches conformance level Structural"
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
depends-on: [TASK-406, TASK-407, TASK-408, TASK-409, TASK-410]
---

# TASK-412 — Verify lean-flow reaches conformance level Structural

## Why

The sprint's outcome is that lean-flow passes the standard it ships. Each slice clears its own rules. This task checks the integrated
tree once, on a clean clone as well as the working host, so contamination on one host cannot hide a finding.

## Done when

- [x] `sh conformance.sh .` prints a level of Structural or higher on the integrated tree, both on this host and on a clean clone on the ✓ integrated tree `6a8094f4`: `level: Structural` on this host (17 worktrees present) and on a fresh VPS clone; both verdict lines are in the Execution Log
      VPS, with both verdict lines recorded.

## Touches

- none expected (verification only; any finding it surfaces routes back to the slice that owns it)

## Assumes

- GAP lines (rules the engine does not yet implement) do not block the level, as the engine's own level line states.

## Tracker

- STANDARD §14 · TASK-406–410
