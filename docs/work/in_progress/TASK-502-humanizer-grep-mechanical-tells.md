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
sprint: SPRINT-140
---

# TASK-502 — Make humanizer's check step count the mechanical tells with Grep instead of reading for them

## Why
Step 6 asks the model to "search again" for dashes and bold labels by reading, which is the tell most likely to survive.
These are character-level patterns a search finds exactly; anti-slop's lesson is to use a tool wherever a model guesses.

## Done when
- [x] Step 6 counts, in the draft and in the final, the em dash, a spaced double hyphen used as a dash, bold-label list ✓ `74d53556`: step 6 counts the draft, step 7 the final; occurrences via Grep on a working-folder scratch file (removed after); run 2 used one Grep over both scratch files
      items (`- **Label:**`) and curly quotes, with the Grep tool when available, and reports before → after counts in
      pasted-text mode.
- [x] A voice sample that uses a tell keeps it at about the sample's rate; the count is reported, not forced to zero. ✓ `74d53556`: rate per 100 words from the sample (catalog § Voice); otherwise the catalog rules, zero target only where it requires one (Codex R2 fix, R3 CLEAR)
- [x] Code blocks and inline code are excluded from the counts. ✓ both runs excluded the fenced block's 3 em dashes and 1 spaced --, and the inline `--` and `“quoted”`; independent count agrees
- [x] Exercised on one real text with known counts; the reported numbers match a second, independent count. ✓ sample with known counts: run 1 (hand count, scratch write denied in system temp) and run 2 (Grep path) both reported 3/2/3/4 → 0/0/0/0; independent python count 3/2/3/4 → 0/0/0/0
- [x] SKILL.md ≤ ~140 lines; CHANGELOG line. ✓ SKILL.md 117/140, no line over 400; prose-density 28/0; check-doc-caps 0 FAIL; CHANGELOG bullet in `74d53556`

## Touches
`skills/humanizer/SKILL.md` (step 6) · `CHANGELOG.md`

## Assumes
- Shares `skills/humanizer/SKILL.md` with TASK-500 and TASK-501: G2 assigns one owner and a commit order.

## Tracker
anti-slop adoption scan 2026-10-25, item 4.
