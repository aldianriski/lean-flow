---
sprint: 154
slug: a2-migrate-arm
stream: s1-discovery
epic: EPIC-023
owner: Maintainer
last_updated: 2026-11-02
status: closed
close_commit: c6255747
plan_commit: af887726
gates_signed: G1,G2 @ 9f8b3d50
update_trigger: sprint execute/close events
---

# SPRINT-154 — A2: Migrate Arm

> **Theme:** EPIC-023's S1 condition ends on "arm A2 measured vs A1". The A1 snapshots carry 2.x docs, so A2 sets up through a
> real `migrate` at S1's close commit, runs its 32 trials under its own amendment and its own log, and is ruled by the
> pre-registered procedure. S3's arms then compare against it (EPIC-023 D10).

## Scope

**In:** the A2 setup on both A/B snapshots through a real `migrate` (owner-driven, cue sheet), Amendment 6 with the S1 pin,
32 trials in a separate log, and the A2 vs A1 ruling (T1, TASK-555).
**Out (deferred):** S3's intake (`/task-decomposer --epic EPIC-023`, after A2 is measured) · any change to S0's log or its
freeze lines · the consumer-docs work (stream codex-pilot, SPRINT-155).

## Members

- docs/work/todo/TASK-555-run-arm-a2-on-both-ab-repos-and-record-it-against-a1.md

## Plan

### T1 — Set up, freeze and run arm A2, then rule it against A1 `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `evals/ab/` · `evals/ab/setup-arm.ts` · `docs/research/logs/ab-measurements-a2.md`
  · `docs/work/todo/TASK-555-run-arm-a2-on-both-ab-repos-and-record-it-against-a1.md`
  · `docs/work/in_progress/TASK-555-run-arm-a2-on-both-ab-repos-and-record-it-against-a1.md`
  · `docs/work/done/TASK-555-run-arm-a2-on-both-ab-repos-and-record-it-against-a1.md`
Depends-on: none
Cites: TASK-555 · `docs/epic/EPIC-023-specific-not-short.md` § Decisions (D6, D10) · `evals/ab/PREREGISTRATION.md` § 2 (later arms)
S1 ships as a MINOR only once its own arm passes (D6), and S3 now measures against A2 (D10). The setup is the real upgrade
path, `migrate` on the 2.x snapshots (owner ruling 2026-11-01), so box 1 is reworded by a `scope-change` entry right after
this plan locks. Paid runs, maintainer-only, never a gate.

**Acceptance:** A2's 32 slots are scored under a signed Amendment 6 in their own log, and the log records A2 against A1 with
the pre-registered ruling.

## Decisions (pre-locked)

- **D1** — A2's setup is `/lean-doc-generator migrate`, not `init`. The owner drives each session from a cue sheet built from
  `evals/ab/answers/`, answering verbatim; an unanswered topic is answered `Not decided yet` (owner ruling 2026-11-01).
- **D2** — Amendment 6 freezes A2 with the plugin pinned at S1's close commit `82990174`. A2 writes to
  `docs/research/logs/ab-measurements-a2.md` with its own freeze line, so S0's log stays closed (owner ruling 2026-11-01).
- **D3** — While A2's trials measure wall time, this machine runs no build, gate or selftest; stream codex-pilot pauses then.

## Assumptions

- **A1** — `run-baseline.ts` takes `--schedule` and `--log`, so A2 needs no driver change. *Confirm: its argument parsing (checked
  2026-11-01).*
- **A2** — `migrate` on a 2.x snapshot cites the business topics from the existing `docs/product/requirements.md` instead of
  asking them (spec 0.18.2). *Confirm: the first owner session's transcript.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-154-a2-migrate-arm.md`](logs/SPRINT-154-a2-migrate-arm.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `evals/ab/lib/operated-session.ts` · `lib/classifier.ts` · `setup-arm.ts` | T1 | the setup operator: popups and chat requests answered by choosing a frozen entry, never model-written text | med | S64-S68 |
| `evals/ab/arms/{workdoo,clinic}-a2{,.manifest}.json` · `schedule-a2.json` · `hash-prereg.ts` | T1 | arm A2 frozen and pinned | high | hash-prereg, freeze check |
| `evals/ab/PREREGISTRATION.md` | T1 | Amendment 6, owner-signed | high | Codex R1+R2 |
| `evals/ab/analyze.ts` · `lib/analyze.ts` | T1 | combined analysis (several slot files) and symptom differences vs A1 | med | S69 + two must-FAIL seeds |
| `docs/research/logs/ab-measurements-a2.md` | T1 | A2's log: freeze line, 32 harness rows, § Report 2026-11-02 | — | build-slots, analyze |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
**Outcome** — 1 of 1 member delivered (TASK-555). A2 was set up through a real `migrate` from the S1 pin on both A1 snapshots,
frozen, pre-registered (Amendment 6, owner-signed) and run: 32 of 32 slots, 0 infra-lost, VALID on its own slots. A2 scored 78.1%
against A1 81.2% and A0 89.6%, no gain over A1 (-3.1, interval spans zero), no symptom regression, 0.93x A1's tokens, but below
the A0 floor: ruled **failed**, owner-signed (`docs/research/logs/ab-measurements-a2.md` § Report 2026-11-02). Under D6, S1 stays
under [Unreleased]. S3's intake ran while the trials measured and was redirected by its own finding (D11, TASK-573/574).

**Retrieval check** — cross-check held twice and missed once. The combined analysis reproduced S0's signed figures before any A2
figure was read, and S69's seeds reddened only S69. The miss: the S3 intake first quoted park and FAIL counts from raw log rows,
voided pilot rows included (A1 "6 of 48"); the built slots gave 3 of 48 and the epic and task were corrected the same day (L-276).

**Cost** — A2 trials 64.81 USD notional, scored (subscription). Setup: ten operator-built clinic sessions plus run 11 and one
workdoo session. Codex review of the operator and Amendment 6: two rounds, 53k tokens. Owner time: the pilot and full run in the
owner's terminal, the setup rulings, two signatures.

**Worked**
- The setup operator: a model only chooses a frozen entry and the text sent is the entry's own words, so setup is reproducible
  and every label sent was checked verbatim against its transcript.
- Validity first, then the comparison, each from a command anyone can rerun.
- Using measurement wait time for intake surfaced the finding that redirected S3.

**Friction**
- Eleven clinic setup sessions before one completed: each new question shape stopped the operator until a ruling class
  covered it, and a substring trigger misread a finished summary (fixed with whole words, S67).
- A start from a plain PowerShell window lost a paid session at grading to a missing `sh` (L-275).
- The parked sessions' streams were swept with their trial copies, so the cause of the parks needs a fresh run (TASK-573).

**Pattern candidates**
- L-275 (count 1): a paid start checks its spawn dependencies first; same class as TD-270.
- L-276 (count 1): split a regression by verdict and cause, on the analysis population, before it admits work.

**Buckets routed** — Shipped: CHANGELOG [Unreleased] maintainer-only entry with the A2 result. Tech debt: TD-283 progress
(symptom differences vs A1 now printed; the verdict line stays open). Follow-ups: TASK-573 and TASK-574, filed by S3's
intake (`origin: decomposer`), none new from this Retro. Learnings: L-275, L-276. TASK-555 is in `done/`. No handoff entry was
taken in this sprint. No release: S1 is held by D6 and the harness is maintainer-only. Retention and the archive move wait for
the owner's approval.
