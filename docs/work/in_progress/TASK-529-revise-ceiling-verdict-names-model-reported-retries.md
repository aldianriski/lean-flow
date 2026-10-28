---
id: TASK-529
title: "Make the revise-ceiling verdict state that its retry count is model-reported"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
sprint: SPRINT-146
depends-on: []
---

# TASK-529 — Revise-ceiling verdict names model-reported retries

## Why
TD-152, defect fix (unfrozen, ADR-053): `check_revise_ceiling()` prints `PASS revise-loop-ceiling: within ADR-022 …`
though nothing mechanically writes a `Tn · retry ·` line, so an unlogged retry and no retry both PASS. A choke-point
mechanism was rejected at intake (a retry fires inside one model turn; nothing external can force it through a door).
This task stops the verdict overclaiming; it does **not** make an unlogged retry detectable. That limit is accepted
(owner ruling, SPRINT-146 promote). G2 review-round cap: 2.

## Done when
- [x] The bare `PASS … within ADR-022` line is gone; the PASS line keeps its `PASS` prefix (tallies unchanged) and states the N model-reported retry lines read and that an unlogged retry is undetectable (TD-152). ✓ 6855ebd2: PASS line keeps its prefix and appends -- N retry line(s) read, all model-reported; an unlogged retry is undetectable (TD-152)
- [x] Every existing over-ceiling must-FAIL fixture stays red with its named finding. ✓ REVISE-LOOP-CEILING FIXTURES: all green (coordinator re-run); every over-ceiling, escalation and rejection case asserts its named FAIL
- [x] Retained fixture: a log with zero retry lines yields the scoped line, never the bare PASS; a sibling with retry lines within the ceiling yields the scoped line with its count. ✓ pass-scoped-zero-retry-lines (0) and pass-scoped-counts-retry-lines (2), plus fenced-not-counted and window cases; red before 6855ebd2, green after
- [x] Every reader of the old PASS string (rollup checker, qa-check tally, evals) is censused and still agrees. ✓ census: only the ceiling harness asserts the PASS text (substring prefix, unchanged); reap() reads ^FAIL only; qa-check lists the harness name; no doc quotes it
- [x] Run on the real artifact: the check over the archived SPRINT-066 and SPRINT-067 logs (the only two with retry lines) and one archived log without any prints the scoped line with the right count for each. ✓ base 0: SPRINT-066 1, SPRINT-067 2, SPRINT-123 1 (also carries retry lines, correcting the parenthetical), SPRINT-070 0; each matched a fence-aware awk count
- [x] TD-152 resolved → accepted (no further fix): the row records that the overclaim is gone (TASK-529), that an unlogged retry stays undetectable, and **Re-file fresh if** a retry-firing choke point becomes feasible. ✓ TD-152 status: resolved -> accepted (no task), b10ad362: overclaim gone, limit stated, Re-file fresh if a retry-firing choke point becomes feasible

## Touches
`scripts/night-run.sh` `check_revise_ceiling()` · `evals/run-revise-loop-ceiling-fixtures.sh` · any reader of the PASS string.

## Assumes
- Existing `.sh` edited in place; no new `.sh`.

## Tracker
TECH-DEBT TD-152 · owner choice at /prime overview 2026-10-27 (false-green guard cluster).
