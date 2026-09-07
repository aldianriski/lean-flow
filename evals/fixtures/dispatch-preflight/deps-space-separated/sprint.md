# Fixture — a BARE-SPACE separated id list (real corpus shape)

Not a real sprint file, but `Depends-on: T1 T3` is this repo's own — `SPRINT-050:111` and
`SPRINT-053:107`. It is load-bearing there rather than incidental: SPRINT-053's D4 reads
*"`Depends-on: T1 T3` gives both files a single owner without guessing — ownership by dependency
chain, which the preflight accepts (TD-025)."* A parser that splits only on `,` and `·` reads that
as `[T1]` and silently drops T3.

MUST rank T5 at 2, strictly after T3. T5 at rank 1 means the space-separated id was dropped and two
dependent tasks would dispatch in the same wave under PREFLIGHT: CLEAR (L-058).

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T3 — Gamma
Layers: gamma.md
Depends-on: T1

### T5 — Epsilon
Layers: epsilon.md
Depends-on: T1 T3
