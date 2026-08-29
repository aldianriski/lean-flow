---
sprint: 990
status: active
gate_exceptions:
  - headless park-record cue skills/lean-doc-generator/references/init.md
gate_exceptions_pin: abc1234
---

# fixture sprint (SPRINT-093 T3 gate-exception harness -- Finding 2)

Paired with scripts/qa-check-headless-cue-collision.sh. Names only the SHARED PREFIX the three
sibling FAILs used to canonicalise to -- the exact string a pre-fix grant would have matched all
three with. Must refuse all three: a prefix is no longer a valid item at all now that matching is
whole-line, so this closes the collision vector rather than merely avoiding it by luck.
