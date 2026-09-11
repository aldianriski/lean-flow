---
epic: 991
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: closed
member_sprints: [(closed), (active)]
update_trigger: fixture -- an entry erased by the annotation strip must still be reported
---

# EPIC-991 — Two Declared Members, Both Erased Before Anyone Looked (fixture)

Both entries are written entirely as state annotations and name no sprint. The strip that removes
`(closed)` / `(active)` used to run BEFORE the emptiness test, so each entry was reduced to the empty
string and dropped by a test meant for entries that were never there -- no member, no NOTE, invisible
to `unverified_count`. This epic, visibly declaring two members and resolving none, was archived with
the checker's strongest sentence: *"every member sprint closed"*.

Strictly worse than the empty-list case, because `[]` declares nothing and this declares two. The
emptiness test now runs twice: once on what the FILE says, once after stripping -- and an entry that
is non-empty in the file is always either resolved or reported.

## Closed when

- [x] the first thing — **SPRINT-991**
