# Fixture — MUST-FAIL: prose that merely NAMES a task is not a dependency

Not a real sprint file. The authoring style is this repo's own: `SPRINT-066:63-64` wraps its
`Depends-on:` explanation onto a continuation line that begins `T1-sanctioned gate is ...`. There it
is harmless by luck — the id it re-derives is one the field already declared. The dangerous form is
below, and a parser that reads a leading `Tn` out of prose invents an edge from a sentence that
explicitly denies one.

T2 and T3 both declare `shared.md` and there is NO dependency between them, so this MUST report
`FAIL shared-file-unowned`. If it reports `shared-file-owned` instead, the guard has invented the
edge from prose and is issuing an ownership PASS over a genuinely unowned overlap — TD-132's exact
failure class.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none

### T2 — Beta
Layers: shared.md
Depends-on: none

### T3 — Gamma
Layers: shared.md
Depends-on: T1 — its boundary is an input: a retry raised under a
      T2-flavoured caveat about scope is a different question, not a real dependency
