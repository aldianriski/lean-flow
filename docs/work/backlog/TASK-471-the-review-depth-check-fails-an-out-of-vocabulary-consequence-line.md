---
id: TASK-471
title: "The review-depth check fails an out-of-vocabulary consequence line"
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

- [ ] A `consequence · Tn · …` line whose behaviour token is outside `low|material`, or whose governance token is outside
      `low|high`, FAILs with a finding naming the bad token. The token check runs **before** the existing-review shortcut, so a
      task that also has a review record is still caught.
- [ ] SPRINT-121's archived log, replayed at a non-archive path, FAILs naming `governance:med` and `behaviour:med`.
- [ ] A retained must-FAIL fixture per bad axis, plus a valid sibling that stays green.
- [ ] TD-244 marked resolved in `TECH-DEBT.md`.

## Touches

the review-depth checker and its fixtures · `TECH-DEBT.md`

## Assumes

- Archived logs stay unread by this checker (ruled; TD-085). Today no live log exists in the population the gate leg selects, so
  "live logs still pass" would be vacuous; the SPRINT-121 replay is the real-artifact run instead (Codex review at intake).

## Tracker

- TD-244 · intake draft reviewed by Codex 2026-10-21
