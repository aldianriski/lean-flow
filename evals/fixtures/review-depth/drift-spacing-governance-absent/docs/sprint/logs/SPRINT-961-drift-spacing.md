---
sprint: 961
slug: drift-spacing
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-961 — Execution Log

<!-- MUST FAIL: review-depth-governance-absent, reached through a DRIFTED consequence line
     (SPRINT-086 T4 revise). The line below carries a double space between the first `·` and `T1` --
     benign transcription drift, the expected case for a line hand-written into narrative markdown.
     The old fixed-string anchor read this as "no consequence line here" and exited 0 with real
     governance:high work unreviewed. The anchor must still refuse a line that only MENTIONS the
     schema (proven by the sibling `drift-prose-mention-passes` control) -- it is the internal
     whitespace run collapsing to one space, not a loosened match, that lets this one through. -->

### 2026-08-25 | progress | T1 — a permission default widened

Widened a default-deny permission to allow one additional command class. Governance-impacting: this
is a rule other automated runs are measured against. No independent reviewer was dispatched this
session.

consequence ·  T1 · behaviour:low · governance:high
