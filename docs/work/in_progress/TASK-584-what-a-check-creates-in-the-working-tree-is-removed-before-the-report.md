---
id: TASK-584
title: "Whatever a check creates inside the working tree is removed before the report"
epic: EPIC-023
sprint: SPRINT-158
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-584 — Whatever a check creates inside the working tree is removed before the report

## Why
A2's clinic appointment-lookup slot followed the repo's own setup doc, started a local test database in `.pgdata/` inside the
repo, stopped it, and left the data directory; the trial scored `scope-breach` (not passed). A0 passed that task 3 of 3. TASK-573
now sends throwaway probes into the working tree, so leftover check artifacts are the next risk. Next S3 bundle (EPIC-023 D14).

## Done when
- [ ] The orchestrator's rule names it: anything a check creates inside the working tree (a scratch script, a database directory, a
      cache, a log), gitignored or not, is removed before the report, unless the task's declared files include it; what the
      repo's own tests leave outside the working tree is named in the report, never deleted (scope-change 2026-11-02).
- [ ] Shown on real input: a development run on clinic appointment-lookup (and any A4a slot that breached on a check artifact)
      ends with no such file left (stream and post-run file list read), and one on workdoo reissue-invitation ends with no popup
      (scope-change 2026-11-02).
- [ ] CHANGELOG `[Unreleased]` entry; `skills/orchestrator/SKILL.md` stays within its cap.

## Touches
`skills/orchestrator/SKILL.md` · CHANGELOG.md

## Assumes
- The A4a run shows whether in-tree probes now leave artifacts; its scope-breach rows are this task's first evidence.

## Tracker
SPRINT-156 next-bundle analysis (A2 kept streams, iso-JVhkQf) · EPIC-023 D14
