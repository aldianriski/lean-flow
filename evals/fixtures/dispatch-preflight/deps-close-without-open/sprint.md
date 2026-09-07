# Fixture — MUST-FAIL: a close bracket with no open is unreadable, not prose

Not a real sprint file. A fifth silent-drop path, found after the round that claimed to have closed
them all. A token carrying a CLOSE with no OPEN — `1)`, an ordinal or a stray bracket — has `o == 0`,
so it never enters depth-tracking; `depth` stays 0 and the end-of-line unbalanced check
structurally cannot see it. The token simply ended the list and every id after it vanished with no
signal at all.

MUST report `FAIL depends-on-unreadable` for T3. A `PASS wave-computation` with T3 at rank 1 is the
silent drop: T2 lost, `PREFLIGHT: CLEAR`, exit 0.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: T1

### T3 — Gamma
Layers: gamma.md
Depends-on: T1 1) T2
