---
id: TASK-510
title: "Delete the spent CLAUDE.md row from the prose-density baseline"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: close-retro
state: ready
sprint: SPRINT-141
depends-on: []
---

# TASK-510 — Delete the spent CLAUDE.md row from the prose-density baseline

## Why
SPRINT-140 T9 took `.claude/CLAUDE.md` from 4 dense lines to 0. `check-prose-density.ts` now prints "baseline row is spent,
delete it" for that row. The file was outside T9's `Layers:`, so the row stayed; a ratchet baseline exists to reach empty.

## Done when
- [x] The `.claude/CLAUDE.md 4` row is gone from `scripts/lib/prose-density-baseline.txt`, and `check-prose-density.ts` still ✓ 126844bc: `prose-density: 26 pass, 0 fail`, no CLAUDE.md line; fixtures 10/0
      passes with no "spent" note for CLAUDE.md.

## Assumes
none

## Tracker
SPRINT-140 Retro (follow-up; T9's prose-density output).
