---
id: TASK-641
title: "Confirm the row 6 merger result on a different sprint with fresh ordinary controls and a balanced run order"
type: feature
epic: EPIC-024
sprint: SPRINT-171
priority: P3
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: [TASK-640]
---

# TASK-641 — Confirm the row 6 merger result on a different sprint with fresh ordinary controls and a balanced run order

## Why
Row 6 passed its frozen bar: merger runs 3.8 and 3.9 USD and 24.0 and 27.4 min against the ordinary mean of 4.05 USD and 47.85 min, 0 bad merges, and the unsafe wrong-base merge refused. Codex's challenge (Med): n = 2 per side, runs on a later day than the ordinary runs, and only 4 to 6 percent of cost headroom support a provisional go, not a reliable savings claim. Part of the time gap is probably variance. The owner has not ruled to ship (TASK-646). Before the merger could become any default, the result needs a second look that shares nothing with the first.

## Done when

- [x] A confirmation design is frozen before any paid run: a different sprint's replay, fresh ordinary controls run in the same session as the merger runs, a balanced (interleaved) order, at least three runs per side, and a verdict rule stated with its stop rules. ✓ G2-B signed and logged at `1533e423` (04:26 UTC), before the first paid run (N1, 06:14 UTC): SPRINT-130 replay, N/K order N1 K1 K2 N2 N3 K3, 3 per side, verdict and stop rules S1 to S9. Later owner rulings changed the oracle's content rule, added one replacement per arm and the futility stop, each logged verbatim before the run it governed
- [x] The verdict is recorded in EPIC-024 row 6 as confirmed, not confirmed or inconclusive, with each side's cost, time and merge-oracle result. ✓ inconclusive (futility stop), EPIC-024 D20, with row 6 now ending `*Amended: D15 (provisional go), D20*`. Figures match the kit's `verdict`, which recomputes them from the recorded files (row spend 7.453378 USD)
- [x] Negative: the earlier ordinary runs (O1, O2) are not reused as this trial's controls, and no merger file is placed on `main` or in `.claude/agents/` by this task. ✓ the kit's order holds only N and K ids (no O1 or O2); `git ls-tree -r main -- agents .claude/agents | grep -c merger` gives 0; `agents/merger.md` lives only on `trial/epic-024-merger-s171`

## Touches
`docs/epic/EPIC-024-agent-roles-one-by-one.md`, `docs/work/`; trial files stay on a trial branch.

## Assumes
- A1: the harness is in `scripts/trials/` (TASK-640).
- **blocked-by:** the owner's budget and the choice of sprint to replay; ask both in the frontier round that opens this task.

## Tracker
SPRINT-170 close Retro · Codex recap review, challenge on row 6 and candidate 1 (CHANGE)

## Results
**Row 6 confirmation on SPRINT-130: inconclusive** (2026-11-10, SPRINT-171 T6). The futility stop ended the trial once the merger side could no longer reach 3 valid runs.

| Run | Arm | USD (headless / transcript) | Minutes | Oracle | Off-host gate | Valid |
|---|---|---|---|---|---|---|
| N1 | ordinary | 1.788 / 1.820 | 10.2 | PASS | green (298/0) | yes |
| K1 | merger | 2.559 / 2.610 | 12.7 | PASS | red twice (297/1) | no: gate, `/tmp` writes |
| K2 | merger | 0.347 / 0.352 | 116.0 (3.4 without its 113-min stall) | no merges | none | no: host kill |
| K2R | merger | 2.649 / 2.704 | 13.2 | PASS | red twice (298/1) | no: gate, `/tmp` writes |

Selected cost is the smaller reading for N and the larger for K (design). Spend 7.453 of the 26 USD row.
- Both completed merger runs merged correctly: oracle PASS, with each task's files equal to its branch side at the merge and at the replay tip. Neither was a bad merge, so the S2 stop never applied.
- Both read red on `layers observed`, because builder commits carried subjects no task owns. N1's coordinator rebuilt its merges with SPRINT-130's subject convention, and the merger arm's prompt forbids that repair. The `/tmp` writes came from read-only inspectors and the T2 builder, workers both arms share, not from the merger.
- Not run: N2, N3, K3, K4 (futility, owner ruling). The queue is as easy as SPRINT-167's (disjoint files), so even a valid set would not have tested conflicting merges.
