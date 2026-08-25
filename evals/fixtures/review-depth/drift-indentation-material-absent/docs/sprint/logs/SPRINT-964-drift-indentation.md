---
sprint: 964
slug: drift-indentation
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-964 — Execution Log

<!-- MUST FAIL: review-depth-material-absent, reached through a DRIFTED consequence line
     (SPRINT-086 T4 revise). The consequence line below is written with two leading spaces, as if
     nested inside a list item or blockquote -- the `^` anchor used to fail on this because the first
     character on the line was a space, not `c`, so the whole-line match missed and the checker
     reported nothing to verify with real behaviour:material work unreviewed. Leading whitespace is
     stripped before the anchor is applied, so this now FAILs correctly. -->

### 2026-08-25 | progress | T7 — a dispatch routing table restructured

Restructured how tasks route to reviewer depth; the running system dispatches differently as of this
change. Notes appended as a nested list item, hence the indentation on the line below:

- consequence details for T7:
  consequence · T7 · behaviour:material · governance:low
