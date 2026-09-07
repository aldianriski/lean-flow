# Fixture — MUST-FAIL, call site 2: an unclosed annotation on a CONTINUATION line

Not a real sprint file. The unbalanced half of the call-site-2 coverage matrix (L-186). The field
line here is well formed; the annotation is opened and never closed on the continuation.

MUST report `FAIL depends-on-unreadable` for T2 — the flag has to be raised by the continuation arm,
not only by the field arm.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: beta.md
Depends-on: T1
      (an annotation opened here and never closed, T1
