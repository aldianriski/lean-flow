# Fixture — call site 2: a `[...]` annotation on a CONTINUATION line

Not a real sprint file. The three round-3 hardening fixtures all put their trigger on the FIELD line,
leaving the indented-continuation arm — the seam the code's own comments call historically dangerous
— unproven for every one of them (L-186: fixtures discriminate branches, never the SELECTION). This
is the bracket half of that matrix.

MUST rank T3 at 2. T3 at 1 means the bracket ended the list on the continuation arm and T2 was lost.

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
      [see D1] T2
