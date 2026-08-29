---
sprint: 990
status: active
gate_exceptions:
  - headless park-record cue skills/lean-doc-generator/references/init.md: file not found
gate_exceptions_pin: abc1234
---

# fixture sprint (SPRINT-093 T3 gate-exception harness -- Finding 2)

Paired with scripts/qa-check-headless-cue-collision.sh. Names only ONE of the three sibling FAILs
that share the identical "headless park-record cue <path>" prefix. Must still refuse, naming one of
the other two -- this is Finding 2's exact motivating case: before the fix, a canonicalised-prefix
match would have silently pre-approved all three from this single entry.
