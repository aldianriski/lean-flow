---
id: TASK-471
title: "The review-depth check fails an out-of-vocabulary consequence line"
sprint: SPRINT-135
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-471 — The review-depth check fails an out-of-vocabulary consequence line

## Why

Defect fix (ADR-053 §3, unfrozen). TD-244 (medium): the review-depth check silently ignores a `consequence ·` line whose class is
outside the vocabulary, so the review-owed check cannot fire on it. SPRINT-121 wrote `governance:med` and `behaviour:med`; the
strict pattern skipped both without a finding, so a governance-high task with a misspelled line reads as owing no review.

Tier G (other): a maintainer-side checker, so a must-FAIL fixture plus one run on its real artifact, no mutation campaign.
G2 review-round cap: 2.

## Done when

- [x] A `consequence · Tn · …` line whose behaviour token is outside `low|material`, or whose governance token is outside ✓ ae27947f: review-depth-consequence-vocab FAILs naming the bad token; the vocab loop runs before the review-line shortcut (fixture vocab-governance-med carries a review line and still FAILs)
      `low|high`, FAILs with a finding naming the bad token. The token check runs **before** the existing-review shortcut, so a
      task that also has a review record is still caught.
- [x] SPRINT-121's archived log, replayed at a non-archive path, FAILs naming `governance:med` and `behaviour:med`. ✓ SPRINT-121 replayed at a non-archive path: 3 FAILs -- T1, T2 governance:med; T5 behaviour:med
- [x] A retained must-FAIL fixture per bad axis, plus a valid sibling that stays green. ✓ fixtures vocab-behaviour-med, vocab-governance-med (must-FAIL) + vocab-valid-passes; run-review-depth-fixtures.sh: all green (23 cases)
- [x] TD-244 marked resolved in `TECH-DEBT.md`. ✓ TD-244 status: resolved -> TASK-471 (SPRINT-135)

## Touches

the review-depth checker and its fixtures · `TECH-DEBT.md`

## Assumes

- Archived logs stay unread by this checker (ruled; TD-085). Today no live log exists in the population the gate leg selects, so
  "live logs still pass" would be vacuous; the SPRINT-121 replay is the real-artifact run instead (Codex review at intake).

## Tracker

- TD-244 · intake draft reviewed by Codex 2026-10-21
