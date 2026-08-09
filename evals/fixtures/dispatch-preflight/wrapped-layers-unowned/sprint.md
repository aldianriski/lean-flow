# Fixture — wrapped-layers-unowned (TD-040)

Not a real sprint file. T1 and T2 both touch `shared.md`, but in BOTH tasks it sits on an *indented
continuation* of the `Layers:` line rather than on the first line. There is no `Depends-on:` edge
between them, so this is a genuine unowned overlap.

Before the TD-040 fix the parser matched only lines beginning `Layers:`, so every path on a
continuation was invisible and this file reported `PREFLIGHT: CLEAR` — the exact silent false PASS
observed live at the SPRINT-053 and SPRINT-054 promotes. A wrapped declaration is the normal shape
for any task touching three or more files, so this is the common case, not an exotic one.

## Plan

### T1 — Alpha
Layers: alpha-one.md · alpha-two.md ·
        shared.md
Depends-on: none

### T2 — Beta
Layers: beta-one.md · beta-two.md ·
        shared.md
Depends-on: none
