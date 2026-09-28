---
sprint: 984
slug: resolution-empty
owner: Maintainer
last_updated: 2026-09-28
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-984 — ## Members lists an id that resolves to nothing (must FAIL)

<!-- CONTROL: must stay FAIL. `## Members` names a task id, but this fixture ships no docs/work/ tree
     at all under its own root -- resolveMembers() has nothing to find. A v2 sprint whose member
     lookup comes back empty while it names members is a real finding, not a silent zero (owner
     ruling B, second sentence). -->

## Members

- docs/work/todo/TASK-985-does-not-exist.md

## Plan

### T1 — orphaned citation
**Acceptance:** none -- the point of this fixture is the missing member file.
