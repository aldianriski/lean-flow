---
id: TASK-626
title: "Add a Bun script that asks Jev whether each Done-when box is observable and each Negative names a concrete case"
type: feature
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-625]
---

# TASK-626 — Add a Bun script that asks Jev whether each Done-when box is observable and each Negative names a concrete case

## Why
It is the first Jev use, by owner ruling, and an advisory maintainer instrument outside the gate and `qa-check.sh`. Any later proposal to put it in the gate must name one of ADR-053's five conditions (measured defect, measured cost, repeated failure, security, consumer evidence).
Tier G (other): one must-FAIL fixture plus one run on the real artifact. G2 review-round cap: 2.

## Done when

- [ ] `scripts/jev-done-when.ts` runs under Bun and prints a table per box with `observable?` and `concrete Negative?`, each pass, fail or unsure (score 0.3 to 0.7).
- [ ] The default is a dry run printing estimated input tokens and cost with no call; `--run` calls Jev; `--budget-usd` (default 5) is the remaining budget and a run aborts before any call when its estimate is above it.
- [ ] Each run prints its spend; the key is read from `jev_key` and mapped to `TYPESAFE_API_KEY` in code, with plain fetch and `jev-1.14.0` pinned.
- [ ] A retained fixture under test/fixtures holds one task file with an unobservable box, a vague Negative and one well-formed control box; --run on it exits non-zero naming UNOBSERVABLE and NEGATIVE-VAGUE, and the control box reads pass.
- [ ] One `--run` over all `docs/work/*/TASK-*.md` is recorded in Results with the skip count, the verdicts, the spend and the cumulative spend noted by hand.
- [ ] Negative: a missing jev_key, or an estimate above --budget-usd, stops before any call with a named message; the key value is never printed, and the script reads only jev_key from the environment, never the dotenv file itself.

## Touches

`scripts/jev-done-when.ts`, `test/fixtures/` (one task file). G2 check: confirm the call against the API facts section of TASK-625's doc; if it is "unconfirmed", G2 stops.

## Assumes

- A1: Jev Box fits both judgments, thresholds 0.7/0.3; a score from 0.3 to 0.7 is "unsure" (confirmed in TASK-625).
- A2: Plain fetch to api.typesafe.ai works with `jev-1.14.0` pinned; the SDK only if the API facts show fetch cannot.
- A3: Task files may be sent to api.typesafe.ai; `.env` and secrets may not (owner ruling).
- A4: Price is 0.042 USD per Mtok input, output free; one run is cents.
- A5: Task files with no `## Done when` section are skipped and the skip count is reported.
- Bun loads `.env` automatically (scripts/gate-remote.ts:13), so `jev_key` reaches the process without the script opening the file.
- No persisted spend ledger: the 5 USD total is held by the budget flag plus a by-hand note in Results.

## Tracker

Owner ruling 2026-11-08 (Jev adoption, use 1 of 4)
