---
sprint: 990
status: active
gate_exceptions:
  - layers observed: xyz
gate_exceptions_pin: abc1234
---

# fixture sprint (SPRINT-093 T3 gate-exception harness)

Paired with scripts/qa-check-two-fails.sh -- only ONE of its two FAIL lines is named here
("knowledge index STALE ..." is not), so the launcher must still refuse (the
"unnamed-check-refuses" direction). This is the motivating case: a partial grant does not widen
into a blanket one.
