# Fixture — MUST-FAIL, call site 2: markup must not WELD an id on a continuation line either

Not a real sprint file. The continuation-arm twin of `deps-markup-welds-id`. The global strip welded
`*T1*3` into `T13` — a real task — inventing an edge and turning a genuinely unowned overlap into
`PASS shared-file-owned`. Round 5 confirmed the anchored strip refuses that on this arm too; this
fixture is what keeps it refused.

T13 and T3 both declare `shared.md` with no dependency between them, so this MUST report
`FAIL shared-file-unowned`. An ownership PASS means the id was welded back into existence.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T13 — Muddle
Layers: shared.md
Depends-on: none

### T3 — Gamma
Layers: shared.md
Depends-on: T1
      *T1*3 refers to nothing real, just decorated prose
