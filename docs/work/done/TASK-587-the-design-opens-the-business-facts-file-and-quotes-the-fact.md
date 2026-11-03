---
id: TASK-587
title: "The design opens the repo's business-facts file and quotes the fact it honours"
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

# TASK-587 — The design opens the repo's business-facts file and quotes the fact it honours

## Why
SPRINT-158's development runs: with TASK-585's G2 box in context, two self-onboarding-guard designs (`iso-9NayTL`, `iso-PtJHOH`)
took duty holders from the current configuration and never named business fact 6 ("The intake creator is initially available
for all three preparation responsibilities"); no run opened `BUSINESS-NOTES.md`. The box lists where facts live but not that
the design must open the file and quote the line. Owner ruling: TASK-585 box 3 half met; this is bundle 3 (EPIC-023 D16).

## Done when
- [x] The orchestrator's business-facts box makes the design open the repo's business-facts source (the profile's pointer, the ✓ `00cfff0b` line 48; Codex read-only review CLEAR (1 round)
      requirements and business-notes files) and quote, for each fact it honours, the fact's line; a design that names no fact
      says which sources it opened.
- [x] Shown on real input: parallel development runs (EPIC-023 D16) on self-onboarding-guard (two) and invitation-issued-by produce ✓ owner ruling 2026-11-03 (met in substance): on revision `2249c701`, `iso-DQY8DN` quotes the en-GB fact, `iso-sFQB2S` quotes fact 6; `iso-gJqQ1a` missed (content grep for the file name); follow-up TASK-597
      designs that quote fact 6 and the en-GB fact; streams read.
- [x] CHANGELOG `[Unreleased]` entry; `skills/orchestrator/SKILL.md` stays within its cap. ✓ `00cfff0b`: one `[Unreleased]` bullet; `check-doc-caps` PASS (140 <= 140)

## Touches
`skills/orchestrator/SKILL.md` · CHANGELOG.md

## Assumes
- invitation-issued-by still fails its business judge in A4a and A4b; quoting the fact is the target, not passing that judge.

## Tracker
SPRINT-158 log (development runs, owner ruling) · EPIC-023 D16, D17
