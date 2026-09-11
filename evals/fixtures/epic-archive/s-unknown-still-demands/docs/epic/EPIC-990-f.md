---
epic: 990
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: closed
member_sprints: [SPRINT-901, SPRINT-9019]
update_trigger: fixture -- an UNKNOWN member must not exempt an epic from direction (b)
---

# EPIC-990 — Typo'd Member Id Must Not Buy An Exemption (fixture)

`SPRINT-901` is local and closed. `SPRINT-9019` is a typo naming no Plan anywhere -- UNKNOWN.

Round 4 demoted direction (b) from FAIL to PASS whenever `unverified_count` was non-zero, arguing
the remedy was unachievable. That argument holds for a FOREIGN member and for nothing else: a typo
is fixable right here, and so is an unfilled template placeholder. Gating on the count rather than
on the class meant this single mistyped id exempted the epic from §11's move -- forever, and
silently, on the one direction the file calls "the drift that actually happened".

Every condition is met and the local member is closed, so §11 demands the move. This case FAILs.

## Closed when

- [x] the first thing — **SPRINT-901**
- [x] the second thing — **SPRINT-901**
