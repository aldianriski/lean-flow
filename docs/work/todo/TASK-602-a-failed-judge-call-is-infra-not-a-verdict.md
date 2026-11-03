---
id: TASK-602
title: "Treat a failed A/B judge call as an infra attempt, never as an UNKNOWN verdict"
type: bug
epic: EPIC-023
sprint: SPRINT-162
priority: P1
size: S
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-602 — Treat a failed A/B judge call as an infra attempt, never as an UNKNOWN verdict

## Why
TD-290. In arm Release (SPRINT-161), the subscription login lapsed at 09:21Z: two agent attempts ended `usage-missing` and the
driver stopped for a ruling, but two judge calls failed with `judge run failed: exit 1, api_error` and were scored as UNKNOWN
verdicts, so their slots counted as not-passed and the arm read 87.5% instead of 93.8% until the owner voided them.

## Repro
1. Run a measured arm (`run-baseline.ts`) on a subscription login, and let the login lapse mid-run (or make the judge CLI
   return `exit 1, api_error`).
2. Read the row of a slot whose agent phase finished before the lapse: `measure.judges.business.verdict` is `UNKNOWN` with
   reason `judge call failed: judge run failed: exit 1, api_error`, `attemptClass` is not infra, and the slot is scored
   not-passed. Seen in `docs/research/logs/ab-measurements-release.md` at 09:21:20Z and 09:21:32Z.

## Done when
- [ ] A judge call that fails (CLI exit, API or auth error, no reply) marks the attempt infra, so the slot retries or stops for a
      ruling under section 18, as a failed agent call already does; a judge that replies UNKNOWN stays a scored verdict.
- [ ] A selftest fails on a judge `api_error` scored as UNKNOWN, and passes with the fix; a control (a real UNKNOWN reply) stays scored.
- [ ] The change is disclosed in the next arm's amendment (harness code is not hashed).

## Touches
`evals/ab/lib/judges.ts` · `evals/ab/lib/measure.ts` · `evals/ab/selftest.ts`

## Tracker
TD-290 · SPRINT-161 log (arm Release ruling) · `docs/research/logs/ab-measurements-release.md` § Report
