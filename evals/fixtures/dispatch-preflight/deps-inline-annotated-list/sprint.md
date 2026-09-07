# Fixture — an id ANNOTATED INLINE, mid-list (real corpus shape)

Not a real sprint file, but the `Depends-on:` line is this repo's own, copied from
`docs/sprint/archive/SPRINT-055-wiring-the-standard.md:161`. The sibling shape lives at
SPRINT-063:83 (`T2 (subtraction first) · T1 (owns ... — see D1)`), which is why BOTH separators
(`,` and `·`) are exercised here.

The first design for TD-132 truncated the whole field at the first prose marker, so a `(` belonging
to the FIRST id's own annotation discarded every id after it. That is worse than TD-132 itself:
TD-132 invented an edge and HALTed loudly, while a dropped edge dispatches dependent tasks in the
same wave with `PREFLIGHT: CLEAR` and no finding at all (L-058).

MUST parse T5's dependencies as exactly T1, T3 and T4 — so T5 ranks strictly AFTER T4, at 2.
A T5 at rank 1 means the annotated ids were dropped.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T3 — Gamma
Layers: gamma.md
Depends-on: T1

### T4 — Delta
Layers: delta.md
Depends-on: T3

### T5 — Epsilon
Layers: epsilon.md
Depends-on: T1 (count guard must exist first), T3, T4 (shared files — see D1)

### T6 — Zeta
Layers: zeta.md
Depends-on: T4 (subtraction first) · T5 (owns `DOCS_Guide` §2 and `docs/adr/` — see D1)
