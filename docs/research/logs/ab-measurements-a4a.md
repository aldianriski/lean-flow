---
owner: Maintainer
last_updated: 2026-11-02
update_trigger: an A4a trial run is appended (evals/ab, run by hand)
status: active
id: ab-measurements-a4a-log
tags: [tooling, process]
domain: governance
related: [EPIC-023, TASK-574]
---

# A/B trial measurements, arm A4a -- run log

> Append-only. One row per run of `evals/ab/run-trial.ts` for arm A4a (`workdoo-a4a`, `clinic-a4a`; schedule
> `evals/ab/schedule-a4a.json`), written by the harness, never by hand. Same row format and rules as the S0 log
> (`ab-measurements.md`, closed, A0 and A1) and the A2 log (`ab-measurements-a2.md`, closed). Tokens and cost come from the CLI's own `result` event.
> A `usage-missing` row is invalid: the CLI reported no usage, and the trial stops for an owner ruling.
>
> **Pre-registration frozen 2026-11-02T06:10:41Z (owner-signed, SPRINT-156 T4, Amendment 7):** `evals/ab/PREREGISTRATION.md` sha256
> `937e9855969dbdb6ad2dfdbcd2b1c83137ddd723c841b2d3dd243955e82e3e03`, at commit `5339c67c`. It carries over nothing: every A4a
> row must postdate this instant. A4a is judged by Amendment 7 (validity on its own 32 slots first, then the ruling against A2).

| ts | tag | arm | repo | task | trial | attempt | graders | in | out | cache-read | cache-write | cost-usd | wall-s | exit | pins | raw | passed | deviation | g2 | park | measure |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
