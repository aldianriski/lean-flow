---
id: TASK-544
title: "Freeze the A/B pre-registration"
epic: EPIC-023
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
- [ ] One frozen document (hash in the log) holds: primary endpoint · symptom measures + −5 pp limits · +10 pp minimum gain · the R-b baseline defect rule · task as unit + bootstrap · Unknown = not-passed · inconclusive rule · D5 cost definition · never-worse-than-A0 · retry classification · cost accounting formula · run-validity rule + slot replacement policy · D9 policy · R-a evidence parity · model inventory (full ids; Opus 5.5 session, 2.x dispatch tiers) · plugin SHA per arm · task-corpus manifest hash · arm manifest hashes.
- [ ] Owner signs it; the log shows no trial on an A/B repo or a task-set task before this hash (R-c).

## Touches
`docs/research/logs/` · `evals/ab/`

## Assumes
- **blocked-by:** TASK-537..543.

## Tracker
research §7 · intake R-b, R-c
