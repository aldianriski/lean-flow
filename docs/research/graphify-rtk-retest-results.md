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
| 2026-11-20T03:47:35.863Z | plain-1 | run | 0.3171 | actual | 1.1348 |
| 2026-11-20T03:49:55.256Z | graphify-1 | run | 0.2584 | actual | 1.3932 |
| 2026-11-20T03:51:16.956Z | graphify-2 | run | 0.1989 | actual | 1.5921 |
| 2026-11-20T03:52:14.067Z | plain-2 | run | 0.1990 | actual | 1.7911 |
| 2026-11-20T03:58:00Z | T2 blind scorer (68,949 reported tokens × 3.00 USD/MTok) | dispatch | 0.2068 | estimate | 1.9979 |

## T2 — graphify arm run results

Order plain-1, graphify-1, graphify-2, plain-2; the snapshot was reset to the baseline before each run and graphify
was re-installed for each graphify run (graphify 0.9.103: `graphify update .` with `.graphifyignore` = `.claude/worktrees/`,
0 LLM tokens, 5,880 nodes, 16,662 edges, 263 communities, 58 s then 22 s; then `graphify install --project`, which wrote
a root `CLAUDE.md` graphify section, a registration in the tracked `.claude/CLAUDE.md`, `.claude/settings.json` PreToolUse
hooks on `Bash|Grep` and `Read|Glob` plus a SessionStart hook, and `.claude/skills/`).

| Run | Correct (of 6) | Tokens (bar unit) | USD | Tool calls | Hook events | Nudges | graphify queries | Wall |
|---|---|---|---|---|---|---|---|---|
| plain-1 | 6 | 296,527 | 0.3171 | Grep 5, Read 10 | 0 | 0 | 0 | 48.5 s |
| graphify-1 | 6 | 381,198 | 0.2584 | Bash 6, Read 5 | 22 | 1 | 1 | 42.5 s |
| graphify-2 | 6 | 248,932 | 0.1989 | Bash 7 | 14 | 3 | 0 | 40.9 s |
| plain-2 | 6 | 221,618 | 0.1990 | Grep 8, Read 7 | 0 | 0 | 0 | 43.5 s |

- **Correctness:** plain 12/12, graphify 12/12 (blind Sonnet scorer, labels R1–R4 shuffled, tool names redacted; map
  R1 = graphify-2, R2 = plain-1, R3 = plain-2, R4 = graphify-1, held by the coordinator).
- **Tokens:** plain mean 259,073, graphify mean 315,065 → **1.216×** plain. Gap 55,993; spread plain 74,909, graphify
  132,266.
- **USD (reported beside it):** plain mean 0.2581, graphify mean 0.2287 → 0.886×. Gap −0.0294; spread plain 0.1181,
  graphify 0.0595.
- **Hook evidence:** both graphify runs carry `hook_response` events with additionalContext (1 and 3 nudges), so both are
  counted runs; the agent ran one `graphify query` in 13 Bash calls across the two runs. Plain runs: no graphify or rtk
  call (not void).
- **Side effect:** `graphify install --project` also refreshed the global `~/.claude/skills/graphify` from 0.8.13 to
  0.9.103 (the owner had upgraded the package). `~/.claude/CLAUDE.md` and `settings.json` hashes were unchanged and no
  hook was added; runs load no user skills (init skill lists).
- Snapshot HEAD 884d897 and `git status --porcelain --ignored` equalled the baseline after the reverts.

## T3 — RTK arm run results

_Empty until TASK-678 runs._
