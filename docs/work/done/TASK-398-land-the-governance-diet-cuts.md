---
id: TASK-398
title: "Land the governance-diet cuts"
sprint: SPRINT-113
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
depends-on: [TASK-396]
---

# TASK-398 — Land the governance-diet cuts

## Why

Split from `TASK-396` at the SPRINT-112 promote (owner, 2026-10-02), because 396 was size L at pull time. 396 rules ADR-050 and
dispositions every guard (keep · freeze · cut) with the owner. This task makes the cuts real: a guard ruled "cut" leaves the gate and
the tree, and a guard ruled "freeze" leaves the gate lists with a header, as SPRINT-111 T2 did.

## Done when

- [x] Every guard TASK-396's audit rules **cut** is removed from `scripts/qa-check.sh`'s lists and from the tree, and every **freeze** is excluded by name with a `FROZEN` header; the gate's completeness leg stays green. ✓ `9a0bfaad` — S10 (8 files), P4, P7 deleted; qa-check excluded list emptied (tombstone); census by two routes found 0 runners; seeded restore of a cut file named by the completeness leg
- [x] The full gate (default and opt-in) reads the same verdict before and after, apart from the removed guards, and the measured gate time is recorded against the audit's estimate. ✓ `9a0bfaad` — full gate (QA_FULL) `304 pass, 5 fail`, none from T1 (worktree env ×3, TD-211, a Plan Cites false positive fixed `0466ba4`); gate-time delta ≈ 0 because every cut guard was already excluded or ungated

## Touches

scripts/qa-check.sh · evals/ · scripts/lib/

## Assumes

- **open:** the cut list exists only once TASK-396's audit is ruled. If it is empty, this task closes as `cancel/` with that finding.

## Tracker

- TASK-396 · SPRINT-112 promote (owner split ruling) · L-221 · TD-212
