---
id: TASK-598
title: "Measure the Final set and S1's no-harm check, and rule what ships"
type: feature
epic: EPIC-023
sprint: SPRINT-161
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-597]
---

# TASK-598 — Measure the Final set and S1's no-harm check, and rule what ships

## Why
EPIC-023 S4. Owner rulings at intake (2026-11-03): R1, admission by the measured stacked add-one deltas instead of per-candidate
leave-one-out (bundle 1, A4a, +12.5 vs A2, D15; bundle 2, A4b, +3.1 vs A4a, non-inferior, D17; bundle 3 and TASK-597 by the Final
arm); R2, S1 (repo profile, question sets, template changes; its arm A2 failed) measured by one more arm, the Final plugin on A1's
unprofiled snapshots. Bundles 1 and 2 are measured; bundle 3 (SPRINT-160) and TASK-597 are shown only by development runs (D16),
and every later arm stood on S1's docs. One Final arm and one S1 check decide the shipped set before any release (D6, D16).

## Done when
- [x] An owner-signed Amendment 9 to the pre-registration, hashed before any trial, defines arm Final (plugin pinned after TASK-597, ✓ Amendment 9 signed (`bd524775`, sha256 `77334de9…`); k = 3 superseded by Amendment 10 (scope-change logged); Amendment 11 adds arm Release
      A2's snapshots, k = 3) and arm Final-on-A1 (the same pin, A1's snapshots, k = 2), their schedules and the rulings below, runs
      at two workers (Amendment 8), and discloses SPRINT-160's development runs and capacity check.
- [x] Both arms pass the pre-registration's run-validity rule, each after an owner-approved pilot, run unattended with an exit ✓ Final and Final-on-A1 32/32 VALID each, pilots approved, detached with watchers; Release 32/32 VALID
      watcher and a notification.
- [x] The rulings are recorded in the arms' log and in EPIC-023: Final against A2 (the minimum gain) and against A1, the ✓ `ab-measurements-final.md` and `-release.md` § Report 2026-11-03; EPIC-023 D21: Final passes, bundle 3 ruled out, S1 ships; Release passes
      never-below-A0 floor, cost within 2x A1; a Final that fails any of these means nothing from EPIC-023 ships, whatever
      bundles 1 and 2 measured. When Final passes: bundles 1 and 2 on their measured deltas (D15, D17); bundle 3 only on a
      positive point delta of Final against A4b and non-inferiority (as D17); S1 ships only if Final on A2's snapshots is not
      below Final-on-A1 by more than 5 points, and when S1 is ruled out, Final-on-A1 (the shipped set without S1's docs) must pass
      the same gates against A1 and A2, else nothing ships. A ruled-out S3 bundle leaves the shipped set unmeasured: it needs a
      further arm before any release, or the outcome is no-ship.
- [x] EPIC-023 records D18 (add-one admission in place of per-candidate leave-one-out) and, per component, an ADR-001 record with ✓ EPIC-023 D18, D20 (S3a/b/c not built, triggers checked), D21 (per-component records)
      its numbers, admitted or not; S3a brief fields, S3b pilot reviewers and S3c roles are recorded as not built (D11), each
      deferred role's trigger checked against the residual failures.

## Touches
`evals/ab/PREREGISTRATION.md` (Amendment 9) · `evals/ab/arms/` (two arms) · `evals/ab/schedule-*.json` · `docs/research/logs/`
(the arms' log) · `docs/epic/EPIC-023-specific-not-short.md` · `CHANGELOG.md` (a Measured entry)

## Assumes
- About 80 paid slots (48 + 32) at two workers: about 120 USD and about 3 hours, run overnight; development runs may share the PC
  (D16).
- The exact statistics behind each ruling are fixed in Amendment 9 at this task's G2 and signed by the owner before any trial.
- A failed Final arm is a result: TASK-599 then records a no-ship with the numbers.
- S1's code is inert in a trial (trials never run `init` or `migrate`), so Final-on-A1 measures the shipped set without S1 as an
  adopter who never re-runs `migrate` meets it.

## Tracker
EPIC-023 S4 · D6, D9, D15, D16, D17 · intake rulings R1, R2 (2026-11-03) · draft reviewed by Codex, 2 rounds, CLEAR
