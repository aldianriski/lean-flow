---
id: TASK-357
title: "Re-measure the gate total after SPRINT-103, then rule ADR-039's deferred `layers-observed` opt-in"
priority: P1
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
sprint: SPRINT-115
---

# TASK-357 — Re-measure the gate total after SPRINT-103, then rule ADR-039's deferred `layers-observed` opt-in

## Why

authority note: the measurement is J1; the recurring-cost ruling it feeds is owner-reserved

origin note: SPRINT-103 A3 could not be confirmed at close: the host sat at 3.0% free memory (428 MB of 14,078 MB), the condition that killed Wave 0, and a wall-clock figure taken under paging measures swap

Two things are waiting on one number. (1) **SPRINT-103's A3** — "porting all five
would put the gate near 8 minutes" was filed as an estimate, not a target, with
*"measured at close against the real total, and recorded as a Round whether or not
it lands"* as its confirm path; the close could not run it. (2) **ADR-039's split**
(SPRINT-103 owner ruling): `authority` (21.2 s) · `doc-caps` (38.8 s) ·
`night-run-rollup` (44.0 s) joined the opt-in set, ~104 s, honouring the parity
mandate for three of the four ports. `layers-observed` at 189.3 s was left
**excluded and named**, its cost written at the site, precisely because deciding a
189 s recurring cost against a total nobody has re-measured is the mistake
SPRINT-103 existed to stop.

## Done when

- [ ] A new Round in `docs/research/logs/qa-gate-timing.md` records the **completed** `QA_FULL=1` gate total post-SPRINT-103, taken on a host with healthy free memory and stated as a range over ≥3 runs (this host shows >3x run-to-run variance — a point estimate is not a measurement here). **Then** the deferred ruling: `layers-observed`'s differential (**189.3 s**) either joins `eval_harnesses_optin` or stays excluded-and-named, decided against the measured total rather than against an estimate. Verify: the Round names the total and the three `optin` harnesses' current cost, and the ruling cites that Round by number.

## Assumes

- none — but it cannot be run under memory pressure, which is the whole reason it exists
- that the sprint's measured savings (T1 median 341.0 → 149.8 s · T2 leg 15 21.0 → 3.4 s) survive into the total. UNCONFIRMED — that is the question, and the arithmetic must not be substituted for the run (D2).

## Tracker

- ADR-039 · ADR-043 · TD-168 · TD-171 · Round 19/20/21 · TD-090 · TD-117 · TD-128 (severity: high, re-routed here 2026-09-28 -- their owners TASK-349/329 are gone)
- carried: SPRINT-104 T4, parked twice, 0 of 6 DoD. 2026-09-23: `wsl --shutdown` freed 5.35 GB and run 1 completed at **1863 s, `275 pass, 4 fail`** — but under paging (min 311 MB free), so it is an observation, not a range member. Run 2 was reaped for memory at 1455 s when Docker restarted WSL. **Unblock: > 3 GB free that STAYS free for ~90 min — WSL/Docker stopped and kept stopped**, not merely freed at the start. The total now measures SPRINT-104's gate too; the Round must say which tree it timed.
