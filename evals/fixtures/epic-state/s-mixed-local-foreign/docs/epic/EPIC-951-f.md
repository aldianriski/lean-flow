---
epic: 951
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: active
member_sprints: [workdoo SPRINT-001 (closed), SPRINT-951 (closed)]
update_trigger: fixture -- SELECTION axis: a MIXED member list, foreign first, local second
---

# EPIC-951 — One Foreign Member, One Local (fixture)

Census at SPRINT-097 T5 round 2: every one of the other 24 fixture epics is **all-local or
all-foreign**, so the per-entry foreign skip could have been a whole-loop `break` and nothing would
have noticed. The foreign member is listed FIRST here precisely so that an early exit costs the
local one.

`SPRINT-951` is local, closed, and its row cites `deadbeef` while its frontmatter says `ccc111951`
-- a real class (a) finding that is only reachable if the loop keeps going past the foreign entry.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [workdoo SPRINT-001](https://example.invalid/workdoo/docs/sprint/archive/SPRINT-001-m.md) | Foreign | closed 2026-05-01 · `eb3d9e7` | elsewhere |
| [SPRINT-951](../sprint/archive/SPRINT-951-m.md) | Local | closed 2026-05-01 · `deadbeef` | did the thing |

## Closed when

- [x] the thing — **SPRINT-951**
