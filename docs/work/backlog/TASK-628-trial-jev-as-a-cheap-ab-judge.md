---
id: TASK-628
title: "Trial Jev as a cheap judge for the A/B harness, and stop silent outage scoring"
type: feature
priority: P3
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: blocked
depends-on: [TASK-627]
---

# TASK-628 — Trial Jev as a cheap judge for the A/B harness, and stop silent outage scoring

## Why
Third use in the chain, in the TD-290 area where judge calls can fail. It needs a delta over the harness's existing judge, with cost and agreement measured.

## Done when

- [ ] A replay compares Jev verdicts with the current judge's on the same recorded runs and states agreement and cost.
- [ ] A failed Jev call is classed as infra and is not scored as a verdict.
- [ ] Negative: a failed or empty Jev call is never scored as a not-passed slot, and the A/B harness default is unchanged until the owner rules.

## Assumes

- A1: Jev Box fits both judgments, thresholds 0.7/0.3; a score from 0.3 to 0.7 is "unsure" (confirmed in TASK-625).
- A2: Plain fetch to api.typesafe.ai works with `jev-1.14.0` pinned; the SDK only if the API facts show fetch cannot.
- A3: Task files may be sent to api.typesafe.ai; `.env` and secrets may not (owner ruling).
- A4: Price is 0.042 USD per Mtok input, output free; one run is cents.
- **blocked-by:** TASK-627 is done and the owner has ruled on its Results.

## Tracker

Owner ruling 2026-11-08 (Jev adoption, use 3 of 4) · TD-290
