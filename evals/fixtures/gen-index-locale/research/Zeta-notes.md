---
owner: Fixture
last_updated: 2026-01-01
update_trigger: n/a (test fixture, TASK-389)
status: current
id: zeta-notes
tags: [process]
domain: governance
---

# Zeta notes (fixture)

Deliberately named to sort BEFORE `alpha-notes.md` under `LC_ALL=C` (capital `Z` = 0x5A precedes
lowercase `a` = 0x61) and AFTER it under `LC_ALL=en_US.UTF-8` (case-folded alphabetic collation).
Shares its `tags:`/`domain:` with alpha-notes.md on purpose, so both land in the SAME
`- **process** — ...` line of the generated index, and the relative order of the two ids inside
that one line is exactly what a locale-dependent enumeration would flip.
