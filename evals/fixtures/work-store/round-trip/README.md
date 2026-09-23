# work-store round-trip fixture

`TASK-901-round-trip-fixture.md` is a copy of a real task file's shape (frontmatter fields +
sections), synthetic id in the reserved 900-block. It proves: a status transition performed as
`git mv` (`backlog/` -> `todo/` -> `backlog/`, each move its own commit) returns a byte-identical
file, and `git log --follow` on its final path shows every commit across the move — i.e. a
transition never mutates content and never breaks history. Used by
`evals/run-work-store-fixtures.ts` (SPRINT-106 T1).
