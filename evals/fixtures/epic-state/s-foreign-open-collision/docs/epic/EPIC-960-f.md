---
epic: 960
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: closed
member_sprints: [workdoo SPRINT-960 (closed)]
update_trigger: fixture -- arms the _members_scan half of the foreign-member guard
---

# EPIC-960 — Foreign Member, Open Local Twin (fixture)

Every other selection fixture's collision partner is CLOSED, so `open_members` and `unknown_members`
return empty whether or not they skip foreign members -- which left the `_members_scan` half of the
fix deletable with the whole suite green. Found by the T5 review, not by the author.

Here the local twin is OPEN. If foreign members are resolved locally again, SPRINT-960 reads as an
open member and this epic becomes "correctly NOT yet archived" at exit 0. With the guard intact the
member is skipped and the epic passes with its claim narrowed to the LOCAL members -- because §11's
move cannot be demanded on a member half that was never verified. Round 3 made this branch report
the narrowing but kept it a FAIL, which would have turned the gate red on EPIC-016 itself the moment
its conditions ticked; round 4 made it an `ok`. This fixture asserted each of those in turn.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [workdoo SPRINT-960](https://example.invalid/workdoo/docs/sprint/archive/SPRINT-960-m.md) | Member | closed 2026-05-01 · `eb3d9e7` | did the thing |

## Closed when

- [x] the first thing — **SPRINT-960**
- [x] the second thing — **SPRINT-960**
