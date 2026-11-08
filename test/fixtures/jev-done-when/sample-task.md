---
id: TASK-SAMPLE
title: "Exercise the Done-when judge"
type: feature
---

# TASK-SAMPLE — Exercise the Done-when judge

## Why

Keep two ambiguous criteria beside an observable control for the paid trial.

## Done when

- [ ] The feature works well and users are happy.
- [ ] Negative: nothing bad happens.
- [ ] Running `bun scripts/jev-done-when.ts docs/work/done/TASK-625-map-jev-use-cases-against-lean-flow-stages.md` with no flag exits 0 and prints a line starting with `estimate:`.

## Touches

`scripts/jev-done-when.ts`
