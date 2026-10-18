# Fixture — column-0-wrap (TD-138, shipped side)

Not a real sprint file. T1's `Layers:` wraps onto a line that sits at COLUMN 0 and opens with a backtick.
That is either a wrapped declaration or prose, and the snippet cannot tell which. Before the fix a
column-0 line reset `cur`, so `shared.md` was dropped in silence and the ownership map was built from
T1's first line only. T2 declares `shared.md` with no `Depends-on:` edge to T1, so the dropped path hid a
genuinely unowned overlap behind `PREFLIGHT: CLEAR`.

## Plan

### T1 — Alpha
Layers: `alpha.md` ·
`shared.md`
Depends-on: none

### T2 — Beta
Layers: `beta.md` · `shared.md`
Depends-on: none
