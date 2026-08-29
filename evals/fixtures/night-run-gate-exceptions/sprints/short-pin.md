---
sprint: 990
status: active
gate_exceptions:
  - layers observed: xyz
  - knowledge index STALE (run: sh scripts/gen-index.sh)
gate_exceptions_pin: a
---

# fixture sprint (SPRINT-093 T3 gate-exception harness)

Paired with scripts/qa-check-two-fails.sh -- both FAIL lines are named verbatim, but the pin is one
hex character, below git's own 7-character abbreviation floor (the same rule
check-approval-envelope.sh already applies to approval_envelope:). Must refuse: a pin that names
almost nothing pins nothing.
