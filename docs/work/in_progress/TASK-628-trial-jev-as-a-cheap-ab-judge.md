---
id: TASK-628
title: "Trial Jev as a cheap judge for the A/B harness, and stop silent outage scoring"
type: feature
priority: P3
size: M
risk: med
autonomy: HITL
class: decision
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-169
---

# TASK-628 — Trial Jev as a cheap judge for the A/B harness, and stop silent outage scoring

## Why
Third use in the chain, in the TD-290 area where judge calls can fail. It needs a delta over the harness's existing judge, with cost and agreement measured.

## Done when

- [x] A replay compares Jev verdicts with the current judge's on the same recorded runs and states agreement and cost. ✓ paid replay on 32b8a8fb (TASK-628 ## Results): agreement with each of the 3 calibration runs and the expectation, and cost per call against the judge's
- [x] A failed Jev call is classed as infra and is not scored as a verdict. ✓ fixture run (test/fixtures/jev-ab-judge/, diff vs expected.txt exit 0): an HTTP 500 and an empty reply are infra, outside every count; 32b8a8fb
- [x] Negative: a failed or empty Jev call is never scored as a not-passed slot, and the A/B harness default is unchanged until the owner rules. ✓ fixture: failed and empty calls never scored; git diff --stat e5219eef..HEAD -- evals/ab/ empty; lockProblems() clean (dry-run pre-flight passed); 32b8a8fb

## Assumes

- A1: Jev Noul (P(yes)) fits both judgments, thresholds 0.7/0.3; a score from 0.3 to 0.7 is "unsure". TASK-625 refuted Box, which is image-only.
- A2: Plain fetch to api.typesafe.ai works with `jev-1.14.0` pinned; the SDK only if the API facts show fetch cannot.
- A3: Task files may be sent to api.typesafe.ai; `.env` and secrets may not (owner ruling).
- A4: Price is 0.042 USD per Mtok input, output free; one run is cents.

## Results

Paid run 2026-11-08 on `32b8a8fb`, `bun scripts/jev-ab-judge.ts --run --budget-usd 1`, exit 0: 96 calls, infra 0 of 96 (0 failed, 0 not sent), Jev unsure rate 36/96 = 37.5%. Pre-flight: the 96 rebuilt cells equal the keys of all three runs.

Jev against each recorded run (unsure counted as disagreement / unsure left out):
- `calibration.md`: 56/96 = 58.3% / 56/60 = 93.3%
- `calibration-run1.md`: 46/96 = 47.9% / 40/60 = 66.7%
- `calibration-run2.md` (42 judge-side infra cells excluded, 54 pairs): 31/54 = 57.4% / 31/33 = 93.9%

Against the expectation (unsure counted as a miss / unsure left out): Jev 45/64 = 70.3% / 45/48 = 93.8% · `calibration.md` 64/64 = 100.0% / 64/64 = 100.0% · `calibration-run1.md` 48/64 = 75.0% / 48/49 = 98.0% · `calibration-run2.md` 36/36 = 100.0% / 36/36 = 100.0%.

The judge against itself: `calibration.md` / run1 70/96 = 72.9% · `calibration.md` / run2 53/54 = 98.1% · run1 / run2 41/54 = 75.9%.

Cost: Jev 0.036843 USD for 96 calls (reported input usage), 0.000384 USD per call (derived). Judge 0.0783 USD per call (mean of 314 logged attempts, `judgeOverhead.costUsd` / 3), 7.52 USD for 96 calls.

**Cumulative Jev spend, noted by hand:** 0.007051632 (TASK-626) + 0.036843 (the accidental pass, SPRINT-169 Log) + 0.036843 (this run) = **0.080737632 USD** of the 5 USD cap.

## Tracker

Owner ruling 2026-11-08 (Jev adoption, use 3 of 4) · TD-290
