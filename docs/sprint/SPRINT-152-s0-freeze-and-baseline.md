---
sprint: 152
slug: s0-freeze-and-baseline
stream: s0-baseline
epic: EPIC-023
owner: Maintainer
last_updated: 2026-10-31
status: active
gates_signed: G1,G2 @ 1f370b53
plan_commit: 421d8d82
update_trigger: sprint execute/close events
---

# SPRINT-152 — S0: Freeze and Baseline

> **Theme:** EPIC-023's S0 closes here. The pre-registration is frozen and owner-signed before any trial, then the paid A0
> and A1 baseline runs against it and rules each symptom as a measured defect or not reproduced. Beside it, the review-depth
> check stops failing a review that happened, and the promote rule from SPRINT-151 gets its first real use.

## Scope

**In:** wave 0: the dependent-pull rule's first real use (T1, TASK-558), review-depth judging the latest review line (T2,
TASK-559) and the pre-registration freeze (T3, TASK-544) · wave 1: the paid A0 + A1 baseline and S0's close (T4, TASK-545).
**Out (deferred):** S1's TASK-548..555 (TASK-548, 549 and 552 now have every blocker in `done/`; their `blocked` state is
stale and goes to `/triage`) · TASK-489, 367, 402, 498 (blocked) · TASK-507, 523 (`needs-info`).

## Members

- docs/work/todo/TASK-558-let-promote-pull-a-dependent-with-its-in-sprint-blockers.md
- docs/work/todo/TASK-559-let-a-later-review-line-supersede-an-earlier-self-review.md
- docs/work/todo/TASK-544-freeze-ab-pre-registration.md
- docs/work/todo/TASK-545-run-ab-baseline-and-rule-symptoms.md

## Plan

### T1 — Record the dependent-pull rule's first real use `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/todo/TASK-558-let-promote-pull-a-dependent-with-its-in-sprint-blockers.md`
  · `docs/work/in_progress/TASK-558-let-promote-pull-a-dependent-with-its-in-sprint-blockers.md`
  · `docs/work/done/TASK-558-let-promote-pull-a-dependent-with-its-in-sprint-blockers.md`
Depends-on: none
Cites: `TASK-558` · `sprint-by-reference.md` (in `skills/lean-doc-generator/references/`; promote step 1)

Wave 0. Boxes 1 and 2 shipped at SPRINT-151 (`07a75451`). This promote pulls TASK-545 beside its blocker TASK-544 under
that rule, with no owner state ruling, and its promote entry records it.

**Acceptance:** this sprint's promote entry records a dependent joining with its in-sprint blocker under the rule, and box 3 is ticked against it.

### T2 — Judge the latest review line per task in the review-depth check `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `scripts/lib/check-review-depth.sh` · `evals/run-review-depth-fixtures.sh` · `evals/fixtures/review-depth/`
  · `docs/work/todo/TASK-559-let-a-later-review-line-supersede-an-earlier-self-review.md`
  · `docs/work/in_progress/TASK-559-let-a-later-review-line-supersede-an-earlier-self-review.md`
  · `docs/work/done/TASK-559-let-a-later-review-line-supersede-an-earlier-self-review.md`
Depends-on: none
Cites: `TASK-559` · `SPRINT-151-s0-answers-tasks-arms-judges.md` (the archived log, in `docs/sprint/archive/logs/`; the real artifact)

Wave 0. A measured defect: SPRINT-151's close failed on a self-review line that two Codex rounds superseded (L-268). Other G
under ADR-050: a must-FAIL fixture per check and one run on the real artifact.

**Acceptance:** the archived SPRINT-151 log passes, a latest-line self-review on material still FAILs, and the interleaved-task fixture FAILs.

### T3 — Freeze the A/B pre-registration `[size: S · risk: high · class: decision · HITL · J2]`
Layers: `docs/research/logs/` · `evals/ab/`
  · `docs/work/todo/TASK-544-freeze-ab-pre-registration.md`
  · `docs/work/in_progress/TASK-544-freeze-ab-pre-registration.md`
  · `docs/work/done/TASK-544-freeze-ab-pre-registration.md`
