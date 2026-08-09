---
epic: 900
slug: premature
owner: Maintainer
status: closed
member_sprints: [SPRINT-900]
update_trigger: fixture -- must-FAIL input for evals/run-epic-archive-fixtures.sh
---

# EPIC-900 — Archived Too Early (fixture)

Every member sprint closed, so a count-based rule would archive this. One exit condition is still
open, which is precisely what DOCS_Guide §11 warns against: archiving hides the unfinished work.

## Closed when

- [x] The mechanism ships
- [ ] The mechanism is exercised on real input
