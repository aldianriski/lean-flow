---
id: TASK-637
title: "Trial a reproducer on a seeded bug report against /diagnose's feedback loop and reproduce phases, and record row 9's verdict"
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
depends-on: []
---

# TASK-637 — Trial a reproducer on a seeded bug report against /diagnose's feedback loop and reproduce phases, and record row 9's verdict

## Why
Row 9 is a standard safeguard to prove (D13): a reproducer that turns a bug report into a working repro. `/diagnose` already builds a feedback loop (Phase 1) and reproduces (Phase 2), so the reproducer must add to those.
No named gap in them is on record, so a pass ships only by an owner exception (ADR-053; owner popup, 2026-11-08).

## G2 (signed 2026-11-09)
Batch G2 signed for SPRINT-170: the design is the SPRINT-170 Execution Log entry "2026-11-09 | gate | G2 batch signed" (its draft section for this task, as amended by its settlements S0 to S36, which win on any conflict).

## Done when
- [x] A seeded bug report with a hidden cause, its clean twin, and a numeric saving threshold are frozen before any run. ✓ Frozen before any run: report (valid tags rejected in big files, not always the same tags), hidden cause (a module-level regex with the `g` flag carrying `lastIndex` between calls), clean twin (one line differs, seed check 4/4 PASS), saving threshold reproducer mean ≤ 0.75 × /diagnose mean.
- [x] `/diagnose` Phases 1 and 2, and the reproducer, each run on the report in fresh sessions, in counterbalanced order, with the same report, model, resources and limits, and with the answer key hidden from both. ✓ ABBA order D1, R1, R2, D2, then R-twin; each in its own fresh folder and session (S32), same Sonnet model, same tools, same report and deliverable text, 1.5 USD and 20-min limits; answer key in operator scratch, path audit 0 hits in every run (the R-twin "twin" hits are its own folder name).
- [x] Each repro is rerun independently against the seeded bug and the clean twin. It counts only if it shows the reported symptom on the bug every time and not on the twin. ✓ Each run's repro command run 5× on its bug tree and 5× on a twin copy: d1, r1, r2, d2 all exit 1 ×5 on the bug and 0 ×5 on the twin. Judgment tick: the commands key their exit code to valid tags being reported invalid, the reported symptom.
- [x] The verdict is recorded in EPIC-024 row 9, no-go included. Pass only if the reproducer reproduces where `/diagnose` does not, or both reproduce and the reproducer is cheaper by at least the threshold, and the reproducer reports no defect on the clean twin. A failed or unknown control is no-go. ✓ **go**: both arms reproduce (2/2 valid each), so the threshold decides: reproducer 0.048 and 0.031 USD (mean 0.039) against /diagnose 0.128 and 0.101 (mean 0.114), bar 0.086; R-twin ends `reproduced: no` (0.050 USD).
- [x] Negative: the reproducer lands no fix and no unasked change. Scratch repro files are allowed; the product tree stays unchanged. Trial files stay on the trial branch; only this file's evidence and the epic row land on `main`. A pass ships only by an owner exception that names the tested artifact. ✓ no run changed any file outside `repro/` (git status checked after each); the reproducer runs made 0 Edit/Write calls outside `repro/`; the agent file stays on `trial/epic-024-row9` 6712393d; ships only by an owner exception that names it (ADR-053).

## Touches
Trial branch: the reproducer's agent file. Scratch repo. `main`: this file and EPIC-024 row 9.

## Assumes
- **A1** — The seeded report, its twin and the threshold are fixed at G2.
- **A2** — All-in spend is charged to the sprint's 60 USD cap. Row limits are frozen at G2.

## Tracker
EPIC-024 row 9, D13 · `skills/diagnose/SKILL.md` § Phase 1 and 2

## Results

**Row 9: go** (2026-11-09, SPRINT-170). The reproducer reproduced as reliably as /diagnose's own Phases 1-2 at about a third of the cost.

| Run | Arm | USD | Wall | Reported | Repro on bug ×5 / twin ×5 |
|---|---|---|---|---|---|
| D1 | /diagnose P1-2 | 0.128 | 29 s | yes | 1 ×5 / 0 ×5 |
| R1 | reproducer | 0.048 | 17 s | yes | 1 ×5 / 0 ×5 |
| R2 | reproducer | 0.031 | 28 s | yes | 1 ×5 / 0 ×5 |
| D2 | /diagnose P1-2 | 0.101 | 26 s | yes | 1 ×5 / 0 ×5 |
| R-twin | reproducer on clean twin | 0.050 | 739 s | no | n/a |

- Caveats: one seeded bug, n = 2 per arm, and /diagnose was asked to stop after Phase 2, which it is not built to do. The saving may partly be /diagnose's procedure overhead rather than a better repro. No named gap in /diagnose is on record, so by ADR-053 a pass ships only by an owner exception; the likelier home is a /diagnose Phase-2 helper rather than a new role.
