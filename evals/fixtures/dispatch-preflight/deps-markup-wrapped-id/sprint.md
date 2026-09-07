# Fixture — a markup-wrapped id is still an id (round 3 of review)

Not a real sprint file. `**T1**` and `` `T1` `` matched neither the exact-id test nor the annotation
test in design 3, so they ended the list — discarding not just the wrapped id but everything after
it. This repo writes `**T1**` and `` `T1` `` freely in sprint logs and commit messages, so the style
is one habit-slip from a real `Depends-on:` field. Markup is decoration; stripping it first makes a
decorated id parse as the id it plainly is.

MUST rank T3 at 2. T3 at 0 or 1 means the wrapped ids were dropped.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: **T1**

### T3 — Gamma
Layers: gamma.md
Depends-on: `T1`, **T2**
