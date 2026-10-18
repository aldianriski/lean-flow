---
id: TASK-440
sprint: SPRINT-127
title: "Decide and specify how a repo without git freezes, signs and closes a sprint (ADR-054, spec 0.18.0)"
epic: EPIC-022
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-440 — Decide and specify how a repo without git freezes, signs and closes a sprint

## Why

`plan_commit` *is* the freeze ("git already holds every member exactly as approved"), so a repo without git cannot promote, freeze or
close a sprint at all, and the standard has no sentence for that case. workdoo has no `.git`. Hard to reverse — it changes what the
freeze means in STANDARD §2 — so it is an ADR (EPIC-022 D3).

## Done when

- [ ] ADR-054 records the decision: without git, the freeze is a verbatim copy of each member's `## Done when` written into the
      Execution Log's promote entry (owner ruling 2026-10-18), with the rejected shapes (content hash · no freeze) and why.
- [ ] STANDARD states the git-less records: `plan_commit: none (no git)` · the promote-entry snapshot as the frozen text ·
      `gates_signed: … @ <YYYY-MM-DD>` · `close_commit: none (no git) · closed <YYYY-MM-DD>` · status moves are plain file moves;
      spec 0.18.0 with its CHANGELOG block.
- [ ] No verdict moves for a repo with git: `conformance.sh .` reports the same verdicts on this repo before and after.

## Touches

- docs/adr/ · docs/DECISIONS.md · docs/knowledge-index.md · spec/STANDARD.md · spec/CHANGELOG.md

## Assumes

- A1: a procedure detects git with `git rev-parse --git-dir`; failure means git-less mode — no flag, no config.
- A4: spec 0.18.0 is MINOR without MAJOR meaning (a git repo is unaffected; a git-less repo gains rules it could not meet before).

## Tracker

- EPIC-022 Closed-when 6 · D3 · owner ruling 2026-10-18 (snapshot in the promote log entry)
