# Fixture — call site 2: a close-without-open token on a CONTINUATION line

Not a real sprint file. Round 4 added the close-without-open rule and gave it a field-line fixture
only; round 5 named the continuation arm as an unproven cell of the 3×2 matrix (L-186) and confirmed
by hand that the code already behaves correctly there. This pins that behaviour so it cannot regress
unnoticed — the arm this parser's own history says a field-only fix leaks through.

MUST report `FAIL depends-on-unreadable` for T3.

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
      1) T2
