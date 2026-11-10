---
owner: Maintainer
last_updated: 2026-11-10
update_trigger: A resume trial is designed, the cost fit prices change, or the stream-json output-token gap is fixed
status: current
id: trial-cost-allocation
tags: [process, tooling]
domain: governance
related: [night-run-cost, TASK-645, TASK-633, EPIC-024]
---

# Research — How do worker, coordinator and cold-start costs compare across the two arms of a resume trial?

> **Question.** Row 5 priced each round from tokens inside one window. Arm B's coordinator starts cold and arm A's does not. Can the two arms be compared on cost without hiding that?
> **Verdict.** Yes, with three buckets per run and one allocation rule. Row 5's six round totals reproduce exactly. The recorded totals under-count output tokens, so the next resume trial must price from Claude Code transcripts. Row 5's no-go does not move.

## Why this matters

A resume trial wins or loses on cost as well as on correctness. A token window cannot show complete incremental cost, so a cost bar set on it could be met or missed by accounting alone. Row 5 itself is unaffected: its gate is the by-name test, which no USD figure feeds.

## Method

Inputs: the stream-json of each run (`total_cost_usd`, per-message usage) and the Claude Code transcripts of the same session (`cost-state` row, final per-message usage). Prices are the 2026-11-09 fit used by `session-cost.ts`. Every figure is tokens times that fit. The script is `t4-buckets.ts`, beside `t3-measure2.ts` outside the repo; it needs a Claude Code export, not just the repo.

**Window rule.** From the coordinator's dispatch (arm A: the resume message; arm B: the worker dispatch) to the first main-thread record at or after the worker's last record. A message is assigned by its start time to exactly one run and one bucket.

**Buckets.**
- *Cold start*: the coordinator's first assistant message of the session, which writes its prompt to cache. Measured in both arms. In arm B it is inside the window, because B dispatches in its first message. In arm A it falls before the window, in the build phase.
- *Worker*: the subagent's messages inside the window.
- *Coordinator*: the main-thread messages inside the window, apart from cold start.

**Allocation rule.** A cost stays with the run whose session paid it. Nothing moves between arms. Arm A's build phase (0.11 to 0.14 USD before the window) is not its incremental cost and is not charged to B. Each arm's round is shown with and without its own cold start. Arm A with cold start is its window plus its cold start.

## Findings

All figures USD. "Window" is the recorded round total; all six match it at three decimals (half-up).

| Run | Recorded | Window | Cold start | Worker | Coordinator | Sum of buckets |
|---|---|---|---|---|---|---|
| q1 A | 0.069 | 0.069 | 0.057 (before) | 0.021 | 0.047 | 0.069 |
| q2 A | 0.058 | 0.058 | 0.057 (before) | 0.013 | 0.045 | 0.058 |
| q3 A | 0.055 | 0.055 | 0.057 (before) | 0.021 | 0.034 | 0.055 |
| q1 B | 0.091 | 0.091 | 0.056 (inside) | 0.035 | 0.000 | 0.091 |
| q2 B | 0.091 | 0.091 | 0.056 (inside) | 0.036 | 0.000 | 0.091 |
| q3 B | 0.081 | 0.081 | 0.056 (inside) | 0.026 | 0.000 | 0.081 |

Arm A's cold start is as large as arm B's, 0.057 against 0.056. Arm B's coordinator has no cost in the window because its next message comes after the worker reports.

**Arm means (recorded basis).**

| Arm | Round with cold start | Round without |
|---|---|---|
| A | 0.117 | 0.061 |
| B | 0.088 | 0.032 |

The recorded ordering, B above A, rests on charging B's cold start and not A's. Charge both, or neither, and A is above B. The earlier claim that B stays above A either way does not hold. The verdict is unchanged: no cost figure feeds the by-name test.

**Reconciliation, whole session.** `cost-state` equals `total_cost_usd` at three decimals in all six runs. The `session-cost.ts` print rounds to one decimal and agrees.

| Run | `total_cost_usd` | `cost-state` | `session-cost.ts` | Priced tokens | Priced / total |
|---|---|---|---|---|---|
| q1 A | 0.2661 | 0.266 | 0.3 | 0.210 | 0.79 |
| q2 A | 0.2440 | 0.244 | 0.2 | 0.187 | 0.76 |
| q3 A | 0.2466 | 0.247 | 0.2 | 0.188 | 0.76 |
| q1 B | 0.1701 | 0.170 | 0.2 | 0.130 | 0.76 |
| q2 B | 0.1694 | 0.169 | 0.2 | 0.131 | 0.77 |
| q3 B | 0.1470 | 0.147 | 0.1 | 0.126 | 0.86 |

`session-cost.ts` cannot price a round: it reads only top-level transcripts and needs a price fit over at least three sessions. On one run it prints `main$ 0.0`.

**The residual (14 to 24 percent).** The stream-json records each message's usage at its start, so `output_tokens` is an early snapshot, not the final count. The transcripts keep the final count, and it equals `modelUsage` exactly.

Priced at the fit, the missing output explains the whole gap: 0.062 against a gap of 0.056 in q1 A, 0.042 against 0.040 in q1 B, and the same shape in the other four. Missing read, write and input tokens add under 0.006. A small price mismatch of -0.004 to -0.011 is left; the likely cause is the fit's single cache-write price across two tiers, not tested.

**Effect on the round totals.** Re-priced with final output tokens, the windows rise:

| Run | q1 | q2 | q3 | Mean without cold start | Mean with cold start |
|---|---|---|---|---|---|
| A | 0.091 | 0.075 | 0.077 | 0.081 | 0.142 |
| B | 0.116 | 0.117 | 0.097 | 0.048 | 0.110 |

Under the symmetric rule A is above B with and without cold start (0.081 against 0.048, and 0.142 against 0.110).

The recorded ordering, B above A, appears only when B's window carries its cold start and A's does not (0.110 against 0.081).

The recorded totals stand as the recorded figures, understated in both arms by the same cause. Their ordering is not safe to cite.

## Recommendation

For the next resume trial, price rounds from Claude Code transcripts (final usage), report cold start on its own line in both arms, and state which side the build phase falls on. Do not set a cost bar inside a 25 percent margin on the recorded basis. Row 5 stays no-go.

## Out of scope / open questions

- Re-check resume on the current CLI before any new trial (TD-305). That is a paid probe and not part of this note.
- TD-306, the estimated worker cost, is untouched. The final-output basis is a better estimate than the snapshot; it does not remove the fit's blended cache-write price.
- The stream-json and transcripts are local and perishable. The tables above are the preserved result; the raw files stay outside the repo, in the SPRINT-170 harness copy.
