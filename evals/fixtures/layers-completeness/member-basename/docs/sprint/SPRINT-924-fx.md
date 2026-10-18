---
sprint: 924
slug: member-basename-fx
status: active
---

# SPRINT-924 -- member-basename (fixture: a member's bare filename vs full-path Layers, TD-178 / TD-215)

## Members

- docs/work/todo/TASK-940-one-match.md
- docs/work/todo/TASK-941-two-matches.md
- docs/work/todo/TASK-942-no-match.md
- docs/work/todo/TASK-943-path-shaped.md

## Plan

### T1 -- exactly one declared path ends in the bare name `[class: execution]`
Layers: `src/lib/one.ts` · `src/lib/other.ts`
Depends-on: none
Cites: `TASK-940`

### T2 -- two declared paths end in the bare name `[class: execution]`
Layers: `x/dup.ts` · `y/dup.ts`
Depends-on: none
Cites: `TASK-941`

### T3 -- no declared path ends in the bare name `[class: execution]`
Layers: `src/lib/other.ts`
Depends-on: none
Cites: `TASK-942`

### T4 -- a path-shaped (not bare) token is still compared literally `[class: execution]`
Layers: `src/lib/one.ts`
Depends-on: none
Cites: `TASK-943`
