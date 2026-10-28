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
- [ ] The bare `PASS … within ADR-022` line is gone; the PASS line keeps its `PASS` prefix (tallies unchanged) and states the N model-reported retry lines read and that an unlogged retry is undetectable (TD-152).
- [ ] Every existing over-ceiling must-FAIL fixture stays red with its named finding.
- [ ] Retained fixture: a log with zero retry lines yields the scoped line, never the bare PASS; a sibling with retry lines within the ceiling yields the scoped line with its count.
- [ ] Every reader of the old PASS string (rollup checker, qa-check tally, evals) is censused and still agrees.
- [ ] Run on the real artifact: the check over the archived SPRINT-066 and SPRINT-067 logs (the only two with retry lines) and one archived log without any prints the scoped line with the right count for each.
- [ ] TD-152 resolved → accepted (no further fix): the row records that the overclaim is gone (TASK-529), that an unlogged retry stays undetectable, and **Re-file fresh if** a retry-firing choke point becomes feasible.

## Touches
`scripts/night-run.sh` `check_revise_ceiling()` · `evals/run-revise-loop-ceiling-fixtures.sh` · any reader of the PASS string.

## Assumes
- Existing `.sh` edited in place; no new `.sh`.

## Tracker
TECH-DEBT TD-152 · owner choice at /prime overview 2026-10-27 (false-green guard cluster).
