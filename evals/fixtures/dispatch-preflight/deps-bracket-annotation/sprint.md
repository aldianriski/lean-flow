# Fixture — a `[...]` annotation is an annotation (round 3 of review)

Not a real sprint file. Design 3 skipped balanced `(...)` groups but treated `[see D1]` as prose,
because a bracket token carries no `(` — so it ended the id list and silently dropped every id after
it. This repo's Plan headers already sit right next to `Depends-on:` in bracket syntax
(`[size: S · risk: low]`), so the habit is one slip away.

MUST rank T3 at 2, strictly after T2. T3 at rank 1 means the bracket ended the list and T2 was lost.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: T1

### T3 — Gamma
Layers: gamma.md
Depends-on: T1 [see D1] T2
