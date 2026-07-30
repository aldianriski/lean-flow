# Fixture — base-ref-drift

Not a real sprint file. A single independent task with no shared file and no dependency, so the
cycle and shared-file-ownership checks both pass clean — only the base-ref check should fire, when
the runner passes a declared base that is deliberately not live HEAD.

## Plan

### T1 — Alpha
Layers: alpha.md
Depends-on: none
