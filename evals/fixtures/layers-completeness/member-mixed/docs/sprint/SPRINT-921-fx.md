---
sprint: 921
slug: member-mixed-fx
status: active
---

# SPRINT-921 -- member-mixed (fixture: v2 by-reference sprint, mixed verdicts)

## Members

- docs/work/todo/TASK-931-clean.md
- docs/work/todo/TASK-932-dir-covered.md
- docs/work/todo/TASK-935-second-of-two.md
- docs/work/todo/TASK-936-no-block.md

## Plan

### T1 -- cites two members, one wrapped onto a continuation line `[class: execution]`
Layers: `a.ts`
Depends-on: none
Cites: `TASK-931`
  `TASK-935`

### T2 -- member covered by a Layers directory `[class: execution]`
Layers: `src/`
Depends-on: none
Cites: `TASK-932`

### T3 -- member reached ONLY via its sprint: stamp `[class: execution]`
Layers: `c.ts`
Depends-on: none
Cites: `TASK-934`
