# Fixture — MUST-FAIL: an unclosed annotation is reported, never silently swallowed

Not a real sprint file. Round 3 of review found that `Depends-on: T1 (unclosed, T3` leaves the
annotation depth above zero, so every remaining token — including the real id `T3` — is treated as
still inside the annotation and vanishes. No corpus line is unbalanced today (all 250 verified), so
this is malformed-input risk rather than a live bug — and surviving malformed input without silently
losing an edge is exactly what a Tier G guard is for.

The list cannot be read, so it MUST be reported by name rather than truncated quietly.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: T1 (unclosed annotation, T1
