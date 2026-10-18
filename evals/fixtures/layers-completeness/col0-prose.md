---
sprint: 903
slug: col0-prose
status: active
plan_commit: fixture
---

# SPRINT-903 -- column-0 text that starts with a backtick (constructed fixture, SPRINT-128 T1)

## Plan

### T1 -- prose directly after a declaration is named, whichever it is `[size: S]`
Layers: `a.ts`
`some note` describes this task. Directly after a declaration, the parser cannot tell this from a wrap.
Depends-on: none

**DoD:**
- [ ] `a.ts` is rewritten

### T2 -- the same prose separated by a blank line is plain prose `[size: S]`
Layers: `a.ts`

`some note` describes this task. A blank line ends the declaration, so this is not flagged.
Depends-on: none

**DoD:**
- [ ] `a.ts` is rewritten
