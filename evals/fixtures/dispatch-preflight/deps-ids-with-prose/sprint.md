# Fixture — SIBLING CONTROL: real ids alongside prose must still parse

Not a real sprint file. The control for `deps-prose-field`: anchoring the parser must not make it
blind to dependencies that are genuinely declared. T3 declares two real edges and THEN explains
itself, so the ids before the prose marker must still be read — exactly `[T1,T2]`, no more and no
fewer.

MUST report T3 at wave rank 1 (after T1 and T2 at rank 0), and MUST NOT report a cycle.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: none

### T3 — Gamma
Layers: gamma.md
Depends-on: T1 · T2 — but see **D1** (T3 lands last; this clause is prose, not an edge)
