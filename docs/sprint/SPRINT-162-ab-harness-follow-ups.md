---
sprint: 162
slug: ab-harness-follow-ups
owner: Maintainer
last_updated: 2026-11-03
status: active
update_trigger: sprint execute/close events
---

# SPRINT-162 — A/B Harness Follow-ups

> **Theme:** Two harness fixes that EPIC-023's release left behind, done before the next release arm needs them. D19 requires a
> release arm before any change to `/orchestrator` or gate behaviour, and TASK-601 is the next such change, so the arm has to
> score honestly and should not take longer than it needs to.

## Scope

**In:** a failed judge call is classified as infra, not as an UNKNOWN verdict (TASK-602); the three-worker capacity re-check,
and adopting N = 3 or recording why not (TASK-603).
**Out (deferred):** TASK-601's intake (`/task-decomposer`, next); any role agent (EPIC-023 D20, watched as TD-291); running a
release arm.

## Members

- docs/work/todo/TASK-602-a-failed-judge-call-is-infra-not-a-verdict.md
- docs/work/todo/TASK-603-recheck-three-workers-after-the-provisioning-lock.md

## Plan

### T1 — Treat a failed judge call as infra, never as an UNKNOWN verdict `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `evals/ab/lib/judges.ts` · `evals/ab/lib/measure.ts` · `evals/ab/selftest.ts`
Depends-on: none
Cites: TASK-602 · TD-290 · `docs/research/logs/ab-measurements-release.md` (09:21:20Z, 09:21:32Z)
In arm Release a login lapse made two judge calls fail, and they were scored UNKNOWN, which read 87.5% until the owner voided
them. A failed call goes down the same infra path as a failed agent call; a judge that actually replies UNKNOWN stays scored.

**Acceptance:** the selftest reddens on a judge `api_error` scored as UNKNOWN and is green with the fix; a real UNKNOWN reply stays
a scored verdict.

### T2 — Re-check three workers now that provisioning is serialised `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `TECH-DEBT.md` · `evals/ab/PREREGISTRATION.md`
Depends-on: T1
Cites: TASK-603 · TD-289 · TASK-586 · TASK-600 · EPIC-023 D19
TASK-600's lock fixed the provisioning race seen at N = 3. Before release arms adopt three workers, one capacity check on
TASK-586's slots must show no provisioning failure and the same outcomes as the serial trials. It runs after T1, so a login
lapse during the check is classified correctly.

**Acceptance:** the owner reads the N = 3 report; TD-289 is resolved with N = 3 recorded for the next amendment, or TD-289 says
why not.

## Owner-action checklist
- [ ] Leave the PC idle during T2's capacity check (about 15 to 30 minutes; it runs real agent and judge sessions on the subscription).

## Decisions (pre-locked)
- **D1** — No `epic:` field: both members carry `epic: EPIC-023`, but that epic closed on 2026-11-03 and its rollup is final, so
  this sprint advances no open epic.
- **D2** — T2 waits for T1, so a judge outage during the check is classified as infra and cannot pass for an outcome difference.

## Assumptions
- **A1** — RAM headroom at N = 3 holds (lowest free RAM at N = 3 was 375 MB, during TASK-586's pilot). *Confirm: T2's free-RAM samples.*
- **A2** — TASK-586's 14 slots, cut to N = 3 only, are enough to compare against the serial trials. *Confirm: at T2's G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-162-ab-harness-follow-ups.md`](logs/SPRINT-162-ab-harness-follow-ups.md). Append
> there, never here (STANDARD §9, ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
