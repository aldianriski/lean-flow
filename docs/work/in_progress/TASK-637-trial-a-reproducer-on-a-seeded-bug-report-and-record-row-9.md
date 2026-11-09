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
- [ ] A seeded bug report with a hidden cause, its clean twin, and a numeric saving threshold are frozen before any run.
- [ ] `/diagnose` Phases 1 and 2, and the reproducer, each run on the report in fresh sessions, in counterbalanced order, with the same report, model, resources and limits, and with the answer key hidden from both.
- [ ] Each repro is rerun independently against the seeded bug and the clean twin. It counts only if it shows the reported symptom on the bug every time and not on the twin.
- [ ] The verdict is recorded in EPIC-024 row 9, no-go included. Pass only if the reproducer reproduces where `/diagnose` does not, or both reproduce and the reproducer is cheaper by at least the threshold, and the reproducer reports no defect on the clean twin. A failed or unknown control is no-go.
- [ ] Negative: the reproducer lands no fix and no unasked change. Scratch repro files are allowed; the product tree stays unchanged. Trial files stay on the trial branch; only this file's evidence and the epic row land on `main`. A pass ships only by an owner exception that names the tested artifact.

## Touches
Trial branch: the reproducer's agent file. Scratch repo. `main`: this file and EPIC-024 row 9.

## Assumes
- **A1** — The seeded report, its twin and the threshold are fixed at G2.
- **A2** — All-in spend is charged to the sprint's 60 USD cap. Row limits are frozen at G2.

## Tracker
EPIC-024 row 9, D13 · `skills/diagnose/SKILL.md` § Phase 1 and 2
