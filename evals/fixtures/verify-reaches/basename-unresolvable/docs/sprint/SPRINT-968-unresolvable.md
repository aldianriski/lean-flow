---
sprint: 968
slug: unresolvable
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-968 — Unresolvable

<!-- MUST FAIL: verify-method-unresolvable, a DIFFERENT finding from verify-method-absent.

     A bare basename that resolves against neither the current directory nor the known roots
     (scripts/, scripts/lib/, evals/). TD-097's fix must not collapse this into "method absent" --
     a basename search that only checked three roots has not proven the script doesn't exist
     somewhere else in the repo, so the honest finding name is "unresolvable", not "absent". -->

## Plan

### T1 — something
**DoD:**
- [x] the docs/alpha/ tree is checked — *Verify: `sh check-nothing-like-this-basename-exists.sh`*
