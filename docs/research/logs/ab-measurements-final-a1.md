---
owner: Maintainer
last_updated: 2026-11-03
update_trigger: a Final-on-A1 trial run is appended (evals/ab, run by hand)
status: active
id: ab-measurements-final-a1-log
tags: [tooling, process]
domain: governance
related: [EPIC-023, TASK-598]
---

# A/B trial measurements, arm Final-on-A1 -- run log

> Append-only. One row per run of `evals/ab/run-trial.ts` for arm Final-on-A1 (`workdoo-final-a1`, `clinic-final-a1`; schedule
> `evals/ab/schedule-final-a1.json`, 32 slots), written by the harness, never by hand. Same row format and rules as the S0 log
> (`ab-measurements.md`), the A2, A4a and A4b logs, all closed. Tokens and cost come from the CLI's own `result` event.
> A `usage-missing` row is invalid: the CLI reported no usage, and the trial stops for an owner ruling.
>
> Final-on-A1 is judged by Amendment 9 (validity on its own 32 slots first, then item 7f).
>
> **Pre-registration frozen 2026-11-03T03:17:08Z (owner-signed, SPRINT-161 T2, Amendment 9):** `evals/ab/PREREGISTRATION.md` sha256
> `77334de9f837320824e23f13017e3da4db6fd7a7e3a56771b2cc4f6172822d08`, at commit `bd524775`. It carries over nothing: every Final-on-A1
> row must postdate this instant.

| ts | tag | arm | repo | task | trial | attempt | graders | in | out | cache-read | cache-write | cost-usd | wall-s | exit | pins | raw | passed | deviation | g2 | park | measure |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
