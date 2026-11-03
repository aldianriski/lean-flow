---
owner: Maintainer
last_updated: 2026-11-03
update_trigger: a Release trial run is appended (evals/ab, run by hand)
status: active
id: ab-measurements-release-log
tags: [tooling, process]
domain: governance
related: [EPIC-023, TASK-598, TASK-599]
---

# A/B trial measurements, arm Release -- run log

> Append-only. One row per run of `evals/ab/run-trial.ts` for arm Release (`workdoo-release`, `clinic-release`; schedule
> `evals/ab/schedule-release.json`, 32 slots), written by the harness, never by hand. Same row format and rules as the S0 log
> (`ab-measurements.md`), the A2, A4a, A4b, Final and Final-on-A1 logs, all closed. Tokens and cost come from the CLI's own
> `result` event. A `usage-missing` row is invalid: the CLI reported no usage, and the trial stops for an owner ruling.
>
> Release is judged by Amendment 11 (validity on its own 32 slots first, then Amendment 9 items 7a-7c).

| ts | tag | arm | repo | task | trial | attempt | graders | in | out | cache-read | cache-write | cost-usd | wall-s | exit | pins | raw | passed | deviation | g2 | park | measure |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
