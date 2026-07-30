# Fixture — shared-file-unowned

Not a real sprint file. T1 and T2 both name `shared.md` in `Layers:` with no `Depends-on:` edge
between them either direction — an unowned overlap, the exact hazard concurrent dispatch creates.
Both are independent (`Depends-on: none`) so the cycle/wave check passes clean and only the
shared-file check should fire.

## Plan

### T1 — Alpha
Layers: shared.md
Depends-on: none

### T2 — Beta
Layers: shared.md
Depends-on: none
