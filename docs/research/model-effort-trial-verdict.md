---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: Question revisited, or a new option/source changes the recommendation
status: current
id: model-effort-trial-verdict
tags: [process, tooling]
domain: governance
related: [ADR-010, trial-cost-allocation]
---

# Research — Which model × effort cells earned a place after the SPRINT-180 trial?

> **Question.** On SPRINT-180's per-dispatch numbers, does each trial cell clear its rule: keep, retune or drop (TASK-671)?
> **Verdict.** **One cell is kept: the intake draft check, opt-in per host.** The intake, promote and close worker cells
> are dropped (over the 1.25x cap). The test runner and the builder-check reader fail or lack the data and go back to
> default. Review, G2 design check and Diagnose escalation are inconclusive or never fired, so they return to manual-only.

## Why this matters
The trial added effort and strongest-tier cells to dispatch. Keeping a cell that costs more than it saves, or on one
sample, would raise the cost of every consumer run. The unit is harness-reported tokens, read as direction, not proof
(EPIC-024 D4); tokens are not USD across models.

## Options considered
- **A — Keep, retune or drop each cell on its rule.** *Trade-off:* honest to the numbers, but most cells leave the table.
- **B — Keep cells on a plausible-looking trend.** *Trade-off:* ignores the 1.25x cap and the n>=2 floor the task froze.

## Findings
Counting rule: one cell dispatch is one worker, costed as its cumulative reported total across resumes and retries,
because the TASK-671 baselines were taken the same way. Source: the SPRINT-180 Log's per-dispatch table, re-derived here.

Cheaper cells (rule: kept at >=20% below baseline with no miss; any dispatch over 1.25x baseline is a drop; n>=2 to keep):

| Cell | n | Cumulative tokens | Baseline | Ratio | Misses | Rule applied | Ruling |
|---|---|---|---|---|---|---|---|
| Intake worker (sonnet, medium) | 1 | 125,493 | 86.5k | 1.45x | 1 (row 2: coverage map omitted the KBBI table) | over 1.25x; also over it against the baseline's own final resume (Log row 8, 1.31x) | **Drop** |
| Promote worker | 1 | 210,964 | 151k | 1.40x | 0 | over 1.25x | **Drop** |
| Close worker | 1 | 153,420 | 114.5k | 1.34x | 0 | over 1.25x | **Drop** |
| Test runner (haiku, low) | 2 | 58,082 · 59,848 | 51.5k | 1.13x · 1.16x | 0 | not 20% below | **Drop** |
| Builder-check reader (sonnet, low) | 1 | 66,026 | 62k | 1.06x | 0 | n<2 and not 20% below | **Inconclusive** |
| Repo fetch | 0 | none in the Log | 83k (n=1) | n/a | n/a | never fired | **Default, never kept** |

Strongest-tier cells (rule: kept if at least one real finding the pair missed, cost within 2x the pair; n>=2 to keep):

| Cell | n | Tokens (Fable / pair) | Ratio | Real finding the pair missed | Input size | Ruling |
|---|---|---|---|---|---|---|
| Intake draft check | 2 | 103,369 / 102,781 · 112,524 / 102,973 | 1.01x · 1.09x | yes in both (H2, M1, M2; N1, N2, N4, N5), each verified by the coordinator (Log line 68 for pair 2: N1, N2, N4, N5) | S task; draft about 10 KB, then its revision (size not logged) | **Keep, opt-in** |
| Review | 1 | 134,027 / 105,958 | 1.26x | yes (T1, T2, S2, S4) | small diff, size not logged | **Inconclusive** (n<2) |
| G2 design check | 1 | 141,419 / no comparator | n/a | yes (H1, M3, M4, M7, M8, M9) | S task design, size not logged | **Inconclusive** (n<2) |
| Diagnose escalation | 0 | never fired | n/a | n/a | n/a | **Default, never kept** |

Strongest-tier dispatches used: 4 of 6 (rows 3, 6, 12, 14). The Log's own summary line counts "4 of 4 samples" met their
condition; that is not the ruling, because Review and G2 design check each have one sample. Two other points:
- The Log's test-runner rows 13 and 16/17 are two workers (baseline runs, then after-runs), so n=2, not one; neither is 20% below.
- Rows 4 and 7 (Codex) and row 15 are comparators, and the round-2 Codex re-review (91,429) sat outside the measured pair.

## Recommendation
Keep the intake draft check only. It stays opt-in per host and is not a consumer default (owner, 2026-11-20: "Revert; kept
= opt-in (Recommended)"). Inconclusive cells revert to default routing, with the strongest tier back to manual-only,
and are recorded here as inconclusive, not as a pass. dispatch.md and CONTEXT now carry the kept cell only, with the
trial label removed (ADR-010 addendum, 2026-11-20).

## Out of scope / open questions
- No retune is proposed: no cheaper cell sat within the cap with a concrete tuning the data supports.
- Confounds: the intake worker had five resumes against the baseline's three, and the repo-fetch baseline is n=1.
- Review and G2 design check each found real defects on one sample. A later sprint can re-sample them under a new `## Why`.
