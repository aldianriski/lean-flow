---
id: TASK-634
title: "Trial a merger worker on the merge-back queue against the coordinator, on the matched replay, and record row 6's verdict"
epic: EPIC-024
sprint: SPRINT-170
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-638]
---

# TASK-634 — Trial a merger worker on the merge-back queue against the coordinator, on the matched replay, and record row 6's verdict

## Why
Row 6 asks whether a merger worker should run the merge-back queue. SPRINT-167 merged twice (`0137a51c`, `9375b607`), but no replay used worktree isolation, so no replay merged anything.
Owner popup, 2026-11-08: allow isolation in all replay arms, as the original sprint ran. TASK-632 owns the shared harness and TASK-638 the two ordinary baseline runs; this task consumes them.

## G2 (signed 2026-11-09)
Batch G2 signed for SPRINT-170: the design is the SPRINT-170 Execution Log entry "2026-11-09 | gate | G2 batch signed" (its draft section for this task, as amended by its settlements S0 to S36, which win on any conflict).

## Done when
- [x] Every replay arm, TASK-638's included, builds both tasks in worktrees inside the run's own scratch repository and merges both back. An ordinary run with fewer than the two merge-backs is invalid for both this verdict and TASK-638's. ✓ O1, O2, R1, M1' and M2 each built both tasks in worktree-isolated workers inside their own scratch clone and merged both back there (two merges each; R1 three, with close). M1 (invalid, treatment prompt) is reported in § Results.
- [x] Two merger runs of the SPRINT-167 replay from `6a7cadf2`, on TASK-632's frozen settings: ordinary coordination plus a merger worker that runs the merge-back queue, the coordinator merging nothing itself. One case asks for an unsafe merge, and the merger refuses it with the target unchanged. ✓ M1' (3.759 USD, 24.0 min) and M2 (3.854 USD, 27.4 min) on the frozen settings; the coordinator ran no merge in either. Unsafe case M-U: a wrong-base branch breaking SPRINT-167 D3 that git would merge cleanly; the merger refused (`blocked`, reasons named), `replay` unchanged at 2cfa97b3, 0 new commits.
- [x] Each merge is judged against a frozen oracle: the expected changes, base and queue order. A worker other than the merger inspects the integrated tree and runs the post-merge checks. ✓ `merge-oracle.ts` (expected file sets, two-parent merges, queue order, base descent, no manual repair on the first-parent line, content rules, no markers): M1' and M2 PASS; calibrated on O1, O2 and R1 (PASS) and a must-FAIL fixture (swapped sets, BAD MERGE). Separate Sonnet inspectors ran merge-check after every merge.
  A lost or unexpected change, an unresolved conflict, a wrong base, a false success or a manual repair is a bad merge.
- [x] The verdict is recorded in EPIC-024 row 6. Go only if no merge is bad, both merger runs pass all 11 boxes, the gate and review, and each run's cost and elapsed time are no worse than the ordinary mean. Anything else, including inconclusive, is no-go. ✓ **go**: 0 bad merges; M1' and M2 11/11, gate green on the operator rerun (472/0), reviews done; cost 3.8 and 3.9 against the 4.05 ordinary mean, time 24.0 and 27.4 against 47.85 min (readings against a pass).
- [x] Negative: a run with no merge, or a merge the coordinator did, is reported and never counts toward a go. Trial files stay on the trial branch; only this file's evidence and the epic row land on `main`. No run pushes or writes outside its scratch repository. ✓ M1 (no T2 merge, stopped by the coordinator's treatment prompt) is reported and does not count; no merge in M1', M2 or M-U was run by the coordinator (checked per Bash call); `agents/merger.md` stays on `trial/epic-024-merger` b2c71d34; no run pushed or wrote outside its scratch clone (snapshots unchanged).

## Touches
Trial branch: `agents/merger.md`. Scratch worktrees. `main`: this file and EPIC-024 row 6.

## Assumes
- **A1** — The merge oracle and the unsafe-merge case are fixed at G2, before any run.
- **A2** — All-in spend is charged to the sprint's 60 USD cap, about 9 to 10 USD here. Row limits are frozen at G2; reruns are cut first.

## Tracker
EPIC-024 row 6 · TASK-638 (shared ordinary baseline) · TASK-632 (harness settings)

## Results

**Row 6: go** (2026-11-09, SPRINT-170). A merger worker running the merge-back queue made no bad merge and its runs came in under the ordinary mean on both cost and time.

| Run | Arm | USD (stream / rows) | Minutes | Boxes | Gate (operator rerun) | Merges (by) | Oracle |
|---|---|---|---|---|---|---|---|
| O1 | ordinary (TASK-638) | 3.849 / 3.8 | 42.0 | 11/11 | 472/0 | 2 (coordinator) | PASS |
| O2 | ordinary (TASK-638) | 4.319 / 4.3 | 53.7 | 11/11 | 472/0 | 2 (coordinator) | PASS |
| M-U | merger, unsafe case | 0.283 | 0.6 | n/a | n/a | 0, refused | n/a |
| M1 | merger, first prompt | 1.641 | 36.4 | 0/11 | not run | 1 (merger) | no T2 merge |
| M1' | merger | 3.759 / 3.8 | 24.0 | 11/11 | 472/0 | 2 (merger) | PASS |
| M2 | merger | 3.854 / 3.9 | 27.4 | 11/11 | 472/0 | 2 (merger) | PASS |

- M1 is invalid by the coordinator's own harness error: its treatment paragraph said "repair nothing yourself … on a fail, stop the queue", so a routine SPRINT-167 record fix halted the queue after merge 1. Fixed by owner ruling ("Fix + M1', early-stop M2"); the merger prompt and file did not change.
- Caveat for shipping: two merger runs against two ordinary runs, and the merger runs ran later in the day than the ordinary ones. The time gap (25.7 against 47.85 min mean) is larger than a merge queue explains, so part of it is likely run-to-run variance; the go is by the frozen rule, not a measured effect size.
