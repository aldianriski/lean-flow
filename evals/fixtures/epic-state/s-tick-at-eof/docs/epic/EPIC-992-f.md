---
epic: 992
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: active
member_sprints: [SPRINT-914]
update_trigger: fixture -- the END{} flush arm, which every real epic depends on and no fixture used
---

# EPIC-992 — Unattributed Tick As The Last Line (fixture)

`ticked_unattributed` flushes an open `- [x]` block from four places: the next `- [x]`, the next
`- [ ]`, the next `## `, and `END{}`. Every other class (c) fixture puts a `- [ ]` immediately after
the tick under test, so the finding is always produced by the checkbox arm and `END{}` is never the
one that reports. That was an incidental property of the fixtures, not a choice.

It is also the arm that matters most: **`## Closed when` is the final section of all sixteen real
epics in this repository**, so the last condition of every one of them is read by `END{}` alone --
and at archival time every condition, including that last one, is ticked. The set this arm runs over
is precisely the set no fixture entered.

The tick below is attributed to nothing and is the last line of the file. Nothing follows it.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-914](../sprint/archive/SPRINT-914-m.md) | Member | closed 2026-05-01 · `ccc111914` | did the thing |

## Closed when

- [x] The mechanism is exercised on real input
