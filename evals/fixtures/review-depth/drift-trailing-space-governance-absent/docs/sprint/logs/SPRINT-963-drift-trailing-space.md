---
sprint: 963
slug: drift-trailing-space
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-963 — Execution Log

<!-- MUST FAIL: review-depth-governance-absent, reached through a DRIFTED consequence line
     (SPRINT-086 T4 revise). The consequence line below carries a trailing space after
     `governance:high`, before the newline -- the `$` anchor used to fail on this because the last
     character on the line was a space, not `h`, so the whole-line match missed and the checker
     reported nothing to verify with real governance:high work unreviewed. Trailing whitespace is
     stripped before the anchor is applied, so this now FAILs correctly. -->

### 2026-08-25 | progress | T4 — a conformance checker's exit-code contract changed

Changed what non-zero means for a checker other automation branches on; other scripts read this
checker's exit code to decide whether to block. No independent reviewer looked at the diff.

consequence · T4 · behaviour:low · governance:high 
