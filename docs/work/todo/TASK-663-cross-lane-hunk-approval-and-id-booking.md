---
id: TASK-663
title: "Add cross-lane shared-file hunk approval and per-lane id-range booking, extending L-143"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-176
depends-on: [TASK-662]
---

# TASK-663 — Add cross-lane shared-file hunk approval and per-lane id-range booking, extending L-143

## Why

Consumer evidence (ADR-053 §4), not a defect. L-143 ("derive the maximum in use") is right inside one tree and blind to
other branches. The bloodlines lanes each saw only their own maximum, so the coordinator booked ranges: lane proposal 11-14T09:23
(`mobile-38`, TASK-100..119); coordinator allocation 11-14T15:29 (mobile-47 TD-023..027, L-020..023, TASK-126..139; c9
TD-018..022, L-016..019, TASK-152..153); correction 11-15T02:30 (range becomes TASK-171..199). The digests show no collision: the
booking prevented one, so no checker is justified. Shared files: hunk approvals 11-14T14:35 and 14:46 ("I own that file under
SPRINT-009 D2"), a review subagent first at 14:31 and 14:37, a cherry-pick backed out at 14:42. L-017 delta: Batch G2 ownership
and L-042 `git add -p` cover one sprint and one tree; the cross-lane owner and the lane-sends-diff protocol are unmatched. G2 review-round cap: 2.

## Done when

- [ ] The coordinator reference gains a cross-lane shared-file section:
  - the coordinator owns each named shared file;
  - a lane sends hunks or a diff;
  - the coordinator approves file by file, optionally after a review subagent;
  - the lane stages per hunk (`git add -p`);
  - a cherry-pick that turns out to be a whole-branch merge is backed out and logged.
- [ ] The reference gains an id-booking section:
  - the coordinator books a TD, L and TASK range per lane at launch, recorded in the lane brief and the coordinator's sprint log;
  - every booking, first or revised, starts above the maximum in use across all lane worktrees and every outstanding booking, and the ranges are mutually disjoint;
  - a lane derives its next id inside its range;
  - a coordinator-side id takes the max across all lane worktrees plus the booked ranges;
  - a range change is sent as a message and logged;
  - no ledger field and no checker.
- [ ] CONTEXT § Gates' L-143 grain and `skills/task-decomposer/references/task-file.md` rule 4 each state that the single-tree derivation is unchanged and that, in a multi-lane run, a lane derives inside its booked range. `.claude/CLAUDE.md` is untouched unless one pointer line fits at or under 80 lines.
- [ ] Re-verified at G2, by reading the scripts that parse ids, that no script derives a next id. If one does, changing that script is out of this task's scope and is filed as a separate task; this task stays prose at Tier P.
- [ ] Negative: a lane must not file a task, TD or L id outside its booked range, and a single-stream repo with no booking still derives the max exactly as before (L-143 unchanged).

## Touches

skills/orchestrator/references/coordinator.md · .claude/CONTEXT.md § Gates · skills/task-decomposer/references/task-file.md · CHANGELOG.md

## Assumes

- Builds after EPIC-025 Sprint B closes.
- Booking is prose, not tooling; no script derives ids (none found at intake; re-verified at G2).

## Tracker

Owner popup Q5; coordinator settlement Q3 (extend L-143, option a).
Codex intake review R1 NOT CLEAR (7 findings, all fixed), R2 662/663 CLEAR, 664 one High fixed in place (stop rule, no R3); owner approve 2026-11-15
