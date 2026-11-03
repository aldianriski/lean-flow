---
id: TASK-597
title: "The design finds the repo's business-facts sources by file name, not by a content search"
type: feature
epic: EPIC-023
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

# TASK-597 — The design finds the repo's business-facts sources by file name, not by a content search

## Why
SPRINT-160 T1 (TASK-587): after its one wording revision (`2249c701`), 2 of 3 development runs quoted their target fact. The third
(`iso-gJqQ1a`, self-onboarding-guard) grepped file contents for "business-notes", never matched the root `BUSINESS-NOTES.md` by
name, and wrote that the repo had no business-notes file. Owner ruling 2026-11-03: TASK-587 box 2 met in substance; this
follow-up covers how the design finds the sources.

## Done when
- [ ] The orchestrator's business-facts box makes the design find each facts source by file name (and by the profile's pointer)
      before it may say a source is absent; `skills/orchestrator/SKILL.md` stays within its cap.
- [ ] Shown on real input: development runs on self-onboarding-guard (two) open `BUSINESS-NOTES.md` and quote fact 6; streams read.
- [ ] CHANGELOG `[Unreleased]` entry.

## Touches
`skills/orchestrator/SKILL.md` · CHANGELOG.md

## Assumes
- The release arm (EPIC-023 D16) may measure this before it lands; if that arm's kept streams show no missed source, the owner
  may cancel this task.

## Tracker
SPRINT-160 log (T1 revision runs, owner ruling) · TASK-587
