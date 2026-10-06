---
id: TASK-401
title: "Name the Codex loop in the review record, so a loop that ends CLEAR leaves a `review ·` line"
priority: P2
size: S
risk: low
autonomy: AFK
class: execution
tier: G
authority: J1
origin: close-retro
state: ready
depends-on: []
sprint: SPRINT-116
---

# TASK-401 — Name the Codex loop in the review record

## Why

SPRINT-114's release gate read `313 pass, 7 fail`, and all 7 were `review-depth-*-absent`. T1–T4 had each been reviewed by a Codex loop
that ended CLEAR, and T6 was reviewed at close. But the record step in `skills/orchestrator/references/review-scoping.md` (and
night-run.md Part 4's depth vocabulary: `self-review | scoped-reviewer | code-review | security-review`) does not name the Codex loop the
owner's D3 rule makes the default reviewer. So no step that ran this sprint ever reached "append `review · Tn · …`". The reviews lived in
prose, which `check-review-depth.sh` correctly refuses to match (L-151, L-225). The gate caught it only at the release-time full run.

## Done when

- [x] Wherever a review loop is said to end (review-scoping.md § the revise loop, and the dispatch brief's Codex step if one exists), the
      procedure says to append the `review · Tn · <depth> · behaviour:… · governance:…` line when the loop closes, whichever reviewer ran.
      Part 4's depth vocabulary names an external-reviewer depth, or the docs state that a Codex loop records as `scoped-reviewer`, but
      not both. ✓ babf3791 (merge f2585a5): review-scoping.md § The revise loop says a closing loop appends the review line whichever reviewer ran, and an external reviewer records as scoped-reviewer; night-run.md Part 4 points at it; no fifth depth word. Codex review round 1: CLEAR
- [x] `check-review-depth.sh`'s regex and the documented line still agree (L-058), proven by one must-FAIL fixture: a log with a Codex-CLEAR
      prose entry and no record line reddens. ✓ check-review-depth.sh unchanged; case 19 codex-clear-no-review-line-fails exits 1 with review-depth-governance-absent, case 20 control passes, the two differ in one line; control seeded-break reddened only case 20, restore hash dc46b148 == HEAD; coordinator re-run on main: REVIEW-DEPTH FIXTURES: all green

## Assumes

none

## Tracker

- SPRINT-114 close Retro · Log entry 2026-10-04 (release gate 313/7) · L-225 · L-151
