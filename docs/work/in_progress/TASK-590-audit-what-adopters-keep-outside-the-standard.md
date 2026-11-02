---
id: TASK-590
title: "Audit what adopters keep outside the standard, and rule on each finding"
sprint: SPRINT-159
priority: P1
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-590 — Audit what adopters keep outside the standard, and rule on each finding

## Why
Owner, 2026-11-02: folders are messy and some work is not managed at all, for example bugs with their evidence, reproduction and
root-cause report. SPRINT-158's read-only audit covered lean-flow's own `docs/`; the adopter side is unread. The workdoo research
copy already holds a `docs/bugs/` folder (with a screenshot) that no lean-flow rule knows about, which is consumer evidence that
adopters need places the standard does not give them.

## Done when
- [ ] The adopter repos' research copies (`D:\Research\dev156\workdoo`, `\clinic`) and lean-flow's own `docs/` are read for
      folders and files the standard does not place (STANDARD §2): each listed with its path, what it holds, and how many files.
- [ ] Each finding carries a ruling: keep (and why), fix inside this sprint's tasks (named), or a new backlog task (filed after the
      owner's approve); the owner rules by popup.
- [ ] The result is a research doc under `docs/research/` with a §3 header, cited by the tasks it changes.

## Touches
`docs/research/` (the audit doc) · read-only on the adopter copies

## Assumes
- Runs first in the sprint; TASK-591, TASK-594 and TASK-589 may take findings from it through a logged scope-change.

## Tracker
Owner request 2026-11-02 (SPRINT-158 close) · SPRINT-158 research audit
