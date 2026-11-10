---
id: TASK-631
title: "Trial Jev as a pre-screen that replaces the A/B judge's call on decided cells and sends unsure cells on to the judge"
type: feature
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: G
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-631 — Trial Jev as a pre-screen that replaces the A/B judge's call on decided cells and sends unsure cells on to the judge

## Why
Owner verdict at the SPRINT-169 close, verbatim: "Trial as pre-screen now". TASK-628's replay on the three calibration runs: Jev decided 60 of 96 cells (unsure 36/96 = 37.5%) and agreed with the judge on 56/60, 40/60 and 31/33 of them (93.3%, 66.7%, 93.9%), at 0.000384 USD a call against the judge's 0.0783. Run1 is the weak one: the judge agrees with itself on 75.9% between run1 and run2. If the judge only sees the unsure cells, the cost is about 2.86 USD for 96 cells against 7.52 (derived: 0.037 + 0.375 × 7.52). Whether decided agreement is good enough is the owner's call, on the replay's numbers.

## Done when

- [ ] A pre-screen replay over the same three recorded runs takes Jev's decided calls (score 0.7 or more, or 0.3 or less) as the verdict, takes the recorded judge verdict for each unsure cell, and states the combined agreement with each run and with the expectation, the count of cells on each path, and the cost against judge-only.
- [ ] The report names which cells flip against the judge's verdict on the decided path, so the owner can read the disagreements, not only the rate.
- [ ] Negative: a failed or empty Jev call is never a decided verdict on the pre-screen path (it goes to the judge as an unsure cell or is reported as infra), and the A/B harness default and `evals/ab/lib/` are unchanged until the owner rules on the numbers.
- [ ] Jev spend stays inside the 5 USD total cap (0.0807 USD used), held by the script's `--budget-usd` guard.

## Touches
`scripts/jev-ab-judge.ts` (or a sibling replay script), `test/fixtures/jev-ab-judge/`.

## Assumes

- A1: Jev Noul (P(yes)) fits the judge's calls at thresholds 0.7 and 0.3; 0.3 to 0.7 is unsure (held in TASK-628's replay).
- A2: the judge's recorded verdicts in the three runs stand in for a live judge call on the unsure cells. The judge is not deterministic (it agrees with itself 72.9% to 98.1% across runs), so the combined figure has that noise floor. A live pre-screen wired into the harness is a later task, after the owner's ruling.
- A3: task files may be sent to api.typesafe.ai; `.env` and secrets may not (owner ruling). Run any test of the script with `bun --no-env-file` and never pass `--run` in a test (L-297).
- A4: price is 0.042 USD per Mtok input, output free.

## Tracker

Owner verdict 2026-11-08 at the SPRINT-169 close (Jev use 3) · TASK-628 `## Results` · TD-290

## Cancelled
2026-11-11, owner ruling: the A/B measurement system was removed, so a cheaper A/B judge has no use. Jev continues through TASK-627.
