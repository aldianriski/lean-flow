# Fixture — Depends-on prose on a CONTINUATION line (TD-132, call site 2 of 2)

Not a real sprint file. The sibling of `deps-prose-field`, and the reason both call sites had to be
anchored: here the field line is a clean `none` and the explanation wraps onto an INDENTED line,
which the parser treats as continuing the declaration. Fixing only the field arm leaves this arm
harvesting `T1`/`T2` out of prose one line lower — the same defect, silent (L-058).

MUST NOT report a cycle. Waves must all be rank 0.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: none
      — but see **D1**: T1 and T2 both touch shared.md, and T1 owns it first.
      Nothing on these two lines is a dependency; they are an explanation of T1 and T2's
      commit order.
