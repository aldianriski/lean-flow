---
epic: 941
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: closed
member_sprints: [workdoo SPRINT-941 (active), workdoo SPRINT-942 (active)]
update_trigger: fixture -- direction (a) must not CLAIM a closure test it never ran
---

# EPIC-941 — Archived With Nothing Verifiable (fixture)

Every member lives in another repository, so this checker resolved none of them. The verdict is
still exit 0 -- that is not a regression and §11 gives this checker no way to read a foreign
sprint's state. What it must NOT do is print "every member sprint closed", which is an affirmative
claim about a test that never ran, two lines above a NOTE saying the trigger cannot be read for
these members. Both members' own rows say **active**. Review CRITICAL-1.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [workdoo SPRINT-941](https://example.invalid/workdoo/docs/sprint/SPRINT-941-m.md) | Member | **active** — promoted 2026-05-01 · `aaa111941` | still running |
| [workdoo SPRINT-942](https://example.invalid/workdoo/docs/sprint/SPRINT-942-m.md) | Member | **active** — promoted 2026-05-01 · `aaa111942` | still running |

## Closed when

- [x] the first thing — **SPRINT-941**
