---
id: TASK-641
title: "Confirm the row 6 merger result on a different sprint with fresh ordinary controls and a balanced run order"
type: feature
epic: EPIC-024
priority: P3
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: blocked
depends-on: [TASK-640]
---

# TASK-641 — Confirm the row 6 merger result on a different sprint with fresh ordinary controls and a balanced run order

## Why
Row 6 passed its frozen bar: merger runs 3.8 and 3.9 USD and 24.0 and 27.4 min against the ordinary mean of 4.05 USD and 47.85 min, 0 bad merges, and the unsafe wrong-base merge refused. Codex's challenge (Med): n = 2 per side, runs on a later day than the ordinary runs, and only 4 to 6 percent of cost headroom support a provisional go, not a reliable savings claim. Part of the time gap is probably variance. The owner has not ruled to ship (TASK-646). Before the merger could become any default, the result needs a second look that shares nothing with the first.

## Done when

- [ ] A confirmation design is frozen before any paid run: a different sprint's replay, fresh ordinary controls run in the same session as the merger runs, a balanced (interleaved) order, at least three runs per side, and a verdict rule stated with its stop rules.
- [ ] The verdict is recorded in EPIC-024 row 6 as confirmed, not confirmed or inconclusive, with each side's cost, time and merge-oracle result.
- [ ] Negative: the earlier ordinary runs (O1, O2) are not reused as this trial's controls, and no merger file is placed on `main` or in `.claude/agents/` by this task.

## Touches
`docs/epic/EPIC-024-agent-roles-one-by-one.md`, `docs/work/`; trial files stay on a trial branch.

## Assumes
- A1: the harness is in `scripts/trials/` (TASK-640).
- **blocked-by:** the owner's budget and the choice of sprint to replay; ask both in the frontier round that opens this task.

## Tracker
SPRINT-170 close Retro · Codex recap review, challenge on row 6 and candidate 1 (CHANGE)
