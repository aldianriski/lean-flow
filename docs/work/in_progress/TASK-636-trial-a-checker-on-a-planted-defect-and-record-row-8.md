---
id: TASK-636
title: "Trial a checker on a planted defect against the gate and scoped review, and record row 8's verdict"
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

# TASK-636 — Trial a checker on a planted defect against the gate and scoped review, and record row 8's verdict

## Why
Row 8 is a standard safeguard to prove (D13): a checker that finds a defect the gate and review missed. No such miss is on record.
The planted case shows the checker works, not that it is needed (ADR-053), so a pass ships only by an owner exception (owner popup, 2026-11-08).

## G2 (signed 2026-11-09)
Batch G2 signed for SPRINT-170: the design is the SPRINT-170 Execution Log entry "2026-11-09 | gate | G2 batch signed" (its draft section for this task, as amended by its settlements S0 to S36, which win on any conflict).

## Done when
- [ ] The seeded defect in a small real change, and a materiality rule for findings, are frozen before any run. The seed is never replaced.
- [ ] The full existing procedure runs on the seeded change: the gate and the scoped review, including its second look after zero findings, with their verdict lines recorded. If either catches the seed, the row records "no gap shown" and is no-go.
- [ ] Otherwise the checker runs on the seeded change and on the same change with the defect removed, blind to the seed and to the earlier verdicts, with a model, access and budget comparable to the review's. A reader other than the checker judges its findings against the materiality rule.
- [ ] The verdict is recorded in EPIC-024 row 8, no-go included. Pass only if the checker finds the seed and raises nothing material on the control. Anything else is no-go.
- [ ] Negative: the checker edits no file and lands no fix; it reports. Trial files stay on the trial branch; only this file's evidence and the epic row land on `main`. A pass ships only by an owner exception that names the tested artifact.

## Touches
Trial branch: the checker's agent file. Scratch repo or worktree. `main`: this file and EPIC-024 row 8.

## Assumes
- **A1** — The seed is one a real change could plausibly carry; G2 names it and the materiality rule.
- **A2** — All-in spend is charged to the sprint's 60 USD cap. Row limits are frozen at G2.

## Tracker
EPIC-024 row 8, D13 · `skills/orchestrator/references/review-scoping.md`
