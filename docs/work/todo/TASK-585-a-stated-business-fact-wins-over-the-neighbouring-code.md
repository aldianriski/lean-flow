---
id: TASK-585
title: "A stated business fact wins over the pattern in the neighbouring code"
epic: EPIC-023
sprint: SPRINT-158
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

# TASK-585 — A stated business fact wins over the pattern in the neighbouring code

## Why
"Misreads the business" is EPIC-023's symptom 2. In A2, workdoo invitation-issued-by failed both trials: the session formatted
dates with the neighbouring helper's locale `en` while the repo's business facts say en-GB (A0 and A1 fail it too). workdoo
self-onboarding-guard came back UNKNOWN because the diff took duty holders from the current configuration while business fact 6
says the intake creator initially holds all three (A0 passes it 3 of 3). The repo profile S1 added carries these facts; the design
step does not check against them. Next S3 bundle (EPIC-023 D14); it is S3a's "profile pointers" brief field applied to the
session's own design (D11).

## Done when
- [ ] Cause named from the kept streams of those slots: whether the design read the business facts, and which neighbouring code it
      followed instead.
- [ ] The orchestrator's G2 rule: the design names each stated business fact (requirements, business notes, the profile's business
      topics) that the change touches and says how it honours it; where a fact and the neighbouring code disagree, the fact wins
      and the design says so.
- [ ] Shown on real input: development runs on invitation-issued-by and self-onboarding-guard produce designs that name the
      locale fact and fact 6, and their business judge verdicts are read (one run each).
- [ ] CHANGELOG `[Unreleased]` entry; `skills/orchestrator/SKILL.md` stays within its cap.

## Touches
`skills/orchestrator/SKILL.md` · CHANGELOG.md

## Assumes
- invitation-issued-by fails in every arm, so a pass there would be lean-flow beating plain Claude Code, not a regression fix.

## Tracker
SPRINT-156 next-bundle analysis (A2 kept streams) · EPIC-023 symptom 2, D11, D14
