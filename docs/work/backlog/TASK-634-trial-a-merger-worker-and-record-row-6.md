---
id: TASK-634
title: "Trial a merger worker on the merge-back queue against the coordinator, on the matched replay, and record row 6's verdict"
epic: EPIC-024
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-632]
---

# TASK-634 — Trial a merger worker on the merge-back queue against the coordinator, on the matched replay, and record row 6's verdict

## Why
Row 6 asks whether a merger worker should run the merge-back queue. SPRINT-167 merged twice (`0137a51c`, `9375b607`), but no replay used worktree isolation, so no replay merged anything.
Owner popup, 2026-11-08: allow isolation in all replay arms, as the original sprint ran. TASK-632 owns the shared harness and the two ordinary baseline runs; this task consumes them.

## Done when
- [ ] Every replay arm, TASK-632's included, builds both tasks in worktrees inside the run's own scratch repository and merges both back. An ordinary run with fewer than the two merge-backs is invalid for both this verdict and TASK-632's.
- [ ] Two merger runs of the SPRINT-167 replay from `6a7cadf2`, on TASK-632's frozen settings: ordinary coordination plus a merger worker that runs the merge-back queue, the coordinator merging nothing itself. One case asks for an unsafe merge, and the merger refuses it with the target unchanged.
- [ ] Each merge is judged against a frozen oracle: the expected changes, base and queue order. A worker other than the merger inspects the integrated tree and runs the post-merge checks.
  A lost or unexpected change, an unresolved conflict, a wrong base, a false success or a manual repair is a bad merge.
- [ ] The verdict is recorded in EPIC-024 row 6. Go only if no merge is bad, both merger runs pass all 11 boxes, the gate and review, and each run's cost and elapsed time are no worse than the ordinary mean. Anything else, including inconclusive, is no-go.
- [ ] Negative: a run with no merge, or a merge the coordinator did, is reported and never counts toward a go. Trial files stay on the trial branch; only this file's evidence and the epic row land on `main`. No run pushes or writes outside its scratch repository.

## Touches
Trial branch: `agents/merger.md`. Scratch worktrees. `main`: this file and EPIC-024 row 6.

## Assumes
- **A1** — The merge oracle and the unsafe-merge case are fixed at G2, before any run.
- **A2** — All-in spend is charged to the sprint's 60 USD cap, about 9 to 10 USD here. Row limits are frozen at G2; reruns are cut first.

## Tracker
EPIC-024 row 6 · TASK-632 (shared ordinary baseline and settings)
