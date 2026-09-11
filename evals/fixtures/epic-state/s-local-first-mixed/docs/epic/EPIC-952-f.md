---
epic: 952
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: active
member_sprints: [SPRINT-951 (closed), workdoo SPRINT-001 (closed)]
update_trigger: fixture -- SELECTION axis: a MIXED member list, LOCAL first, foreign second
---

# EPIC-952 — One Foreign Member, One Local (fixture)

Round 3 census: every fixture that mixes localities lists the FOREIGN member FIRST. That ordering is
the incidental property nobody chose -- it discriminates the two `|| continue` skips and is
structurally blind to `report_unresolvable`'s `&& continue`, which only a LOCAL-FIRST list can reach.
So this epic lists the local member first and the foreign one second.

`SPRINT-951` is local, closed, and its row cites `deadbeef` while its frontmatter says `ccc111951`
-- a real class (a) finding that is only reachable if the loop keeps going past the foreign entry.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [workdoo SPRINT-001](https://example.invalid/workdoo/docs/sprint/archive/SPRINT-001-m.md) | Foreign | closed 2026-05-01 · `eb3d9e7` | elsewhere |
| [SPRINT-951](../sprint/archive/SPRINT-951-m.md) | Local | closed 2026-05-01 · `deadbeef` | did the thing |

## Closed when

- [x] the thing — **SPRINT-951**
