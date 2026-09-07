# Fixture — Depends-on prose on the FIELD line (TD-132, call site 1 of 2)

Not a real sprint file. Every task declares `Depends-on: none` and then explains itself on the SAME
line, which is what every SPRINT-094 task did. Before TD-132's fix the bare `grep -oE 'T[0-9]+'`
harvested the ids out of that explanation and built `T2 -> [T1,T2]` — a self-edge no topological sort
resolves — so the tool FAILed `cycle-detected` on a Plan with no dependencies at all.

MUST NOT report a cycle. Waves must all be rank 0.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: none — but see **D1** (T1 and T2 both touch shared.md; T1 commits first)

### T3 — Gamma
Layers: gamma.md
Depends-on: none — and no longer part of **D1**: the shared-file map is now T1–T2 only
