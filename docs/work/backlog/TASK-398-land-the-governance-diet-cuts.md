---
id: TASK-398
title: "Land the governance-diet cuts"
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

- [ ] Every guard TASK-396's audit rules **cut** is removed from `scripts/qa-check.sh`'s lists and from the tree, and every **freeze** is excluded by name with a `FROZEN` header; the gate's completeness leg stays green.
- [ ] The full gate (default and opt-in) reads the same verdict before and after, apart from the removed guards, and the measured gate time is recorded against the audit's estimate.

## Touches

scripts/qa-check.sh · evals/ · scripts/lib/

## Assumes

- **open:** the cut list exists only once TASK-396's audit is ruled. If it is empty, this task closes as `cancel/` with that finding.

## Tracker

- TASK-396 · SPRINT-112 promote (owner split ruling) · L-221 · TD-212
