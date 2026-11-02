---
sprint: 158
slug: s3-bundle-2
stream: s3-expertise
epic: EPIC-023
owner: Maintainer
last_updated: 2026-11-02
status: active
plan_commit: 4b8fd7d3
update_trigger: sprint execute/close events
---

# SPRINT-158 — S3 Bundle 2: Progress Reports, Clean Checks, Business Facts, Parallel Trials

> **Theme:** A4a fixed two lean-flow habits and shipped (EPIC-023 D15). What is left in the kept streams is smaller and more
> specific: a check's leftovers scored as a scope breach, a stated business fact lost to the neighbouring code, and an owner
> who has to ask how far the work has got. This sprint fixes those three on top of A4a, measures them as one arm against A4a,
> and first makes trials run in parallel so that arm does not cost another two-hour wait (EPIC-023 D14).

## Scope

**In:** parallel A/B trials with a safe sweep, a capacity check and an owner-signed amendment (T1, TASK-582) · the `Progress:`
line shown on real input (T2, TASK-583) · check artifacts removed before the report (T3, TASK-584) · a stated business fact wins
over the neighbouring code (T4, TASK-585) · bundle 2 measured as its own arm against A4a, with its development runs disclosed
(T5, TASK-581).
**Out (deferred):** S3a's brief fields and S3b's pilot reviewers · workdoo-specific fixes (owner: lean-flow first) · the MINOR
release (owner: after this arm rules) · the harness's G2 scope check on `docs/work/` (TD-286) · SPRINT-157's verification work.

## Members

- docs/work/todo/TASK-582-run-ab-trials-in-parallel-without-losing-validity.md
- docs/work/todo/TASK-583-every-task-done-report-carries-a-progress-line.md
- docs/work/todo/TASK-584-what-a-check-creates-in-the-working-tree-is-removed-before-the-report.md
- docs/work/todo/TASK-585-a-stated-business-fact-wins-over-the-neighbouring-code.md
- docs/work/todo/TASK-581-measure-bundle-2-as-its-own-arm.md

## Plan

### T1 — Run A/B trials in parallel without losing validity `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `evals/ab/` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-582 · EPIC-023 D14 · `evals/ab/PREREGISTRATION.md` § 11
The sweep deletes every `iso-*` directory while the lock is per log, so a second driver destroys a running trial; that is fixed
first, then a bounded worker count. Codex builds the harness code; the amendment that adopts N > 1 is owner-signed.

**Acceptance:** a pilot-sized run at N = 2 completes with no infra-lost slot and results inside the serial spread.

### T2 — Show the Progress line on real input `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `skills/` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-583 · memory: report-leads-with-conclusion
The report-shape change already landed (SPRINT-156); what is open is seeing the changed skill print the line with figures that
match the sprint file and the epic, from the live checkout rather than the installed copy (L-277).

**Acceptance:** a task-done report from the changed skill carries a Progress line the owner reads as correct.

### T3 — Remove what a check creates before the report `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-584 · `docs/research/logs/ab-measurements-a2.md` § Report 2026-11-02 · `docs/research/logs/ab-measurements-a4a.md` § Report 2026-11-02
A2's clinic slot left a test database directory in the repo and scored a breach; A4a's one park was a session deleting a
system-temp directory the repo's own test had made. Whether the rule covers artifacts outside the working tree is settled at G2.

**Acceptance:** development runs on the affected tasks end with no check artifact left and no popup.

### T4 — A stated business fact wins over the neighbouring code `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/` · `CHANGELOG.md`
Depends-on: T3
Cites: TASK-585 · EPIC-023 symptom 2, D11
invitation-issued-by followed a helper's `en` locale over the stated en-GB fact, and self-onboarding-guard took duty holders from
configuration over business fact 6. The design step names each business fact the change touches and how it honours it.

**Acceptance:** development runs on those two tasks produce designs naming the fact, and their judge verdicts are read.

### T5 — Measure bundle 2 as its own arm against A4a `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `evals/ab/` · `docs/research/logs/` · `docs/epic/EPIC-023-specific-not-short.md` · `CHANGELOG.md`
Depends-on: T1, T2, T3, T4
Cites: TASK-581 · EPIC-023 D8, D14, D15 · `evals/ab/PREREGISTRATION.md` Amendment 7
The arm uses A2's frozen snapshots with the plugin pinned at the commit after T3 and T4, compared with A4a. An amendment is signed
before any trial; the pilot is approved, then the full arm runs unattended with a notification.

**Acceptance:** the arm's 32 slots are scored under a signed amendment, and its log records the ruling against A4a.

## Decisions (pre-locked)

- **D1** — Bundle 2 stacks on A4a, and A4a is its comparator (EPIC-023 D15). The arm pins the commit after T3 and T4 (and T2 if
  it changes skill text).
- **D2** — Shared files: `skills/orchestrator/SKILL.md` in commit order T2, T3, T4 (sequential); `evals/ab/` T1 then T5;
  `CHANGELOG.md` in commit order, staged per hunk. SPRINT-157 (stream verification, unmerged branch) also edits `CHANGELOG.md`:
  never stage its WIP, and resolve at its merge.
- **D3** — Development runs use research copies of the A2 snapshots and a pinned clone of the plugin, never a frozen arm snapshot
  or the live checkout from an interactive session (L-277); they are disclosed in T5's amendment with an untouched-task check.
- **D4** — While a measured arm runs, this machine runs no build, gate, selftest, second driver or development run (TASK-582 makes
  parallel trials safe inside one driver; it does not lift this rule across drivers).
- **D5** — Execution pieces (T1's harness code) are Codex-built and Claude-reviewed; decision pieces are Claude-built. Every
  material skill change gets its scoped review logged before close (the SPRINT-156 close found two missing).
- **D6** — `skills/orchestrator/SKILL.md` stays within its ~140-line cap: T3 and T4 replace or tighten wording, never only add.

## Assumptions

- **A1** — A2's snapshots and manifests serve bundle 2's arm unchanged, as they served A4a. *Confirm: at T5's G2.*
- **A2** — The live checkout loaded with `--plugin-dir` in a headless run is enough to show T2's line on real input. *Confirm: at
  T2's G2.*
- **A3** — Two workers fit this PC's memory for the A/B repos' graders. *Confirm: T1's capacity check.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-158-s3-bundle-2.md`](logs/SPRINT-158-s3-bundle-2.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
