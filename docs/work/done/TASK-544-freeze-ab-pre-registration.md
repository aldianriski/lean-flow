---
id: TASK-544
title: "Freeze the A/B pre-registration"
epic: EPIC-023
sprint: SPRINT-152
priority: P2
size: S
risk: high
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-537, TASK-538, TASK-539, TASK-540, TASK-541, TASK-542, TASK-543]
---

# TASK-544 — Freeze the A/B pre-registration

## Why
The decision procedure must be written, owner-signed and frozen before the first trial on an A/B repo, or every later held / not-held is discretionary (R-c). Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [x] One frozen document (hash in the log) holds: primary endpoint · symptom measures + −5 pp limits · +10 pp minimum gain · the R-b baseline defect rule · task as unit + bootstrap · Unknown = not-passed · inconclusive rule · D5 cost definition · never-worse-than-A0 · retry classification · cost accounting formula · run-validity rule + slot replacement policy · D9 policy · R-a evidence parity · model inventory (full ids; Opus 5.5 session, 2.x dispatch tiers) · plugin SHA per arm · task-corpus manifest hash · arm manifest hashes. ✓ bc1ddf4a: one frozen pre-registration holding every listed item (its section 1 maps each), sha256 e72002cf recorded in the A/B measurement log; 12 file hashes reproduce on main; selftest 43/43; two independent review rounds
- [x] Owner signs it; the log shows no trial on an A/B repo or a task-set task before this hash (R-c). ✓ owner signed by popup 2026-10-31; the measurement log holds 13 rows before the freeze, all smoke on the fixture repo, none on an A/B repo or task-set task

## Touches
`docs/research/logs/` · `evals/ab/`

## Assumes
- **blocked-by:** TASK-537..543.
- **note from SPRINT-148 close:** under `permissionMode: acceptEdits` in a headless run, a lean-flow arm's Bash call is denied, and the D9 protocol parks it as a popup. The P6 smoke re-run signed G2, then parked in phase 2 when the model tried to run the graders itself. The arms' permission mode (and an allow-list, if one is used) is a treatment control that the pre-registration must fix before any A1 trial; otherwise every lean-flow trial can park.
- **open:** judge calibration (SPRINT-151 run 3, `evals/ab/judges/calibration.md`): 85.5% on 55 judged rows; before freezing the prompts,
  re-rule three rows where the construction may be wrong (forecast-month-end reference scope, reissue-invitation reference
  convention, access-activity-type-filter reference convention) and decide whether the 400-line context cap must grow (it cut
  off self-onboarding-guard: three UNKNOWN). The business judge missed `en` vs `en-GB` in invitation-issued-by's wrong solution.
- **open:** three workdoo tasks' calibration calls (self-onboarding-guard, shared-auth-failure, shared-timestamp-format) were lost
  to a transient auth drop and are unjudged; re-run them if the freeze needs every task calibrated.

## Tracker
research §7 · intake R-b, R-c
