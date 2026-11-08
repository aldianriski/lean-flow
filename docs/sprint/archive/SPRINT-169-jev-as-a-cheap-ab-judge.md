---
sprint: 169
slug: jev-as-a-cheap-ab-judge
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-08
status: closed
plan_commit: e5219eef
gates_signed: G1,G2 @ 89fd891c
close_commit: 121b89a8
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
| `scripts/jev-ab-judge.ts` | T1 | maintainer-only replay of Jev against the A/B judge's three recorded calibration runs: dry run by default, 96-cell key pre-flight, failed or empty calls kept as infra, `--budget-usd` guard | low | fixture diff exit 0; paid replay 96 calls, 0 infra, exit 0 |
| `test/fixtures/jev-ab-judge/` | T1 | retained must-FAIL fixture: red scored failed and empty calls as UNKNOWN, green keeps them as infra with an unsure control scored | low | by-hand diff vs `expected.txt`, exit 0 |
| `evals/run-emitter-column-fixtures.ts` | T1 | one OUT_OF_SCOPE row so the population scan lists the new script | low | `emitter-column-fixtures: 9 pass, 0 fail` |
| `docs/work/**/TASK-628-*` | T1 | the member task moved to done with ticks and `## Results` | low | `check-sprint-by-reference --close` 4/0 |
| `CHANGELOG.md` · `docs/LEARNINGS.md` · `TECH-DEBT.md` · `docs/epic/EPIC-024-*` · `docs/architecture/overview.md` · `docs/research/jev-use-cases.md` · `docs/work/backlog/TASK-631-*` | close | Retro routing: Unreleased entry, L-297 plus an L-261 sighting, TD-303 plus a TD-299 sighting, rollup row, scripts line, use-3 result line, the pre-screen follow-up | low | doc-caps; by-reference close check |

## Retro

**Retrieval check:** two misses, both a rule that existed and was not applied. The `consequence ·` vocabulary (L-261): the coordinator's T1 line carried prose, so system verify read 495/1; fixed in place (L-176), then 496/0. The promote doc-aging line named TD deletion but not closed task files, so 10 due files went unreported (TD-299).

**Cost:** the coordinator ran on Opus as the router, with no shell, edit or write tools; Sonnet workers did promote, the builder check, the G2 recon, the T1 build, the scoped review and the bookkeeping. Snapshot at close: about 10.8 USD across all agents (main 6.8, workers 4.0), 3.6 USD/box over 3 boxes. Jev spend 0.0737 USD this sprint, 0.0807 of the 5 USD cap. Three off-host QA_FULL runs (promote baseline, first verify, rerun). Elapsed 163 min from the first sprint commit to the last, 31 active with gaps over 5 minutes dropped. Not comparable to the 0.88 to 1.41 USD/box baseline until the TASK-630 replay.

**Worked**
- The builder check found 4 contradictions before any code and all were settled in the design, so the build took one review round and one delta re-review.
- The red/green fixture was retained before the paid run: red scored failed and empty calls as UNKNOWN, green keeps them as infra.
- The paid run's output was checked line by line against the builder's report before any tick.
- The router held: 0 shell, edit or write calls on the main thread.

**Friction**
- Jev decided 60 of 96 cells (37.5% unsure). Decided agreement with the judge's runs: 93.3%, 66.7%, 93.9%. Run1 is weak against the judge's own 75.9% run1/run2 agreement. Cost: 0.000384 against 0.0783 USD a call. Owner verdict, verbatim: "Trial as pre-screen now" → TASK-631.
- A guard test passed `--run` and Bun loaded `jev_key` from the repo dotenv: one unapproved live pass, 0.036843 USD → L-297.
- The coordinator's `consequence ·` line reddened system verify → L-261 sighting.
- The promote worker skipped the humanizer pass it was told to run. One sighting, no defect traced to it, so no entry.
- The "not sent" figure in the Infra line is a remainder (open review suggestion) → TD-303.
- TASK-627 sits `blocked` on a done TASK-626: stale, left to `/triage`.

**Pattern candidate:** L-261 gains a fourth sighting. L-297 is new (count 1).
