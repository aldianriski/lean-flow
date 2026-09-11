---
epic: 970
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: closed
member_sprints: [SPRINT-NNN, SPRINT-NNN — appended as each is promoted]
update_trigger: fixture -- an entry naming no sprint number must not read as a verified member set
---

# EPIC-970 — Template Default, Never Filled In (fixture)

`member_sprints:` here is copied VERBATIM from this plugin's own shipped
`skills/lean-doc-generator/templates/EPIC.md.template`. Neither entry contains a sprint number, so
the checker selects **no members at all**.

Before SPRINT-097 T5 round 3 such entries were dropped silently: `unverified_count` returned 0, the
narrowing never fired, and this epic -- archived with nothing whatsoever verified -- received the
checker's strongest possible claim, *"archived correctly … every member sprint closed"*. The one
member class provably not verified got the most affirmative sentence. Review CRITICAL-2.

## Closed when

- [x] the first thing — **SPRINT-971**
- [x] the second thing — **SPRINT-971**
