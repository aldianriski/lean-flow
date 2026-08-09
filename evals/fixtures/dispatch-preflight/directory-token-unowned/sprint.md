# Fixture — directory-token-unowned (TD-043)

Not a real sprint file. T1 declares the directory `evals/fixtures/` and T2 declares a file inside
that tree, with no `Depends-on:` edge between them — two tasks writing the same tree concurrently.

Before the TD-043 fix the token pattern required a dot, so a directory token ending in `/` was
extracted by nothing and compared against nothing: `PREFLIGHT: CLEAR`. The rule "declare a directory
only for a tree ONE task owns" was stated in a header comment, which is a comment and not a check —
the shape this whole sprint exists to remove.

## Plan

### T1 — Alpha
Layers: evals/fixtures/
Depends-on: none

### T2 — Beta
Layers: evals/fixtures/dispatch-preflight/sprint.md
Depends-on: none
