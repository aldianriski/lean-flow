# Fixture — MUST-FAIL: markup stripping must not WELD a new id out of fragments

Not a real sprint file. The first markup fix stripped `` ` `` and `*` globally, so `*T1*3` collapsed
to `T13` — a real task here — and the parser reported a dependency nobody declared. That turned a
genuinely unowned overlap into `PASS shared-file-owned`: a silent false PASS, worse under this
project's doctrine than the loud HALT it replaced, and TD-132's own failure class reintroduced by
TD-132's own fix. Only WRAPPING markup is stripped now, so `*T1*3` keeps its interior marker, fails
the exact-id test, and is read as prose.

T13 and T3 both declare `shared.md` with no dependency between them, so this MUST report
`FAIL shared-file-unowned`. A `shared-file-owned` PASS means the id was welded back into existence.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T13 — Muddle
Layers: shared.md
Depends-on: none

### T3 — Gamma
Layers: shared.md
Depends-on: *T1*3 refers to nothing real, just decorated prose
