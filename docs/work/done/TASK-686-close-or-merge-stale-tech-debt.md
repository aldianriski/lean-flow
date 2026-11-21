---
id: TASK-686
title: "Close or merge stale TECH-DEBT rows with the owner's per-row approval"
priority: P2
size: M
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
sprint: SPRINT-184
depends-on: []
---
# TASK-686 — Close or merge stale TECH-DEBT rows with the owner's per-row approval

## Why
123 open rows, none high. About 10 look stale by fact (a cited path is gone, or the A/B and EPIC-024 trials closed): TD-070, 090, 061, 158, 159, 207, 228, 288, 291, 293 (a heuristic; the builder confirms by reading each). §11 deletes a resolved row 3 sprints later, so this step shrinks the open set, not the file.

## Done when
- [x] The builder returns a per-row table (row, proposed disposition: close / merge-into-TD-N / keep, reason, "Re-file fresh if"); each close or merge is applied only after the owner's per-row approval, as `status: resolved → accepted (no task)` with its reasoning and a "Re-file fresh if" line. ✓ per-row table in the SPRINT-184 Log T3 entry; owner approved TD-288/291/293 by popup; applied as resolved → accepted (no task) with reasoning and Re-file fresh if
- [x] Duplicate rows found in the pass are merged into the surviving row, which records the merge; no id is freed. ✓ no duplicate met while reading the ten candidates or their cited rows; no merge, no id freed
- [x] Negative: no row is closed or merged without the owner's per-row approval recorded in the table, and the highest id (TD-319) and the id set stay intact. ✓ Negative held: only owner-approved rows changed (header diff = {288,291,293}); 123 ids, TD-319 highest

## Touches
`TECH-DEBT.md` only (closed rows keep their lines; no compression here).

## Assumes
- Medium rows may be closed only if stale by fact and approved like the rest.
- TASK-687 starts after this task lands (same file).

## Tracker
Owner intake 2026-11-21, area 2; answer Q3.
