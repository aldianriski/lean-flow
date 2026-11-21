---
id: TASK-684
title: "Collapse promoted LEARNINGS entries to pointer form and report the measured line delta"
priority: P2
size: M
risk: low
autonomy: AFK
class: mechanical-ingest
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-184
depends-on: []
---
# TASK-684 — Collapse promoted LEARNINGS entries to pointer form and report the measured line delta

## Why
`docs/LEARNINGS.md` is 2,269 lines. 233 of 309 entries are `[status: promoted]`, and 85 of those keep bodies over the 6-line collapsed form (about 418 lines recoverable, re-measured at build). §11 requires collapse at promotion.

## Done when
- [x] Every `[status: promoted]` entry lacking both deliberate-non-collapse markers is reduced to heading + seen + count + the `→ promoted: <where>` pointer with its `disposition:` + related; commit message and Tracker report the measured line delta (before/after `wc -l`). ✓ 2,269 → 2,184 lines (−85), in the commit message and the Tracker; 78 entries collapsed to heading + seen + count + pointer + related
- [x] Census before/after: the `L-NNN` id set is identical (309 in, 309 out); every `→ promoted:` target (file + `§` anchor) resolves; the S11.LEARNINGS check and `evals/run-learnings-metadata-fixtures.ts` pass. ✓ 309 ids in and out; all 232 promotion pointers resolve (L-106 target fixed by owner ruling); S11.LEARNINGS PASS; run-learnings-metadata-fixtures 5/0
- [x] Negative: an entry carrying `§11 collapse deliberately NOT applied` and a `Re-collapse when` condition is left byte-identical, and a promoted entry whose pointer target does not resolve is not collapsed but listed in the Tracker for the owner. ✓ Negative held: L-144 (both markers) byte-identical; no unresolved pointer remained, so none listed

## Touches
`docs/LEARNINGS.md` only. Contract: the collapsed form already used by L-329.

## Assumes
- Collapsed bodies stay recoverable only through git (the §11 design).
- Active entries (76) are out of scope.

## Tracker
Owner intake 2026-11-21, area 3.
- SPRINT-184 T1 result: `wc -l docs/LEARNINGS.md` 2,269 → 2,184 (−85 lines; 542,110 → 515,810 bytes). 78 promoted entries collapsed, including the 13 no-disposition entries (owner ruling "Collapse them", each marked `(no disposition at promotion)`). L-144 (both hold markers) byte-identical. L-106's stale pointer target `DOCS_Guide.md` corrected to `spec/STANDARD.md` §2 Growth rule (owner ruling "Fix the target"), so no promoted entry is left unresolved and none is listed for the owner.