Depends-on: none
Cites: `TASK-544` · `lean-flow-3-foundation.md` (in `docs/research/`; §7, rulings R-a..R-c) · `calibration.md` (in `evals/ab/judges/`)

Wave 0. Every later held or not-held rests on a procedure written, signed and frozen before the first trial (R-c). The open
calibration rows and the arms' permission mode are settled before the hash is taken.

**Acceptance:** one frozen pre-registration with its hash in the log, owner-signed, and no trial on an A/B repo or a task-set task before that hash.

### T4 — Run the A0 + A1 baseline, rule each symptom, and close S0 `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/research/logs/` · `evals/ab/` · `docs/epic/EPIC-023-specific-not-short.md` · `docs/architecture/overview.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-545-run-ab-baseline-and-rule-symptoms.md`
  · `docs/work/in_progress/TASK-545-run-ab-baseline-and-rule-symptoms.md`
  · `docs/work/done/TASK-545-run-ab-baseline-and-rule-symptoms.md`
Depends-on: T3
Cites: `TASK-545` · `lean-flow-3-foundation.md` (in `docs/research/`; §7)

Wave 1, joined with its blocker under the dependent-pull rule. Paid and run by hand: 2 arms × 16 tasks × k = 3 = 96 scored
trials, pinned to T3's frozen hash. The result is the admission evidence S2, S3 and the STANDARD change rest on.

**Acceptance:** each of the three symptoms ruled measured defect or not reproduced, with a log reference, and EPIC-023 Closed-when 1 ticked or its reason recorded.

## Decisions (pre-locked)

- **D1** — Waves: W0 = T1 ∥ T2 ∥ T3 · W1 = T4 once T3 is in `done/`. No two wave-0 tasks share a declared path. T3 and T4
  share `docs/research/logs/` and `evals/ab/` in sequence only. T4 joins by the dependent-pull rule, with no state ruling.
  TASK-544 joins with zero open blockers: all seven of its `depends-on:` are in `done/`, so its `blocked` state is stale.
- **D2** — T2 is Other G (ADR-050): a must-FAIL fixture per check plus one run on the real archived log, no mutation
  campaign, no mandatory review. T3 is P, T4 is X. S0 stays maintainer-only measurement (`evals/ab/`), never a gate or
  `qa-check.sh` leg; G2 review-round cap 2 on T3 and T4.
- **D3** — Status moves, Log, sprint-file edits and ticks in a folder a task's `Layers:` do not name commit as bare
  `sprint(152):` (L-238 · L-258). A file a task turns out to need joins by scope-change first (L-229). Every builder brief
  touching `.ts` names `bunx tsc --noEmit` (L-262). Write a `review · Tn` line only once the depth is decided (L-268).

## Assumptions

- **A1** — TASK-544's open items (three calibration rows to re-rule, the 400-line judge context cap, three unjudged workdoo
  calls) are settled inside T3, before the hash. *Confirm: T3 G2.*
- **A2** — The arms' permission mode (and any allow-list) is fixed in the pre-registration, or every A1 trial can park on a
  denied Bash call (SPRINT-148 note). *Confirm: T3 G2.*
