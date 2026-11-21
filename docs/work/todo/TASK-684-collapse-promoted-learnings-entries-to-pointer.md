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
- [ ] Every `[status: promoted]` entry lacking both deliberate-non-collapse markers is reduced to heading + seen + count + the `→ promoted: <where>` pointer with its `disposition:` + related; commit message and Tracker report the measured line delta (before/after `wc -l`).
- [ ] Census before/after: the `L-NNN` id set is identical (309 in, 309 out); every `→ promoted:` target (file + `§` anchor) resolves; the S11.LEARNINGS check and `evals/run-learnings-metadata-fixtures.ts` pass.
- [ ] Negative: an entry carrying `§11 collapse deliberately NOT applied` and a `Re-collapse when` condition is left byte-identical, and a promoted entry whose pointer target does not resolve is not collapsed but listed in the Tracker for the owner.

## Touches
`docs/LEARNINGS.md` only. Contract: the collapsed form already used by L-329.

## Assumes
- Collapsed bodies stay recoverable only through git (the §11 design).
- Active entries (76) are out of scope.

## Tracker
Owner intake 2026-11-21, area 3.
