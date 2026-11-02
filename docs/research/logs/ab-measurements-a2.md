---
owner: Maintainer
last_updated: 2026-11-02
update_trigger: an A2 trial run is appended (evals/ab, run by hand)
status: active
id: ab-measurements-a2-log
tags: [tooling, process]
domain: governance
related: [EPIC-023, TASK-555]
---

# A/B trial measurements, arm A2 -- run log

> Append-only. One row per run of `evals/ab/run-trial.ts` for arm A2 (`workdoo-a2`, `clinic-a2`; schedule
> `evals/ab/schedule-a2.json`), written by the harness, never by hand. Same row format and rules as the S0 log
> (`ab-measurements.md`, closed), which keeps A0 and A1. Tokens and cost come from the CLI's own `result` event.
> A `usage-missing` row is invalid: the CLI reported no usage, and the trial stops for an owner ruling.
>
> **Pre-registration frozen 2026-11-02T00:40:46Z (owner-signed, SPRINT-154 T1, Amendment 6):** `evals/ab/PREREGISTRATION.md` sha256
> `f6b770f1c0a1210b66620f27b5f22bab9cc405c959cb67425b2ddd17aa7b470f`, at commit `e6b621bd`. It carries over nothing: every A2
> row must postdate this instant. A2 is judged by Amendment 6 (validity on its own 32 slots first, then the ruling against A1).

| ts | tag | arm | repo | task | trial | attempt | graders | in | out | cache-read | cache-write | cost-usd | wall-s | exit | pins | raw | passed | deviation | g2 | park | measure |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