- **A3** — T4's 96 trials run on the subscription with a spend ceiling and stop rule the pre-registration names, and the A1
  arm loads the pinned 2.19.1 SHA, not the installed copy. *Confirm: T4 G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-152-s0-freeze-and-baseline.md`](logs/SPRINT-152-s0-freeze-and-baseline.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `evals/ab/PREREGISTRATION.md` | T3 · T4 | the frozen A/B design, then Amendments 1-5 (the fifth corrected after two outside reviews), each owner-signed | High | freeze guard (S45); owner signatures |
| `evals/ab/*.ts` · `evals/ab/lib/*.ts` | T3 · T4 | resumable driver, slot builder and analysis; voids before the freeze check, non-transitive carry-over, the cache file only | High | selftest 61/61; seeds S41 · S45 · S56 |
| `evals/ab/arms/` · `evals/ab/judges/` · `evals/ab/tasks/workdoo/` | T3 · T4 | arm inventory and allow-list, judge prompt lock, task corrections before the freeze | Med | section 19 hashes |
| `docs/research/logs/ab-measurements.md` | T4 | 162 rows, 7 freeze lines and the S0 report (A1 81.2% vs A0 89.6%) | High | rebuilds byte-identical; outside process review |
| `scripts/lib/check-review-depth.sh` · `evals/fixtures/review-depth/` | T2 | the latest review line per task decides | Med | three must-FAIL fixtures |
| `docs/epic/EPIC-023-specific-not-short.md` · `.out-of-scope/pointer-carry-through.md` · `docs/work/cancel/` (TASK-566..572) | T4 · triage | S0 ticked, S2 recorded as not admitted and cancelled, D10 admits S3 | Med | owner-signed |
| `docs/LEARNINGS.md` · `TECH-DEBT.md` · `docs/knowledge-index.md` · `CHANGELOG.md` · `docs/architecture/overview.md` | T4 · close | L-270..274, TD-283 · 284, the `evals/ab/` line and the S0 entry | Low | gen-index |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
**Outcome** — 4 of 4 members delivered (TASK-558, 559, 544, 545). S0 is closed: the pre-registration was frozen and signed
before any trial, then amended five times under owner signature, each amendment ahead of the rows it governs. The paid
baseline filled 96 of 96 slots, run VALID. A1 (lean-flow 2.x) scored 81.2% against A0 (plain Claude Code) 89.6% on the
primary endpoint, regressed against A0 on convention, business and lost detail, and sat below the A0 floor at about 3.9x A0's
tokens. Yet no symptom cleared R-b, so all three are not reproduced (`docs/research/logs/ab-measurements.md` § Report
2026-11-01). Owner rulings followed: S2 not admitted (TASK-567..572 cancelled), and EPIC-023 D10 admits S3 as a measured experiment
on the regressions. The review-depth check now grades a task's latest review line (TASK-559), and the dependent-pull rule had
its first real use (TASK-558).

**Retrieval check** — one rule missed, one rule held. The report's first draft read only the verdicts `analyze.ts` prints. Section 4's
regression test, which the pre-registration leaves to the reader, surfaced only on a hand pass (L-274, TD-283). Cross-check
held: every figure in the report was recounted from the slot data by a second script before it was written.

**Cost** — scored trials 129.03 USD notional, plus 43.81 USD of voided attempts (172.84 USD in total; subscription, not
billed per call). Four outside reviews ran on Codex, 12k to 20k tokens each (63k in all): Amendment 5 rounds 1 and 2, the S2 intake, and
the close-out process. Owner time: the
92-slot and 13-slot driver runs in the owner's terminal, plus the popup rulings and six signatures.

**Worked**
- Amendments before rows: every rule change was signed before the rows it governs, and voids carried the owner's ruling.
- Outside review on Codex found what the self-checks missed: the transitive carry-over, the directory-wide exclusion, the
  overclaiming correction, and the report's scope caveat.
- Seeding each old design back in proved each fixture fails only its own check.

**Friction**
- The harness's own side effect (PowerShell's cache under the trial copy) decided the first result. It cost a void, a re-run
  and an amendment (L-271).
- Trial copies are deleted after each row, so a rule changed later could not be re-checked against finished rows (L-273,
  TD-284).
- The low-memory reaper killed the in-session driver. Long runs moved to the owner's terminal.

**Pattern candidates**
- L-273 (count 1): a claim about finished rows under a changed rule cites what the row retains.
- L-274 (count 1): apply every frozen decision rule before ruling admission.

**Buckets routed** — Shipped: CHANGELOG [Unreleased] maintainer-only entry with the S0 result. Tech debt: TD-283 (no section 4
verdict printed), TD-284 (no post-run manifest kept). Follow-ups: none new; TASK-555 (A2), the Codex builder pilot
(TASK-561..565) and S3's intake carry over to the next promote. Learnings: L-270..274. Every member is in `done/`; the
close-time members check passes 10 of 10. System verify on the VPS: see the close entries in the log. No handoff entry was taken in this sprint. No release: the harness
is maintainer-only. Retention and the archive move wait for the owner's approval.
