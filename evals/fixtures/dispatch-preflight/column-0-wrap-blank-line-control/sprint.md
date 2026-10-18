# Fixture — column-0-wrap-blank-line-control (TD-138, shipped side)

Not a real sprint file. The sibling of column-0-wrap: a line that opens with a backtick at column 0 but
sits after a BLANK line is prose, not a continuation, and must not be named. A snippet that flagged every
backtick-led column-0 line would turn this fixture's tree into a false HALT.

## Plan

### T1 — Alpha
Layers: `alpha.md`
Depends-on: none

`note.md` is mentioned here as prose, separated from the declaration by a blank line.

### T2 — Beta
Layers: `beta.md`
Depends-on: none
