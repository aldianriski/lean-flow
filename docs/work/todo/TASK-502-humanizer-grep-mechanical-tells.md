---
id: TASK-502
title: "Make humanizer's check step count the mechanical tells with Grep instead of reading for them"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-502 — Make humanizer's check step count the mechanical tells with Grep instead of reading for them

## Why
Step 6 asks the model to "search again" for dashes and bold labels by reading, which is the tell most likely to survive.
These are character-level patterns a search finds exactly; anti-slop's lesson is to use a tool wherever a model guesses.

## Done when
- [ ] Step 6 counts, in the draft and in the final, the em dash, a spaced double hyphen used as a dash, bold-label list
      items (`- **Label:**`) and curly quotes, with the Grep tool when available, and reports before → after counts in
      pasted-text mode.
- [ ] A voice sample that uses a tell keeps it at about the sample's rate; the count is reported, not forced to zero.
- [ ] Code blocks and inline code are excluded from the counts.
- [ ] Exercised on one real text with known counts; the reported numbers match a second, independent count.
- [ ] SKILL.md ≤ ~140 lines; CHANGELOG line.

## Touches
`skills/humanizer/SKILL.md` (step 6) · `CHANGELOG.md`

## Assumes
- Shares `skills/humanizer/SKILL.md` with TASK-500 and TASK-501: G2 assigns one owner and a commit order.

## Tracker
anti-slop adoption scan 2026-10-25, item 4.
