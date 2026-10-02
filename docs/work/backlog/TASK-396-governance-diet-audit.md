---
id: TASK-396
title: "Governance diet: consequence-based proof bar, freeze new rules, cut guards that never caught a defect"
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-396 — Governance diet: consequence-based proof bar, freeze new rules, cut guards that never caught a defect

## Why

Owner, 2026-09-30, in the middle of SPRINT-111: "every time we set a new standard, development time grows while we only ship small
changes". An outside review (Codex) measured `evals/` + `scripts/**/*.sh` at 45,076 lines, against 6,854 for all of `skills/` (6.6×),
and 33× the 14 SKILL.md files. It counted 5 of sprints 101–110 as mostly guard maintenance and 2 as product-led. SPRINT-111 alone
grew from "delete one file" to five tasks, because its guards read the retired shape.

## Done when

- [ ] ADR-050 records the principle: the proof bar scales with consequence (seeded-mutation campaigns and worktree-isolated outside review are kept for consequential guard logic, not every Tier G change); no new standing rule without a retirement; shell/TS parity is not grown beyond supported contracts.
- [ ] An audit (`docs/research/`, feeding ADR-050) lists every guard/leg with the real defects it caught (git log · LEARNINGS), and each carries an owner-ruled disposition: keep · freeze · cut. Landing the cuts is TASK-398.

## Touches

docs/adr/ · docs/DECISIONS.md · docs/research/

## Assumes

none. The ADR-043 consumer contract bounds any cut to the conformance engine.

## Amended 2026-10-02 (SPRINT-112 promote)

- **Split (owner, 2026-10-02):** size L at pull time (ADR + a ~120-guard audit + landed cuts + a CLAUDE.md slim). This task keeps
  ADR-050 and the audit with its dispositions. Landing the cuts → `TASK-398`. The CLAUDE.md slim → `TASK-384`, which already demotes a
  CLAUDE.md rule, so one task owns that file.

## Tracker

SPRINT-111 scope-change · Codex review 2026-09-30
