---
owner: Maintainer
last_updated: 2026-11-13
status: current
update_trigger: The revisit-if condition fires
---

# Out of scope — Jev judgments in the loop

- date: 2026-11-13
- decision: out of scope
- reason: Every use of Jev tried so far ended without a keeper. The consequence-classification
  trial ran in SPRINT-173 and was dropped (EPIC-025 D3, TASK-654). The router and watcher roles it
  would have judged were ruled no-go in EPIC-024, so no role exists to put it in. Concept match in
  `/triage` and `/insights` was folded into that same trial by D3 and went with it. A paid judgment
  call also stays off a consumer's path (EPIC-025, Scope › Out).
- revisit-if: a recorded miss by the existing keyword and title duplicate checks in `/triage` or
  `/insights` (a duplicate filed and found later), or an agent role ships that needs a routing or
  hang judgment.
- prior-requests: TASK-627, TASK-629

`scripts/jev-done-when.ts` (TASK-626) stays as a maintainer-only script run by hand. This entry
covers new Jev uses, not that one.
