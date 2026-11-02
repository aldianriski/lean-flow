---
id: TASK-588
title: "The build never deletes a path outside the working tree"
epic: EPIC-023
sprint: SPRINT-160
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-588 — The build never deletes a path outside the working tree

## Why
TASK-584's rule (what the repo's own tests leave outside the working tree is named in the report, never deleted) was in context
in SPRINT-158's counter-run (`iso-PtJHOH`), and the build still ran `rm -rf` on a system-temp directory a test had made, in the
same command that removed its own in-tree probe; the run parked on the permission popup. A4a parked once the same way; A4b had 0.
A plain prohibition the build meets at the moment it cleans up is the next try (bundle 3, EPIC-023 D16).

## Done when
- [ ] The orchestrator's every-mode cleanup line states it as a prohibition the build meets when it cleans up: no delete command
      names a path outside the working tree; such a path is reported, not removed.
- [ ] Shown on real input: parallel development runs on workdoo reissue-invitation and self-onboarding-guard (two each) end with
      no delete outside the working tree and no popup; streams read.
- [ ] CHANGELOG `[Unreleased]` entry; `skills/orchestrator/SKILL.md` stays within its cap.

## Touches
`skills/orchestrator/SKILL.md` · CHANGELOG.md

## Assumes
- The park rate is low (A4a 1 of 32, A4b 0 of 32), so a clean development batch shows the wording works, not that it is needed.

## Tracker
SPRINT-158 log (counter-run, owner ruling) · TASK-584 · EPIC-023 D16
