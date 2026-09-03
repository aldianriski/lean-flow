---
sprint: 936
slug: x
status: active
plan_commit: abc1236
---

# SPRINT-936 — x (constructed fixture)

Active sprint with a `live` handoff outstanding -- correctly NOT a violation while the sprint
is still open. Without this control, a checker that FAILed every `live` handoff regardless of
sprint status would also satisfy the closed-live-outstanding case above and look correct.
