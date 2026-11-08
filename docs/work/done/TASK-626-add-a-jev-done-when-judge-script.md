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
sprint: SPRINT-168
---

# TASK-626 — Add a Bun script that asks Jev whether each Done-when box is observable and each Negative names a concrete case

## Why
It is the first Jev use, by owner ruling, and an advisory maintainer instrument outside the gate and `qa-check.sh`. Any later proposal to put it in the gate must name one of ADR-053's five conditions (measured defect, measured cost, repeated failure, security, consumer evidence).
Tier G (other): one must-FAIL fixture plus one run on the real artifact. G2 review-round cap: 2.

## Done when

- [x] `scripts/jev-done-when.ts` runs under Bun and prints a table per box with `observable?` and `concrete Negative?`, each pass, fail or unsure (score 0.3 to 0.7). ✓ fixture run table, § Results
- [x] The default is a dry run printing estimated input tokens and cost with no call; `--run` calls Jev; `--budget-usd` (default 5) is the remaining budget and a run aborts before any call when its estimate is above it. ✓ dry run exit 0 with `estimate:`; `--budget-usd 0.000001` stop exit 2; fetch only under `--run` after both guards (review r1+r2)
- [x] Each run prints its spend; the key is read from `jev_key` and mapped to `TYPESAFE_API_KEY` in code, with plain fetch and `jev-1.14.0` pinned. ✓ spend line in both paid runs; `jev_key` → `TYPESAFE_API_KEY` line 90; `fetch` line 106; `"jev-1.14.0"` line 36 (judgment tick by code read)
- [x] A retained fixture under test/fixtures holds one task file with an unobservable box, a vague Negative and one well-formed control box; --run on it exits non-zero naming UNOBSERVABLE and NEGATIVE-VAGUE, and the control box reads pass. ✓ exit 1, UNOBSERVABLE=2, NEGATIVE-VAGUE=1, control pass (0.97)
- [x] One `--run` over all `docs/work/*/TASK-*.md` is recorded in Results with the skip count, the verdicts, the spend and the cumulative spend noted by hand. ✓ § Results: 108 files, 0 skipped, 395 boxes, 0.0070 USD, cumulative 0.0071 USD
- [x] Negative: a missing jev_key, or an estimate above --budget-usd, stops before any call with a named message; the key value is never printed, and the script reads only jev_key from the environment, never the dotenv file itself. ✓ both guard stops exit 2 with named messages and no call; key printed nowhere (redacted on error, review r2); readFileSync only on .md inputs, `.env*` refused (line 66)

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

## Results

Built by Codex in a worktree (no network). Reviewed by a scoped Sonnet reviewer in two rounds: round 1 had no High or Medium findings, and the two worst Lows were fixed by one builder retry (a run failure now exits 3 and is never scored; the key is trimmed once). Round 2 was clean. Landed in 66d4be0f with blob hashes equal to the worktree's. Both paid runs were made by the coordinator from the main tree.

**Fixture run** (`--run test/fixtures/jev-done-when/sample-task.md`): exit 1.
- Unobservable box: fail (0.04).
- Vague Negative: observable fail (0.25), concrete Negative fail (0.03).
- Control box: pass (0.97).
- `findings: UNOBSERVABLE=2; NEGATIVE-VAGUE=1`. The summary line prints both names even at 0, so the counts are the evidence, not the names.
- Spend 0.000046326 USD (reported input usage). No retune was needed.

**Real run** (`--run`, default glob `docs/work/*/TASK-*.md`): exit 1, as expected.
- 108 files read, 0 skipped, 395 boxes judged.
- Observable: 166 pass, 229 unsure, 9 fail. Concrete Negative: 0 NEGATIVE-VAGUE.
- The 9 UNOBSERVABLE boxes are in TASK-523, TASK-366, TASK-567, TASK-576 (×2), TASK-609, TASK-452, TASK-524 and TASK-604. Only TASK-523 is open (backlog).
- Spend 0.007005306 USD (reported input usage).
- Reading: most real boxes land in the 0.3-0.7 band, so the vendor default thresholds leave the judge mostly undecided on this corpus. That is a measurement for the next use's design, not a defect in this script.

**Cumulative Jev spend, noted by hand:** 0.000046326 + 0.007005306 = **0.007051632 USD** of the 5 USD cap.
