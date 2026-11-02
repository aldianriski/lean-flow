---
id: TASK-575
title: "A coding task's design declares only the files its change needs"
epic: EPIC-023
sprint: SPRINT-156
priority: P2
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

# TASK-575 — A coding task's design declares only the files its change needs

## Why
In 82 of 93 measured lean-flow trial sessions (A1 57 of 61, A2 25 of 32), the first G2 design declared files outside the
task's allowed layers and failed the scope check. Each failure cost a revise round, a third paid phase (A2 mean cost: plan
$0.58, G2 round $0.70, build $0.95; A0's whole task $0.62). The files it reached for were bookkeeping and docs the change did not
need: the task's own work file (59), `acceptance-criteria.md` (12), the flow doc (12), `BUSINESS-NOTES.md` (11),
`requirements.md` (7) and verify scripts. Larger diffs also leave the judges unable to see the change ("file cut off", UNKNOWN).
Owner ruling 2026-11-02: bundled with TASK-573 and TASK-576 into one arm, A4a (TASK-574).

## Done when
- [x] Cause named: the skill text that leads a design to list the task file, product docs or flow docs for a coding change is quoted, from the kept streams of the measured sessions (`D:\ab-work\kept\`) (scope-change 2026-11-02, owner ruling). ✓ 2026-11-02: 82 of 93 first designs failed scope (tests 45, docs 35, task file alone 14, code 2); the cause is the unbounded pin-first clauses and no rule on what a design lists, quoted in the SPRINT-156 log
- [ ] Fixed: the named text changed so a coding task's design declares only the files its change needs; a doc is listed only when
      the task's own Done-when or the change's behaviour requires it, and ticking the task file stays coordinator bookkeeping
      outside the design's file list. Re-run headless on the same tasks, one run each: the first G2 scope check passes; streams kept.
- [x] Consumer surface: CHANGELOG `[Unreleased]` entry (unversioned until its arm passes, D6). ✓ 2026-11-02: CHANGELOG [Unreleased] Changed line for `/orchestrator` G2 (`56964ce2`)

## Touches
the skill(s) the diagnosis names (`skills/**`, likely `orchestrator` and its references) · CHANGELOG.md

## Assumes
- The trial's allowed layers are the task's real scope (frozen in each task.json); the task file being outside them is how an
  adopter's own Layers would read too, not a harness artifact. Confirm at G2 against the D9 protocol text.
- Runs start after SPRINT-155 closes; about $2 a run.

## Tracker
EPIC-023 § Closed when S3 · D11 · `docs/research/logs/ab-measurements.md` and `-a2.md` rows (`firstRound` scope)
