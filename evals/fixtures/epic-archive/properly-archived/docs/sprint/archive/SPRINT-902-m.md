---
sprint: 902
slug: m
owner: Maintainer
last_updated: 2026-01-01
status: closed
close_commit: ccc111902
update_trigger: fixture -- the member EPIC-902 names, modelled so the control is genuinely verified
---

# SPRINT-902 — Member (fixture)

Added at SPRINT-097 T5. EPIC-902 has always named this member and the fixture never modelled it, so
the "archived correctly" control was passing on a member the checker could not resolve. It is now
the one fixture where NOTHING is unverifiable, which is what makes it a control for the un-narrowed
success line.
