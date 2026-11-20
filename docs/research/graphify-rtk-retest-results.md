---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: A run or a coordinator dispatch is booked to the ledger, or TASK-678 closes
status: current
id: graphify-rtk-retest-results
tags: [tooling]
domain: knowledge
related: [graphify-rtk-retest-questions, graphify-workdoo-test, rtk-trial-verdict]
---

# graphify and RTK re-test — ledger and run results

> The SPRINT-182 ledger. Cap 8.00 USD; 0.50 USD is held back for scoring. A run starts only if ledger +
> its `--max-budget-usd` + 0.50 is at most 8.00 and its `--max-budget-usd` is at least 0.30 (the probe refuses
> otherwise). Runs book `total_cost_usd` (basis `actual`). Coordinator Sonnet dispatches book reported tokens
> x 3.00 USD/MTok (basis `estimate`, conservative). A run with no `result` event or no `total_cost_usd` is
> written as `UNPRICED` and blocks all later runs until the row is reconciled by a new row.

Fixture commit: `46043cf5` (questions, key and frozen run rules, committed before any arm ran).

Smoke runs (T1, plain config, held-out prompts, not scored): `plain-smoke` 0.0450 USD, 52,858 tokens, 1 Grep call, no
hook events, 5.9 s, answer correct (200 `{status:'ok', version}`; 503 `unavailable` on a failed query). The model skipped
the quote-or-NONE line, so `plain-smoke2` asked it alone: **NONE** (0.0282 USD). Config sources from the init event:
`memory_paths` holds only workdoo's project auto-memory directory, which does not exist; skills and plugins are
built-in only, with no graphify or rtk entry. The plain arm is uncontaminated, so the per-run `CLAUDE_CONFIG_DIR`
fallback is not needed. Snapshot HEAD and `git status --porcelain --ignored` equalled the baseline after both runs.

## Ledger

<!-- LEDGER-ROWS: the probe appends one row after the header; keep the table contiguous. -->

| time | item | kind | USD | basis | cumulative |
|---|---|---|---|---|---|
| 2026-11-20T03:41:00Z | T1 builder (fixture, key, probe; 153,486 reported tokens × 3.00 USD/MTok) | dispatch | 0.4605 | estimate | 0.4605 |
| 2026-11-20T03:47:00Z | T1 key check (blind second pass; 94,674 reported tokens × 3.00 USD/MTok) | dispatch | 0.2840 | estimate | 0.7445 |
| 2026-11-20T03:43:43.262Z | plain-smoke | run | 0.0450 | actual | 0.7895 |
| 2026-11-20T03:44:22.223Z | plain-smoke2 | run | 0.0282 | actual | 0.8177 |

## T2 — graphify arm run results

_Empty until TASK-677 runs._

## T3 — RTK arm run results

_Empty until TASK-678 runs._
