---
sprint: 990
status: active
gate_exceptions:
  - headless park-record cue skills/lean-doc-generator/references/init.md: file not found
  - headless park-record cue skills/lean-doc-generator/references/init.md: ask-channel probe (ToolSearch select:AskUserQuestion) missing
  - headless park-record cue skills/lean-doc-generator/references/init.md: park-record instruction naming the /handoff doc missing
gate_exceptions_pin: abc1234
---

# fixture sprint (SPRINT-093 T3 gate-exception harness -- Finding 2)

Paired with scripts/qa-check-headless-cue-collision.sh. Names all three sibling FAILs verbatim, in
full, so the launcher must proceed.
