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
member is skipped, every condition is met, and §11 demands the move -- so this case FAILs.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [workdoo SPRINT-960](https://example.invalid/workdoo/docs/sprint/archive/SPRINT-960-m.md) | Member | closed 2026-05-01 · `eb3d9e7` | did the thing |

## Closed when

- [x] the first thing — **SPRINT-960**
- [x] the second thing — **SPRINT-960**
