---
sprint: 935
slug: x
status: closed
plan_commit: abc1235
close_commit: def5935
---

# SPRINT-935 — x (constructed fixture)

Closed sprint whose ONE handoff was written `live`, then later re-recorded `spent` under the
SAME `handoff-path` -- proves the LATEST entry per path wins, not merely "any spent entry
exists" (a checker that OR'd every entry for a path together would also pass this on the
earlier `live` write, masking a genuinely re-opened one elsewhere).
