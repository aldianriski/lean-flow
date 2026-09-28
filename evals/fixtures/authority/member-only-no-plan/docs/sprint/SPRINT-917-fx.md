---
sprint: 917
slug: fx
status: active
plan_commit: abc1234
---

# SPRINT-917 — fixture

No `## Members` section and no `### Tn` Plan blocks at all -- both members below are reached ONLY
by their `sprint: 917` frontmatter stamp (L-186 selection arm), and one sits in `done/` rather than
`todo/` (a second selection arm). A checker keyed to "no ### Tn task blocks -> skip" would silently
pass this file's real defect.
