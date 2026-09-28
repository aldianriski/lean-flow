---
sprint: 982
slug: member-stamp-arm
owner: Maintainer
last_updated: 2026-09-28
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-982 — Member reached via the sprint: stamp arm only (L-186)

<!-- CONTROL: must stay PASS, and must find exactly ONE member despite ## Members naming none.

     resolveMembers() (scripts/lib/sprint-members.ts) has TWO independent selection arms: a path
     LISTED under `## Members`, and a task file STAMPED `sprint: NNN` anywhere in docs/work/ whether
     listed or not. Every other fixture in this family reaches its member through the first arm; this
     one has no `## Members` section at all, so the ONLY way its member is found is the stamp arm --
     and the member itself sits in review/, not the todo/ folder every other case uses. -->

## Plan

### T1 — something about beta
**Acceptance:** the member's own Done when carries the mechanical criterion; this Plan has none.
