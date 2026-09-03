---
sprint: 937
slug: x
status: closed
plan_commit: abc1237
close_commit: def5937
---

# SPRINT-937 — x (constructed fixture)

Closed via `status: closed` but its Plan still sits under `docs/sprint/` -- the archival move
has not happened yet. T1's independent review found the identical reachability gap in
`check-epic-archive.sh` (HIGH-3: every fixture put its member under `archive/`, so the live-path
half of the glob went unexercised while SPRINT-093 was exactly this shape in this repo). This
case exercises the same half here before a reviewer has to find it a second time.
