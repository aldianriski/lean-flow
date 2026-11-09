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
- [x] The seeded defect in a small real change, and a materiality rule for findings, are frozen before any run. The seed is never replaced. ✓ Real change 5ca2c00e (TD-232 close check), seeded by script before any run: `REAPED_TAG_RE` end anchor dropped, plus the JSDoc and a fixture case name reworded to match (each edit `found 1`); the seed is material (M2 probe: a terminal line with a non-final `[derived]` counts as reaped on seeded, not on control). Materiality rule frozen in G2 (S27-S31). Seed never replaced.
- [x] The full existing procedure runs on the seeded change: the gate and the scoped review, including its second look after zero findings, with their verdict lines recorded. If either catches the seed, the row records "no gap shown" and is no-go. ✓ Gate (VPS, main's `gate-remote.ts` from the clone): control and seeded identical, `bun test` 441/0, qa-check 299/1 (the unrelated EPIC-005 prose-density FAIL, as SPRINT-135 recorded), so the gate does not catch it. Scoped review R1 (Sonnet, frozen brief, read-only tools, 0.143 USD, 35 s): `findings: 1`, at `check-sprint-by-reference.ts:174`, input `terminal · PLAN_EXHAUSTED · all [derived] done`, wrong result `--close` passes with no reaper run. The reader ruled it material on all four points. R2 not needed (R1 was not zero). **The review catches the seed: "no gap shown", no-go.**
- [x] Otherwise the checker runs on the seeded change and on the same change with the defect removed, blind to the seed and to the earlier verdicts, with a model, access and budget comparable to the review's. A reader other than the checker judges its findings against the materiality rule. ✓ not reached: the review caught the seed, so by this box's own condition the checker does not run (the checker file stays frozen on `trial/epic-024-row8` 7179cff0).
- [x] The verdict is recorded in EPIC-024 row 8, no-go included. Pass only if the checker finds the seed and raises nothing material on the control. Anything else is no-go. ✓ **no-go (no gap shown)**: the existing scoped review found the planted defect.
- [x] Negative: the checker edits no file and lands no fix; it reports. Trial files stay on the trial branch; only this file's evidence and the epic row land on `main`. A pass ships only by an owner exception that names the tested artifact. ✓ the checker never ran, so it edited nothing; R1 edited nothing (0 Edit/Write calls, clone status clean, HEAD unchanged) and read nothing outside its clone (path audit 0 hits for the host clone, the main repo and the branch names); trial file only on `trial/epic-024-row8`; only this file and EPIC-024 row 8 land on `main`.

## Touches
Trial branch: the checker's agent file. Scratch repo or worktree. `main`: this file and EPIC-024 row 8.

## Assumes
- **A1** — The seed is one a real change could plausibly carry; G2 names it and the materiality rule.
- **A2** — All-in spend is charged to the sprint's 60 USD cap. Row limits are frozen at G2.

## Tracker
EPIC-024 row 8, D13 · `skills/orchestrator/references/review-scoping.md`

## Results

**Row 8: no-go, no gap shown** (2026-11-09, SPRINT-170). The planted defect passes the gate but not the scoped review.

- Seed: commit 5ca2c00e's `REAPED_TAG_RE = /\[derived\]\s*$/` with its end anchor dropped, made self-consistent (JSDoc and fixture case name say "carries"; TD-232's own mitigation text already said "carrying").
- Gate on control and seeded, VPS: identical (441/0, 299/1), the one FAIL pre-existing and unrelated, so no gate leg separates them.
- Scoped review R1 caught it in 35 s for 0.143 USD with a reproducible input. The checker did not run, by the task's own condition.
- Reader: the coordinator, applying S27-S31's rule. Owner ruling on the way: the control gate is not green, but it reproduces SPRINT-135's recorded baseline exactly ("Proceed: baseline reproduced").
