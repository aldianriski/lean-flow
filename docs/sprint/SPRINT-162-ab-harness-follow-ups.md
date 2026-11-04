---
sprint: 162
slug: ab-harness-follow-ups
owner: Maintainer
last_updated: 2026-11-04
status: closed
plan_commit: 1a610a18
gates_signed: G1,G2 @ f9b8345e
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
Layers: `evals/ab/lib/judges.ts` · `evals/ab/lib/measure.ts` · `evals/ab/lib/trial.ts` · `evals/ab/lib/protocol.ts` · `evals/ab/lib/retry.ts` · `evals/ab/selftest.ts` · `TECH-DEBT.md`
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
| `evals/ab/lib/judges.ts`, `evals/ab/lib/measure.ts` | T1 | a thrown or empty judge call is recorded as failed and makes the attempt `infra:judge-failed` | med | S79 must-FAIL on the old code; selftest 84/84 |
| `evals/ab/lib/trial.ts`, `evals/ab/lib/protocol.ts`, `evals/ab/lib/retry.ts` | T1 | both trial paths take the class from the measure; `realJudge` keeps the CLI error text; the new infra kind | med | S79 (both paths, usage-limit) |
| `evals/ab/selftest.ts` | T1 | S79 | low | red on `ebf6cfe6`'s lib, green with the fix |
| `TECH-DEBT.md` | T1, T2 | TD-290 and TD-289 carry-forward lines | low | check-sprint-by-reference |

## Retro

**Outcome** — 2 of 2 members delivered (TASK-602, TASK-603), 5 of 5 boxes. A failed judge call no longer scores: it retries,
counts toward the 3-infra abort, or pauses on a usage limit. Three workers ran clean after TASK-600's lock (6 of 6 slots on
attempt 1, three clinic starts overlapping, no provisioning failure); the owner ruled two judge UNKNOWNs noise, so the next
release arm adopts N = 3. Both amendment boxes carry forward in TD-290 and TD-289 (owner ruling at G2).

**Retrieval check** — yes, one miss. L-238 (a coordinator write commits as bare `sprint(N):`) was in context from priming and
still broken: T2's tick and Log went under `sprint(162) T2:`. `check-layers-observed` caught it before close; the two commits
were local and re-split. Counted on L-238 (3).

**Cost** — Codex built T1 for 58k tokens. One Sonnet builder check, 87k tokens. The T2 check cost 13.85 USD (12.54 agents,
1.31 judges) in 22 minutes, against 8.5 USD estimated at G2: the same six slots had cost 8.54 USD at SPRINT-160, so the gap is
run-to-run variance in agent spend. Two off-host gate runs. Claude session tokens: not available.

**Worked**
- The builder check found that fixing the measure alone would never reach the retry loop, before any build (L-289).
- Codex built test-first, and S79 went red on the unfixed code in a throwaway worktree; Claude's review found no blocker.
- The pilot stop gave a cheap read before three workers ran.

**Friction**
- S43 failed inside Codex's sandbox and passed on the host, so a builder's suite result is not the host's.
- The T2 estimate came from one earlier run of the same slots, and agent spend varies more than one run shows.

**Pattern candidate**
- L-289: trace a changed field to every reader before calling a classification fixed.

**Buckets** — Shipped: two `[Unreleased]` CHANGELOG lines (maintainer-only; no release). Tech debt: TD-292 (filed); TD-289 and
TD-290 carried forward. Follow-ups: TASK-604 (the G2 signer, `origin: close-retro`). Learnings: L-289 (new), L-238 (count 3).
