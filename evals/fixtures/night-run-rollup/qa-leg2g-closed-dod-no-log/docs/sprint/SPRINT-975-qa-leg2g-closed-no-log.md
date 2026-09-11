---
sprint: 975
slug: qa-leg2g-closed-no-log
status: active
---

# SPRINT-975 — selection control (L-186): open-DoD's OTHER side, no log, must be excluded entirely

Every DoD item below is ticked -- this sprint has ZERO open DoD, which is the transient
"at close, about to archive" shape check-layers-observed.sh already names. Its log is absent too,
same as qa-leg2g-open-dod-no-log's, but the VERDICT must differ: this one is never even handed to
the checker, because open-DoD is the selection criterion DoD 1 states, not the log's existence.

## Plan

### T1 — a task that finished
- [x] the one DoD item, ticked, leaving this sprint's open-DoD count at zero
