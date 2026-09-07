# Fixture — the first id is EXPLAINED, the rest of the list WRAPS

Not a real sprint file. The second defect independent review found in TD-132's first fix: that
design stopped collecting continuations as soon as the field line carried any prose marker, on the
reasoning "if the field explained itself, its continuations are prose too". A field that annotates
its first dependency and wraps the remainder of a real list therefore lost every wrapped id, and
`PREFLIGHT: CLEAR` was printed over two dependent tasks landing in one wave.

MUST parse T3's dependencies as T1 AND T2 — so T3 ranks 2, strictly after T2.
A T3 at rank 1 means the wrapped id was dropped.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: T1

### T3 — Gamma
Layers: gamma.md
Depends-on: T1 — shared alpha.md, and T1 owns it first
      , T2
