---
epic: 980
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: closed
member_sprints: [SPRINT-980]
update_trigger: fixture -- an UNKNOWN member must raise unverified_count, not just emit a NOTE
---

# EPIC-980 — Member Named, Never Modelled (fixture)

`SPRINT-980` appears in no `docs/sprint/` path here, so it is UNKNOWN -- a local id naming nothing.

`unverified_count()` sums two producers, foreign and unknown. Round 3 asserted only the foreign
half: setting the unknown half to a constant 0 left all 30 cases green while the checker printed a
member count that disagreed with its own NOTE lines. This epic has NO foreign member, so its count
comes entirely from the unknown side and the assertion below cannot be satisfied any other way.

## Closed when

- [x] the first thing — **SPRINT-980**
- [x] the second thing — **SPRINT-980**
