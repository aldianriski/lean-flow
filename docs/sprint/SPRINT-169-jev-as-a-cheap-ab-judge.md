---
sprint: 169
slug: jev-as-a-cheap-ab-judge
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-08
status: active
plan_commit: e5219eef
gates_signed: G1,G2 @ 89fd891c
update_trigger: sprint execute/close events
---

# SPRINT-169 — Jev as a Cheap A/B Judge, Built Under the Router

> **Theme:** the third Jev use (a replay of Jev against the A/B harness's existing judge, with failed calls kept out of the scores) and, at the same time, step 1 of the EPIC-024 row 4 router trial: this sprint is built and closed with the router as the main thread.

## Scope

**In:** one maintainer-only replay script that scores recorded judge inputs with Jev and compares them with the current judge's verdicts (TASK-628) · a retained fixture · the replay's agreement and cost recorded · the router-trial measures for this sprint.
**Out (deferred):** changing the A/B harness default or `evals/ab/lib/` · Jev in `/triage`, `/insights`, router or watcher roles (TASK-627, TASK-629) · any release or push · putting the script in the gate.

## Members

- docs/work/todo/TASK-628-trial-jev-as-a-cheap-ab-judge.md

## Plan

### T1 — Replay Jev against the current A/B judge `[size: M · risk: med · class: decision · HITL · J1]`
Layers: `scripts/jev-ab-judge.ts`, `test/fixtures/jev-ab-judge/`, `evals/run-emitter-column-fixtures.ts`
Depends-on: none
Cites: TASK-628, `docs/research/jev-use-cases.md`, `scripts/jev-done-when.ts`, `evals/ab/judges/calibration.md`, TD-290
The third Jev use is judged by its delta over the harness judge (cost and agreement, L-017), and a failed Jev call must be infra, never a not-passed slot (TD-290).

**Acceptance:** a replay over the same recorded runs states Jev's agreement with the current judge and its cost, a failed or empty Jev call is reported as infra and never scored, and the harness default is unchanged.

## Decisions (pre-locked)

- **D1** — Built under the router (EPIC-024 row 4, step 1 of TASK-630): the router session holds no shell or write tools and every command, edit, move and commit goes to a worker. Proposed; owner confirms at G2.
- **D2** — Jev spend stays inside the 5 USD total cap (0.007 USD used); the script's `--budget-usd` guard holds it. Proposed from the Jev adoption ruling.

## Assumptions

- **A1** — Jev Noul (P(yes)) fits the judge's PASS or FAIL calls at thresholds 0.7 and 0.3, 0.3 to 0.7 being unsure. *Confirm: the replay (TASK-625 refuted Box).*
- **A2** — A recorded set with the current judge's verdicts and the inputs that produced them exists. *Confirm: G2 names it (candidate: `evals/ab/judges/calibration*.md`).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-169-jev-as-a-cheap-ab-judge.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close (STANDARD §10). -->
