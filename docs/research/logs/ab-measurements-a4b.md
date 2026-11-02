---
owner: Maintainer
last_updated: 2026-11-02
update_trigger: an A4b trial run is appended (evals/ab, run by hand)
status: active
id: ab-measurements-a4b-log
tags: [tooling, process]
domain: governance
related: [EPIC-023, TASK-581]
---

# A/B trial measurements, arm A4b -- run log

> Append-only. One row per run of `evals/ab/run-trial.ts` for arm A4b (`workdoo-a4b`, `clinic-a4b`; schedule
> `evals/ab/schedule-a4b.json`), written by the harness, never by hand. Same row format and rules as the S0 log
> (`ab-measurements.md`, closed, A0 and A1), the A2 log (`ab-measurements-a2.md`, closed) and the A4a log (`ab-measurements-a4a.md`, closed). Tokens and cost come from the CLI's own `result` event.
> A `usage-missing` row is invalid: the CLI reported no usage, and the trial stops for an owner ruling.
>
> **Pre-registration frozen 2026-11-02T10:39:02Z (owner-signed, SPRINT-158 T5, Amendment 8):** `evals/ab/PREREGISTRATION.md` sha256
> `d7ad195f1c8b05e7e1900c0601ccc321abe7821675bf7466d21018687391378d`, at commit `4c61911d`. It carries over nothing: every A4b
> row must postdate this instant. A4b is judged by Amendment 8 (validity on its own 32 slots first, then non-inferiority against A4a).

| ts | tag | arm | repo | task | trial | attempt | graders | in | out | cache-read | cache-write | cost-usd | wall-s | exit | pins | raw | passed | deviation | g2 | park | measure |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
