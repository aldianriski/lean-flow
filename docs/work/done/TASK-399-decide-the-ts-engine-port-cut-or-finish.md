---
id: TASK-399
title: "Decide the TS engine port: cut it or finish it"
epic: EPIC-014
priority: P2
size: S
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
sprint: SPRINT-116
---

# TASK-399 — Decide the TS engine port: cut it or finish it

## Why

SPRINT-112's guard audit (TASK-396) found K01: the TypeScript port of the conformance engine in `packages/standard` + `apps/cli`, 72
files and 10,802 lines, with 32 tests run only by `bun test`, untouched since 2026-08-29. It duplicates the Shell engine, which keeps authority
(EPIC-014 D2), and no adopter runs it. Class rule R5 would cut it. The owner froze it instead (Q9) and left the cut-or-finish decision to EPIC-014,
because deleting 10k lines under a diet would decide that epic's direction by default. The 11 tests the kept §4 guards run (E04 · P5)
are not part of K01.

## Done when

- [x] An owner ruling records whether EPIC-014 continues the port (with a next step and a date), or retires it: an ADR naming what is ✓ owner ruled CUT (SPRINT-116 G2); ADR-051 accepted (17d80f8) names what is deleted (103 files + 2 harnesses) and what replaces E04/P5 (run-adr-family-fixtures.sh always-on, with the per-rule assertions Codex R1/R2 found missing restored); cut landed in 1a7361f (merge 6c0c109) + fixes c6e41db, 44c6741; Codex loop CLEAR at R3; system verify QA_FULL=1 on the VPS at d5ba41b: QA-CHECK: 320 pass, 0 fail (106 s)
      deleted, what replaces the parity (E04/P5) coverage, and the cut landed through the disposition route (ADR-050 clause 2).

## Assumes

none

## Tracker

- docs/research/guard-audit-rest.md (K01) · ADR-050 · ADR-039 · EPIC-014 D2 · SPRINT-112 Retro
