---
sprint: 983
slug: no-clauses
owner: Maintainer
last_updated: 2026-09-28
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-983 — v2 sprint, zero mechanical clauses (must not pass vacuously)

<!-- CONTROL: must stay PASS (zero clauses is legitimate -- every criterion below is a judgment tick),
     but the NOTE line naming "2 member(s), 0 mechanical ... clause(s)" must be PRESENT. Before this
     task, a v2 sprint's Plan carried no such clause either, and the OLD .sh checker -- which never
     read member files at all -- said nothing whatever about it: a vacuous pass, indistinguishable
     from "checked and found nothing wrong" (owner ruling B). -->

## Members

- docs/work/todo/TASK-983-no-clauses.md
- docs/work/todo/TASK-984-no-clauses.md

## Plan

### T1 — two judgment-only criteria
**Acceptance:** both members' own Done-when items are plain judgment ticks; neither names a script.
