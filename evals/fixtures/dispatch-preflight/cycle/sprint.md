# Fixture — cycle

Not a real sprint file. Minimal enough to carry the three markup tokens the preflight parses
(`### Tn`, `Layers:`, `Depends-on:`) with T1 and T2 depending on each other — no valid dispatch
order exists, which is exactly what the cycle check must catch.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: T2

### T2 — Beta
Layers: beta.md
Depends-on: T1

## Other section

Parsing stops leaving "## Plan" (the real preflight only reads inside that section), so this line
and anything after it must never be mistaken for a third task.
