---
sprint: 972
slug: prefix
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-972 — Prefix

<!-- MUST FAIL: verify-does-not-reach-target, on the PREFIX-COLLISION shape (TD-087 (b), named
     verbatim in its Evidence: "target `src/db` matches a script touching only `src/dbtools/`").
     The named method's only path-like mention is `src/dbtools/`, a different directory that merely
     shares a prefix with the claimed target `src/db`. A substring test cannot distinguish them; a
     path-boundary test must. -->

## Plan

### T1 — db work
**DoD:**
- [x] src/db is covered — *Verify: `sh evals/fixtures/verify-reaches/scripts/touches-dbtools.sh`*
