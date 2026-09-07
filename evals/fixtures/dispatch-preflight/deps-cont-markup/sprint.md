# Fixture — call site 2: a markup-wrapped id on a CONTINUATION line

Not a real sprint file. The markup half of the call-site-2 coverage matrix (L-186).

MUST rank T3 at 2. T3 at 1 means the wrapped id was dropped on the continuation arm.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: T1

### T3 — Gamma
Layers: gamma.md
Depends-on: T1
      , **T2**
