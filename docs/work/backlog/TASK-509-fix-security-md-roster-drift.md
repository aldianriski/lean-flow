---
id: TASK-509
title: "Fix SECURITY.md's stale skill count and missing humanizer grant row, and make a check read it"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-509 — Fix SECURITY.md's stale skill count and missing humanizer grant row, and make a check read it

## Why
SPRINT-140 T4's audit exercise ran on a copy of SECURITY.md and flagged "Of the 14": the roster has been 15 since SPRINT-139,
and the tool-grant table has no `humanizer` row. `check-count-claims.sh` reads CLAUDE.md, README and overview.md, never
SECURITY.md, so the claim drifted with nothing to catch it (the L-210 family: a claim nothing re-derives).

## Done when
- [ ] SECURITY.md states the current skill count and its grant table has a row for every skill, `humanizer` included, with its
      real `allowed-tools`.
- [ ] Either `check-count-claims.sh` reads SECURITY.md's count (with a retained must-FAIL fixture), or the count is removed in
      favour of a pointer to the roster; the choice and its reason are recorded.
- [ ] Exercised: the chosen route fails on a seeded wrong count and passes on the real file.

## Assumes
- Extending a checker is governance machinery (ADR-053); its reason here is a measured defect (the drift above).

## Tracker
SPRINT-140 Retro (follow-up; found by T4's audit exercise).
