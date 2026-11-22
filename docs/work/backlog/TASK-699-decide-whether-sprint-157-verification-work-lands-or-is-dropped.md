---
id: TASK-699
title: "Decide whether SPRINT-157's verification work lands or is dropped"
priority: P3
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: needs-info
depends-on: []
---

# TASK-699 — Decide whether SPRINT-157's verification work lands or is dropped

## Why

SPRINT-157 ran as a parallel stream and never merged to main. Its three local branches hold the work:
`sprint-157-reusable-verification` (21 commits whose patches are not on main; on that branch SPRINT-157 is still `active`,
with TASK-577 and 578 done and TASK-579 and 580 in progress), `sprint157-t1-index` and `sprint157-t4-docs`. Main has no
TASK-577 to 580 files and no SPRINT-157 plan. SPRINT-185's close removed the stream's worktree directories after a Codex
check; the branches were kept, since removing a directory decides nothing about the work (owner ruling at close, 2026-11-22).

## Done when

- [ ] Each of the three branches has a recorded owner ruling: land (as new tasks against current main), drop, or keep, with the reason.
- [ ] A ruling to drop deletes that branch only after its commits are named in the ruling; a ruling to land files the follow-up tasks in `docs/work/backlog/`.

## Touches

none (a decision; any follow-up work is filed as its own task)

## Assumes

- **open:** Which of SPRINT-157's changes still matter against today's main (the CRLF index fix and setup docs were left to it by SPRINT-159)? Groom with `/triage`.

## Tracker

- SPRINT-185 close (TD-246 worktree sweep) · `docs/sprint/archive/SPRINT-159-work-types-and-bug-items.md` · branches listed above
