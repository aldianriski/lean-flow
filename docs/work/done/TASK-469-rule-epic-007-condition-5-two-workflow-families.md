---
id: TASK-469
title: "Rule EPIC-007 condition 5: do two workflow families satisfy the decision gate?"
epic: EPIC-007
sprint: SPRINT-134
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-467]
---

# TASK-469 — Rule EPIC-007 condition 5: do two workflow families satisfy the decision gate?

## Why

`03 § 5`'s platform decision gate requires "at least 2 runtime or workflow variations prove abstraction pressure". Whether
workflow packs alone satisfy it, or the clause also needs a second runtime, is a judgement call, so it closes by ruling (L-094).
The epic says to rule it before claiming the condition met, never after (L-088). Once the verification pack exists there are
two pack families, so the question can be ruled on real evidence.

## Done when

- [x] EPIC-007 § Closed when condition 5 is ticked either as satisfied or as not-satisfied-by-packs-alone, with the owner's ✓ owner ruling by popup 2026-10-20: not satisfied by packs alone, with its reason and the three families, recorded on condition 5 (closed by SPRINT-134)
  ruling and its reason, citing the pack families that exist when it is ruled.
- [x] The epic's open question on decision-gate condition 6 records the same answer, so the two never disagree. ✓ open question 3 struck through and answered with the same ruling; the phrase appears in both places (joined-text count 2)

## Touches

`docs/epic/EPIC-007-workflow-packs.md`

## Assumes

- The ruling is the owner's (J2). The agent assembles the evidence and the options, never the verdict.

## Tracker

- EPIC-007 condition 5 · open question 3 · D1 census 2026-10-20 (intake)
