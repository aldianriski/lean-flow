---
sprint: 990
status: active
gate_exceptions:
  - layers observed: xyz
  - knowledge index STALE (run: sh scripts/gen-index.sh)
gate_exceptions_pin: abc1234
---

# fixture sprint (SPRINT-093 T3 gate-exception harness)

Paired with scripts/qa-check-two-fails.sh -- both of its FAIL lines are named here, VERBATIM, so
the launcher must proceed rather than refuse (the "named-check-proceeds" direction).
