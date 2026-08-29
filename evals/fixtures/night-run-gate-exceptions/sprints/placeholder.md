---
sprint: 990
status: active
gate_exceptions:
  - [verbatim FAIL line text]
gate_exceptions_pin: [sha]
---

# fixture sprint (SPRINT-093 T3 gate-exception harness)

Paired with scripts/qa-check-two-fails.sh -- the shipped template's own unfilled bracketed
placeholders, exactly as check-approval-envelope.sh already treats an unfilled approval_envelope:.
Must count as absent, not as a grant.
